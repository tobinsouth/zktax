import React from "react";
import { useColor } from "./ColorContext";
import { safelyParseJSON } from "./utilities/jsonUtils";

const JSONDisplay = (props: {
	taxData: string;
	onChange: (newInput: string) => void;
	default: string;
	disabled?: boolean;
	style?: any;
}) => {
	const { pageStyle } = useColor();
	const reJSON = new Map(Object.entries(safelyParseJSON(props.taxData)));
	const formatted = reJSON.size ? JSON.stringify(Object.fromEntries(reJSON.entries()), null, 4) : props.taxData;
	return (
		<textarea
			value={formatted}
			style={{
				marginBottom: 10,
				height: 300,
				backgroundColor: pageStyle.altBackgroundColor,
				...props.style,
				color: pageStyle.textColor,
			}}
			onChange={(event) => {
				try {
					props.onChange(event.target.value);
				} catch {}
			}}
			placeholder={props.default}
			disabled={props.disabled || false}
		/>
	);
};

export default JSONDisplay;
