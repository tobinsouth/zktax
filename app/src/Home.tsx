import React, { useEffect, useState } from "react";
import { PageStyle } from "./App";
import { useColor } from "./ColorContext";
import { ColumnContainer, fonts, PageTitle, RestrictWidthContainer, Text, RowContainer } from "./common";

const homePageStyle: PageStyle = {
	backgroundColor: "#ADD8E6",
	textColor: "#eaeaea",
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
			<RowContainer
				style={{
					justifyContent: "space-around",
					paddingTop: 10,
					paddingBottom: 10,
					//backgroundColor: "#e1e1e1",
					borderRadius: 5,
					alignItems: "center",
				}}>
				<RowContainer style={{ width: "60%", justifyContent: "center" }}>
					<div>
						<p>
							This is a proof of concept prototype for an end-to-end zero-knowledge tax disclosure system.
						</p>
						<p>
							The system allows individuals to expose verifiable information from their taxes, while
							keeping other private information from their taxes private.
						</p>
						<p>
							This demo implementation uses Form 1040 from the U.S., which is the common form used to
							submit individual income tax returns.
						</p>
						<p>
							Why is this useful? Form 1040 aggregates a variety of data submitted to the government. This
							system could allow:
						</p>
						<div>
							<ul>
								<li>
									Public officials to publish verified information from their F1040's that was
									requested by the public, while keeping other information on the F1040 private
								</li>
								<li>
									Celebrities to publish verified charitable contributions in an act to inspire
									contributions from others
								</li>
								<li>
									People to demonstrate eligibility for public benefit programs without disclosing
									private information
								</li>
							</ul>
						</div>
						<div>
							<p>The system utilizes a zk-snark circuit, which is publicly maintained. The circuit:</p>
							<ul>
								<li>Verifies the tax data was signed by a trusted authority</li>
								<li>Redacts the tax data based on users' input</li>
								<li>Outputs redacted tax data and a proof that anyone can verify</li>
							</ul>

							<p>The system is composed of three separate services.</p>
						</div>
					</div>
				</RowContainer>
			</RowContainer>
			<RestrictWidthContainer>
				<RowContainer style={{ width: "100%", marginBottom: 40 }}>
					<ColumnContainer style={{ flex: 1, marginRight: 10 }}>
						<h2>Trusted Tax Service</h2>
						<Text size={fonts.fontS} style={{ fontWeight: "500" }}>
						

						This service already collects individuals' tax records and is a trusted authority. E.g. the IRS in the United States.

						This service uses private-public key cryptography to sign individuals' tax data, which individuals can then download as JSON. 
						The Trusted Tax Service's public key is public.
						The downloaded data is private.

						</Text>
						<a href="/sign" target="_blank"><button>Go to Trusted Tax Service</button></a>
					</ColumnContainer>
					<ColumnContainer style={{ flex: 1, marginRight: 10 }}>
						<h2>Redact and Prove Service</h2>
						<Text size={fonts.fontS} style={{ fontWeight: "500" }}>
						

Users take their downloaded tax data from the Trusted Tax Service to the Redact and Prove Service.
The tax data are still private.

Users select which tax fields are to be redacted (e.g. SSN, address, etc).
The tax fields selected for redaction are provided as input along with the signed tax data to the zk-snark circuit.
The circuit verifies the signature, redacts the data, and outputs a proof with the redacted version of the tax data.
The outputs (proof data and redacted tax data) can be made public.

						</Text>
						<a href="/prove" target="_blank"><button>Go to Redact and Prove Service</button></a>
					</ColumnContainer>
					<ColumnContainer style={{ flex: 1, marginRight: 10 }}>
						<h2>Verify Service</h2>
						<Text size={fonts.fontS} style={{ fontWeight: "500" }}>
						Anyone can verify the redacted tax data by using the verify service. The verify service uses the zk-snark circuit to verify the proof data matches the redacted tax data.
						</Text>
						<a href="/verify" target="_blank"><button>Go to Verify Service</button></a>
					</ColumnContainer>
				</RowContainer>
				<img style={{width: "100%", height: 400, backgroundColor: "white", border: "1px solid black", margin: 30}}></img>
				{/* TODO: Put nice graphic here */}
			</RestrictWidthContainer>
		</ColumnContainer>
	);
};

export default Home;
