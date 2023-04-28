# Zero-knowledge Tax Audit app

Sign, Redact and Prove, Verify

The circuit and related files are located in the folder `src/zkproof`. 

Larger files needed for a larger JSON blob (size > 100) and hence real demo are not stored in git, but can be generated from the src files.

See `src/zkproof` for instructions.

## Run

To install the necessary packages etc, run `yarn install`. 

The circuit-specific files are provided to the react frontend through express. 

To run the example, start the express server in `file-server` and the react application:
```
# Run fileserver:
cd src/file-server
node index.js

# Start react
yarn start
```

To fix ssl issue:
`export NODE_OPTIONS=--openssl-legacy-provider`

`yarn start`

http://localhost:3000/

