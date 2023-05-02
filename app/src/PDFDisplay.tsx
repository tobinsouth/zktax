import React, { useCallback, useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { updatePdfForm } from "./utilities/f1040";
import { safelyParseJSON } from "./utilities/jsonUtils";

const PDFDisplay = (props: { taxData: string; style?: any }) => {
	const [pdfDataUri, setPdfDataUri] = useState<string>("");

	useEffect(() => {
		const reJSON: Map<string, any> = new Map(Object.entries(safelyParseJSON(props.taxData)));
		updateFormState(reJSON);
	}, [props]);

	async function updatePdf(doc: PDFDocument) {
		const newPdfDataUri = await doc.saveAsBase64({ dataUri: true });
		setPdfDataUri(newPdfDataUri);
	}

	const updateFormState = async (taxJson: Map<string, string>) => {
		const formUrl = "http://localhost:3000/f1040/f1040-2020-empty.pdf";
		const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
		const doc = await PDFDocument.load(formPdfBytes);
		updatePdf(doc);
		const form = doc.getForm();
		updatePdfForm(form, taxJson);
	};

	return <iframe src={pdfDataUri} id="pdf" style={{ width: "auto", height: 400, ...props.style }} scrolling="yes" />;
};

export default PDFDisplay;
