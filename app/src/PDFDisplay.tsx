import React, { useEffect, useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { updatePdfForm } from "./utilities/f1040";
import { safelyParseJSON } from "./utilities/jsonUtils";

const PDFDisplay = (props: { taxData: string; style?: any }) => {
	const [pdfDataUri, setPdfDataUri] = useState<string>("");

	const updatePdf = useCallback(
		(doc: PDFDocument) => {
			const func = async () => {
				const newPdfDataUri = await doc.saveAsBase64({ dataUri: true });
				setPdfDataUri(newPdfDataUri);
			};
			func();
		},
		[setPdfDataUri],
	);

	const updateFormState = useCallback(
		(taxJson: Map<string, string>) => {
			const func = async () => {
				const formUrl = "http://localhost:3000/f1040/f1040-2020-empty.pdf";
				const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
				const doc = await PDFDocument.load(formPdfBytes);
				updatePdf(doc);
				const form = doc.getForm();
				updatePdfForm(form, taxJson);
			};
			func();
		},
		[updatePdf],
	);

	useEffect(() => {
		const reJSON: Map<string, any> = new Map(Object.entries(safelyParseJSON(props.taxData)));
		updateFormState(reJSON);
	}, [props, updateFormState]);

	return (
		<iframe
			title="pdfDisplay"
			src={pdfDataUri}
			id="pdf"
			style={{ width: "auto", height: 400, ...props.style }}
			scrolling="yes"
		/>
	);
};

export default PDFDisplay;
