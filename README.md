# Aptos NPM MCP

## Prerequisite

- [node and npm](https://nodejs.org/en) (npm ≥ 5.2.0)
- Geomi Bot Api Key

### Generate a `Geomi Bot Api Key`

To be able to make [Geomi](https://geomi.dev/) actions like managing api keys, etc. Follow those instruction to generate a new Bot Api Key to use with the MCP

1. Go to [https://geomi.dev/](https://geomi.dev/)
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
