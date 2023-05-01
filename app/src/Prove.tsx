import React, { useState, useEffect } from "react";
import { MAX_JSON_SIZE, signalsArrayToJSON } from "./utilities/jsonUtils";
import { Button, ColumnContainer, fonts, PageTitle, RestrictWidthContainer, RowContainer, Text } from "./common";
import { PageStyle } from "./App";
import { useColor } from "./ColorContext";
const snarkjs = require("snarkjs");

const provePageStyle: PageStyle = {
	backgroundColor: "#161616",
	textColor: "#f8f8f8",
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
	const [allChecked, setAllChecked] = useState(false);

	const onAllChecked = (check: boolean) => {
		Object.keys(inputJson).map((k) => {
			const checked = redactKeys.includes(k);
			if ((check && !checked) || (!check && checked)) {
				editRedactKey(k);
			}
		});
	};

	return (
		<ColumnContainer style={{ width: "100%", marginBottom: 10 }}>
			<RowContainer
				style={{
					justifyContent: "space-around",
					paddingTop: 10,
					paddingBottom: 10,
					backgroundColor: "#e1e1e1",
					borderRadius: 5,
					alignItems: "center",
				}}>
				<RowContainer style={{ width: "33%", justifyContent: "center" }}>
					<input
						id="all"
						type="checkbox"
						checked={allChecked}
						style={{
							height: 20,
							width: 20,
							cursor: "pointer",
							borderWidth: 2,
						}}
						onChange={() => {
							onAllChecked(!allChecked);
							setAllChecked(!allChecked);
						}}
						className="checkbox"
					/>
				</RowContainer>
				<Text size={fonts.fontS} style={{ fontWeight: "600", width: "33%", textAlign: "center" }}>
					Form Field
				</Text>
				<Text size={fonts.fontS} style={{ fontWeight: "600", width: "33%", textAlign: "center" }}>
					Value
				</Text>
			</RowContainer>
			{Object.keys(inputJson).map((key: string, index: any) => {
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
							marginTop: 8,
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
						<Text size={fonts.fontS} style={{ fontWeight: "300", width: "33%", textAlign: "center" }}>
							{key}
						</Text>
						<Text size={fonts.fontS} style={{ fontWeight: "300", width: "33%", textAlign: "center" }}>
							{value}
						</Text>
					</RowContainer>
				);
			})}
		</ColumnContainer>
	);
};

function Prove() {
	// What to show
	const [showRedactTable, setShowRedactTable] = useState(false);
	const [showProof, setShowProof] = useState(false);

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

	useEffect(() => {
		setShowProof(proof.length > 0 && signals.length > 0);
	}, [proof, signals]);

	//let wasmFile = "http://localhost:8000/circuit25.wasm";
	// let zkeyFile = "http://localhost:8000/circuit25.zkey";
	// let wasmFile = "http://localhost:8000/circuit100.wasm";
	// let zkeyFile = "http://localhost:8000/circuit100.zkey";
	// let wasmFile = "http://localhost:8000/circuit1000.wasm";
	// let zkeyFile = "http://localhost:8000/circuit1000.zkey";
	let wasmFile = "http://localhost:8000/circuit1500.wasm";
	let zkeyFile = "http://localhost:8000/circuit1500.zkey";
	// let wasmFile = "http://localhost:8000/circuit2000.wasm";
	// let zkeyFile = "http://localhost:8000/circuit2000.zkey";

	const processInput = () => {
		try {
			let input = JSON.parse(inputJsonOfEverything);
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

	const runProofs = () => {
		if (!inputJsonOfEverything || !inputJson) {
			alert("Please input a JSON");
			return;
		}
		if (redactKeys.length === 0) {
			alert("Please select at least one key to redact");
			return;
		}

		let proofInput = JSON.parse(inputJsonOfEverything);
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
		console.log("redact_map");
		console.log(JSON.stringify(_redactMap));
		console.log("Proof input", proofInput);
		console.log(JSON.stringify(proofInput));

		makeProof(proofInput, wasmFile, zkeyFile).then(({ proof: _proof, publicSignals: _signals }) => {
			setProof(JSON.stringify(_proof, null, 2));
			setSignals(JSON.stringify(_signals, null, 2));
		});
	};

	useEffect(() => {
		console.log("Signals", signals);
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
			<PageTitle title="Redact & Prove" subtitle="Pick fields and generate a proof" />
			<RestrictWidthContainer>
				<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 10, marginTop: 20 }}>
					Signed Witness Inputed
				</Text>
				<textarea
					id="jsonInput"
					rows={4}
					required={true}
					value={inputJsonOfEverything}
					onChange={(event) => {
						setInputJsonOfEverything(event.target.value);
					}}
					style={{ flex: 1 }}
					placeholder={"Please enter the output of a trust tax verification service"}
				/>
				<Button title="Select Redaction" onClick={processInput} />
				{/* We should also have a json upload option */}
				{showRedactTable ? (
					<ColumnContainer>
						<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 10, marginTop: 40 }}>
							Select Redaction
						</Text>
						<RedactTable inputJson={inputJson} redactKeys={redactKeys} editRedactKey={editRedactKey} />
						<Button title="Generate Proof" onClick={runProofs} />
					</ColumnContainer>
				) : null}
				{showProof ? (
					<ColumnContainer>
						<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 10, marginTop: 40 }}>
							My Proof Artifacts
						</Text>
						<Text size={fonts.fontS} style={{ fontWeight: "700", marginBottom: 3 }}>
							Proof
						</Text>
						<Text size={fonts.fontS} style={{}}>
							{proof}
						</Text>
						<Text size={fonts.fontS} style={{ fontWeight: "700", marginBottom: 3, marginTop: 20 }}>
							Signals
						</Text>
						<Text size={fonts.fontS} style={{}}>
							{signals}
						</Text>
						<Text size={fonts.fontS} style={{ fontWeight: "700", marginBottom: 3, marginTop: 20 }}>
							Redacted JSON
						</Text>
						<Text size={fonts.fontS} style={{ marginBottom: 10 }}>
							{redactedJson}
						</Text>
						<Button title="Download Proof Artifacts" onClick={downloadJSON} />
					</ColumnContainer>
				) : null}
			</RestrictWidthContainer>
		</ColumnContainer>
	);
}

export default Prove;
