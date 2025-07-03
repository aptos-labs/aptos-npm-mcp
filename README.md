# Aptos NPM MCP

## Usage

1. Clone this MCP repo

```bash
git clone git@github.com:aptos-labs/aptos-npm-mcp.git
```

2. Link the MCP to your project

   1. Open the Cursor IDE
   2. On the project root folder, create a `.cursor` folder
   3. In the `.cursor` folder, create a `mcp.json` file
   4. paste this content

      ```json
      {
        "mcpServers": {
          "aptos-build-mcp": {
            "command": "npx",
            "args": ["tsx", "<path-to-mcp-server>/src/server.ts"],
            "type": "stdio"
          }
        }
      }
      ```

   5. Make sure to update the `args` to point to the cloned MCP folder from the previous step

3. Verify Cursor runs your MCP
   1. Open Cursor Setting: `cursor -> setting -> cursor setting`
   2. Head to the `MCP` or `Tools & Integrations` section
   3. Make sure it is enabled and showing a green color indicator
      <img width="939" alt="image" src="https://github.com/user-attachments/assets/568600be-2a00-4381-876d-619e5771f602" />

   5. Click the “refresh” icon to update the MCP
4. Start vibe coding.

   1. Make sure the Cursor AI window dropdown is set to `Agent` and `claude-4-sonnet`
      <br/>
      <img width="270" alt="image (1)" src="https://github.com/user-attachments/assets/957ab3eb-72ef-46ee-b129-f43ecb327158" />
      
   3. Prompt the agent with `are you using mcp?` to verify the connection. The agent should replay with something like:
      ![Screenshot 2025-06-26 at 3 54 44 PM](https://github.com/user-attachments/assets/4ead13c6-1697-40e1-b4e7-0fbf7dd5f281)


   5. Prompt the agent with the action you want it to do. For best results, try be as much as specific as you can.
      1. build a full end-to-end dapp on Aptos
         ```text
         Help me build a todo list dapp on Aptos. Build the smart contract to handle the dapp logic and help me with deplyoing the contract, the frontend for the UI and wallet connection for users to be able to connect with their wallet.
         ```
      3. Build a frontend of a < whatever > dapp on Aptos
         ```text
         Help me build a frontend for a todo list dapp on Aptos. Build the UI and wallet connection for users to be able to connect with their wallet.
         ```
      5. Write a smart contract for < whatever > on Aptos
         ```text
         Help me build a smart contract for a todo list dapp on Aptos. Build the smart contract to handle the dapp logic. Also, help with with deploying the contract.
         ```

## Contributing Resources

Want to add new development resources to the MCP server? Follow these steps using the Gas Station integration as an example:

### 1. Add Your Resource File

Place your markdown guide in `src/resources/` following the "How to..." naming pattern:

```
src/resources/how_to_integrate_gas_station.md
```

The MCP server automatically discovers all `.md` files in this directory.

### 2. Update Context Mappings

To make your resource discoverable through intelligent queries, add relevant keywords to `src/server.ts`.

Find the `contextMappings` object (around line 110) and add your mappings:

```typescript
const contextMappings = {
  // ... existing mappings ...
  
  // Gas Station example - add keywords users might search for
  "gas": ["how_to_integrate_gas_station"],
  "sponsor": ["how_to_integrate_gas_station"],
  "sponsored": ["how_to_integrate_gas_station"],
  "station": ["how_to_integrate_gas_station"],
  "gasless": ["how_to_integrate_gas_station"],
  
  // Also add to existing categories where relevant
  dapp: [
    // ... existing resources ...
    "how_to_integrate_gas_station", // Add here
  ],
  frontend: [
    // ... existing resources ...
    "how_to_integrate_gas_station", // And here too
  ],
};
```

### 3. Restart the MCP Server

After updating the code, restart the MCP server in Cursor:

1. Open Cursor Settings: `Cursor → Settings → Cursor Settings`
2. Navigate to Tools and Integrations (MCP section)
3. Toggle the on/off switch to reload the MCP server
4. Verify green status indicator shows the server is running

### 4. Test Your Integration

Test with queries like:
- "I need help with gas station"
- "How to implement sponsored transactions"
- "Show me gasless transaction setup"

Your resource should now be discoverable by AI agents through both direct queries and intelligent context matching.

## Development

To get started, clone the repository and install the dependencies.

```bash
npm install
```

### Add the MCP to Cursor

```json
{
  "mcpServers": {
    "aptos-build-mcp": {
      "command": "npx",
      "args": ["tsx", "<path-to-mcp-server>/src/server.ts"],
      "type": "stdio"
    }
  }
}
```

### Start the server

If you simply want to start the server, you can use the `start` script.

```bash
npm run start
```

However, you can also interact with the server using the `dev` script.

```bash
npm run dev
```

This will start the server and allow you to interact with it using CLI.

### Linting

Having a good linting setup reduces the friction for other developers to contribute to your project.

```bash
npm run lint
```

This boilerplate uses [Prettier](https://prettier.io/), [ESLint](https://eslint.org/) and [TypeScript ESLint](https://typescript-eslint.io/) to lint the code.

### Formatting

Use `npm run format` to format the code.

```bash
npm run format
```
