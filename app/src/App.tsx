import React from "react";
import Sign from "./Sign";
import Prove from "./Prove";
import Verify from "./Verify";
import styled from "styled-components";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import Header from "./Header";

export interface PageStyle {
	backgroundColor: string;
	textColor: string;
	altBackgroundColor: string;
}

const App = () => {
	return (
		<AppContainer>
			<Header />
			<Routes>
				<Route key="sign" path="/sign" element={<Sign />} />
				<Route key="home" path="/prove" element={<Prove />} />
				<Route key="home" path="/verify" element={<Verify />} />
				<Route key="home" path="*" element={<Home />} />
			</Routes>
		</AppContainer>
	);
};

const AppContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

export default App;
