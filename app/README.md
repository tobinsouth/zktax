# Zero-knowledge Tax Audit app

Sign, Redact and Prove, Verify

The circuit and related files are located in the folder `/src/zkproof`. 

The circuit files are generated in `/src/zkproof` and are then served from the `/public/zkproof/` directory. 

Larger files needed for a larger JSON blob (size > 100) and hence real demo are not stored in git, but can be generated from the src files.

See `/src/zkproof` for instructions to compile and test.


After being compiled they must be moved to the `/public/zkproof/` directory (the compile `.wasm`, `.zkey`, and verificationkey `.json` files).

e.g.
```
cp src/zkproof/circuit*.zkey public/zkproof/
cp src/zkproof/circuit*.wasm public/zkproof/
cp src/zkproof/verification_key* public/zkproof/

```

## Install

To install the necessary packages etc, run `yarn install`. 

## Run

`yarn start`

http://localhost:3000/

