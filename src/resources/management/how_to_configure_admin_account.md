# How to Configure An Admin Account

The admin account for a dapp on Aptos, is used to publish the Move contract to the Aptos configured chain. To setup an admin account you can either generate a new keypair and then store it in a secret place like `.env` file, or use an existing private key that is known to you.

### How to Generate a new Keypair for an admin account

1. Use the aptos CLI to generate a new local account

```bash
aptos init --network <dapp-network>
```

2. Store the private key and the account address

Store the generated private key and the account address in an `.env` file. If not already exists, create a new one and store it there.

3. Fund The Admin Account

See [How to Fund An Account On Aptos](./how_to_fund_an_account_on_aptos.md)

### How to Use a Known admin account

If you have your own admin account you would like to use, past its key pair information to the dapp `.env` file. Make sure the account is funded.
