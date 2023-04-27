
# First you should do the powers of TAU
https://github.com/iden3/snarkjs

## Clear all the old stuff to clean up
rm -rf *.zkey *.ptau *.r1cs *.wasm *.r1cs.json *.sym challenge_phase* *_js *.wtns response_phase* verification_key.json

## Generate the powers of tau
snarkjs powersoftau new bn128 20 pot14_0000.ptau -v
snarkjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau --name="First contribution" -v -e="It's actually my birthday today"
snarkjs powersoftau contribute pot14_0001.ptau pot14_0002.ptau --name="Second contribution" -v -e="What really is randomness"
snarkjs powersoftau export challenge pot14_0002.ptau challenge_0003
snarkjs powersoftau challenge contribute bn128 challenge_0003 response_0003 -e="Cheese Gromit"
snarkjs powersoftau import response pot14_0002.ptau response_0003 pot14_0003.ptau -n="Third contribution name"
snarkjs powersoftau verify pot14_0003.ptau
snarkjs powersoftau beacon pot14_0003.ptau pot14_beacon.ptau 0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 -n="Final Beacon"
snarkjs powersoftau prepare phase2 pot14_beacon.ptau pot14_final.ptau -v
snarkjs powersoftau verify pot14_final.ptau


# Generate the circuit

rm -rf redactString_js *.zkey *.r1cs *.wasm *.sym 
circom redactString.circom --r1cs --wasm --sym

snarkjs r1cs export json redactString.r1cs redactString.r1cs.json
snarkjs groth16 setup redactString.r1cs pot14_final.ptau circuit_0000.zkey
snarkjs zkey contribute circuit_0000.zkey circuit_0001.zkey --name="Tobin Bot" -v -e="random entropy"
snarkjs zkey contribute circuit_0001.zkey circuit_0002.zkey --name="Tobin Bot 2" -v -e="I want some peanut butter"
snarkjs zkey export bellman circuit_0002.zkey  challenge_phase2_0003
snarkjs zkey bellman contribute bn128 challenge_phase2_0003 response_phase2_0003 -e="beans are great two"
snarkjs zkey import bellman circuit_0002.zkey response_phase2_0003 circuit_0003.zkey -n="Tobin Bellman Bot"
snarkjs zkey beacon circuit_0003.zkey circuit_final.zkey 0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 -n="Final Beacon phase2"

snarkjs zkey verify redactString.r1cs pot14_final.ptau circuit_final.zkey

snarkjs zkey export verificationkey circuit_final.zkey verification_key.json
cp redactString_js/redactString.wasm .


# TEST INPUTS
cd redactString_js && node generate_witness.js redactString.wasm ../inputs10.json ../witness.wtns
snarkjs wtns check redactString.r1cs witness.wtns 
snarkjs groth16 setup redactString.r1cs pot14_final.ptau circuit_0000.zkey
