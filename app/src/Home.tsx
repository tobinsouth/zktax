import React, { useEffect, useState } from "react";
import { PageStyle } from "./App";
import { useColor } from "./ColorContext";
import { ColumnContainer, fonts, PageTitle, RestrictWidthContainer, Text } from "./common";
import TabSelect, { TabOption } from "./TabSelect";

const homePageStyle: PageStyle = {
	backgroundColor: "#ADD8E6",
	textColor: "#f8f8f8",
	altBackgroundColor: "#161616",
	buttonColor: "#ADD8E6",
};

const tabOptions: TabOption[] = [
	{
		title: "Sign",
		index: 0,
	},
	{
		title: "Prove",
		index: 1,
	},
	{
		title: "Verify",
		index: 2,
	},
];

const Home = () => {
	const { setPageStyle } = useColor();
	const [tab, setTab] = useState(0);

	useEffect(() => {
		setPageStyle(homePageStyle);
	});

	return (
		<ColumnContainer>
			<PageTitle title="zkTaxes" subtitle="Verifiable tax details with identity security" />
			<RestrictWidthContainer>
				<TabSelect
					options={tabOptions}
					onChange={(i) => {
						setTab(i);
					}}
				/>{" "}
				{tab === 0 ? (
					<ColumnContainer>
						<Text size={fonts.fontS} style={{ fontWeight: "500" }}>
							Copy for Sign
						</Text>
					</ColumnContainer>
				) : tab === 1 ? (
					<ColumnContainer>
						<Text size={fonts.fontS} style={{ fontWeight: "500" }}>
							Copy for Prove
						</Text>
					</ColumnContainer>
				) : (
					<ColumnContainer>
						<Text size={fonts.fontS} style={{ fontWeight: "500" }}>
							Copy for Verify
						</Text>
					</ColumnContainer>
				)}
			</RestrictWidthContainer>
		</ColumnContainer>
	);
};

export default Home;
