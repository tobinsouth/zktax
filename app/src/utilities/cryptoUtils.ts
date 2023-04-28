
const { buildBabyjub, buildMimc7, buildEddsa } = require("circomlibjs");

// This is a PROTOTYPE where we make the secret/private signing key public
// generated as const sk = Buffer.from("1".toString().padStart(64, "0"), "hex");
const sk = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
// generated as eddsa.prv2pub(sk);
export const publicKey = ["5602421584708175181046807257310257387379311773690155958487101805560296232204","5602421584708175181046807257310257387379311773690155958487101805560296232204"];

export async function hashAndSignEddsaMiMC(msgArray: any) {
    const eddsa = await buildEddsa();
    const mimc7 = await buildMimc7();
    const babyJub = await buildBabyjub();
    const F = babyJub.F;
    const k = 1;
    // hash and sign
    const hash = mimc7.multiHash(msgArray, k);
    const pk = eddsa.prv2pub(sk);
    const signature = eddsa.signMiMC(sk, hash);
    return {
        pubkey: [BigInt(F.toObject(pk[0])).toString(), BigInt(F.toObject(pk[1])).toString()],
        R8x: BigInt(F.toObject(signature.R8[0])).toString(),
        R8y: BigInt(F.toObject(signature.R8[1])).toString(),
        S: BigInt(signature.S).toString(),
    };
};
