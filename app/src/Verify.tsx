import React, { useState, ChangeEvent } from 'react';
import "./App.css";

const snarkjs = require("snarkjs");


const verificationKey = "http://localhost:8000/verification_key.json";
const verifyProof = async (_verificationkey: string, signals: any, proof: any) => {
	const vkey = await fetch(_verificationkey).then(function (res) {
		return res.json();
	});
	const res = await snarkjs.groth16.verify(vkey, signals, proof);
	return res;
};

const Verify = () => {
  const [proof, setProof] = useState("");
  const [signals, setSignals] = useState("");
  const [isValid, setIsValid] = useState(false);


  const runVerify = () => {
		let _proof = JSON.parse(proof);
		let _signals = JSON.parse(signals);

		verifyProof(verificationKey, _signals, _proof).then((_isValid) => {
			setIsValid(_isValid);
		});
	}

  const handleProofUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      if (typeof reader.result === 'string') {
        setProof(reader.result);
      } 
      reader.readAsText(file);
    }
	};
	  
	const handleSignalsUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSignals(reader.result);
        }
      };
      reader.readAsText(file);
    }
	};

  return (
    <div>
     <div>
        <label htmlFor="proof-upload">Upload proof:</label>
        <input
            type="file"
            id="proof-upload"
            accept=".json"
            onChange={handleProofUpload}
        />
        </div>
        <div>
        <label htmlFor="signals-upload">Upload signals:</label>
        <input
            type="file"
            id="signals-upload"
            accept=".json"
            onChange={handleSignalsUpload}
        />
    </div>
    <button onClick={runVerify}>Verify Proof</button>
    Result:
    {proof.length > 0 && <p>{isValid ? "Valid proof" : "Invalid proof"}</p>}
    </div>
  );
};

export default Verify;
