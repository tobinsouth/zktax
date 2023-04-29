import React, { useState, ChangeEvent } from "react";
import { PageStyle } from "./App";
import { ColumnContainer, fonts, PageTitle, PDF1040Display, RestrictWidthContainer, Text } from "./common";
import { Document } from "react-pdf";
import "./App.css";
const snarkjs = require("snarkjs");

const pageStyle: PageStyle = {
	backgroundColor: "#f8f8f8",
	textColor: "#161616",
	altBackgroundColor: "#eaeaea",
};

const verificationKey = "http://localhost:8000/verification_key1000.json";
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

	const runVerify = () => {
		console.log("Running verify", proof);
		let _proof = JSON.parse(proof);
		let _signals = JSON.parse(signals);

		verifyProof(verificationKey, _signals, _proof).then((_isValid) => {
			setIsValid(_isValid);
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
		<ColumnContainer style={{ marginBottom: 50 }}>
			<PageTitle title="Verify" subtitle="Check the legitimacy of a zk proof" />
			<RestrictWidthContainer>
				<PDF1040Display file={/** Put PDF data here */ ""} />
				<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 5, marginTop: 20 }}>
					Proof Details
				</Text>
				<div>
					<label htmlFor="proof-upload">Upload proof:</label>
					<input type="file" id="proof-upload" accept=".json" onChange={handleProofUpload} />
				</div>
				<div>
					<label htmlFor="signals-upload">Upload signals:</label>
					<input type="file" id="signals-upload" accept=".json" onChange={handleSignalsUpload} />
				</div>
				<button onClick={runVerify}>Verify Proof</button>
				Result:
				{proof.length > 0 && <p>{isValid ? "Valid proof" : "Invalid proof"}</p>}
			</RestrictWidthContainer>
		</ColumnContainer>
	);
};

export default Verify;
