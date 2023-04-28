pragma circom 2.0.0;

/*
Verifies signature from hash-and-sign over JSON, using MIMC hash function.
Redacts JSON based on redact_map.
Outputs the redacted JSON.
Where JSON is represented as an array of ascii characters.
Based on circuit developed at https://github.com/aberke/snarkjs-hash-and-sign
*/


// include "circomlib/circuits/mimc.circom";
// include "circomlib/circuits/eddsamimc.circom";
include "../../node_modules/circomlib/circuits/mimc.circom";
include "../../node_modules/circomlib/circuits/eddsamimc.circom";

template VerifySignatureAndRedactJson(max_json_size) {
    // json passed as an array of integers representing ascii characters
    // last (max_json_size - json_size) characters are just padding
    signal input json[max_json_size];
    // Redaction map
    signal input redact_map[max_json_size];
    // Reacted JSON output
    signal output json_output[max_json_size];

    // signature parts
    signal input pubkey[2]; // Public 
    signal input signature_R8x;
    signal input signature_R8y;
    signal input signature_S;

    // hash json
    component hash = MultiMiMC7(max_json_size, 91); // 2nd parameter is number of rounds: 91 used in circomlibjs and circom unit tests
    hash.k <== 1; // k=1 used in frontend mimc hash
    for (var i=0; i<max_json_size; i++) {
        hash.in[i] <== json[i];
    }

    // verify signature
    component signatureCheck = EdDSAMiMCVerifier();
    signatureCheck.enabled <== 1;
    signatureCheck.Ax <== pubkey[0];
    signatureCheck.Ay <== pubkey[1];
    signatureCheck.R8x <== signature_R8x;
    signatureCheck.R8y <== signature_R8y;
    signatureCheck.S <== signature_S;
    signatureCheck.M <== hash.out;

    // Redaction to create output
    for(var i=0; i<max_json_size; i++){
        // Set to JSON string if redact_map[i] == 1 else set to blank space (32)
        json_output[i] <==  json[i]*redact_map[i] + 32*(1-redact_map[i]);
    }
}
// component main { public [ pubkey ] } = VerifySignatureAndRedactJson(10); // Size 10: 9356 constraints
// component main { public [ pubkey ] } = VerifySignatureAndRedactJson(25); // Size 25: 14831 constraints --> 14 ptau << For github demo
// component main { public [ pubkey ] } = VerifySignatureAndRedactJson(50); // Size 50: 23956 constraints --> 15 ptau
// component main { public [ pubkey ] } = VerifySignatureAndRedactJson(100); // Size 100: 42206 constraints --> 16 ptau << For github demo
// component main { public [ pubkey ] } = VerifySignatureAndRedactJson(500); // Size 500: 188206 constraints -> 18 ptau
// component main { public [ pubkey ] } = VerifySignatureAndRedactJson(750); // Size 750: 279456 constraints -> 19 ptau
// component main { public [ pubkey ] } = VerifySignatureAndRedactJson(1000); // Size 1000: 370706 constraints -> 19 ptau << For bigger demo


// Note it doesn't matter (at least in zkrepl) if arrays are arrays of strings of numbers or numbers
// i.e. {"test":[1,0]} same as {"test":["1", "0"]}
/* 
INPUT = {"json":[123,34,98,101,97,110,115,34,58,34,103,114,101,97,116,34,125,32,32,32,32,32,32,32,32],"pubkey":["1891156797631087029347893674931101305929404954783323547727418062433377377293","14780632341277755899330141855966417738975199657954509255716508264496764475094"],"signature_R8x":"10485436169466215689676929185828614138923593819810395015047005369693315157358","signature_R8y":"9485804816844556363645625755949166296471221111483948963250707162354763717658","signature_S":"1524834290451955647604955862619673604199381373564759205138448033359694902143","redact_map":[1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]}
*/