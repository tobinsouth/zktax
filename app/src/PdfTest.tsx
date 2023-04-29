
import React, { ChangeEvent, useEffect, useState } from "react";

import { pdfToJSON } from "./utilities/f1040";

export default function PDFToJson() {

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
        console.log(json1040);
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
    }

    return (
        <>
            <div>
                <div>
                    <label htmlFor="dropzone-file">
                        <input id="dropzone-file" name='f1040' type="file" onChange={on1040PDF}  />
                    </label>
                </div>

                <div>
                    <button color="white" onClick={() => testButton()}>Test PDF</button>
                </div>
            </div>

        </>
    );
}