import React from "react";
import { useColor } from "./ColorContext";
import { safelyParseJSON } from "./utilities/jsonUtils";

export const ArrayDisplay = (props: { content: string[]; style?: any }) => {
	const { pageStyle } = useColor();
	const formatted =
		props.content
			.map((c, i) => `    "${c}"${i !== props.content.length - 1 ? "," : ""}\n`)
			.reduce((p, c) => p + c, "[\n") + "]";
	return (
		<textarea
			value={formatted}
			rows={2 + props.content.length}
			style={{
				backgroundColor: pageStyle.altBackgroundColor,
				resize: "none",
				...props.style,
			}}
			disabled={true}
		/>
	);
};

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
