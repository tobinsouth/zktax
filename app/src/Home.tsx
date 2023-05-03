import React, { useEffect } from "react";
import { PageStyle } from "./App";
import { useColor } from "./ColorContext";
import { ColumnContainer, PageTitle, RowContainer, Text } from "./common";

const homePageStyle: PageStyle = {
	backgroundColor: "#ADD8E6",
	textColor: "#f8f8f8",
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
					The system allows individuals to expose verifiable information from their taxes, while keeping other private information from their taxes private.
				</p>
				<p>
				This demo implementation uses Form 1040 from the U.S., which is the common form used to submit individual income tax returns.
				</p>
				<p>
				Why is this useful? Form 1040 aggregates a variety of data submitted to the government. This system could allow:
				<ul>
					<li>
					Public officials to publish verified information from their F1040's that was requested by the public, while keeping other information on the F1040 private
					</li>
					<li>
					Celebrities to publish verified charitable contributions in an act to inspire contributions from others
					</li>
					<li>
					People to demonstrate eligibility for public benefit programs without disclosing private information
					</li>
				</ul>
				</p>
				<p>
				The system utilizes a zk-snark circuit, which is publicly maintained.
				The circuit:
				<ul>
					<li>
					Verifies the tax data was signed by a trusted authority
					</li>
					<li>
					Redacts the tax data based on users' input
					</li>
					<li>
					Outputs redacted tax data and a proof that anyone can verify
					</li>
				</ul>
				</p>
				<p>
				The system is composed of three separate services.
				</p>
				{/* TODO: More on this below in 3 columns */}

			</div>
			{/* TODO: Put nice graphic here */}
			</RowContainer>
			</RowContainer>
		</ColumnContainer>
	);
};

export default Home;
