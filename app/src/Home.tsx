import React, { useEffect } from "react";
import { PageStyle } from "./App";
import { useColor } from "./ColorContext";
import { ColumnContainer, PageTitle } from "./common";

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
			<PageTitle title="zkTaxes" subtitle="Verifiable tax details with identity security" />
			{/* TODO: Put nice graphic here */}
		</ColumnContainer>
	);
};

export default Home;
