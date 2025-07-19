# How to Create and Manage Keys

This guide provides an overview of the different types of API keys available in Aptos Build and where to create each type. Use this as a central reference point for understanding key management across your Aptos projects.

## Overview of Key Types

Aptos Build supports three main types of API keys, each serving different purposes:

### Full Node API Keys
Used for direct interaction with Aptos blockchain nodes. These keys provide access to read blockchain data, submit transactions, and interact with smart contracts through the Aptos API.

**When to use**: For frontend applications, backend services, or any application that needs to interact directly with the Aptos blockchain.

### Gas Station Keys
Auto-generated keys that enable gasless transactions for your users. These keys are tied to specific Gas Station projects and handle transaction fee sponsorship.

**When to use**: When you want to sponsor transaction fees for your users, providing a seamless Web2-like experience.

### No-Code Indexer Keys
Auto-generated keys for accessing indexed blockchain data through the No-Code Indexer service. These keys provide structured access to processed blockchain events and data.

**When to use**: When you need to query historical blockchain data, track events, or build analytics dashboards.

## Where to Create Each Type

### Full Node API Keys
1. Navigate to the [Aptos Build dashboard](https://build.aptos.dev)
2. Go to **API Keys** section
3. Click **Create New API Key**
4. Configure your key settings and network preferences
5. Copy and securely store your API key

### Gas Station Keys
Gas Station keys are automatically generated when you create a Gas Station project:

1. Navigate to **Gas Station** in the Aptos Build dashboard
2. Create a new Gas Station project
3. Your API key will be automatically generated and displayed
4. Copy the key for use in your application

### No-Code Indexer Keys
Indexer keys are automatically generated when you create a Processor project:

1. Navigate to **No-Code Indexer** in the Aptos Build dashboard
2. Create a new Processor project
3. Your indexer API key will be automatically generated
4. Use this key to access your indexed data

## References to Detailed Guides

For detailed implementation instructions, see these specific guides:

- **[API Keys Management](../how_to/how_to_manage_api_keys_as_project_resources.md)**: Detailed guide on creating and managing Full Node API keys
- **[Gas Station Integration](../how_to/how_to_integrate_gas_station.md)**: Complete guide on integrating Gas Station for gasless transactions
- **[No-Code Indexer Integration](../how_to/how_to_integrate_no_code_indexer_build.md)**: Step-by-step guide for setting up and using the No-Code Indexer

## Security Best Practices

- Store all API keys in environment variables, never in source code
- Use different keys for development, staging, and production environments
- Regularly rotate your API keys for enhanced security
- Monitor key usage through the Aptos Build dashboard