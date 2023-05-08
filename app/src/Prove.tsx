import React, { useState, useEffect } from "react";
import { MAX_JSON_SIZE, safelyParseJSON, signalsArrayToJSON } from "./utilities/jsonUtils";
import {
	Button,
	ColumnContainer,
	Divider,
	fonts,
	PageTitle,
	RestrictWidthContainer,
	RowContainer,
	Text,
} from "./common";
import { PageStyle } from "./App";
import { useColor } from "./ColorContext";
import JSONDisplay from "./JSONDisplay";
import PDFDisplay from "./PDFDisplay";
import { METADATA_FIELDS } from "./utilities/f1040";
const snarkjs = require("snarkjs");

// The circuit files are compiled for different MAX_JSON_SIZE's 
// Where larger JSON means a larger circuit, hence larger files. 
// The large files used for the demo (>= 1500) are not committed to git. 
// The smaller files are. 
// Update which file and MAX_JSON_SIZE are used to match.
// const wasmFile = "/zkproof/circuit25.wasm";
// const zkeyFile = "/zkproof/circuit25.zkey";
// const wasmFile = "/zkproof/circuit100.wasm";
// const zkeyFile = "/zkproof/circuit100.zkey";
const wasmFile = "/zkproof/circuit1500.wasm";
const zkeyFile = "/zkproof/circuit1500.zkey";
// const wasmFile = "/zkproof/circuit2000.wasm";
// const zkeyFile = "/zkproof/circuit2000.zkey";

const provePageStyle: PageStyle = {
	backgroundColor: "#161616",
	textColor: "#eaeaea",
	altBackgroundColor: "#333333",
	buttonColor: "#ADD8E6",
};

const makeProof = async (_proofInput: any, _wasm: string, _zkey: string) => {
	console.log("Making proof");
	const { proof, publicSignals } = await snarkjs.groth16.fullProve(_proofInput, _wasm, _zkey);
	console.log("Proof made");
	console.log("publicSignals", publicSignals);
	return { proof, publicSignals };
};

const RedactTable = (props: { inputJson: any; redactKeys: Array<string>; editRedactKey: any }) => {
	const { inputJson, redactKeys, editRedactKey } = props;

	return (
		<ColumnContainer style={{ width: "100%", marginBottom: 10, color: "#161616" }}>
			<RowContainer
				style={{
					justifyContent: "space-around",
					paddingTop: 10,
					paddingBottom: 10,
					marginBottom: 8,
					backgroundColor: "#e1e1e1",
					borderRadius: 5,
					alignItems: "center",
				}}>
				<Text size={fonts.fontS} style={{ fontWeight: "600", width: "33%", textAlign: "center" }}>
					Redact Field
				</Text>
				<Text size={fonts.fontS} style={{ fontWeight: "600", width: "33%", textAlign: "center" }}>
					Form Field
				</Text>
				<Text size={fonts.fontS} style={{ fontWeight: "600", width: "33%", textAlign: "center" }}>
					Value
				</Text>
			</RowContainer>
			<ColumnContainer style={{ maxHeight: 500, overflow: "scroll" }}>
				{Object.keys(inputJson)
					.filter((k: string) => !METADATA_FIELDS.includes(k))
					.map((key: string, index: any) => {
						const value = inputJson[key];
						const checked = redactKeys.includes(key);
						return (
							<RowContainer
								style={{
									justifyContent: "space-around",
									paddingTop: 10,
									paddingBottom: 10,
									backgroundColor: "#e1e1e1",
									borderRadius: 5,
									alignItems: "center",
									marginTop: index === 0 ? 0 : 8,
								}}>
								<RowContainer style={{ width: "33%", justifyContent: "center" }}>
									<input
										id="all"
										type="checkbox"
										checked={checked}
										style={{
											height: 20,
											width: 20,
											cursor: "pointer",
											borderWidth: 2,
										}}
										onChange={() => editRedactKey(key)}
										className="checkbox"
									/>
								</RowContainer>
								<Text
									size={fonts.fontS}
									style={{ fontWeight: "300", width: "33%", textAlign: "center" }}>
									{key}
								</Text>
								<Text
									size={fonts.fontS}
									style={{
										fontWeight: "300",
										width: "33%",
										textAlign: "center",
										textDecoration: checked ? "line-through" : "none",
									}}>
									{value}
								</Text>
							</RowContainer>
						);
					})}
			</ColumnContainer>
		</ColumnContainer>
	);
};

function Prove() {
	// What to show
	const [showRedactTable, setShowRedactTable] = useState(false);
	const [generatingProof, setGeneratingProof] = useState(false);

	// The first half is the input and redaction
	const [inputJsonOfEverything, setInputJsonOfEverything] = useState("");
	const [inputJson, setInputJson] = useState<{ [key: string]: any }>({});
	const [redactKeys, setRedactKeys] = useState<Array<string>>([]);
	// The second half is the proof output and download
	const [proof, setProof] = useState("");
	const [signals, setSignals] = useState("");
	const [redactedJson, setRedactedJson] = useState("");
	const { pageStyle, setPageStyle } = useColor();

	useEffect(() => {
		setPageStyle(provePageStyle);
	});

	useEffect(() => {
		setShowRedactTable(Object.keys(inputJson).length > 0);
	}, [inputJson]);

	const processInput = () => {
		try {
			let input = safelyParseJSON(inputJsonOfEverything);
			const _inputJsonStr = input.json.map((code: number) => String.fromCharCode(code)).join("");
			const _inputJson = JSON.parse(_inputJsonStr); // parse signals_str into a JavaScript object
			setInputJson(_inputJson);
			console.log("processInput", _inputJson);
		} catch (e) {
			console.log("processInput", e);
		}
	};

	const editRedactKey = (key: string) => {
		if (redactKeys.includes(key)) {
			setRedactKeys(redactKeys.filter((k) => k !== key));
		} else {
			setRedactKeys(redactKeys.concat([key]));
		}
	};

	const filterRedactedFields = (input: { [key: string]: any }, redactKeys: string[]) => {
		const output: { [key: string]: any } = {};
		Object.keys(input).forEach((k) => {
			if (!redactKeys.includes(k)) {
				output[k] = input[k];
			}
		});
		return output;
	};

	const runProofs = () => {
		if (!inputJsonOfEverything || !inputJson) {
			alert("Please input a JSON");
			return;
		}
		if (redactKeys.length === 0) {
			alert("Please select at least one key to redact");
			return;
		}
		setGeneratingProof(true);

		let proofInput = safelyParseJSON(inputJsonOfEverything);
		let _inputJsonStr = proofInput.json.map((code: number) => String.fromCharCode(code)).join("");

		// We build redact map from the input json and the redact keys
		let _redactMap = Array(MAX_JSON_SIZE).fill(1);
		for (var key of redactKeys) {
			let fakeJson: { [key: string]: any } = {};
			fakeJson[key] = inputJson[key];
			let fakeJsonStr = JSON.stringify(fakeJson).slice(1, -1);
			let redactStartIndex = _inputJsonStr?.indexOf(fakeJsonStr);
			// If redactStartIndex in undefined throw error
			if (!(redactStartIndex > 0)) {
				console.log("Redaction error", fakeJsonStr, redactStartIndex);
			} else {
				let redactEndIndex = redactStartIndex + fakeJsonStr?.length;
				for (var i = redactStartIndex; i < redactEndIndex; i++) {
					_redactMap[i] = 0;
				}
				// If the redacted field is not the last field in the JSON, we need to remove the comma
				if (_inputJsonStr[redactEndIndex] === ",") {
					_redactMap[redactEndIndex] = 0;
				}
				console.log("Redacting", redactStartIndex, redactEndIndex);
			}
		}

		proofInput["redact_map"] = _redactMap;
		console.log("Proof input", proofInput);
		console.log(JSON.stringify(proofInput));

		makeProof(proofInput, wasmFile, zkeyFile).then(({ proof: _proof, publicSignals: _signals }) => {
			setGeneratingProof(false);
			setProof(JSON.stringify(_proof));
			setSignals(JSON.stringify(_signals));
		});
	};

	useEffect(() => {
		setRedactedJson(signalsArrayToJSON(signals));
	}, [signals]);

	const downloadJSON = () => {
		const proofBlob = new Blob([proof], { type: "application/json" });
		const signalsBlob = new Blob([signals], { type: "application/json" });
		const proofUrl = URL.createObjectURL(proofBlob);
		const signalsUrl = URL.createObjectURL(signalsBlob);
		const proofLink = document.createElement("a");
		const signalsLink = document.createElement("a");
		proofLink.href = proofUrl;
		signalsLink.href = signalsUrl;
		proofLink.download = "proof.json";
		signalsLink.download = "signals.json";
		document.body.appendChild(proofLink);
		document.body.appendChild(signalsLink);
		proofLink.click();
		signalsLink.click();
		document.body.removeChild(proofLink);
		document.body.removeChild(signalsLink);
		URL.revokeObjectURL(proofUrl);
		URL.revokeObjectURL(signalsUrl);
	};

	return (
		<ColumnContainer style={{ paddingBottom: 50, backgroundColor: pageStyle.backgroundColor }}>
			<PageTitle title="Redact & Prove" subtitle="Select fields for redaction and generate proof" />
			<RestrictWidthContainer>
				<Text size={fonts.fontS} style={{ marginTop: 20 }}>
					This is a third-party redact service, which could be provided as an open-source tool to take signed
					tax records, redact sensitive fields, and creates a zero-knowlegde (zk) proof that the redacted tax
					record comes from the original signed source.
				</Text>
				<Text size={fonts.fontS} style={{ marginTop: 20 }}>
					The sensitive fields for redaction are chosen by the user, and a zk proof is generated by a public
					circom circuit that produces a new JSON with sensitive fields converted to whitespace. The circuit
					produces a set of output signals, including the redacted tax information, and a proof for
					verification.
				</Text>
				<Text size={fonts.fontS} style={{ marginTop: 20 }}>
					This code is capable of running locally through a browser such that users do not need to upload
					sensitive tax records to a third-party server.
				</Text>
				<Divider style={{ marginTop: 50, marginBottom: 30 }} />
				{proof.length > 0 && signals.length > 0 ? (
					<ColumnContainer>
						<RowContainer>
							<ColumnContainer style={{ flex: 1, marginRight: 10 }}>
								<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 5, marginTop: 20 }}>
									Redacted JSON Form Data
								</Text>
								<PDFDisplay taxData={redactedJson} style={{ flex: 1, minHeight: 400 }} />
							</ColumnContainer>
							<ColumnContainer>
								<Text size={fonts.fontM} style={{ fontWeight: "700", marginTop: 20, marginBottom: 5 }}>
									Redacted Tax Data JSON
								</Text>
								<JSONDisplay
									taxData={redactedJson}
									default="Add JSON tax data"
									onChange={() => {}}
									style={{ flex: 1, minWidth: 400, marginBottom: 0, color: pageStyle.textColor }}
								/>
							</ColumnContainer>
						</RowContainer>
						<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 10, marginTop: 40 }}>
							Proof Artifacts
						</Text>
						<RowContainer>
							<ColumnContainer style={{ marginRight: 10, flex: 1 }}>
								<Text size={fonts.fontS} style={{ fontWeight: "700", marginBottom: 3 }}>
									Proof
								</Text>
								<JSONDisplay
									taxData={proof}
									onChange={() => {}}
									disabled
									default=""
									style={{ color: pageStyle.textColor }}
								/>
							</ColumnContainer>
							<ColumnContainer style={{ marginRight: 10, flex: 1 }}>
								<Text size={fonts.fontS} style={{ fontWeight: "700", marginBottom: 3 }}>
									Signals
								</Text>
								<JSONDisplay
									taxData={signals}
									onChange={() => {}}
									disabled
									default=""
									style={{ color: pageStyle.textColor }}
								/>
							</ColumnContainer>
						</RowContainer>

						<Button title="Download Proof Artifacts" onClick={downloadJSON} />
					</ColumnContainer>
				) : generatingProof ? (
					<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 10, marginTop: 40 }}>
						Generating proof...
					</Text>
				) : showRedactTable ? (
					<ColumnContainer>
						<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 5, marginTop: 20 }}>
							Tax data
						</Text>
						<PDFDisplay
							taxData={JSON.stringify(filterRedactedFields(inputJson, redactKeys))}
							style={{ minHeight: 400 }}
						/>
						<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 10, marginTop: 40 }}>
							Select Redaction
						</Text>
						<RedactTable inputJson={inputJson} redactKeys={redactKeys} editRedactKey={editRedactKey} />
						<Button title="Generate Proof" onClick={runProofs} />
					</ColumnContainer>
				) : (
					<ColumnContainer>
						<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 10, marginTop: 20 }}>
							Input Signed Tax Data (ZK proof "witness")
						</Text>
						<JSONDisplay
							taxData={inputJsonOfEverything}
							onChange={setInputJsonOfEverything}
							default="Enter tax data JSON..."
							style={{ color: pageStyle.textColor }}
						/>
						<Button title="Select Redaction" onClick={processInput} />
					</ColumnContainer>
				)}
			</RestrictWidthContainer>
		</ColumnContainer>
	);
}

export default Prove;
