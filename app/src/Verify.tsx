import React, { useState, ChangeEvent } from "react";
import { PageStyle } from "./App";
import { ColumnContainer, fonts, PageTitle, RestrictWidthContainer, Text } from "./common";
import "./App.css";

const pageStyle: PageStyle = {
	backgroundColor: "#f8f8f8",
	textColor: "#161616",
	altBackgroundColor: "#eaeaea",
};

const snarkjs = require("snarkjs");

const verificationKey = "http://localhost:8000/verification_key.json";
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
			if (typeof reader.result === "string") {
				setProof(reader.result);
			}
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
				}
			};
			reader.readAsText(file);
		}
	};

	return (
		<ColumnContainer>
			<PageTitle title="Verify" subtitle="Check the legitimacy of a zk proof" />
			<RestrictWidthContainer>
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
