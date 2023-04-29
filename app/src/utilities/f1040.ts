/*
The present implementation expects a 
2020 version of the F-1040 form where fields
are as defined on the F-1040 form on the IRS website:
https://www.irs.gov/pub/irs-prior/f1040--2020.pdf

Note
- fields differ year to year
- fields may be read or named differently for PDFs from other sources.
*/
// @ts-nocheck // TODO: React/Typescript expert please fix this.

import { PDFDocument, PDFTextField, PDFCheckBox } from 'pdf-lib';
// Tuple mapping IRS field names to field names we use
import { F1040_2020_FIELDNAMES_MAP } from './f1040Fields';

const CHECK = "X"; // how we represent a checked checkbox
const IGNORE_FIELD = "-";


export async function pdfToJSON(fBytes: ArrayBuffer) {
    // let json = {};
    let json : Map<string, string> = new Map<string, string>();
    // used for developing the map between IRS fieldnames and those we use
    let fnamesMap : Map<string, string> = new Map<string, string>();

    const pdfDoc = await PDFDocument.load(fBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    fields.forEach(field => {
        const fieldName = field.getName();
        let fieldValue = "";
        if (!!PDFTextField.prototype.isPrototypeOf(field)) {
            fieldValue = field.getText();
            fieldValue = (!!fieldValue) ? fieldValue : "";
            json[fieldName] = fieldValue;
            fnamesMap[fieldName] = (!!fieldValue.length) ? fieldValue : fieldName.toString();
        }
        else if (!!PDFCheckBox.prototype.isPrototypeOf(field)) {
            fieldValue = field.isChecked() ? CHECK : "";
            json[fieldName] = fieldValue;
            fnamesMap[fieldName] = fieldName;
        } else {
            // Note this case does not happen with initial tests
            console.error('unhandled field:', fieldName, field);
            json[fieldName] = IGNORE_FIELD;
            fnamesMap[fieldName] = fieldName;
        }
    })
    // Map field names from the IRS fieldnames to ones we use
    // let renamedJson = <string>{};
    let renamedJson : Map<string, string> = new Map<string, string>();
    for (var key in json) {
        let val = json[key];
        let fieldName = (key in F1040_2020_FIELDNAMES_MAP) ? F1040_2020_FIELDNAMES_MAP[key] : key;
        renamedJson[fieldName] = val;
    }
    // Add metadata
    renamedJson['year'] = '2020';
    renamedJson['form'] = '1040';
    // Used for developing the fieldnames map
    printFieldNamesMap(fnamesMap);
    return renamedJson;
}

function printFieldNamesMap (fnamesMap: any) {
    console.log('FieldNamesMap')
    let s = "";
    for (var key in fnamesMap) {
        let val = fnamesMap[key];
        s += ('"'+key+'":"'+val+'",'+'\n')
    }
    console.log(s)
}

