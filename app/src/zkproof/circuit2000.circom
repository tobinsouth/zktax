pragma circom 2.0.0;

include "./circuit.circom";

component main { public [ pubkey ] } = VerifySignatureAndRedactJson(2000); // Size 2000: 735706 constraints -> 20 ptau
