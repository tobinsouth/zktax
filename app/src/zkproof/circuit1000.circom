pragma circom 2.0.0;

include "./circuit.circom";

component main { public [ pubkey ] } = VerifySignatureAndRedactJson(1000); // Size 1000: non-linear constraints: 370706 - requires pot19
