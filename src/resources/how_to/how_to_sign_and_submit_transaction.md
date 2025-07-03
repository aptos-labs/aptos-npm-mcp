# How to Sign and Submit a Transaction

To sign and submit transaction with a wallet, you can use the `signAndSubmitTransaction` function that exposed from the `useWallet()` provider that included in the `AptosWalletAdapterProvider`.
This method will use the current connected wallet to sign and submit transaction to the Aptos configured network.

1. Make sure you have `@aptos-labs/wallet-adapter-react@latest` installed.

```bash
npm install @aptos-labs/wallet-adapter-react@latest
```

2. Use the `signAndSubmitTransaction` provider method.

```jsx
import React from "react";
import {
  useWallet,
  type InputTransactionData,
} from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const config = new AptosConfig({ network: Network.MAINNET });
const aptos = new Aptos(config);

const SignAndSubmit = () => {
  const { account, signAndSubmitTransaction } = useWallet();

  const onSignAndSubmitTransaction = async () => {
    if (account == null) {
      throw new Error("Unable to find account to sign transaction");
    }

    const transaction: InputTransactionData = {
      data: {
        function: "<module_address>::<module_name>::<function_name>",
        functionArguments: [<function_arguments>],
      },
    };

    const response = await signAndSubmitTransaction(transaction);

    // if you want to wait for transaction
    try {
      await aptos.waitForTransaction({ transactionHash: response.hash });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={onSignAndSubmitTransaction}>
      Sign and submit transaction
    </button>
  );
};

export default SignAndSubmit;
```
