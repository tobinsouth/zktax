import { Link } from "react-router-dom";
import styled from "styled-components";
import { useColor } from "./ColorContext";
import { fonts, Text } from "./common";

const Header = () => {
	const { pageStyle } = useColor();
	return (
		<OuterContainer style={{ backgroundColor: pageStyle.backgroundColor }}>
			<Container style={{ color: pageStyle.textColor }}>
				<LeftContainer>
					<Link
						style={{ cursor: "pointer", textDecoration: "none" }}
						to={{
							pathname: "/",
						}}>
						<Text
							size={fonts.fontML}
							style={{ color: pageStyle.textColor, fontWeight: "600", cursor: "pointer" }}>
							zktax
						</Text>
					</Link>
				</LeftContainer>
				<RightContainer>
					<Link
						className="link"
						to={{
							pathname: "/sign",
						}}>
						<Text size={fonts.fontS} style={{ color: pageStyle.textColor, paddingRight: 30 }}>
							Sign
						</Text>
					</Link>

					<Link
						className="link"
						to={{
							pathname: "/prove",
						}}>
						<Text size={fonts.fontS} style={{ color: pageStyle.textColor, paddingRight: 30 }}>
							Prove
						</Text>
					</Link>
					<Link
						className="link"
						to={{
							pathname: "/verify",
						}}>
						<Text size={fonts.fontS} style={{ color: pageStyle.textColor }}>
							Verify
						</Text>
					</Link>
				</RightContainer>
			</Container>
		</OuterContainer>
	);
};

const Container = styled.div`
	height: 72px;
	max-width: 1200px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: row;
	flex: 1;
	align-self: center;
`;

const OuterContainer = styled.div`
	width: 100%;
	margin: auto;
	display: flex;
	flex-direction: row;
	justify-content: center;
`;

const LeftContainer = styled.div`
	display: flex;
	align-items: center;
	flex-direction: row;
	flex: 1;
	display: flex;
`;

const RightContainer = styled.div`
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: flex-end;
	flex-direction: row;
	margin-left: auto;
`;

export default Header;
