# How to Manage a Move Smart Contract Development

The following doc outlines the guidelines on how to set up and manage a smart contract development on Aptos.

### Create Package

1. Make sure you have the correct Move package folder structure

project-folder/
├── contract/
│ ├── sources // all Move modules should live here
│ ├── Move.toml
│ ├── .gitignore // put files and folder to ignore like build/

2. Update Move.toml

```rust
[package]
name = "<name-of-your-package>"
version = "<version-of-your-package>"

[addresses]
<names-address> = "_"

[dev-addresses]
<names-address> = "0x123"

[dependencies.AptosFramework]
git = "https://github.com/aptos-labs/aptos-framework.git"
rev = "mainnet"
subdir = "aptos-framework"
```

3. Write your Move smart contract modules

### Compiling

Once you have a package set up, you can compile your Move code by doing:

```bash
aptos move compile --dev
```

### Testing

Unit testing for Move adds three new annotations to the Move source language:

#[test] #[test_only], and #[expected_failure]

Run Unit Tests:

```bash
aptos move test --dev
```

### Deployment

After writing and testing the contract, deploy it to the Aptos network so any client can communicate and integrate with the contract.

Follow the [deploy_smart_contract](./deploy_smart_contract.md) resource on how to deploy a smart contract.
