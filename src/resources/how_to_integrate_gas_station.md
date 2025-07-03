# How to Integrate Gas Station for Sponsored Transactions

Gas Station lets your dApp pay gas fees for users, removing the "first-buy-APT" hurdle and smoothing onboarding. Use it when you want newcomers to transact with empty wallets or need precise control over which functions are subsidized.

## Prerequisites

Make sure you have published your Move module and have the module address.

## Backend Setup in Aptos Build

1. Go to [Aptos Build](https://build.aptoslabs.com/) and create a new project.

2. Choose "Gas Station" as the project type.

3. Configure your Gas Station:
   - Name the project (3-32 chars, lowercase, numbers, `_` or `-`)
   - Select network (Mainnet or Testnet)
   - Paste your module address and select module name
   - Select the function(s) to subsidize
   - Set gas limits (default: 3-50 per transaction, 100 OCTA gas price)

4. Create the Gas Station and copy the auto-generated API key (`aptoslabs_xxx...`).

## Frontend Integration

1. Install required dependencies:

```bash
npm install @aptos-labs/ts-sdk@^3 @aptos-labs/gas-station-client@^1.1 @aptos-labs/wallet-adapter-react@latest
```

2. Create Gas Station service file:

```tsx
import {
  Aptos,
  AptosConfig,
  Network,
  SimpleTransaction,
  AccountAuthenticator,
} from "@aptos-labs/ts-sdk";
import { createGasStationClient } from "@aptos-labs/gas-station-client";
import { useWallet } from '@aptos-labs/wallet-adapter-react';

const network = Network.TESTNET;

// Create the Gas Station client
const gasStationClient = createGasStationClient({
  network,
  apiKey: process.env.NEXT_PUBLIC_GAS_STATION_API_KEY!,
});

// Create an Aptos client for building transactions
const aptos = new Aptos(new AptosConfig({ network }));

export const submitSponsoredTransaction = async (userAddress: string, functionName: string, functionArguments: any[]) => {
  const { signTransaction } = useWallet();

  // Build a sponsored transaction
  const tx = await aptos.transaction.build.simple({
    sender: userAddress,
    withFeePayer: true,                   // enables gas sponsorship
    data: {
      function: `${process.env.NEXT_PUBLIC_MODULE_ADDR}::${functionName}`,
      functionArguments,
    },
    options: {
      maxGasAmount: 50,                   // match your gas station limit
    },
  });

  // Ask the wallet to sign
  const { authenticator } = await signTransaction({
    transactionOrPayload: tx,
  });

  // Submit via Gas Station
  const response = await gasStationClient.simpleSignAndSubmitTransaction(
    tx as SimpleTransaction,
    authenticator as AccountAuthenticator,
    undefined,
  );

  if (response.error !== undefined || response.data === undefined) {
    throw new Error(`Gas Station error: ${JSON.stringify(response.error)}`);
  }

  return response.data.transactionHash;
};
```

3. Set up environment variables:

```env
NEXT_PUBLIC_GAS_STATION_API_KEY=aptoslabs_YOUR_API_KEY_HERE
NEXT_PUBLIC_MODULE_ADDR=0x...your_contract_address
NEXT_PUBLIC_NETWORK=testnet
```

4. Use in your React component:

```tsx
import { submitSponsoredTransaction } from './services/gasStation';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

const MyComponent = () => {
  const { account } = useWallet();

  const handleSponsoredAction = async () => {
    if (!account) return;
    
    try {
      const txHash = await submitSponsoredTransaction(
        account.address,
        "your_module::your_function",
        [arg1, arg2]
      );
      console.log("✅ Sponsored transaction:", txHash);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <button onClick={handleSponsoredAction}>
      Execute Sponsored Transaction
    </button>
  );
};
```

## Verification

Test your integration by executing a sponsored transaction. Users should see "Network Fee: 0 APT" in their wallet confirmation.

Monitor usage in Aptos Build dashboard under Gas Station → Usage to track gas costs in USD.