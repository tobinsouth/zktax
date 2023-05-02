import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { PageStyle } from "./App";

interface IColorContext {
	pageStyle: PageStyle;
	setPageStyle: (style: PageStyle) => void;
}

const defaultColorContext = {
	pageStyle: {
		backgroundColor: "#ADD8E6",
		textColor: "#f8f8f8",
		altBackgroundColor: "#161616",
		buttonColor: "#ADD8E6",
	},
	setPageStyle: () => null,
};

const ColorContext = createContext<IColorContext>(defaultColorContext);

export const useColor = () => {
	return useContext(ColorContext);
};

type ContextProps = {
	children?: React.ReactNode;
};

export const ColorProvider = ({ children }: ContextProps) => {
	const [pageStyle, setPageStyle] = useState<PageStyle>(defaultColorContext.pageStyle);

	return (
		<ColorContext.Provider
			value={{
				pageStyle: pageStyle,
				setPageStyle: setPageStyle,
			}}>
			{children}
		</ColorContext.Provider>
	);
};

export default ColorContext;
