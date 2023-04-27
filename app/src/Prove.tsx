import React, { useState, useEffect } from "react";
import { MAX_JSON_SIZE, signalsArrayToJSON } from "./Utilities";
import "./App.css";

const inputPlaceholder: string = `{"json":[123,34,98,101,97,110,115,34,58,34,103,114,101,97,116,34,125,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32],"expected_hash":"8212667227496080003659044215129690500251129226858791313097901395621523328751","pubkey":["1891156797631087029347893674931101305929404954783323547727418062433377377293","14780632341277755899330141855966417738975199657954509255716508264496764475094"],"signature_R8x":"575367722704732835986236382562944164536106996141647026564175120532141075707","signature_R8y":"5161394658463472095215528820052179047558392292057981442809422878860372724687","signature_S":"1232751336502645209440039865304637461569194785573761662733072429732905422095"}`

const snarkjs = require("snarkjs");


const makeProof = async (_proofInput: any, _wasm: string, _zkey: string) => {
	console.log("Making proof")
	const { proof, publicSignals } = await snarkjs.groth16.fullProve(_proofInput, _wasm, _zkey);
	console.log("Proof made")
	console.log("publicSignals", publicSignals);
	return { proof, publicSignals };
};


function Prove() {
    const [inputJson, setInputJson] = useState("");
	const [proof, setProof] = useState("");
	const [signals, setSignals] = useState("");
	const [redactedJson, setRedactedJson] = useState("");
    const [redactMap, setRedactMap] = useState<Array<number>>(Array(MAX_JSON_SIZE).fill(1));

	let wasmFile = "http://localhost:8000/redactString25.wasm";
	let zkeyFile = "http://localhost:8000/circuit_final25.zkey";

	const chooseRedaction = () => {
		let _redactMap = redactMap;
		_redactMap[4] = 0; // Hide the 4 letter to test
		setRedactMap(_redactMap);
	}

	const runProofs = () => {


        let proofInput = JSON.parse(inputJson);
		
        // We build redact map from the input json.
        let jsonArray = proofInput.json;
		chooseRedaction();

        proofInput["redactMap"] = redactMap;
		console.log("Proof input", proofInput);


		makeProof(proofInput, wasmFile, zkeyFile).then(({ proof: _proof, publicSignals: _signals }) => {
			setProof(JSON.stringify(_proof, null, 2));
			setSignals(JSON.stringify(_signals, null, 2));
		})
	};

	useEffect(() => {		
		console.log("Signals", signals);
		setRedactedJson(signalsArrayToJSON(signals));
	}, [signals]);

	const downloadJSON = () => {
		const proofBlob = new Blob([proof], { type: 'application/json' });
		const signalsBlob = new Blob([signals], { type: 'application/json' });
		const proofUrl = URL.createObjectURL(proofBlob);
		const signalsUrl = URL.createObjectURL(signalsBlob);
		const proofLink = document.createElement('a');
		const signalsLink = document.createElement('a');
		proofLink.href = proofUrl;
		signalsLink.href = signalsUrl;
		proofLink.download = 'proof.json';
		signalsLink.download = 'signals.json';
		document.body.appendChild(proofLink);
		document.body.appendChild(signalsLink);
		proofLink.click();
		signalsLink.click();
		document.body.removeChild(proofLink);
		document.body.removeChild(signalsLink);
		URL.revokeObjectURL(proofUrl);
		URL.revokeObjectURL(signalsUrl);
	};		



	return (
		<div>
			<h1>Prove Section</h1>
			<pre>Signed Witness Inputs</pre>
			<textarea 
				id="jsonInput"
				rows={4}
				required={true}
				value={inputJson}
				onChange={(event) => {setInputJson(event.target.value)}} 
				placeholder={inputPlaceholder}
			></textarea>
			{/* We should also have a json upload option */}
			<button onClick={runProofs}>Generate Proof</button>
			Proof: <p>{proof}</p>
			Signals: <p>{signals}</p>
			Redacted JSON: <p>{redactedJson}</p>
			<button disabled={!(proof && signals)} onClick={downloadJSON}>Download Proof Artifacts</button>
		</div>
	);
}


export default Prove;
