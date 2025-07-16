# How to Add a Wallet Connection

Aptos provides a React Provider and Context for connecting Aptos wallets to your dapp. Then you can use the Provider to look up account information and sign transactions / messages.

This provides a standard interface for using all Aptos wallets, and allows new wallets to easily be supported just by updating your React Wallet Adapter dependency version.

1. Install `@aptos-labs/wallet-adapter-react@latest`.

```bash
npm install @aptos-labs/wallet-adapter-react@latest
```

2. Initialize the `AptosWalletAdapterProvider`.

```jsx
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { type PropsWithChildren } from "react";
import { Network } from "@aptos-labs/ts-sdk";

export const WalletProvider = ({ children }: PropsWithChildren) => {

  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{
      network: Network.MAINNET,  // The Aptos Network The Dapp Works With
      aptosApiKeys: {
          <dapp-network>: APTOS_API_KEY_TESNET,
        }
      }}
      onError={(error) => {
        console.log("error", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};
```

3. Import `useWallet` in files where you want to access data from the `Provider`

```jsx
import { useWallet } from "@aptos-labs/wallet-adapter-react";

// Access fields / functions from the adapter
const { account, connected, wallet, changeNetwork } = useWallet();
```

3. Integrate a Wallet Selector UI

See the [how_to_integrate_wallet_selector_ui.md file](./how_to_integrate_wallet_selector_ui.md)
