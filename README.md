# Aptos NPM MCP

## Usage

### Clone this MCP repo

```bash
git clone git@github.com:aptos-labs/aptos-npm-mcp.git
```

### Generate a `Build Bot Api Key`

To be able to make [Aptos Build] actions like generate api keys, etc. Follow those instructions to generate a new Bot Api Key to use with the MCP

1. Go to [https://build.aptoslabs.com/](https://build.aptoslabs.com/)
2. Click on your name in the bottom left corner
3. Click on "Bot Keys"
4. Click on the "Create Bot Key" button
5. Copy the Bot Key and paste it into the MCP configuration file as an env arg: `APTOS_BOT_KEY=<your-bot-key>`

### Link the MCP to your project

1.  Open the Cursor IDE
2.  On the project root folder, create a `.cursor` folder
3.  In the `.cursor` folder, create a `mcp.json` file
4.  paste this content

    ```json
    {
      "mcpServers": {
        "aptos-build-mcp": {
          "command": "npx",
          "args": ["tsx", "<path-to-mcp-server>/src/server.ts"],
          "type": "stdio",
          "env": {
            "APTOS_BOT_KEY": "<bot_api_key>"
          }
        }
      }
    }
    ```

5.  Make sure to update the `args` to point to the cloned MCP folder from the previous step.
6.  Make sure to update the `APTOS_BOT_KEY` with the key you generated in the previous step.

### Verify Cursor runs your MCP

1.  Open Cursor Setting: `cursor -> setting -> cursor setting`
2.  Head to the `MCP` or `Tools & Integrations` section
3.  Make sure it is enabled and showing a green color indicator
    <img width="939" alt="image" src="https://github.com/user-attachments/assets/568600be-2a00-4381-876d-619e5771f602" />

4.  Click the “refresh” icon to update the MCP

### Start vibe coding.

1.  Make sure the Cursor AI window dropdown is set to `Agent` and `claude-4-sonnet`
    <br/>
    <img width="270" alt="image (1)" src="https://github.com/user-attachments/assets/957ab3eb-72ef-46ee-b129-f43ecb327158" />
2.  Prompt the agent with `are you using mcp?` to verify the connection. The agent should replay with something like:
    ![Screenshot 2025-06-26 at 3 54 44 PM](https://github.com/user-attachments/assets/4ead13c6-1697-40e1-b4e7-0fbf7dd5f281)

3.  Prompt the agent with the action you want it to do. For best results, try be as much as specific as you can.
    1. build a full end-to-end dapp on Aptos
       ```text
       Help me build a todo list dapp on Aptos. Build the smart contract to handle the dapp logic and help me with deplyoing the contract, the frontend for the UI and wallet connection for users to be able to connect with their wallet.
       ```
    2. Build a frontend of a < whatever > dapp on Aptos
       ```text
       Help me build a frontend for a todo list dapp on Aptos. Build the UI and wallet connection for users to be able to connect with their wallet.
       ```
    3. Write a smart contract for < whatever > on Aptos
       ```text
       Help me build a smart contract for a todo list dapp on Aptos. Build the smart contract to handle the dapp logic. Also, help with with deploying the contract.
       ```

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

### Debugging

You can test and debug the MCP using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) tool.

Run the following command from the root path of this Repo

```bash
npx @modelcontextprotocol/inspector
```

That would open up a UI where you can run and test the MCP tools/prompts/resources

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
