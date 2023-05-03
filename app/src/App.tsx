import React from "react";
import Sign from "./Sign";
import Prove from "./Prove";
import Verify from "./Verify";
import PdfTest from "./PdfTest";
import styled from "styled-components";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import Header from "./Header";
import { useColor } from "./ColorContext";

export interface PageStyle {
	backgroundColor: string;
	textColor: string;
	altBackgroundColor: string;
	buttonColor: string;
}

const App = () => {
	const { pageStyle } = useColor();
	return (
		<AppContainer style={{ backgroundColor: pageStyle.backgroundColor, color: pageStyle.textColor }}>
			<Header />
			<Routes>
				<Route key="pdfTest" path="/pdfTest" element={<PdfTest />} />
				<Route key="sign" path="/sign" element={<Sign />} />
				<Route key="home" path="/prove" element={<Prove />} />
				<Route key="home" path="/verify" element={<Verify />} />
				<Route key="home" path="*" element={<Home />} />
			</Routes>
			<Dummy style={{ backgroundColor: pageStyle.backgroundColor, color: pageStyle.textColor }} />
		</AppContainer>
	);
};

const AppContainer = styled.div`
	display: flex;
	flex-direction: column;
	min-height: 100vh;
`;

const Dummy = styled.div`
	flex: 1;
	display: flex;
`;

export default App;
