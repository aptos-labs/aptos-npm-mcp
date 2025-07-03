# How to Manage a Move Smart Contract Development

The following doc outlines the guidelines on how to set up and manage a smart contract deployment on Aptos.

1. Install the `aptos cli` on your local machine, to check if `aptos` is already installed try running in your terminal

```bash
aptos --version
```

That should output something like

```bash
aptos 7.2.0
```

2. Make sure you have set up an admin account to deploy the contract with

```bash
aptos init --network <dapp_network>
```

### Compiling

Compile the Move package to make sure all works

```bash
aptos move compile --named-addresses <named_address>=<your_address>
```

### Testing

Run Unit Tests:

```bash
aptos move test
```

## Deployment

Deploy the compiled code to an object via the command:

```bash
aptos move deploy-object --address-name <named_address> --assume-yes
```

Store the object address output from the publish cli command in the configured `.env` file.

### Transfer and upgrade code in an existing package

Now you can upgrade the code with the designated admin account, as shown below.

Replace <named_address> with the existing named address.
Replace <code_object_addr> with the address of the object hosting the code.

```bash
aptos move upgrade-object --address-name <named_address> --object-address <code_object_addr> --assume-yes
```
