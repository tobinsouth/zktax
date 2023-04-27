// Alex Berke version

pragma circom 2.0.0;

/*
Implements hash-and-sign over JSON, using MIMC hash function.

Outputs the hash.
*/


// include "circomlib/circuits/mimc.circom";
// include "circomlib/circuits/eddsamimc.circom";
include "../../node_modules/circomlib/circuits/mimc.circom";
include "../../node_modules/circomlib/circuits/eddsamimc.circom";

template HashAndSignJson (max_json_size) {
    // json passed as an array of integers representing ascii characters
    // last (max_json_size - json_size) characters are just padding
    signal input json[max_json_size];
    // expectedHash included for testing. Note this must be passed as a string entire to match up
    signal input expected_hash;


    // signature parts
    signal input pubkey[2]; // Public 
    signal input signature_R8x;
    signal input signature_R8y;
    signal input signature_S;

    signal output json_hash;

    // Redaction map
    signal input redactMap[max_json_size];
    signal output jsonOutput[max_json_size];

    
    // hash json
    component hash = MultiMiMC7(max_json_size, 91); // 2nd parameter is number of rounds: 91 used in circomlibjs and circom unit tests
    hash.k <== 1; // k=1 used in frontend mimc hash
    for (var i=0; i<max_json_size; i++) {
        hash.in[i] <== json[i];
    }
    // assert expected hash -- the hash is used as the message to sign in the signature
    expected_hash === hash.out;

    // verify signature
    component signatureCheck = EdDSAMiMCVerifier();
    signatureCheck.enabled <== 1;
    signatureCheck.Ax <== pubkey[0];
    signatureCheck.Ay <== pubkey[1];
    signatureCheck.R8x <== signature_R8x;
    signatureCheck.R8y <== signature_R8y;
    signatureCheck.S <== signature_S;
    signatureCheck.M <== hash.out;

    json_hash <== hash.out;


    // Logic for doing redaction to create output
    for(var i=0; i<max_json_size; i++){
        // Set to JSON string if redactMap[i] == 1 else set to blank space (32)
        jsonOutput[i] <==  json[i]*redactMap[i] + 32*(1-redactMap[i]);
    }
}

component main { public [ pubkey ] } = HashAndSignJson(1000);
// component main { public [ pubkey ] } = HashAndSignJson(2000); // TODO: Use larger size like 2000 or 3000

// Note it doesn't matter (at least in zkrepl) if arrays are arrays of strings of numbers or numbers
// i.e. {"test":[1,0]} same as {"test":["1", "0"]}
/* 
INPUT = {"json":[123,34,110,97,109,101,34,58,34,97,98,101,114,107,101,34,125,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"expected_hash":"13159802027422757966648157110889553078019941283604846286942432723851737596579","pubkey":["1891156797631087029347893674931101305929404954783323547727418062433377377293","14780632341277755899330141855966417738975199657954509255716508264496764475094"],"signature_R8x":"16964126305936474542281368944751139086965196672827466858771916915951120046946","signature_R8y":"21825774281722416292533193496684199774545936832852839934247605628835037337464","signature_S":"418143625420133529219476527635100290825461317961811291907047180787670775971"}
*/