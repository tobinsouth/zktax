import React from "react";
import { PageStyle } from "./App";
import { ColumnContainer, PageTitle } from "./common";

const pageStyle: PageStyle = {
	backgroundColor: "#ADD8E6",
	textColor: "#f8f8f8",
	altBackgroundColor: "#161616",
};

const Home = () => {
	return (
		<ColumnContainer>
			<PageTitle title="zkTaxes" subtitle="Verifiable tax details with identity security" />
			{/* TODO: Put nice graphic here */}
		</ColumnContainer>
	);
};

export default Home;
