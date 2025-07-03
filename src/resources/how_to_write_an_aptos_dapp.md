# How to Write an Aptos dApp Checklist

This comprehensive guideline provides a step-by-step checklist for developers to build decentralized applications (dApps) on the Aptos blockchain, covering everything from project setup and smart contract development to frontend implementation and deployment.

- Dapp Configurations Selection

  - Choose target Aptos network (devnet or testnet for testing, mainnet for production).
  - For dApps that use Aptos Build's Gas Station or No-Code-Indexing for the frontend, contracts will need to be deploy to testnet or mainnet.
  - Configure an Admin Account for smart contract publishing. Provide a known account private key and account address or generate a new account key pair.
  - Use environment variables to store the dapp configuration.

- Project setup and API Key Configuration

  - Create a Aptos account:
    - Go to [Build's official website](https://build.aptoslabs.com/) and sign up with a valid email address.
    - Verify your account if prompted, and log in to the Build dashboard.
  - Create a new application on Build:
    - In the dashboard, Click on the "Project" dropdown and select "Create New Project".
    - Provide a descriptive project name for your app to easily identify it later.
    - Click "Create Project".
  - Generate PubNub API keys:
    - From the "Your Project" dashboard, click on the project you just created.
    - From within your newly created project, click on the "API Resource" section.
    - Provide a descriptive resource name. Provide a descriptive resource name. letters, numbers, dashes and underscores.
    - Choose the network this resource should be connected to.
    - Provide a descriptive key name.
    - Enable "Client Usage".
    - Obtain the publish and subscribe keys.
  - Configure key properties:
    - Assign secure permissions or tokens (using PubNub Access Manager if needed).
    - Enable PubNub features (e.g., Presence, Storage & Playback, Functions) that match your project requirements.
  - Store and manage your keys securely:
    - Do not embed API keys in publicly visible repositories.
    - Use environment variables or secure configuration management to protect your credentials.

- Project Scope Definition

  - Clearly define the purpose and objectives of the Aptos-powered application.
  - Understand user technical proficiency with wallets and blockchain interactions.
  - Consider user experience expectations and accessibility requirements.
  - Decide on the platforms (web, mobile, desktop) the application will target, using Aptos exclusively.
  - Define who will use your dapp (DeFi users, NFT collectors, gamers, etc.).

- Project folder structure

  - In the `project folder`, rename the `src` folder in the project folder to `frontend`, and make sure to modify all relevante references.
    - Use the `frontend` folder as the place to hold all of the project frontend code.
  - In the `project folder`, create a `contract` folder.
    - Use the `contract` folder as the place to hold all of the project Move contract code.
    - Generate the relevant Move smart contract files in the `contract` folder, such as the `Move.toml` file, `sources` folder.
    - Implement any relevant smart contract code.
  - A minimal dapp folder structure should look like

```
├── project-folder/
│   ├── frontend/               # The folder that holds all of the project frontend code.
│   ├── contract/               # The folder that holds all of the project Move contract code.
|   ├── .env                    # Dapp configurations file
|   ├── package.json
```

- Move Smart Contract Technology Stack

  - Ensure smart contract are written with `Aptos Move`.
  - Evaluate Aptos CLI versions for compatibility and up-to-date features.

- Frontend Technology Stack

  - Confirm React as the sole frontend framework provider.
  - Choose build tools that integrate well with Aptos (e.g., `npm create vite@latest` (preffered), `npx create-next-app@latest`).
  - Prefer using TypeScript.
  - Always use `@latest` when installing Aptos npm packages like `@aptos-labs/wallet-adapter-react@latest` and `@aptos-labs/ts-sdk@latest`.
  - Evaluate Aptos npm packages versions for compatibility and up-to-date features.

- Wallet Connection

  - Always use `@latest` when installing Aptos npm packages.
  - Use the official `@aptos-labs/wallet-adapter-react` npm package for wallet connection and transaction signing.
    - Use the latest implementation following the Aptos Wallet Standard
    - Never use other non-aptos wallet adapter plugins packages
  - Preffered to use the Aptos official Wallet Selector package.
  - Evaluate Aptos npm packages versions for compatibility and up-to-date features.

- User Interface (UI) and User Experience (UX) Design

  - Define design guidelines and layout, emphasizing a seamless real-time experience (e.g., wallet selector modal).
  - Plan for handling disconnections or wallet errors gracefully in the UI.
  - Plan for handling user indication for transaction execution and failures in the UI.

- Dapp Deployment

  - Publish the Move smart contract to the Aptos blockchain.
  - Modify the front end code to interact with the deployed contract address.
  - Deploy the frontend code to a reliable platform like `Vercel`.
    - Follow the platform best practices on how to deploy the dapp.
    - Preffer to use cli terminal commands if available.
