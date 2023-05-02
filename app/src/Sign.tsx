import React, { useState, ChangeEvent, useEffect } from "react";
import { MAX_JSON_SIZE, toAsciiArray } from "./utilities/jsonUtils";
import "./App.css";
import { PageStyle } from "./App";
import { Button, ColumnContainer, fonts, PageTitle, RestrictWidthContainer, RowContainer, Text } from "./common";
import { hashAndSignEddsaMiMC } from "./utilities/cryptoUtils";
import { pdfToJSON } from "./utilities/f1040";
import { useColor } from "./ColorContext";
import PDFDisplay from "./PDFDisplay";
import JSONDisplay from "./JSONDisplay";

const { buildBabyjub, buildMimc7, buildEddsa } = require("circomlibjs");

const signPageStyle: PageStyle = {
	backgroundColor: "#00599c",
	textColor: "#f8f8f8",
	altBackgroundColor: "#eaeaea",
	buttonColor: "#add8e6",
};

const Sign = () => {
	const [actualJson, setActualJson] = useState<Map<string, string>>(new Map());
	const [signedTaxData, setSignedTaxData] = useState("");
	const [signing, setSigning] = useState(false);

	const { pageStyle, setPageStyle } = useColor();

	useEffect(() => {
		setPageStyle(signPageStyle);
	});

	async function on1040PDF(e: ChangeEvent<HTMLInputElement>) {
		/*
        Handles the PDF File input. Expects form 1040 from 2020.
        */
		const fileInput = e.target;
		if (!fileInput.files || fileInput.files.length === 0) {
			console.error("No files?!");
			return;
		}
		const file = fileInput.files[0];
		const fBytes = await file.arrayBuffer();
		const json1040 = await pdfToJSON(fBytes);
		setActualJson(json1040);
	}

	const filterJsonKeysByValue = (jsonObj: Map<string, string>): Map<string, string> => {
		// Filter the JSON object to only include keys with a non-empty value
		console.log(jsonObj);
		const p = new Map<string, string>();
		jsonObj.forEach((v, k) => {
			if (v.length > 0) {
				p.set(k, v);
			}
		});
		return p;
	};

	const handleSign = async () => {
		setSigning(true);
		const parsedJsonObj = filterJsonKeysByValue(actualJson);
		console.log("filtered JSON");
		console.log(filterJsonKeysByValue(parsedJsonObj));
		const parsedJson = JSON.stringify(Object.fromEntries(parsedJsonObj));

		if (parsedJson.length > MAX_JSON_SIZE) {
			console.error(
				"Cannot handle json: too large. Max size:",
				MAX_JSON_SIZE,
				"Json array size:",
				parsedJson.length,
			);
			setSigning(false);
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
		setSigning(false);
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
		navigator.clipboard.writeText(signedTaxData).then(() => {
			alert("JSON copied to clipboard");
		});
	};

	return (
		<ColumnContainer style={{ paddingBottom: 50, backgroundColor: pageStyle.backgroundColor }}>
			<PageTitle title="Sign" subtitle="Get your tax info sign by authority" />
			<RestrictWidthContainer>
				{signing ? (
					<ColumnContainer>
						<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 5, marginTop: 20 }}>
							Signing tax data...
						</Text>
					</ColumnContainer>
				) : signedTaxData.length === 0 ? (
					<ColumnContainer>
						<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 5, marginTop: 20 }}>
							Upload Tax Data
						</Text>
						<input
							id="dropzone-file"
							name="f1040"
							type="file"
							onChange={on1040PDF}
							style={{ backgroundColor: pageStyle.altBackgroundColor }}
						/>
						<RowContainer>
							<ColumnContainer style={{ flex: 1, marginRight: 10 }}>
								<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 5, marginTop: 20 }}>
									Example IRS 1040
								</Text>
								<PDFDisplay JSONTaxData={actualJson} style={{ flex: 1, minHeight: 400 }} />
							</ColumnContainer>
							<ColumnContainer>
								<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 5, marginTop: 20 }}>
									Tax Data JSON
								</Text>
								<JSONDisplay
									JSONTaxData={actualJson}
									onChange={(newData) => setActualJson(newData)}
									style={{ flex: 1, minWidth: 400 }}
								/>
								<Button title="Get Signed Tax Data" onClick={handleSign} />
							</ColumnContainer>
						</RowContainer>
					</ColumnContainer>
				) : (
					<ColumnContainer style={{ marginTop: 20, marginBottom: 20 }}>
						<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 5, marginTop: 20 }}>
							My Signed Tax Data
						</Text>
						<JSONDisplay
							JSONTaxData={new Map(Object.entries(JSON.parse(signedTaxData)))}
							onChange={() => {}}
							disabled
						/>

						<RowContainer style={{ marginTop: 10 }}>
							<Button
								title="Download Signed Tax Data"
								onClick={handleDownload}
								style={{ flex: 1, marginRight: 5 }}
							/>
							<Button
								title="Copy to Clipboard"
								onClick={handleCopyToClipboard}
								style={{ flex: 1, marginLeft: 5 }}
							/>
						</RowContainer>
					</ColumnContainer>
				)}
			</RestrictWidthContainer>
		</ColumnContainer>
	);
};

export default Sign;
