import React, { useState, useEffect } from "react";
import { MAX_JSON_SIZE, signalsArrayToJSON } from "./Utilities";
import { ColumnContainer, fonts, PageTitle, RestrictWidthContainer, Text } from "./common";
import { PageStyle } from "./App";

const pageStyle: PageStyle = {
	backgroundColor: "#161616",
	textColor: "#f8f8f8",
	altBackgroundColor: "#333333",
};

const snarkjs = require("snarkjs");

const makeProof = async (_proofInput: any, _wasm: string, _zkey: string) => {
	console.log("Making proof");
	const { proof, publicSignals } = await snarkjs.groth16.fullProve(_proofInput, _wasm, _zkey);
	console.log("Proof made");
	console.log("publicSignals", publicSignals);
	return { proof, publicSignals };
};

function RedactCard(props: {inputJson: any, redactKeys: Array<string>, editRedactKey: any}) {
  // This is the component that shows the JSON input and allows the user to redact keys by clicking on them
  const { inputJson, redactKeys, editRedactKey } = props;

  console.log("inputJson", inputJson);
  console.log("redactKeys", redactKeys);

  return (
	<>
    <ul className="ml-4 font-mono text-sm">
      <>
        {inputJson  && (
          <>
            {Object.keys(inputJson).map(
              (key: string, index: any) => {
              return (              
                <div key={index}>
                  <span className="mb-4 mr-4">
					{'"' + key + '"'}: 
                    <button className={
                      inputJson[key] && key in redactKeys ?
                        "hover:line-through decoration-pink-500 decoration-2 bg-transparent border-none cursor-auto focus:outline-none" :
                        "line-through decoration-pink-500 decoration-2 bg-transparent border-none cursor-auto focus:outline-none" }
                        onClick={() =>editRedactKey(key)}
                      >
                      {
                        key in inputJson && 
                        inputJson[key] && <>{
							typeof inputJson[key] === 'string' ?
							'"' + inputJson[key]+ '"' :
							inputJson[key] 
                        }</>
                      }
                      {/* {index != numKeys - 1 && <>,</>} */}
                    </button>
                  </span>
                </div>)
			  })}
          </>
        )}
      </>
    </ul>
  </>);
}

function Prove() {
	// The first half is the input and redaction
	const [inputJsonOfEverything, setInputJsonOfEverything] = useState("");
	const [inputJson, setInputJson] = useState<{ [key: string]: any }>({});
	const [redactKeys, setRedactKeys] = useState<Array<string>>([]);
	// The second half is the proof output and download
	const [proof, setProof] = useState("");
	const [signals, setSignals] = useState("");
	const [redactedJson, setRedactedJson] = useState("");

	//let wasmFile = "http://localhost:8000/circuit25.wasm";
	// let zkeyFile = "http://localhost:8000/circuit25.zkey";
	// let wasmFile = "http://localhost:8000/circuit100.wasm";
	// let zkeyFile = "http://localhost:8000/circuit100.zkey";
	let wasmFile = "http://localhost:8000/circuit1000.wasm";
	let zkeyFile = "http://localhost:8000/circuit1000.zkey";

	const processInput = () => {
		try {
			let input = JSON.parse(inputJsonOfEverything);
			const _inputJsonStr = input.json.map((code: number) => String.fromCharCode(code)).join('');
			const _inputJson = JSON.parse(_inputJsonStr); // parse signals_str into a JavaScript object
			setInputJson(_inputJson);
			console.log("processInput", _inputJson);
		} catch (e) {
			console.log("processInput", e);
		}
	};

	const editRedactKey = (key: string) => {
		if (redactKeys.includes(key)) {
			setRedactKeys(redactKeys.filter((k) => k !== key));
		} else {
			setRedactKeys(redactKeys.concat([key]));
		}
	};

	const runProofs = () => {
		if (!inputJsonOfEverything || !inputJson) {
			alert("Please input a JSON");
			return;
		}
		if (redactKeys.length === 0) {
			alert("Please select at least one key to redact");
			return;
		}

		let proofInput = JSON.parse(inputJsonOfEverything);
		let _inputJsonStr = proofInput.json.map((code: number) => String.fromCharCode(code)).join('');

		// We build redact map from the input json and the redact keys
		let _redactMap = Array(MAX_JSON_SIZE).fill(1);
		for (var key of redactKeys) {
			let fakeJson: { [key: string]: any } = {};
			fakeJson[key] = inputJson[key];
			let fakeJsonStr = JSON.stringify(fakeJson).slice(1,-1);
			let redactStartIndex = _inputJsonStr?.indexOf(fakeJsonStr);
			// If redactStartIndex in undefined throw error
			if(!(redactStartIndex >0)){
				console.log("Redaction error", fakeJsonStr, redactStartIndex);
			} else {
				let redactEndIndex = redactStartIndex + fakeJsonStr?.length;
				for (var i = redactStartIndex; i < redactEndIndex; i++) {
					_redactMap[i] = 0;
				}
				// If the redacted field is not the last field in the JSON, we need to remove the comma
				if (_inputJsonStr[redactEndIndex] === ",") {
					_redactMap[redactEndIndex] = 0;
				}
				console.log("Redacting", redactStartIndex, redactEndIndex)
			}
		}
	
		proofInput["redact_map"] = _redactMap;
		console.log("Proof input", proofInput);

		makeProof(proofInput, wasmFile, zkeyFile).then(({ proof: _proof, publicSignals: _signals }) => {
			setProof(JSON.stringify(_proof, null, 2));
			setSignals(JSON.stringify(_signals, null, 2));
		});
	};

	useEffect(() => {
		console.log("Signals", signals);
		setRedactedJson(signalsArrayToJSON(signals));
	}, [signals]);

	const downloadJSON = () => {
		const proofBlob = new Blob([proof], { type: "application/json" });
		const signalsBlob = new Blob([signals], { type: "application/json" });
		const proofUrl = URL.createObjectURL(proofBlob);
		const signalsUrl = URL.createObjectURL(signalsBlob);
		const proofLink = document.createElement("a");
		const signalsLink = document.createElement("a");
		proofLink.href = proofUrl;
		signalsLink.href = signalsUrl;
		proofLink.download = "proof.json";
		signalsLink.download = "signals.json";
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
		<ColumnContainer>
			<PageTitle title="Redact & Prove" subtitle="Pick fields and generate a proof" />
			<RestrictWidthContainer>
				<Text size={fonts.fontM} style={{ fontWeight: "700", marginBottom: 5, marginTop: 20 }}>
					Prove Section
				</Text>
				<pre>Signed Witness Inputs</pre>
				<textarea
					id="jsonInput"
					rows={4}
					required={true}
					value={inputJsonOfEverything}
					onChange={(event) => {
						setInputJsonOfEverything(event.target.value);
					}}
					placeholder={"The output of a trust tax verification service"}></textarea>
				{/* We should also have a json upload option */}
				<button onClick={processInput}>Select Redaction</button>
				<RedactCard inputJson={inputJson} redactKeys={redactKeys} editRedactKey={editRedactKey}/>
				<button onClick={runProofs}>Generate Proof</button>
				Proof: <p>{proof}</p>
				Signals: <p>{signals}</p>
				Redacted JSON: <p>{redactedJson}</p>
				<button disabled={!(proof && signals)} onClick={downloadJSON}>
					Download Proof Artifacts
				</button>
			</RestrictWidthContainer>
		</ColumnContainer>
	);
}

export default Prove;
