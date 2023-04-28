import React, { useState } from "react";
import { MAX_JSON_SIZE, toAsciiArray } from "./Utilities";
import "./App.css";
import { PageStyle } from "./App";
import { ColumnContainer, fonts, PageTitle, RestrictWidthContainer, RowContainer, Text } from "./common";

const { buildBabyjub, buildMimc7, buildEddsa } = require("circomlibjs");

const pageStyle: PageStyle = {
	backgroundColor: "#ADD8E6",
	textColor: "#f8f8f8",
	altBackgroundColor: "#161616",
};

const Sign = () => {
	// const [inputJson, setInputJson] = useState<string>(`{"SSN": "000-00-0000", "fname": "DONALD J", "lname": "TRUMP", "address_state": "FL", "f_1": "393,229", "f_2a": "2,208", "f_2b": "10,626,179", "f_3a": "17,694","f_3b": "25,347","f_4a": "","f_4b": "","f_5a": "","f_5b": "86,532","f_6a": "","f_6b": "", "f_7": "", "f_8": "-15,825,345", "f_9": "-4,694,058", "f_10a": "101,699","f_10b": "","f_10c": "101,699","f_11": "-4,795,757","f_12": "915,171","f_13": "", "f_14": "915,171","f_15": "0","f_16": "0","f_17": "","f_18": "0","f_19": "","f_20": "","f_21": "","f_22": "0","f_23": "271,973","f_24": "271,973","f_25a": "83,915","f_25b": "","f_25c": "1,733","f_25d": "85,649","f_26": "13,635,520","f_27": "","f_28": "","f_29": "","f_30": "","f_31": "19,397","f_32": "19,397","f_33": "13,740,566","f_34": "13,468,593","f_35a": "","f_35b": "000000000","f_35c": "checking","f_35d": "00000000000000000","f_36": "8,000,000","f_37": "","year": "2020","form": "1040"}`);
	const [inputJson, setInputJson] = useState<string>(`{"beans":"great"}`);
	const [signature, setSignature] = useState("");

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

		const mimc7 = await buildMimc7();
		const babyJub = await buildBabyjub();
		const F = babyJub.F;

		const k = 1;
		const hash = mimc7.multiHash(paddedInput, k);

		// handle signature
		const eddsa = await buildEddsa();
		console.log("generating Eddsa (sk, pk) key pair");
		const sk = Buffer.from("1".toString().padStart(64, "0"), "hex");
		const pk = eddsa.prv2pub(sk);
		console.log("public key:", pk);
		// do the signing
		const signature = eddsa.signMiMC(sk, hash);

		const getFakeRedactMap = () => {
			let redactMap = Array(MAX_JSON_SIZE).fill(1);
			redactMap[4] = 0; // Hide the 4 letter to test
			return redactMap;
		};

		const inputs = {
			json: paddedInput,
			//expected_hash: BigInt(F.toObject(hash)).toString(),
			pubkey: [BigInt(F.toObject(pk[0])).toString(), BigInt(F.toObject(pk[1])).toString()],
			signature_R8x: BigInt(F.toObject(signature.R8[0])).toString(),
			signature_R8y: BigInt(F.toObject(signature.R8[1])).toString(),
			signature_S: BigInt(signature.S).toString(),
			redact_map: getFakeRedactMap(),
		};

		console.log("Inputs", JSON.stringify(inputs));

		setSignature(JSON.stringify(inputs));
	};

	const handleDownload = () => {
		const element = document.createElement("a");
		const file = new Blob([signature], { type: "application/json" });
		element.href = URL.createObjectURL(file);
		element.download = "signature.txt";
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	};

	const handleCopyToClipboard = () => {
		navigator.clipboard.writeText(signature);
	};

	return (
		<ColumnContainer>
			<PageTitle title="Sign" subtitle="Get your tax info sign by authority" />
			<RestrictWidthContainer>
				<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 5, marginTop: 20 }}>
					Enter JSON
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
				{signature.length ? (
					<ColumnContainer style={{ marginTop: 20, marginBottom: 20 }}>
						<Text size={fonts.fontM}>Signature:</Text>
						<Text size={fonts.fontS}>{signature}</Text>
						<RowContainer style={{ marginTop: 10 }}>
							<button onClick={handleDownload}>Download Signature</button>
							<button onClick={handleCopyToClipboard}>Copy to Clipboard</button>
						</RowContainer>
					</ColumnContainer>
				) : null}
			</RestrictWidthContainer>
		</ColumnContainer>
	);
};

export default Sign;
