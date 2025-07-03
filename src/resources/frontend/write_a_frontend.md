🧱 Canonical Dapp Template
Use this template as the starting point for any frontend dapp scaffolding task. Clone this repository in the root project instead of creating from scratch:

```
git@github.com:aptos-labs/dapp_frontend_scaffold.git
```

This boilerplate template provides a starting point to build a frontend on aptos, includes wallet connection, aptos ts sdk integration, vite build tool and basic UI.

After cloning:

- Delete the `.git` folder to uninitizlie github
- Move all cloned files to the project root path, and delete the cloned folder
- Update project name and title in package.json, vite.config.ts, and index files
- Adjust UI/UX per user prompts
- Never install packages manually unless asked
- All core dependencies (@aptos-labs/\*) are already installed using the latest published version
- When done, take a last round to delete unused files, dependencies, imports, etc
  - Delete files if needed
  - Remove dependencies if needed
    - Run npm install if dependencies where removed

✅ Guaranteed compatibility with Wallet Standard and Aptos TypeScript SDK

❌ Do not hand-write package.json
❌ Do not scaffold from npx create-react-app or older tooling
