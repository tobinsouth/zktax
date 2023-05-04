import React, { useEffect, useState } from "react";
import { PageStyle } from "./App";
import { useColor } from "./ColorContext";
import { ColumnContainer, fonts, PageTitle, RestrictWidthContainer, Text, RowContainer } from "./common";
// import TabSelect, { TabOption } from "./TabSelect";

const homePageStyle: PageStyle = {
	backgroundColor: "#ADD8E6",
	textColor: "#eaeaea",
	altBackgroundColor: "#161616",
	buttonColor: "#ADD8E6",
};

// const tabOptions: TabOption[] = [
// 	{
// 		title: "Sign",
// 		index: 0,
// 	},
// 	{
// 		title: "Prove",
// 		index: 1,
// 	},
// 	{
// 		title: "Verify",
// 		index: 2,
// 	},
// ];

const Home = () => {
	const { setPageStyle } = useColor();
	const [tab, setTab] = useState(0);

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
						{/* TODO: More on this below in 3 columns */}
					</div>
				</RowContainer>
			</RowContainer>
			<RestrictWidthContainer>
				<RowContainer style={{ width: "100%", marginBottom: 40 }}>
					<ColumnContainer style={{ flex: 1, marginRight: 10 }}>
						<Text size={fonts.fontS} style={{ fontWeight: "500" }}>
							Copy for Sign
						</Text>
					</ColumnContainer>
					<ColumnContainer style={{ flex: 1, marginRight: 10 }}>
						<Text size={fonts.fontS} style={{ fontWeight: "500" }}>
							Copy for Prove
						</Text>
					</ColumnContainer>
					<ColumnContainer style={{ flex: 1, marginRight: 10 }}>
						<Text size={fonts.fontS} style={{ fontWeight: "500" }}>
							Copy for Verify
						</Text>
					</ColumnContainer>
				</RowContainer>
				{/* TODO: Put nice graphic here */}
			</RestrictWidthContainer>
		</ColumnContainer>
	);
};

export default Home;
