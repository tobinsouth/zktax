pragma circom 2.0.0;

include "./circuit.circom";

component main { public [ pubkey ] } = VerifySignatureAndRedactJson(25); // Size 25: 14831 constraints --> 14 ptau
