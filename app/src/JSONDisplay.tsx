import React from "react";
import { useColor } from "./ColorContext";

const JSONDisplay = (props: {
	JSONTaxData: Map<string, string>;
	onChange: (newData: Map<string, string>) => void;
	disabled?: boolean;
	style?: any;
}) => {
	const { pageStyle } = useColor();
	return (
		<textarea
			value={JSON.stringify(Object.fromEntries(props.JSONTaxData.entries()), null, 4)}
			style={{ marginBottom: 10, height: 300, backgroundColor: pageStyle.altBackgroundColor, ...props.style }}
			onChange={(event) => {
				try {
					const parsed = JSON.parse(event.target.value);
					props.onChange(parsed);
				} catch {}
			}}
			placeholder="Enter JSON here..."
			disabled={props.disabled || false}
		/>
	);
};

export default JSONDisplay;
