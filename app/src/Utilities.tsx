export const MAX_JSON_SIZE = 25; // TODO: increase the size after testing (slower)
export const signalsArrayToJSON = (signalsInput: string) => {
	// The signals will return a long array of numbers. The first max_json_size elements are our JSON string as a ascii array (with lots of whitespace). For there we just convert it to a string and parse it using JSON.parse.
	if (!signalsInput) return "";

	const signals_array = JSON.parse(signalsInput);
	// As we change the circuit, we need to manually figure out where the json will be included in the signal
	const signals_section = signals_array.slice(0, MAX_JSON_SIZE); // extract the first max_json_size elements from signals
	const signals_str = signals_section.map((code: number) => String.fromCharCode(code)).join('');
	const signals_obj = JSON.parse(signals_str); // parse signals_str into a JavaScript object
	const signals_json_str = JSON.stringify(signals_obj);
	return signals_json_str;
}

export type Ascii = number;
export function toAsciiArray(str: string): Ascii[] {
    return Array.from(str).map((_, i) => str.charCodeAt(i));
}