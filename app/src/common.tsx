import React from "react";
import styled from "styled-components";

export const fonts = {
	fontXXXL: "72px",
	fontXXL: "54px",
	fontXL: "48px",
	fontL: "36px",
	fontML: "30px",
	fontM: "24px",
	fontMS: "20px",
	fontS: "16px",
	fontXS: "14px",
	fontXXS: "12px",
};

export const Text = styled.div`
	font-size: ${(props: { size: string }) => props.size || fonts.fontM};
`;

export const Image = styled.img`
	width: ${(props) => props.width || 30}px;
	height: ${(props) => props.height || 30}px;
`;

export const Holder = styled.div``;

export const RowContainer = styled.div`
	display: flex;
	flex-direction: row;
`;

export const ColumnContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

export const ColumnDivider = styled.div`
	flex: 1;
`;

export const PageTitle = (props: { title: string; subtitle: string }) => {
	return (
		<ColumnContainer
			style={{
				height: "30vh",
				width: "100%",
				backgroundColor: "#ADD8E6",
				justifyContent: "center",
				alignItems: "center",
			}}>
			<Text size={fonts.fontXXL} style={{ fontWeight: "600", color: "#f8f8f8" }}>
				{props.title}
			</Text>
			<Text size={fonts.fontM} style={{ fontWeight: "300", color: "#f8f8f8" }}>
				{props.subtitle}
			</Text>
		</ColumnContainer>
	);
};

export const RestrictWidthContainer = (props: { children: React.ReactNode | React.ReactNode[] }) => {
	return (
		<RowContainer style={{ width: "100%", justifyContent: "center" }}>
			<ColumnContainer style={{ maxWidth: "1200px", flex: 1 }}>{props.children}</ColumnContainer>
		</RowContainer>
	);
};
