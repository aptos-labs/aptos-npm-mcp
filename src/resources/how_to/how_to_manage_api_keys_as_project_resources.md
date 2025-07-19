# How to Manage API Keys as Project Resources

API keys in Aptos Build provide authenticated access to enhanced services with higher rate limits and additional features. This guide covers Full Node API keys and references to other API key types.

## Prerequisites

- Active Aptos Build account at [build.aptoslabs.com](https://build.aptoslabs.com)
- Node.js project with package.json
- Basic understanding of environment variables

## Full Node API Keys

Full Node API keys provide authenticated access to Aptos blockchain data with enhanced rate limits and performance.

**Key Types**:
- **Server Keys**: For backend/server-side applications (never expose in client code)
- **Client Keys**: For frontend applications (safe for browser environments)

1. **Generate API Keys**:
   - Navigate to [build.aptoslabs.com](https://build.aptoslabs.com)
   - Go to "API Keys" section in your project
   - Click "Create New API Key"
   - Choose "Client Key" for frontend or "Server Key" for backend
   - Copy the generated key (starts with `aptoslabs_`)

2. **Configure Environment Variables**:

```env
# Client keys (frontend) - use NEXT_PUBLIC_ prefix
NEXT_PUBLIC_APTOS_API_KEY_TESTNET=aptoslabs_your_client_key_here
NEXT_PUBLIC_APTOS_API_KEY_MAINNET=aptoslabs_your_mainnet_key_here

# Server keys (backend) - no NEXT_PUBLIC_ prefix
APTOS_SERVER_API_KEY=aptoslabs_your_server_key_here

# Network configuration
NEXT_PUBLIC_NETWORK=testnet
```

3. **Integrate with Aptos SDK**:

```tsx
// src/config/aptos.ts
import { AptosConfig, Aptos, Network } from "@aptos-labs/ts-sdk";

const network = process.env.NEXT_PUBLIC_NETWORK === 'mainnet'
  ? Network.MAINNET
  : Network.TESTNET;

const config = new AptosConfig({
  network,
  clientConfig: {
    API_KEY: network === Network.MAINNET
      ? process.env.NEXT_PUBLIC_APTOS_API_KEY_MAINNET
      : process.env.NEXT_PUBLIC_APTOS_API_KEY_TESTNET,
  },
});

export const aptos = new Aptos(config);
```

4. **Use in Wallet Provider**:

```tsx
// src/components/providers/WalletProvider.tsx
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";

export const WalletProvider = ({ children }) => {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{
        network: process.env.NEXT_PUBLIC_NETWORK === 'mainnet'
          ? Network.MAINNET
          : Network.TESTNET,
        aptosApiKeys: {
          testnet: process.env.NEXT_PUBLIC_APTOS_API_KEY_TESTNET,
          mainnet: process.env.NEXT_PUBLIC_APTOS_API_KEY_MAINNET,
        }
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};
```

## Other API Key Types

**Gas Station API Keys**: Auto-generated when creating Gas Station projects for transaction sponsorship. See [how_to_integrate_gas_station.md](./how_to_integrate_gas_station.md) for details.

**No-Code Indexer API Keys**: Auto-generated when creating Indexer processors for real-time blockchain data. See [how_to_integrate_no_code_indexer_build.md](./how_to_integrate_no_code_indexer_build.md) for details.

## Verification

Test your API key integration:

```tsx
// Test Full Node API connection
const ledgerInfo = await aptos.getLedgerInfo();
console.log("✅ API Key working:", ledgerInfo.chain_id);
```

## Security Best Practices

- Use `NEXT_PUBLIC_` prefix only for client-side keys
- Keep server keys without the public prefix
- Never commit `.env.local` files to version control
- Configure origin restrictions for client keys in Aptos Build dashboard
- Use different keys for development and production environments