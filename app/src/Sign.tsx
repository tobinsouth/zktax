import React, { useState } from "react";
import { MAX_JSON_SIZE, toAsciiArray } from "./utilities/jsonUtils";
import "./App.css";
import { PageStyle } from "./App";
import { ColumnContainer, fonts, PageTitle, RestrictWidthContainer, RowContainer, Text } from "./common";
import { hashAndSignEddsaMiMC } from "./utilities/cryptoUtils";

const { buildBabyjub, buildMimc7, buildEddsa } = require("circomlibjs");

const pageStyle: PageStyle = {
	backgroundColor: "#ADD8E6",
	textColor: "#f8f8f8",
	altBackgroundColor: "#161616",
};

const Sign = () => {
	const [inputJson, setInputJson] = useState<string>(`{"SSN": "000-00-0000", "fname": "DONALD J", "lname": "TRUMP", "address_state": "FL", "f_1": "393,229", "f_2a": "2,208", "f_2b": "10,626,179", "f_3a": "17,694","f_3b": "25,347","f_4a": "","f_4b": "","f_5a": "","f_5b": "86,532","f_6a": "","f_6b": "", "f_7": "", "f_8": "-15,825,345", "f_9": "-4,694,058", "f_10a": "101,699","f_10b": "","f_10c": "101,699","f_11": "-4,795,757","f_12": "915,171","f_13": "", "f_14": "915,171","f_15": "0","f_16": "0","f_17": "","f_18": "0","f_19": "","f_20": "","f_21": "","f_22": "0","f_23": "271,973","f_24": "271,973","f_25a": "83,915","f_25b": "","f_25c": "1,733","f_25d": "85,649","f_26": "13,635,520","f_27": "","f_28": "","f_29": "","f_30": "","f_31": "19,397","f_32": "19,397","f_33": "13,740,566","f_34": "13,468,593","f_35a": "","f_35b": "000000000","f_35c": "checking","f_35d": "00000000000000000","f_36": "8,000,000","f_37": "","year": "2020","form": "1040"}`);
	// const [inputJson, setInputJson] = useState<string>(`{"beans":"great"}`);
	const [signedTaxData, setSignedTaxData] = useState("");

	const handleSign = async () => {
		const parsedJson = JSON.stringify(JSON.parse(inputJson));
		if (parsedJson.length > MAX_JSON_SIZE) {
			console.error(
				"Cannot handle json: too large. Max size:",
				MAX_JSON_SIZE,
				"Json array size:",
				parsedJson.length
			);
			return false;
		}

		const asciiArray = toAsciiArray(parsedJson);
		const paddingLength = MAX_JSON_SIZE - asciiArray.length;
		const paddedInput = asciiArray.concat(Array(paddingLength).fill(32));
		const signature = await hashAndSignEddsaMiMC(paddedInput);
		
		const inputs = {
			json: paddedInput,
			pubkey: signature.pubkey,
			signature_R8x: signature.R8x,
			signature_R8y: signature.R8y,
			signature_S: signature.S,
		};
		console.log("Inputs", JSON.stringify(inputs));
		setSignedTaxData(JSON.stringify(inputs));
	};

	const handleDownload = () => {
		const element = document.createElement("a");
		const file = new Blob([signedTaxData], { type: "application/json" });
		element.href = URL.createObjectURL(file);
		element.download = "signedTaxData.txt";
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	};

	const handleCopyToClipboard = () => {
		navigator.clipboard.writeText(signedTaxData);
	};

	return (
		<ColumnContainer>
			<PageTitle title="Sign" subtitle="Get your tax info sign by authority" />
			<RestrictWidthContainer>
				<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 5, marginTop: 20 }}>
					JSON Tax Data
				</Text>
				<textarea
					value={inputJson}
					style={{ width: "100%", marginBottom: 5 }}
					onChange={(event) => {
						setInputJson(event.target.value);
					}}
					placeholder="Enter JSON here..."
				/>
				<button onClick={handleSign}>Sign</button>
				{signedTaxData.length ? (
					<ColumnContainer style={{ marginTop: 20, marginBottom: 20 }}>
						<Text size={fonts.fontM}>Signed Tax Data:</Text>
						<Text size={fonts.fontS}>{signedTaxData}</Text>
						<RowContainer style={{ marginTop: 10 }}>
							<button onClick={handleDownload}>Download Signed Tax Data</button>
							<button onClick={handleCopyToClipboard}>Copy to Clipboard</button>
						</RowContainer>
					</ColumnContainer>
				) : null}
			</RestrictWidthContainer>
		</ColumnContainer>
	);
};

export default Sign;
