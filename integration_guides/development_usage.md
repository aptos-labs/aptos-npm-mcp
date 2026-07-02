# Local development with the Aptos MCP

To get started, clone the repository and then navigate into the folder `aptos-npm-mcp`

```bash
git clone git@github.com:aptos-labs/aptos-npm-mcp.git
```

Install the dependencies.

```bash
npm install
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

### Link local MCP server to your project

#### Cursor

```json
{
  "mcpServers": {
    "aptos-mcp": {
      "command": "npx",
      "args": ["tsx", "<path-to-mcp-server>/src/server.ts"],
      "env": {
        "APTOS_BOT_KEY": "<bot_api_key>"
      }
    }
  }
}
```

#### Claude Code

```json
{
  "mcpServers": {
    "aptos-mcp": {
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

This boilerplate uses [Biome](https://biomejs.dev/) for formatting and linting, and TypeScript for type checking.

### Formatting

Use `npm run format` to format the code.

```bash
npm run format
```
