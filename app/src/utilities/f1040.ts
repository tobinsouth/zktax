/*
The present implementation expects a 
2020 version of the F-1040 form where fields
are as defined on the F-1040 form on the IRS website:
https://www.irs.gov/pub/irs-prior/f1040--2020.pdf

Note
- fields differ year to year
- fields may be read or named differently for PDFs from other sources.
*/

import { PDFDocument, PDFTextField, PDFCheckBox, PDFForm } from "pdf-lib";
// Tuple mapping IRS field names to field names we use
import { F1040_2020_FIELDNAMES_MAP } from "./f1040Fields";

const CHECK = "X"; // how we represent a checked checkbox
const IGNORE_FIELD = "-";

// metadata
const YEAR_KEY = "year";
const FORMNAME_KEY = "form";
const METADATA_FIELDS = [YEAR_KEY, FORMNAME_KEY];

export const empty1040src = "/f1040/f1040-2020-empty.pdf";

export async function pdfToJSON(fBytes: ArrayBuffer) {
	const json: Map<string, string> = new Map<string, string>(); // {};
	const fnamesMap: Map<string, string> = new Map<string, string>();

	const pdfDoc = await PDFDocument.load(fBytes);
	const form = pdfDoc.getForm();
	const fields = form.getFields();

	fields.forEach((field) => {
		const fieldName = field.getName();
		if (PDFTextField.prototype.isPrototypeOf(field)) {
			const fieldValue = (field as PDFTextField).getText() || "";
			json.set(fieldName, fieldValue);
			fnamesMap.set(fieldName, fieldValue.length ? fieldValue : fieldName.toString());
		} else if (PDFCheckBox.prototype.isPrototypeOf(field)) {
			const fieldValue = (field as PDFCheckBox).isChecked() ? CHECK : "";
			json.set(fieldName, fieldValue);
			fnamesMap.set(fieldName, fieldName);
		} else {
			// Note this case does not happen with initial tests
			console.error("unhandled field:", fieldName, field);
			json.set(fieldName, IGNORE_FIELD);
			fnamesMap.set(fieldName, fieldName);
		}
	});
	// Map field names from the IRS fieldnames to ones we use
	const renamedJson: Map<string, string> = new Map<string, string>();

	json.forEach((v, k) => {
		const fieldName = k in F1040_2020_FIELDNAMES_MAP ? F1040_2020_FIELDNAMES_MAP[k] : k;
		renamedJson.set(fieldName, v);
	});

	// Add metadata
	renamedJson.set(YEAR_KEY, "2020");
	renamedJson.set(FORMNAME_KEY, "1040");

	// Used for developing the fieldnames map
	// printFieldNamesMap(fnamesMap);
	return renamedJson;
}

export function updatePdfForm(form: PDFForm, taxJson: Map<string, string>) {
	const reverseFieldnamesMap = getReverseFieldNamesMap();
	// update the form with the reverse map
	if (taxJson.size > 0) {
		taxJson.forEach((v, k) => {
			if (METADATA_FIELDS.includes(k)) {
				return;
			}
			const value = taxJson.get(k);
			const fieldName = reverseFieldnamesMap.get(k) || "";
			const field = form.getField(fieldName);
			if (!!PDFTextField.prototype.isPrototypeOf(field)) {
				(field as PDFTextField).setText(value);
			} else if (!!PDFCheckBox.prototype.isPrototypeOf(field)) {
				if (value === CHECK) (field as PDFCheckBox).check();
			} else {
				console.error("Unhandled field:", fieldName, field);
			}
		});
	}
}

export function getReverseFieldNamesMap() {
	const reverseFieldnamesMap = new Map<string, string>();
	Object.keys(F1040_2020_FIELDNAMES_MAP).forEach(function (key) {
		reverseFieldnamesMap.set(F1040_2020_FIELDNAMES_MAP[key], key);
	});
	return reverseFieldnamesMap;
}

// function printFieldNamesMap(fnamesMap: any) {
// 	console.log("FieldNamesMap");
// 	let s = "";
// 	for (var key in fnamesMap) {
// 		let val = fnamesMap[key];
// 		s += '"' + key + '":"' + val + '",' + "\n";
// 	}
// 	console.log(s);
// }
