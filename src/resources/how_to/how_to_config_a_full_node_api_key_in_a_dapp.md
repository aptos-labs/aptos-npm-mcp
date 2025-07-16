# How to config a Full Node API Key for general blockchain interactions in an Aptos dapp

Aptos full node api keys are designed as indentifications for authentication and rate limiting purposes. If you do not use an API key, your client will be considered “anonymous” and subject to significantly lower rate limits.

The full node api key is used for general blockchain interactions when an applications wants to read data from chain or submit data to chain.

This guide is designed for agents to follow when configuring `APTOS_API_KEY`.
It is structured to enforce user validation steps before applying any modifications.

### 🟩 Step 1: Retrieve & Display Available API Keys

1. Fetch the user's Build Organizations, including:

- Organizations
- Applications
- Projects
- API Keys

2. Display all available API Keys (of type "Api") with:

- Key Name
- Key Secret
- Associated Network
- Project/Application Name

4. If no Api resource applications, help the user to create a new Api resource application.

5. If no API keys exist, help the user to create a new API Key

### 🟩 Step 2: Prompt the User to Select Keys

Wait for explicit user selection of:

API Key (APTOS_API_KEY) — for client authentication.

❗ Do not proceed automatically. Pause and await user selection input.

### 🟩 Step 3: Apply User-Selected Keys

Once user input is received:

1. ✅ Update the .env file:

```
APTOS_API_KEY=<apiKey.keySecret>
```

2. ✅ Ensure the selected API key is injected into the:

- AptosWalletAdapterProvider:

```ts
<AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{
      network: Network.MAINNET,
      aptosApiKeys: {
          <dapp-network>: APTOS_API_KEY,
        }
      }}
      onError={(error) => {
        console.log("error", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
```

- Aptos client instance:

```ts
const aptos = new Aptos(
  new AptosConfig({
    network: NETWORK,
    clientConfig: { API_KEY: APTOS_API_KEY },
  }),
);
```

```

3. ✅ Confirm to the user that:

- The keys have been set.
- The relevant code/config files were updated.

### 🟩 Step 4: Validation

- ✅ Ensure that the API Key's network matches the dapp's current network.
- ✅ If mismatched, warn the user and ask for confirmation before proceeding.

### 🟩 Bonus: Documentation References
[Build API Keys Guide](https://build.aptoslabs.com/docs/start/api-keys)

```
