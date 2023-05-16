import React, { useState, ChangeEvent, useEffect } from "react";
import { PageStyle } from "./App";
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
import "./App.css";
import { useColor } from "./ColorContext";
import { signalsArrayToJSON } from "./utilities/jsonUtils";
import PDFDisplay from "./PDFDisplay";
const snarkjs = require("snarkjs");

const verifyPageStyle: PageStyle = {
	backgroundColor: "#eaeaea",
	textColor: "#161616",
	altBackgroundColor: "#eaeaea",
	buttonColor: "#ADD8E6",
};

// The circuit files are compiled for different MAX_JSON_SIZE's 
// Where larger JSON means a larger circuit, hence larger files. 
// The large files used for the demo (>= 1500) are not committed to git. 
// The smaller files are. 
// Update which file and MAX_JSON_SIZE are used to match.
// const verificationKey = "/zkproof/verification_key2000.json";
const verificationKey = "/zkproof/verification_key1500.json";
// const verificationKey = "/zkproof/verification_key100.json";
// const verificationKey = "/zkproof/verification_key25.json";

const verifyProof = async (_verificationkey: string, signals: any, proof: any) => {
	const vkey = await fetch(_verificationkey).then(function (res) {
		return res.json();
	});
	const res = await snarkjs.groth16.verify(vkey, signals, proof);
	return res;
};

const Verify = () => {
	const [proof, setProof] = useState("");
	const [pdfInput, setPDFInput] = useState("");
	const [signals, setSignals] = useState("");
	const [isValid, setIsValid] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [showResult, setShowResult] = useState(false);
	const { pageStyle, setPageStyle } = useColor();

	useEffect(() => {
		setPageStyle(verifyPageStyle);
	});

	const runVerify = () => {
		console.log("Running verify", proof);
		setIsLoading(true);
		setShowResult(true);
		let _proof = JSON.parse(proof);
		let _signals = JSON.parse(signals);

		verifyProof(verificationKey, _signals, _proof).then((_isValid) => {
			setIsValid(_isValid);
			setIsLoading(false);
		});
	};

	const handleProof = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			const reader = new FileReader();

			reader.onload = () => {
				if (typeof reader.result === "string") {
					setProof(reader.result);
				} else {
					console.log("Error reading proof file", reader.result);
				}
			};

			reader.onerror = () => {
				console.log("Error reading file", reader.error);
			};

			reader.readAsText(file);
		}
	};

	const handleSignals = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			const reader = new FileReader();

			reader.onload = () => {
				if (typeof reader.result === "string") {
					setSignals(reader.result);
					setPDFInput(signalsArrayToJSON(reader.result));
				} else {
					console.log("Error reading proof file", reader.result);
				}
			};

			reader.onerror = () => {
				console.log("Error reading file", reader.error);
			};

			reader.readAsText(file);
		}
	};

	return (
		<ColumnContainer style={{ paddingBottom: 50, backgroundColor: pageStyle.backgroundColor }}>
			<PageTitle title="Verify" subtitle="" />
			<RestrictWidthContainer>
				<Text size={fonts.fontS} style={{ marginTop: 20 }}>
					This service is a separate service from the proving service and can be run by anyone
					once an individual's tax proof has been made public. This service verifies that the redacted JSON
					output was produced from the original private tax data based on the zero-knowledge proof
					file, without needing to see the private tax data.
				</Text>
				<Divider style={{ marginTop: 50, marginBottom: 30 }} />
				{showResult ? (
					<ColumnContainer>
						<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 10, marginTop: 20 }}>
							{isLoading ? "Proccessing validation..." : "Proof Validation Result"}
						</Text>
						{isLoading ? null : (
							<Text
								size={fonts.fontL}
								style={{ fontWeight: "700", marginBottom: 10, color: isValid ? "#33ff57" : "#D22B2B" }}>
								{isValid ? "VALID PROOF" : "INVALID PROOF"}
							</Text>
						)}
					</ColumnContainer>
				) : (
					<ColumnContainer>
						{pdfInput.length ? (
							<ColumnContainer>
								<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 25, marginTop: 20 }}>
									Redacted IRS Form 1040
								</Text>
								<PDFDisplay taxData={pdfInput} style={{ minHeight: 400 }} />
							</ColumnContainer>
						) : null}
						<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 10, marginTop: 20 }}>
							Proof Artifacts
						</Text>
						<RowContainer style={{ marginBottom: 5 }}>
							<ColumnContainer style={{ flex: 1, marginRight: 5 }}>
								<Text size={fonts.fontXS} style={{ fontWeight: "700", marginBottom: 5 }}>
									Insert Proof
								</Text>
								<input
									type="file"
									id="proof-file"
									accept=".json"
									onChange={handleProof}
									style={{ backgroundColor: pageStyle.altBackgroundColor }}
								/>
							</ColumnContainer>
							<ColumnContainer style={{ flex: 1, marginLeft: 5 }}>
								<Text size={fonts.fontXS} style={{ fontWeight: "700", marginBottom: 5 }}>
									Insert Signals
								</Text>
								<input
									type="file"
									id="signals-file"
									accept=".json"
									onChange={handleSignals}
									style={{ backgroundColor: pageStyle.altBackgroundColor }}
								/>
							</ColumnContainer>
						</RowContainer>
						<Button title="Verify Proof" onClick={runVerify} />
					</ColumnContainer>
				)}
			</RestrictWidthContainer>
		</ColumnContainer>
	);
};

export default Verify;
