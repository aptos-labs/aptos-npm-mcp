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

4. Create the Gas Station and copy the auto-generated GAS STATION API key (`aptoslabs_xxx...`).

**Note**: For enhanced rate limits and better performance when making SDK calls to read blockchain data, consider also setting up Full Node API keys. See [how_to_manage_api_keys_as_project_resources.md](./how_to_manage_api_keys_as_project_resources.md) for details.

## Frontend Integration (Plugin Approach - Recommended)

This is the preferred method recommended by the Aptos team. It integrates seamlessly with the wallet adapter and requires minimal setup.

1. **Install required dependencies**:

```bash
npm install @aptos-labs/ts-sdk@^3.1.1 @aptos-labs/gas-station-client@^1.1.1 @aptos-labs/wallet-adapter-core@^6.0.0 @aptos-labs/wallet-adapter-react@^7.0.0
```

2. **Configure Gas Station client and Aptos SDK**:

```tsx
// src/lib/gasStation.ts
import { AptosConfig, Aptos, Network } from "@aptos-labs/ts-sdk";
import { createGasStationClient } from "@aptos-labs/gas-station-client";

const network = process.env.NEXT_PUBLIC_NETWORK === 'mainnet'
  ? Network.MAINNET
  : Network.TESTNET;

// Create Gas Station client
const gasStationClient = createGasStationClient({
  network,
  apiKey: process.env.NEXT_PUBLIC_GAS_STATION_API_KEY!,
});

// Configure Aptos client with Gas Station plugin
const config = new AptosConfig({
  network,
  pluginSettings: {
    TRANSACTION_SUBMITTER: gasStationClient,
  },
});

export const aptos = new Aptos(config);
```

3. **Configure Wallet Adapter Provider**:

```tsx
// src/components/WalletProvider.tsx
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { type PropsWithChildren } from "react";
import { Network } from "@aptos-labs/ts-sdk";
import { aptos } from "../lib/gasStation";

export const WalletProvider = ({ children }: PropsWithChildren) => {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{
        network: process.env.NEXT_PUBLIC_NETWORK === 'mainnet'
          ? Network.MAINNET
          : Network.TESTNET,
        transactionSubmitter: aptos.config.getTransactionSubmitter(),
      }}
      onError={(error) => {
        console.log("Wallet error:", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};
```

4. **Set up environment variables**:

```env
NEXT_PUBLIC_GAS_STATION_API_KEY=aptoslabs_YOUR_API_KEY_HERE
NEXT_PUBLIC_MODULE_ADDR=0x...your_contract_address
NEXT_PUBLIC_NETWORK=testnet
```

5. **Use standard wallet adapter flow**:

```tsx
// src/components/SponsoredTransaction.tsx
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export const SponsoredTransaction = () => {
  const { account, signAndSubmitTransaction } = useWallet();

  const handleSponsoredTransaction = async () => {
    if (!account) return;

    try {
      // Standard wallet adapter flow - Gas Station handles sponsorship automatically
      const response = await signAndSubmitTransaction({
        data: {
          function: `${process.env.NEXT_PUBLIC_MODULE_ADDR}::your_module::your_function`,
          functionArguments: ["arg1", "arg2"],
        },
        withFeePayer: true, // Enable gas sponsorship
      });

      console.log("✅ Sponsored transaction hash:", response.hash);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <button onClick={handleSponsoredTransaction} disabled={!account}>
      Execute Sponsored Transaction
    </button>
  );
};
```

## reCAPTCHA Integration (Optional)

If you've configured reCAPTCHA protection in your Gas Station, you can include the token:

```tsx
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export const SponsoredTransactionWithCaptcha = () => {
  const { account, signAndSubmitTransaction } = useWallet();

  const getRecaptchaToken = async (): Promise<string> => {
    // Implement your reCAPTCHA logic here
    // Return the reCAPTCHA token
    return "your-recaptcha-token";
  };

  const handleSponsoredTransaction = async () => {
    if (!account) return;

    try {
      // Get reCAPTCHA token
      const recaptchaToken = await getRecaptchaToken();

      // Submit transaction with reCAPTCHA token
      const response = await signAndSubmitTransaction({
        data: {
          function: `${process.env.NEXT_PUBLIC_MODULE_ADDR}::your_module::your_function`,
          functionArguments: ["arg1", "arg2"],
        },
        withFeePayer: true,
        pluginParams: { recaptchaToken },
      });

      console.log("✅ Sponsored transaction hash:", response.hash);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <button onClick={handleSponsoredTransaction} disabled={!account}>
      Execute Sponsored Transaction (with reCAPTCHA)
    </button>
  );
};
```

## Alternative: Manual Integration (Advanced)

For advanced use cases where you need more control over the transaction flow, you can use the manual approach:

```tsx
// src/services/manualGasStation.ts
import {
  Aptos,
  AptosConfig,
  Network,
  SimpleTransaction,
  AccountAuthenticator,
} from "@aptos-labs/ts-sdk";
import { createGasStationClient } from "@aptos-labs/gas-station-client";

const network = Network.TESTNET;

// Create separate Gas Station client for manual use
const gasStationClient = createGasStationClient({
  network,
  apiKey: process.env.NEXT_PUBLIC_GAS_STATION_API_KEY!,
});

// Create standard Aptos client for building transactions
const aptos = new Aptos(new AptosConfig({ network }));

export const submitSponsoredTransactionManually = async (
  userAddress: string,
  functionName: string,
  functionArguments: any[],
  signTransaction: any
) => {
  // Build a sponsored transaction
  const tx = await aptos.transaction.build.simple({
    sender: userAddress,
    withFeePayer: true,
    data: {
      function: `${process.env.NEXT_PUBLIC_MODULE_ADDR}::${functionName}`,
      functionArguments,
    },
    options: {
      maxGasAmount: 50, // Match your gas station limit
    },
  });

  // Ask the wallet to sign
  const { authenticator } = await signTransaction({
    transactionOrPayload: tx,
  });

  // Submit via Gas Station manually
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

## Error Handling

```tsx
// src/utils/gasStationErrors.ts
export const handleGasStationError = (error: any) => {
  if (error.message?.includes('insufficient funds')) {
    return 'Gas Station has insufficient funds. Please contact support.';
  }
  
  if (error.message?.includes('function not allowed')) {
    return 'This function is not sponsored by the Gas Station.';
  }
  
  if (error.message?.includes('rate limit')) {
    return 'Rate limit exceeded. Please try again later.';
  }
  
  if (error.message?.includes('reCAPTCHA')) {
    return 'reCAPTCHA verification failed. Please try again.';
  }
  
  return `Transaction failed: ${error.message}`;
};
```

## Verification

1. **Test sponsored transactions**:
   - Users should see "Network Fee: 0 APT" in their wallet confirmation
   - Transactions should complete without users holding APT tokens

2. **Monitor usage**:
   - Check Aptos Build dashboard → Gas Station → Usage
   - Track gas costs in USD and transaction volume
   - Set up alerts for high usage or errors

3. **Verify contract rules**:
   - Ensure only intended functions are sponsored
   - Check spending limits are appropriate
   - Test rate limiting if configured

## Best Practices

- **Use the plugin approach** for standard integrations
- **Set appropriate gas limits** to prevent abuse
- **Monitor usage regularly** to control costs
- **Test thoroughly** on testnet before mainnet deployment
- **Implement proper error handling** for better user experience
- **Use reCAPTCHA** for public-facing applications to prevent abuse
- **Keep API keys secure** and use environment variables (see [how_to_manage_api_keys_as_project_resources.md](./how_to_manage_api_keys_as_project_resources.md) for best practices)

## Official Resources

- [Gas Station Documentation](https://build.aptoslabs.com/docs/gas-stations)
- [Integration Guide](https://build.aptoslabs.com/docs/gas-stations#integration)
- [API Keys and Authentication](https://build.aptoslabs.com/docs/start/api-keys)
- [Billing and Cost Management](https://build.aptoslabs.com/docs/start/resource-management)

## Common Issues

- **"Function not allowed"**: Check your Gas Station contract rules configuration
- **"Insufficient funds"**: Gas Station needs more APT tokens for sponsorship
- **"Rate limit exceeded"**: Too many requests - implement proper rate limiting
- **"Invalid API key"**: Verify your API key is correct and has proper permissions
- **Network mismatch**: Ensure Gas Station network matches your dApp configuration