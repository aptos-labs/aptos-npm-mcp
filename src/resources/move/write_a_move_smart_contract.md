# How to Write a Move Smart Contract

The following doc outlines the best practices and guidelines to follow when writing a Move smart contract on the Aptos blockchain.

### Folder Structure

- Create a `contract` folder in the root of the project and place all Move-related files in it
  - The `sources` folder should hold all the `.move` module files
  - The `tests` folder should hold all the `.move` test files

├── contract/
│ ├── sources/
│ ├── tests/  
| ├── Move.toml

### Move syntax

- Always use the `Aptos Move 2` syntax.
- Use double slash comments (//) for function doc strings and overall comments

  ```rust
  // doc string for MyStruct
  struct MyStruct has store, copy, drop {}

  // doc string for my_entry_function
  public entry fun my_entry_function(account: &signer) {}

  // doc string for my_view_function
  #[view]
  public fun my_view_function(account_addr: address) {}
  ```

- Always use the latest Aptos standards such as - `Object`, `Aptos Fungible Asset (FA) Standard`, `Aptos Digital Asset (DA) Standard`
  - For any Coin or AptosCoin related implementation, use the `Aptos Fungible Asset (FA) Standard`
  - For any NFT related implementation, use the `Aptos Digital Asset (DA) Standard`
  - For any data that should be easily modified or that requires other users to use the data, use the Aptos `Object`

### Unit tests

- ALWAYS write unit tests for the Move module.
- ALWAYS make sure the smart contract unit tests pass.
  - IF there are issues when interacting with the contract, but unit tests are passing, try to solve those issues separate from the contract.
- IF the contract uses `timestamp` module, ALWAYS make sure to initialize `timestamp` in tests
  ```rust
  // Initialize timestamp for testing
  timestamp::set_time_has_started_for_testing(aptos_framework);
  ```

### Error Codes

- Each error code must be documented with triple slash comments (///) above its definition
  - ```rust
      // Error codes
      /// not found
      const ENOT_FOUND: u64 = 1;
      /// not authorized
      const ENOT_AUTHORIZED: u64 = 2;
    ```
- Error messages should be clear and user-friendly with wide context on what the error is, as they are directly visible to end users

### General best practices

- NEVER use let mut var = ...;. ALWAYS use let var = ....
- NEVER use mut before any function parameter.
- ALL integers in Move are UNSIGNED. There is no negative number.
- ALL modules MUST be top-level -- no module within module/function.
- ALL struct/enum MUST be module-top-level -- no struct/enum within function.
- At the end of a function body, NEVER use return value; as the last statement. To return some expression/value, simply use it as the last expression without a semicolon.
- NEVER assign tuples to a single variable. let \_ = (a, b, c); is invalid. ALWAY unpack tuple to different variables: let (\_a, \_b, \_c) = (a, b, c);.
- NEVER create cyclic data types unless explicitly told so.
- ALWAY ONLY access fields/variants of data structures within the module that defines them. Expose public functions for other modules to interact with data types.
- ALWAY end if, if-else, while, for, loop body with a semicolon.
- ALWAYS use the b or x prefix to create strings, e.g., b"byte\nstring" or x"DEADBEEF".
- NEVER use //# run for functions whose arguments include complex types like struct, enum, or vectors. Create wrappers that take simple primitive types to run such functions.
- NEVER use a module before //# publish it. NEVER assume any module exists unless (1) you define and publish it (2) it's in std.
- ALWAYS explicitly use parentheses to make a nested expression or type clear to avoid ambiguous parsing, especially nested function types.
- NEVER use lifetime specifier!!!
- IF there are default framework functions the dapp can use, ALWAYS prefer using these instead of writing/adding to a custom smart contract.
  - Refer to these [framework functions](https://github.com/aptos-labs/aptos-core/tree/main/aptos-move/framework/aptos-framework/sources)
- ALWAYS default to use the Aptos Testnet, unless specified otherwise.
