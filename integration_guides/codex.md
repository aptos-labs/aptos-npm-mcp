# Install Aptos MCP with Codex

1. Install the `codex` package

Install with npm
```bash
npm install -g @openai/codex
```

Install with Homebrew
```bash
brew install codex
```

2. Obtain your `APTOS_BOT_KEY` by following the instructions [here](https://github.com/aptos-labs/aptos-npm-mcp?tab=readme-ov-file#generate-a-build-bot-api-key).

3. Navigate to your project

```bash
cd your-awesome-project
```

4. Add the Aptos MCP server to Codex:

```bash
codex mcp add aptos-mcp --env APTOS_BOT_KEY=<your_bot_api_key> -- npx -y @aptos-labs/aptos-mcp
```

Replace `<your_bot_api_key>` with the key you generated in step 2.

**Note:** You can add more `--env NAME=VALUE` pairs as needed.

5. Verify the MCP server was added successfully:

```bash
codex mcp list
```

You should see `aptos-mcp` in the list of configured MCP tools.

6. Start Codex:

```bash
codex
```

7. Verify the connection inside codex:
```bash
/mcp
```

You should see `aptos-mcp` in the list of configured MCP tools.

8. Verify the connection by prompting: `what aptos mcp version are you using?`

The agent should reply with something like:

```text
Running Aptos MCP server version 0.0.16.
```


## Alternative: Using TOML configuration

If you encounter issues with the CLI approach, you can use the TOML method:

1. Open `~/.codex/config.toml` in your editor. (In the IDE, click the gear icon → **MCP settings → Open config.toml**.)
2. Add an MCP server table like the following:

```toml
# ~/.codex/config.toml

[mcp_servers.aptos-mcp]
command = "npx"
args = ["-y", "@aptos-labs/aptos-mcp"]

[mcp_servers.aptos-mcp.env]
APTOS_BOT_KEY = "<your_bot_api_key>"
```

3. Save the file and restart Codex (or reload the IDE).