pragma circom 2.0.0;

include "./circuit.circom";

component main { public [ pubkey ] } = VerifySignatureAndRedactJson(100); // Size 100: 42206*2 constraints --> 17 ptau << For github demo
