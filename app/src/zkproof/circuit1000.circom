pragma circom 2.0.0;

include "./circuit.circom";

component main { public [ pubkey ] } = VerifySignatureAndRedactJson(1000); // Size 1000: 370706*2 constraints --> 17 ptau << For github demo
