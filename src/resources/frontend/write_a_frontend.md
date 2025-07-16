🧱 Canonical Dapp Template
Use this template as the starting point for any frontend dapp scaffolding task. Clone this repository in the root project instead of creating from scratch:

```
git@github.com:aptos-labs/dapp_frontend_scaffold.git
```

This boilerplate template provides a starting point to build a frontend on aptos, includes wallet connection, aptos ts sdk integration, vite build tool and basic UI.

After cloning:

- Delete the `.git` folder to uninitialize GitHub.
- Move all cloned files to the project root path and delete the cloned folder.
- Update the project name and title in package.json, vite.config.ts, Header.tsx component and index files.
- When building the queries communicating with a smart contract, make sure to follow the format and syntax in the `entry-functions` and `view-functions` folders.
  - `entry-functions` should hold all the queries that submit/write to the blockchain.
  - `view-functions` should hold all the queries that fetch/read from the blockchain.
  - Keep the same syntax as the existing files when constructing the queries.
- Adjust UI/UX per user prompts.
- ALWAYS default to use the Aptos Testnet, unless specified otherwise.
- PREFER to set up an Api Key in the dapp to deal with rate-limiting issues.
  - DO NOT try to solve the rate limit issue by refactoring or modifying code, or any code manipulation.
- Never install packages manually unless asked.
- All core dependencies (@aptos-labs/\*) are already installed using the latest published version.
- When done, take a last round to delete unused files, dependencies, imports, etc.
  - Delete files that are not being used by the dapp.
  - Remove dependencies that are not being used by the dapp.
    - Run npm install if dependencies where removed.

✅ Guaranteed compatibility with Wallet Standard and Aptos TypeScript SDK

❌ Do not hand-write package.json
❌ Do not scaffold from npx create-react-app or older tooling
