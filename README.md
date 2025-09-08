# Aptos NPM MCP

## What This MCP Server Can Do

The Aptos MCP Server provides **specialized tools** and **development guides** that automate Aptos infrastructure and ensure AI agents use current best practices.

### 🚀 **Infrastructure Automation**
- **Automate Aptos Geomi platform management** (skip manual setup steps and let the agent manage your projects)
- **Create gas stations for sponsored transactions** (give your users free transactions with web2 UX)
- **Handle API keys and rate limits** (automated setup for production apps)

### 🤖 **AI Agent Guidance**
- **Current Move smart contract patterns** (MCP-specialized up-to-date language vs outdated general models)
- **Modern Aptos features** (sponsored transactions, no-code indexer, wallet adapters for Google login)
- **Proper CLI usage and workflows** (current Aptos commands vs generic blockchain knowledge)

**Why This Exists:** Aptos moves so fast that generic AI models don't know about new features like Aptos Geomi gas stations, no-code indexers, or current Move patterns.

📋 **[View Complete Capabilities →](./capabilities.md)**

---

## Prerequisites

- [node and npm](https://nodejs.org/en) (npm ≥ 5.2.0)
- Build Bot Api Key

### Generate a `Build Bot Api Key`

To be able to make [Aptos Build](https://build.aptoslabs.com/) actions like managing api keys, etc. Follow those instruction to generate a new Bot Api Key to use with the MCP

1. Go to [https://build.aptoslabs.com/](https://build.aptoslabs.com/)
2. Click on your name in the bottom left corner
3. Click on "Bot Keys"
4. Click on the "Create Bot Key" button
5. Copy the Bot Key and paste it into the MCP configuration file as an env arg: `APTOS_BOT_KEY=<your-bot-key>`

## Production Usage

#### Follow these guides on how to integrate the Aptos MCP with your prefered interface

- [Cursor](./integration_guides/cursor.md)
- [Claude Code](./integration_guides/claude_code.md)

### Start vibe coding.

Make sure to read the [user guide](./integration_guides/user_guide.md) for best results.

## Development Usage

#### Follow this guide on how to develop locally the Aptos MCP

- [Local development with the Aptos MCP](./integration_guides/development_usage.md)
