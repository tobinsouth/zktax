import React, { useState, ChangeEvent, useEffect } from "react";
import { MAX_JSON_SIZE, safelyParseJSON, toAsciiArray } from "./utilities/jsonUtils";
import "./App.css";
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
import { hashAndSignEddsaMiMC } from "./utilities/cryptoUtils";
import { pdfToJSON } from "./utilities/f1040";
import { useColor } from "./ColorContext";
import PDFDisplay from "./PDFDisplay";
import JSONDisplay, { ArrayDisplay } from "./JSONDisplay";

// const { buildBabyjub, buildMimc7, buildEddsa } = require("circomlibjs");

const signPageStyle: PageStyle = {
	backgroundColor: "#00599c",
	textColor: "#eaeaea",
	altBackgroundColor: "#eaeaea",
	buttonColor: "#add8e6",
};

const Sign = () => {
	const [inputJson, setInputJson] = useState<string>("");
	// const [actualJson, setActualJson] = useState<Map<string, string>>(new Map());
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
		setInputJson(JSON.stringify(Object.fromEntries(json1040)));
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
		const reJSON: Map<string, string> = new Map(Object.entries(safelyParseJSON(inputJson)));
		const parsedJsonObj = filterJsonKeysByValue(reJSON);
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
			<PageTitle title="Trusted Tax Service" subtitle="" />
			<RowContainer
				style={{
					justifyContent: "space-around",
					paddingTop: 10,
					paddingBottom: 10,
					borderRadius: 0,
					alignItems: "center",
					marginBottom: 20,
				}}>
				<RestrictWidthContainer>
					<Text size={fonts.fontS}>
						This page represents a hypothetical service provided by a trusted tax authority that already
						collects individuals' tax records. For example, the IRS in the United States. This prototype is
						meant to show that while this service does not currently exist, it could.
					</Text>
					<Text size={fonts.fontS} style={{ marginTop: 20 }}>
						Tax data are often stored in PDF format, and can be converted into other common formats such as
						JSON. This service uses public key cryptography to sign individuals' tax data, which individuals
						can then download as JSON.
						<ul style={{ marginTop: 1, marginBottom: 0 }}>
							<li>The Trusted Tax Service's public key is public</li>
							<li>The downloaded data is private</li>
						</ul>
					</Text>
					<Text size={fonts.fontS} style={{ marginTop: 20 }}>
						In this demo, instead of users automatically downloading their tax data, users provide tax data
						to then be signed and output by the service.
					</Text>
					<Text size={fonts.fontS} style={{ marginTop: 20, fontWeight: "700" }}>
						This example uses the 2020 version of US income tax return form 1040.
					</Text>
					<Text size={fonts.fontS}>
						An empty form can be downloaded from the IRS to be filled out and inserted below:
						<a
							href="https://www.irs.gov/pub/irs-prior/f1040--2020.pdf"
							target="_blank"
							rel="noreferrer"
							style={{ color: "#ADD8E6", marginLeft: 4 }}>
							https://www.irs.gov/pub/irs-prior/f1040--2020.pdf
						</a>
					</Text>
					<Text size={fonts.fontS}>
						or use this filled out version from a public official who was recently compelled to publish
						their 2020 form 1040:
						<a
							href="/f1040/f1040-2020-trump.pdf"
							target="_blank"
							rel="noreferrer"
							style={{ color: "#ADD8E6", marginLeft: 4 }}>
							/f1040/f1040-2020-trump.pdf
						</a>
					</Text>
					<Divider style={{ marginTop: 50 }} />
				</RestrictWidthContainer>
			</RowContainer>
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
							Trusted Tax Service Public Key (
							<a
								style={{ color: pageStyle.textColor }}
								href="https://iden3-docs.readthedocs.io/en/latest/_downloads/a04267077fb3fdbf2b608e014706e004/Ed-DSA.pdf">
								EdDSA/MIMC-7
							</a>
							)
						</Text>
						<ArrayDisplay
							content={[
								"5602421584708175181046807257310257387379311773690155958487101805560296232204",
								"5602421584708175181046807257310257387379311773690155958487101805560296232204",
							]}
						/>
						<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 5, marginTop: 20 }}>
							Insert Form 1040
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
									JSON Form Data
								</Text>
								<PDFDisplay taxData={inputJson} style={{ flex: 1, minHeight: 400 }} />
							</ColumnContainer>
							<ColumnContainer>
								<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 5, marginTop: 20 }}>
									Tax Data JSON
								</Text>
								<JSONDisplay
									taxData={inputJson}
									default="Add JSON tax data"
									onChange={setInputJson}
									style={{ flex: 1, minWidth: 400 }}
								/>
								<Button title="Get Signed Tax Data" onClick={handleSign} />
							</ColumnContainer>
						</RowContainer>
					</ColumnContainer>
				) : (
					<ColumnContainer style={{ marginTop: 20, marginBottom: 20 }}>
						<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 5, marginTop: 20 }}>
							Signed Tax Data
						</Text>
						<JSONDisplay
							taxData={signedTaxData}
							default="Singed tax JSON will appear here"
							onChange={() => {}}
							disabled
						/>
						<RowContainer>
							<Button
								title="Download Signed Tax Data"
								onClick={handleDownload}
								style={{ flex: 1, marginRight: 5 }}
							/>
							<Text size={fonts.fontS} style={{ alignSelf: "center", fontWeight: "700" }}>
								Or copy above text area directly
							</Text>
							{/* TODO: use this button once we have SSL */}
							{/* <Button
								title="Copy to Clipboard"
								onClick={handleCopyToClipboard}
								style={{ flex: 1, marginLeft: 5 }}
							/> */}
						</RowContainer>
						<RowContainer>
							<ColumnContainer style={{ flex: 1, marginRight: 10 }}>
								<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 5, marginTop: 20 }}>
									JSON Form Data
								</Text>
								<PDFDisplay taxData={inputJson} style={{ flex: 1, minHeight: 400 }} />
							</ColumnContainer>
							<ColumnContainer>
								<Text size={fonts.fontM} style={{ fontWeight: "700", marginTop: 20, marginBottom: 5 }}>
									Tax Data JSON
								</Text>
								<JSONDisplay
									taxData={inputJson}
									default="Add JSON tax data"
									onChange={setInputJson}
									style={{ flex: 1, minWidth: 400, marginBottom: 0 }}
								/>
							</ColumnContainer>
						</RowContainer>
					</ColumnContainer>
				)}
			</RestrictWidthContainer>
		</ColumnContainer>
	);
};

export default Sign;
