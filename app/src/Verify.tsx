import React, { useState, ChangeEvent, useEffect } from "react";
import { PageStyle } from "./App";
import { Button, ColumnContainer, fonts, PageTitle, RestrictWidthContainer, RowContainer, Text } from "./common";
import "./App.css";
import { useColor } from "./ColorContext";
const snarkjs = require("snarkjs");

const verifyPageStyle: PageStyle = {
	backgroundColor: "#f8f8f8",
	textColor: "#161616",
	altBackgroundColor: "#eaeaea",
	buttonColor: "#ADD8E6",
};

// const verificationKey = "http://localhost:8000/verification_key2000.json";
const verificationKey = "http://localhost:8000/verification_key1500.json";
// const verificationKey = "http://localhost:8000/verification_key1000.json";
// const verificationKey = "http://localhost:8000/verification_key100.json";
// const verificationKey = "http://localhost:8000/verification_key25.json";
const verifyProof = async (_verificationkey: string, signals: any, proof: any) => {
	const vkey = await fetch(_verificationkey).then(function (res) {
		return res.json();
	});
	const res = await snarkjs.groth16.verify(vkey, signals, proof);
	return res;
};

const Verify = () => {
	const [proof, setProof] = useState("");
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

	const handleProofUpload = (event: ChangeEvent<HTMLInputElement>) => {
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

	const handleSignalsUpload = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			const reader = new FileReader();

			reader.onload = () => {
				if (typeof reader.result === "string") {
					setSignals(reader.result);
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
			<PageTitle title="Verify" subtitle="Check the legitimacy of a zk proof" />
			<RestrictWidthContainer>
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
						<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 10, marginTop: 20 }}>
							Proof Details
						</Text>
						<RowContainer style={{ marginBottom: 5 }}>
							<ColumnContainer style={{ flex: 1, marginRight: 5 }}>
								<Text size={fonts.fontXS} style={{ fontWeight: "700", marginBottom: 5 }}>
									Upload Proof
								</Text>
								<input
									type="file"
									id="proof-upload"
									accept=".json"
									onChange={handleProofUpload}
									style={{ backgroundColor: pageStyle.altBackgroundColor }}
								/>
							</ColumnContainer>
							<ColumnContainer style={{ flex: 1, marginLeft: 5 }}>
								<Text size={fonts.fontXS} style={{ fontWeight: "700", marginBottom: 5 }}>
									Upload Signals
								</Text>
								<input
									type="file"
									id="signals-upload"
									accept=".json"
									onChange={handleSignalsUpload}
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
