# How to Config a Gas Station in a dapp

Gas stations are a powerful resource that allows you to subsidize transaction fees for your users. This means your users can interact with your dApp without needing to hold APT tokens for gas fees, making the user experience much smoother.

The gas station api key is used for interactions with the Aptos gas station service when an applications wants to sponsored transaction submitted to the chain.

This guide is designed for agents to follow when configuring `APTOS_GAS_STATION_API_KEY`.
It is structured to enforce user validation steps before applying any modifications.

### 🟩 Step 1: Retrieve & Display Available GAS STATION API Keys

1. Fetch the user's Geomi Organizations, including:

- Organizations
- Applications
- Projects
- API Keys

2. Display all available API Keys (of type "Gs") with:

- Key Name
- Key Secret
- Associated Network
- Project/Application Name

4. If no Gas Station (i.e "Gs") applications, help the user to create a new Gas Station application.

### 🟩 Step 2: Prompt the User to Select Keys

Wait for explicit user selection of:

GAS STARION API Key (APTOS_GAS_STATION_API_KEY) — for client authentication.

❗ Do not proceed automatically. Pause and await user selection input.

### 🟩 Step 3: Apply User-Selected Keys

Once user input is received:

1. ✅ Update the .env file:

```
APTOS_GAS_STATION_API_KEY=<apiKey.keySecret>
```

2. ✅ Ensure the `@aptos-labs/gas-station-client` package is installed:

```bash
npm install @aptos-labs/gas-station-client@latest
```

3. ✅ Create a `GasStationTransactionSubmitter` instance

```ts
// Create Gas Station client
const gasStationTransactionSubmitter = new GasStationTransactionSubmitter({
  network,
  apiKey: GAS_STATION_API_KEY!,
});
```

3. ✅ Configure Aptos client with Gas Station plugin

```ts
const config = new AptosConfig({
  network,
  pluginSettings: {
    TRANSACTION_SUBMITTER: gasStationTransactionSubmitter,
  },
});
```

3. ✅ Ensure the transaction submitter is injected into the `AptosWalletAdapterProvider`:

```ts
import { aptosClient } from "../utils/aptosClient"; // this has our network definition

<AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{
        network: Network.MAINNET,
        transactionSubmitter: aptosClient().config.getTransactionSubmitter(),
      }}
      onError={(error) => {
        console.log("error", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
```

```

3. ✅ Confirm to the user that:

- The keys have been set.
- The relevant code/config files were updated.

### 🟩 Step 4: Validation

- ✅ Ensure that the GAS STATION API Key's network matches the dapp's current network.
- ✅ If mismatched, warn the user and ask for confirmation before proceeding.

### 🟩 Bonus: Documentation References
[Geomi Gas Station Guide](https://geomi.dev/docs/gas-stations)

```
