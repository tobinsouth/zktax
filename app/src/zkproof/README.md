# ZK related files

[Helpful diagram](https://file.notion.so/f/s/d08b94e9-ceac-4497-97b4-be481ea5f014/Untitled.png?id=4edc02c2-caf1-47b5-9084-664d56e87382&table=block&spaceId=49789257-8634-4c86-a9e2-dcecb65edf1c&expirationTimestamp=1682116775286&signature=Lbun12RN0PDWBRfxUByA5IReWqFuSMKccOuD-JU0vTo)

The size of our circuit related files scales with the size of the JSON input.

We generate a circuit for multiple sizes X named `circuitX.circom`.

Larger files used in the main demo cannot be commited to git. 

Git contains the smaller files for tests. 

- circuit25: `max_json_size=25`
    - compiled with 14 powers of tau
- circuit100: `max_json_size=100`
    - compiled with 17 powers of tau
- circuit1000: `max_json_size=1000`
    - compiled with 19 powers of tau
- circuit1500: `max_json_size=1500`
    - compiled with 20 powers of tau
- circuit2000: `max_json_size=2000`
    - compiled with 20 powers of tau


All necessary files can be recompiled from the `circuitX.circom` files and tested with the `inputX.json` files by following the instructions from snarkjs: 
https://github.com/iden3/snarkjs


We use groth16.


Steps used to compile/test the circuit files are below

```
circom circuit2000.circom --r1cs --wasm --sym

mv circuit2000_js/circuit2000.wasm .

# multiple steps for the groth16 setup -- should contribute to the phase 2 ceremonhy
snarkjs groth16 setup circuit2000.r1cs pot20_final.ptau circuit2000.zkey

# verify the zkey
snarkjs zkey verify circuit2000.r1cs pot20_final.ptau circuit2000.zkey

# export verification key
snarkjs zkey export verificationkey circuit2000.zkey verification_key2000.json

# Test prove and verify
# prove
snarkjs groth16 fullprove input2000.json circuit2000.wasm circuit2000.zkey proof2000.json public2000.json
# verify
snarkjs groth16 verify verification_key2000.json public2000.json proof2000.json
```
