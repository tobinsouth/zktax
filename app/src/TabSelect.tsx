import React, { useState } from "react";
import styled from "styled-components";
import { fonts, Text } from ".//common";
import { useEffect } from "react";
import { useColor } from "./ColorContext";

export interface TabOption {
	title: string;
	index: number;
}

const TabSelect = (props: { options: TabOption[]; onChange: (selection: number) => void }) => {
	const [selected, changeSelected] = useState(0);

	const optionTabs = props.options.map((option) => {
		return (
			<TabSection
				title={option.title}
				selected={selected === option.index}
				index={option.index}
				onSelected={changeSelected}
				key={option.index}
			/>
		);
	});

	useEffect(() => {
		const selectedOption = props.options[selected];
		props.onChange(selectedOption.index);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selected]);

	return <Container>{optionTabs}</Container>;
};

const TabSection = (props: {
	title: string;
	selected: boolean;
	index: number;
	onSelected: (index: number) => void;
}) => {
	const { pageStyle } = useColor();
	const TabContainer = styled.div<TabContainerProps>`
		border-bottom: 3px solid;
		display: flex;
		flex: 1;
		border-bottom-color: ${(props) => (props.selected ? pageStyle.textColor : pageStyle.backgroundColor)};
		color: ${pageStyle.textColor};
		font-weight: ${(props) => (props.selected ? "600" : "400")};
		cursor: pointer;
		background-color: ${pageStyle.backgroundColor};
	`;
	return (
		<TabContainer className="tabSection" selected={props.selected} onClick={() => props.onSelected(props.index)}>
			<Text size={fonts.fontMS} style={textStyle}>
				{props.title}
			</Text>
		</TabContainer>
	);
};

const Container = styled.div`
	display: flex;
	padding: 20px 0px;
	align-items: center;
	justify-content: space-around;
	flex-direction: row;
	flex: 1;
`;

interface TabContainerProps {
	selected: boolean;
}

const textStyle = {
	paddingBottom: 2,
	width: "100%",
	textAlign: "center" as const,
};

export default TabSelect;
