# How to Fund An Account On Aptos

### If the dapp is configured to use the `devnet` network, run this function:

```
aptos account fund-with-faucet --profile default --url https://fullnode.devnet.aptoslabs.com --faucet-url https://faucet.devnet.aptoslabs.com
```

### If the dapp is configured to use the `testnet` network:

Do not run any CLI commands, but instead provide the following steps to take:

1. Visit the Aptos Testnet Faucet: https://aptos.dev/en/network/faucet
2. Enter your account address
3. Request tokens (you'll get 1 APT)

### If the dapp is configured to use the `mainnet` network:

Don't run any CLI commands, but instead you should use dex/cex to gain real APT coins.
