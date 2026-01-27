# Agent User Guide: Effective Vibe Coding

## Reality Check

- **Agents aren't magic** - They're sophisticated tools that need clear instructions
- **No mind reading** - You must be specific about what you want
- **Black box is OK** - You don't need to understand how it works, just how to use it effectively

## The Golden Rule: Be Specific

### ❌ Vague Requests = Poor Results

```
"Build me something cool with blockchain"
"Fix this error"
"Help me with Aptos"
```

### ✅ Specific Requests = Great Results

```
"Create a decentralized voting dApp on Aptos with Move smart contract and React frontend.
Users should create proposals, vote once per wallet, view real-time results.
Include a wallet integration for Aptos testnet."
```

## Geomi Queries - Be Precise

**Good Examples:**

- "Get me all of my applications on Geomi"
- "Create a new Full node API key resource named 'MyDApp-Production'"
- "List all active API keys for my Geomi account"

## Perfect Prompt Template

```
GOAL: [What you want to achieve]
CONTEXT: [Your experience, current setup, constraints]
DELIVERABLES: [Specific outputs you need]
ENVIRONMENT: [Network, tools, versions]
```

**Example:**

```
GOAL: Build a token staking contract on Aptos
CONTEXT: Intermediate Move knowledge, 2-week timeline, DeFi focus
DELIVERABLES: Complete Move module, unit tests, deployment script, React integration code
ENVIRONMENT: Aptos testnet, CLI v2.0, TypeScript SDK, Aptos compatible wallet
```

## Quick Wins

**Always Include:**

- Target network (mainnet/testnet/devnet)
- Full error messages when debugging
- Complete code context for fixes

**Request Explanations:**

- "Explain why you chose this approach"
- "Include security considerations"
- "Add inline comments explaining each function"

## Common Mistakes to Avoid

1. **Assuming context** - Start fresh each conversation
2. **Being too broad** - Break complex requests into smaller parts
3. **Incomplete error info** - Share full error messages and relevant code

## Power User Tips

- **Iterate and refine:** Start broad, then add specific requirements
- **Reference examples:** "Like [project] but with [modifications]"
- **Specify format:** "Provide as commented code", "Include step-by-step instructions"

**Remember:** The more specific and thoughtful your request, the more valuable the response!
