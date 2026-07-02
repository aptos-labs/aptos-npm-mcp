# Integrate Aptos MCP with Claude Code

1. Install the `claude-code` package

```bash
npm install -g @anthropic-ai/claude-code
```

2. Obtain your `APTOS_BOT_KEY` by following the instructions [here](https://github.com/aptos-labs/aptos-npm-mcp?tab=readme-ov-file#generate-a-geomi-bot-api-key).

3. Navigate to your project

```bash
cd your-awesome-project
```

4. Add the Aptos MCP server to your project using the Claude CLI:

```bash
claude mcp add -s local aptos-mcp npx -e APTOS_BOT_KEY=<your_bot_api_key> -- -y @aptos-labs/aptos-mcp
```

Replace `<your_bot_api_key>` with the key you generated in step 2.

**Note:** The `-s local` flag adds the MCP server to your project's local configuration. You can also use:
- `-s user` to add it globally for all projects
- `-s project` to add it to the project's shared configuration (if you want to commit it to version control)

5. Verify the MCP server was added successfully:

```bash
claude mcp list
```

You should see `aptos-mcp` in the list of configured servers.

6. Start Claude Code:

```bash
claude
```

7. Verify the connection by prompting: `what aptos mcp version are you using?`

The agent should reply with something like:

```text
I'm using Aptos MCP version 0.0.2.
```

## Alternative: Using JSON configuration

If you encounter issues with the CLI approach, you can use the JSON method to install it to the folder you are in:

```bash
claude mcp add-json aptos-mcp '{"command": "npx", "args": ["-y", "@aptos-labs/aptos-mcp"], "type": "stdio", "env": {"APTOS_BOT_KEY": "<your_bot_api_key>"}}'
```

## Troubleshooting

- If Claude doesn't recognize the Aptos MCP tools, ensure you've completely quit and restarted Claude Code after adding the configuration
- Run `claude mcp list` to verify the server is properly configured
- Check that your `APTOS_BOT_KEY` is valid and has the necessary permissions
