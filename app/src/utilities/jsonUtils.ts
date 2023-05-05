// Match MAX_JSON_SIZE to circuit files being used.
// Use small size for github version
// export const MAX_JSON_SIZE = 100;
export const MAX_JSON_SIZE = 1500;
// export const MAX_JSON_SIZE = 2000;

export const signalsArrayToJSON = (signals: string) => {
	// The signals will return a long array of numbers.
	// The first max_json_size elements are our JSON string as a ascii array (with lots of whitespace).
	// We transform these to a string and parse using JSON.parse.
	if (!signals) return "";

	const signals_array = JSON.parse(signals);
	const signals_section = signals_array.slice(0, MAX_JSON_SIZE);
	const signals_str = signals_section.map((code: number) => String.fromCharCode(code)).join("");
	const signals_obj = JSON.parse(signals_str); // parse signals_str into a JavaScript object
	return JSON.stringify(signals_obj);
};

export type Ascii = number;
export function toAsciiArray(str: string): Ascii[] {
	return Array.from(str).map((_, i) => str.charCodeAt(i));
}

export function safelyParseJSON(json: any) {
	var parsed;

	try {
		parsed = JSON.parse(json);
	} catch (e) {
		return {};
	}

	return parsed;
}
