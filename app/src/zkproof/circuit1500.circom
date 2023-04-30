pragma circom 2.0.0;

include "./circuit.circom";

component main { public [ pubkey ] } = VerifySignatureAndRedactJson(1500); // Size 1500: 553206 constraints --> 20 ptau
