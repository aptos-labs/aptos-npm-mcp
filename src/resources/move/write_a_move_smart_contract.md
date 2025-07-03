# How to Write a Move Smart Contract

The following doc outlines the best practices and guidelines to follow when writing a Move smart contract on the Aptos blockchain.

### Folder Structure

- Create a `contract` folder in the root of the porject and place all Move related files in it
  - The `sources` folder should hold all the `.move` module files
  - The `tests` folder should hold all the `.move` test files

├── contract/
│ ├── sources/
│ ├── tests/  
| ├── Move.toml

### Move syntax

- Always use the `Aptos Move 2` syntax.
- All comments (other than error code comments) should be using double slash comments (//)
  - Use double slash comments (//) for function doc strings and comments
- Always use the latest Aptos standards such as - `Object`, `Aptos Fungible Asset (FA) Standard`, `Aptos Digital Asset (DA) Standard`
  - For any Coin, AptosCoin related implementation, use the `Aptos Fungible Asset (FA) Standard`
  - For any NFT related implementation, use the `Aptos Digital Asset (DA) Standard`
  - For any data, that should be easily modified or that requires other users to use the data, use the Aptos `Object`

### Unit tests

- Make sure to write unit tests for the Move module.

### Error Codes

- Each error code must be documented with triple slash comments (///) above its definition
- Error messages should be clear and user-friendly with wide context on what the error is, as they are directly visible to end users
