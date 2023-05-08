import React, { useEffect, useState } from "react";
import { PageStyle } from "./App";
import { useColor } from "./ColorContext";
import { ColumnContainer, fonts, PageTitle, RestrictWidthContainer, Text, RowContainer, Button } from "./common";

const homePageStyle: PageStyle = {
	backgroundColor: "#ADD8E6",
	textColor: "#161616",
	altBackgroundColor: "#161616",
	buttonColor: "#ADD8E6",
};

const Home = () => {
	const { setPageStyle } = useColor();

	useEffect(() => {
		setPageStyle(homePageStyle);
	});

	return (
		<ColumnContainer>
			<PageTitle title="Zero-knowledge (ZK) Tax Disclosures" subtitle="" />
			<RestrictWidthContainer
				style={{ backgroundColor: "#00599c", color: "#eaeaea", paddingTop: 80, paddingBottom: 80 }}>
				<ColumnContainer style={{ width: "100%" }}>
					<Text size={fonts.fontS}>
						This is a proof of concept prototype for an end-to-end zero-knowledge tax disclosure system. The
						system allows individuals to expose verifiable information from their taxes, while keeping other
						private information from their taxes private. This demo implementation uses Form 1040 from the
						U.S., which is the common form used to submit individual income tax returns.
					</Text>
					<Text size={fonts.fontS} style={{ marginTop: 20 }}>
						Form 1040 aggregates a variety of data submitted to the government. This system could allow:
						<ul style={{ marginTop: 1, marginBottom: 0 }}>
							<li>
								Public officials to publish verified information from their F1040's that was requested
								by the public, while keeping other information on the F1040 private
							</li>
							<li>
								Celebrities to publish verified charitable contributions in an act to inspire
								contributions from others
							</li>
							<li>
								People to demonstrate eligibility for public benefit programs without disclosing private
								information
							</li>
						</ul>
					</Text>
					<Text size={fonts.fontS} style={{ marginTop: 20 }}>
						The system utilizes a zk-snark circuit, which is publicly maintained. The circuit:
						<ul style={{ marginTop: 1, marginBottom: 0 }}>
							<li>Verifies the tax data was signed by a trusted authority</li>
							<li>Redacts the tax data based on users' input</li>
							<li>Outputs redacted tax data and a proof that anyone can verify</li>
						</ul>
					</Text>
				</ColumnContainer>
			</RestrictWidthContainer>
			<RestrictWidthContainer style={{ color: homePageStyle.textColor, paddingTop: 80, paddingBottom: 80 }}>
				<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 20 }}>
					The system is composed of three separate services.
				</Text>
				<RowContainer style={{ width: "100%", marginBottom: 40, marginTop: 10, color: "#eaeaea" }}>
					<ColumnContainer
						style={{ flex: 1, marginRight: 30, padding: 20, borderRadius: 10, backgroundColor: "#00599c" }}>
						<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 10, textAlign: "center" }}>
							Trusted Tax Service (TTS)
						</Text>
						<Text size={fonts.fontS} style={{ fontWeight: "500" }}>
							This service already collects individuals' tax records and is a trusted authority. E.g. the
							IRS in the United States. This service uses private-public key cryptography to sign
							individuals' tax data, which individuals can then download as JSON. The Trusted Tax
							Service's public key is public. The downloaded data is private.
						</Text>
						<a href="/sign" style={{ marginTop: "auto", width: "100%" }}>
							<Button title="Go to Trusted Tax Service" onClick={() => {}} style={{ width: "100%" }} />
						</a>
					</ColumnContainer>
					<ColumnContainer
						style={{ flex: 1, marginRight: 30, padding: 20, borderRadius: 10, backgroundColor: "#00599c" }}>
						<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 10, textAlign: "center" }}>
							Redact & Prove
						</Text>
						<Text size={fonts.fontS} style={{ fontWeight: "500", marginBottom: 15 }}>
							Users take their downloaded tax data from the Trusted Tax Service to the Redact and Prove
							Service. The tax data are still private. Users select which tax fields are to be redacted
							(e.g. SSN, address, etc). The tax fields selected for redaction are provided as input along
							with the signed tax data to the zk-snark circuit. The circuit verifies the signature,
							redacts the data, and outputs a proof with the redacted version of the tax data. The outputs
							(proof data and redacted tax data) can be made public.
						</Text>
						<a href="/sign" style={{ marginTop: "auto", width: "100%" }}>
							<Button title="Go to Redact & Prove Service" onClick={() => {}} style={{ width: "100%" }} />
						</a>
					</ColumnContainer>
					<ColumnContainer
						style={{ flex: 1, marginRight: 30, padding: 20, borderRadius: 10, backgroundColor: "#00599c" }}>
						<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 10, textAlign: "center" }}>
							Verification
						</Text>
						<Text size={fonts.fontS} style={{ fontWeight: "500", marginBottom: 15 }}>
							Anyone can verify the redacted tax data by using the verify service. The verify service uses
							the zk-snark circuit to verify the proof data matches the redacted tax data.
						</Text>
						<a href="/verify" style={{ marginTop: "auto", width: "100%" }}>
							<Button title="Go to Verify Service" onClick={() => {}} style={{ width: "100%" }} />
						</a>
					</ColumnContainer>
				</RowContainer>
				<img
					style={{
						width: "100%",
						height: 400,
						backgroundColor: "white",
						border: "1px solid black",
					}}></img>
				{/* TODO: Put nice graphic here */}
			</RestrictWidthContainer>
		</ColumnContainer>
	);
};

export default Home;
