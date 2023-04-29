
import React, { ChangeEvent, useState } from "react";
import { PDFDocument } from 'pdf-lib';

import { pdfToJSON } from "./utilities/f1040";

export default function PDFTest() {

    const [pdfDataUri, setPdfDataUri] = useState<string>("");

    async function updatePdf(doc) {
        const newPdfDataUri = await doc.saveAsBase64({ dataUri: true });
        // const newPdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
        setPdfDataUri(newPdfDataUri);
    }

    async function testButton() {
        // Question: What is a good way to make us consistently read fields?
        // We shouldn't expect the fields to be consistently named, right?
        // Note the filled out trump example is from the empty IRS form

        // trump example form
        const formUrl = 'http://localhost:3000/f1040/f1040-2020-trump.pdf';
        // empty example form from IRS
        // const formUrl = 'http://localhost:3000/f1040/f1040-2020-empty.pdf';
        const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer())
        const json1040 = await pdfToJSON(formPdfBytes);
        // to doc
        const doc = await PDFDocument.load(formPdfBytes);
        updatePdf(doc);
    }

    async function on1040PDF(e: ChangeEvent<HTMLInputElement>) {
        /*
        Handles the PDF File input. Expects form 1040 from 2020.
        */
        const fileInput = e.target;
        if (!fileInput.files || fileInput.files.length === 0) {
          console.error("No files?!");
          return;
        }
        const file = fileInput.files[0];
        const fBytes = await file.arrayBuffer();
        const json1040 = await pdfToJSON(fBytes);
        console.log(json1040)
        console.log('fBytes')
        console.log(fBytes)
        const doc = await PDFDocument.load(fBytes);
        updatePdf(doc);

    }

    return (
        <>
            <div style={{textAlign: "center"}}>
                <div>
                    <label htmlFor="dropzone-file">
                        <input id="dropzone-file" name='f1040' type="file" onChange={on1040PDF}  />
                    </label>
                </div>

                <div>
                    <button color="white" onClick={() => testButton()}>Test PDF</button>
                </div>
                <div style={{height: 600}}>
                    <iframe src={pdfDataUri} id="pdf" style={{width: 800, height: "100%"}}></iframe>
                </div>
            </div>

        </>
    );
}