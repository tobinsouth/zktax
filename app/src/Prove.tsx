import React, { useState, useEffect } from "react";
import "./App.css";

import { Field, Input, Text, Button, Link } from "rimble-ui";

const inputPlaceholder = `{"json":[123,34,98,101,97,110,115,34,58,34,103,114,101,97,116,34,125,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32],"expected_hash":"8212667227496080003659044215129690500251129226858791313097901395621523328751","pubkey":["1891156797631087029347893674931101305929404954783323547727418062433377377293","14780632341277755899330141855966417738975199657954509255716508264496764475094"],"signature_R8x":"575367722704732835986236382562944164536106996141647026564175120532141075707","signature_R8y":"5161394658463472095215528820052179047558392292057981442809422878860372724687","signature_S":"1232751336502645209440039865304637461569194785573761662733072429732905422095"}`
const MAX_JSON_SIZE = 1000; // TODO: increase the size after testing (slower)
const signalsArrayToJSON = (signalsInput: string) => {
	// The signals will return a long array of numbers. The first max_json_size elements are our JSON string as a ascii array (with lots of whitespace). For there we just convert it to a string and parse it using JSON.parse.
	const max_json_size = 10;
	if (!signalsInput) return "";

	const signals_array = JSON.parse(signalsInput);
	const signals_section = signals_array.slice(0, max_json_size); // extract the first max_json_size elements from signals
	const signals_str = signals_section.map(code => String.fromCharCode(code)).join('');
	const signals_obj = JSON.parse(signals_str); // parse signals_str into a JavaScript object
	const signals_json_str = JSON.stringify(signals_obj);
	return signals_json_str;
}

const snarkjs = require("snarkjs");


const makeProof = async (_proofInput: any, _wasm: string, _zkey: string) => {
	console.log("Making proof")
	const { proof, publicSignals } = await snarkjs.groth16.fullProve(_proofInput, _wasm, _zkey);
	console.log("Proof made")
	return { proof, publicSignals };
};


function App() {
    const [inputJson, setInputJson] = useState("");
	const [proof, setProof] = useState("");
	const [signals, setSignals] = useState("");
	const [redactedJson, setRedactedJson] = useState("");
	const [isValid, setIsValid] = useState(false);
    const [redactMap, setRedactMap] = useState("");

	let wasmFile = "http://localhost:8000/redactString.wasm";
	let zkeyFile = "http://localhost:8000/circuit_final.zkey";


	const runProofs = () => {

        let proofInput = JSON.parse(inputJson);
        console.log("Proof input", proofInput);
        
        // We build redact map from the input json.
        let jsonArray = proofInput.json;
        let redactMap = Array(jsonArray.length).fill(1);
        redactMap[4] = 0; // Hide the 4 letter to test
    
        proofInput["redact_map"] = redactMap;

		makeProof(proofInput, wasmFile, zkeyFile).then(({ proof: _proof, publicSignals: _signals }) => {
			setProof(JSON.stringify(_proof, null, 2));
			setSignals(JSON.stringify(_signals, null, 2));
		})
	};

	useEffect(() => {		
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
			<header className="App-header">
				<h1>Prove Section</h1>
				<pre>Signed Witness Inputs</pre>
				<textarea 
					label="json input" rows="4"
					type="text" required={true} value={inputJson} 
					onChange={(event) => {setInputJson(event.target.value)}} placeholder={inputPlaceholder}
				></textarea>
                {/* We should also have a json upload option */}
				<Button.Outline onClick={runProofs}>Generate Proof</Button.Outline>
				Proof: <Text width={1 / 2}>{proof}</Text>
				Signals: <Text>{signals}</Text>
				Redacted JSON: <Text>{redactedJson}</Text>
				<Button.Outline disabled={!(proof && signals)} onClick={downloadJSON}>Download Proof Artifacts</Button.Outline>
			</header>
		</div>
	);
}


export default App;
