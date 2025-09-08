# Aptos MCP Server Capabilities Audit

**Last Updated:** September 5, 2025  
**Audit Date:** September 5, 2025  
**MCP Server Version:** 0.0.16

## Executive Summary

The Aptos MCP Server provides **22 specialized tools** and **15 comprehensive development guides** that serve as an intelligent bridge between AI agents and the Aptos ecosystem. It automates interactions with the **Aptos Geomi platform** while providing AI agents with current best practices for Aptos development.

## Platform Relationships & Clarifications

### Aptos Geomi Platform (External Service)
- **What it is:** Aptos' official infrastructure management platform at https://geomi.dev/ (formerly build.aptoslabs.com)
- **What it provides:** Organizations, projects, applications, API keys, gas stations
- **Authentication:** Requires Google login and Bot API keys
- **Manual process:** 5-15 minutes per capability setup through web interface

### What the MCP Does (Direct Automation)
- **Automates Aptos Geomi interactions** through Bot API keys
- **Eliminates manual platform navigation** with programmatic API calls
- **Provides infrastructure-as-code** for Aptos Geomi resources
- **Enables instant setup** by AI agents vs. manual web interface navigation

### What the MCP Empowers AI Agents To Do (Guidance & Patterns)
- **Use current Aptos development patterns** instead of outdated generic blockchain knowledge
- **Write proper Move code** that compiles on first try
- **Implement cutting-edge features** like sponsored transactions and no-code indexers
- **Follow MCP-first workflows** that ensure best practices

## Why This MCP Exists

Aptos is such a cutting-edge blockchain with an incredibly fast-moving team that generic AI models struggle with current development practices. They don't know about:
- Brand new **Aptos Geomi gas station** for sponsored transactions
- **No-code indexer** capabilities  
- **API keys for improved rate limits**
- Current **Move development patterns**
- Proper **Aptos CLI commands and capabilities**

Most AI agents won't write good Move code on the first or second try, even with powerful prompts. More critically, users don't know what's possible with modern Aptos development - they don't realize they can provide users with **Google login experiences** and **totally sponsored transactions** (no native gas needed for initial user experiences).

## Core Value Propositions

### 1. Aptos Geomi Platform Automation
- **Eliminates manual web interface navigation** by automating Aptos Geomi platform interactions
- **Enables instant setup by AI agents** vs. 5-15 minutes of manual configuration per capability
- **Automates complex gas station configuration** with sponsorship rules (vs. weeks of custom infrastructure development)
- **Manages enterprise-level project organization** through programmatic API calls
- **Provides improved rate limits** through automated API key configuration

### 2. Current Best Practices Enforcement for AI Agents
- **Prevents outdated pattern usage** by redirecting agents to current Aptos-specific guidance
- **Ensures Move code quality** with current compilation and testing patterns
- **Provides cutting-edge feature support** for sponsored transactions, no-code indexer, and wallet adapters
- **Guides proper CLI usage** and wallet creation workflows

### 3. Agent-Assisted Development Workflow
- **Designed specifically for AI agents** like Cursor and Claude Code
- **MCP-first workflow enforcement** with built-in prompts and debugging helpers
- **Systematic error recovery** with Aptos-specific debugging workflows
- **Template and guidance provision** (not automatic code generation)

## Complete Tool Inventory (22 Tools)

### Aptos Geomi Platform Automation Tools (13 Tools)
*These tools directly interact with the Aptos Geomi platform via Bot API keys*

#### Organization Management (3 tools)
1. **`get_aptos_build_applications`**
   - **MCP Action:** Queries Aptos Geomi API for all user resources
   - **Manual Alternative:** Navigate through Geomi dashboard pages
   - **Time Savings:** Instant vs. 2-3 minutes of navigation

2. **`create_aptos_build_organization`**
   - **MCP Action:** Programmatically creates organization via Geomi API
   - **Manual Alternative:** Fill out organization creation form in web interface
   - **Time Savings:** Instant vs. 5-10 minutes of form completion

3. **`update_aptos_build_organization`**
   - **MCP Action:** Updates organization details via API
   - **Manual Alternative:** Navigate to settings and edit through web interface
   - **Time Savings:** Instant vs. 3-5 minutes of manual editing

#### Project Management (3 tools)
4. **`create_aptos_build_project`**
   - **MCP Action:** Creates project within organization via Geomi API
   - **Manual Alternative:** Navigate to projects section and create through web form
   - **Time Savings:** Instant vs. 5-10 minutes of manual setup

5. **`update_aptos_build_project`**
   - **MCP Action:** Updates project configuration via API
   - **Manual Alternative:** Navigate to project settings and edit manually
   - **Time Savings:** Instant vs. 3-5 minutes of manual changes

6. **`delete_aptos_build_project`**
   - **MCP Action:** Removes project and resources via API
   - **Manual Alternative:** Navigate through deletion confirmations in web interface
   - **Time Savings:** Instant vs. 2-3 minutes of manual deletion

#### Application Management (4 tools)
7. **`create_aptos_build_api_resource_application`**
   - **MCP Action:** Creates API application via Geomi API
   - **Manual Alternative:** Navigate to applications section and create through web form
   - **Time Savings:** Instant vs. 5-10 minutes of manual configuration

8. **`create_gas_station_application`** ⭐ **FLAGSHIP AUTOMATION**
   - **MCP Action:** Creates complete gas station setup via multiple Geomi API calls
   - **Manual Alternative:** Multi-step process through web interface (create application → create API key → configure gas station → set up rules)
   - **Time Savings:** Instant vs. 15-20 minutes of manual multi-step setup
   - **Alternative to Building From Scratch:** Weeks of custom gas station infrastructure development with captcha, security, etc.

9. **`delete_aptos_application`**
   - **MCP Action:** Removes application via Geomi API
   - **Manual Alternative:** Navigate through application deletion in web interface
   - **Time Savings:** Instant vs. 2-3 minutes of manual deletion

10. **`update_aptos_build_application_name`**
    - **MCP Action:** Updates application metadata via API
    - **Manual Alternative:** Navigate to application settings and edit manually
    - **Time Savings:** Instant vs. 3-5 minutes of manual editing

#### API Key Management (3 tools)
11. **`create_aptos_build_api_key`**
    - **MCP Action:** Generates API keys via Geomi API with proper configuration
    - **Manual Alternative:** Navigate to API keys section and create through web form
    - **Time Savings:** Instant vs. 5-10 minutes of manual key creation

12. **`update_aptos_build_api_key`**
    - **MCP Action:** Updates API key configuration via API
    - **Manual Alternative:** Navigate to key settings and edit manually
    - **Time Savings:** Instant vs. 3-5 minutes of manual updates

13. **`delete_aptos_build_api_key`**
    - **MCP Action:** Revokes API keys via Geomi API
    - **Manual Alternative:** Navigate to key management and delete manually
    - **Time Savings:** Instant vs. 2-3 minutes of manual deletion

### AI Agent Guidance Tools (9 Tools)
*These tools provide current Aptos development guidance to AI agents*

#### Core Development Guidance (4 tools)
14. **`get_mcp_version`**
    - **Agent Benefit:** Version verification for compatibility
    - **Value:** Ensures agent knows current MCP capabilities

15. **`build_smart_contract_on_aptos`**
    - **Agent Benefit:** Current Move smart contract development patterns
    - **Resources:** Management and Move directory guidance
    - **Value:** Agents write Move code that compiles on first try

16. **`build_ui_frontend_on_aptos`**
    - **Agent Benefit:** Current frontend integration patterns
    - **Focus:** Wallet connections, transaction handling, UI integration
    - **Value:** Agents implement current wallet adapter patterns

17. **`build_dapp_on_aptos`**
    - **Agent Benefit:** Full-stack development guidance
    - **Resources:** Combined frontend, Move, and management guidance
    - **Value:** End-to-end current development patterns

#### Resource Discovery and Access (2 tools)
18. **`list_aptos_resources`**
    - **Agent Benefit:** Discover all available development resources
    - **Value:** Helps agents find relevant current guidance

19. **`get_specific_aptos_resource`**
    - **Agent Benefit:** Access specific how-to guides
    - **Value:** Targeted guidance for specific development tasks

#### MCP-First Workflow Enforcement (3 tools)
20. **`build_dapp_on_aptos_guidance_prompt`** ⭐ **WORKFLOW ENFORCER**
    - **Agent Benefit:** Primary system prompt ensuring MCP-first development
    - **Workflow:** Mandatory MCP consultation before using outdated knowledge
    - **Value:** Prevents agents from using generic blockchain patterns

21. **`aptos_development_reminder_prompt`**
    - **Agent Benefit:** Mid-development reminder to use MCP tools
    - **Timing:** When conversation goes several exchanges without MCP usage
    - **Value:** Maintains current best practices throughout development

22. **`aptos_debugging_helper_prompt`**
    - **Agent Benefit:** Error recovery with Aptos-specific debugging
    - **Recovery:** Redirects from generic solutions to MCP resources
    - **Value:** Ensures Aptos-specific error resolution

## Development Guides Inventory (15 Guides)
*These guides provide AI agents with current Aptos development patterns*

### How-To Guides (8 guides)
1. **`how_to_add_wallet_connection`** - Current wallet integration patterns
2. **`how_to_config_a_full_node_api_key_in_a_dapp`** - API key integration for improved rate limits
3. **`how_to_config_a_gas_station_in_a_dapp`** - Gas station integration for sponsored transactions
4. **`how_to_handle_rate_limit_in_a_dapp`** - Production-ready rate limiting strategies
5. **`how_to_integrate_fungible_asset`** - Current fungible asset patterns
6. **`how_to_integrate_no_code_indexer_build`** - No-code indexer integration
7. **`how_to_integrate_wallet_selector_ui`** - Multi-wallet support patterns
8. **`how_to_sign_and_submit_transaction`** - Current transaction handling patterns

### Move Smart Contract Guides (3 guides)
9. **`deploy_smart_contract`** - Current deployment procedures
10. **`develop_smart_contract`** - Move development workflow and testing
11. **`write_a_move_smart_contract`** - Current Move language patterns

### Management Guides (3 guides)
12. **`how_to_configure_admin_account`** - Account setup and management
13. **`how_to_create_and_manage_keys`** - Key creation and security best practices
14. **`how_to_fund_an_account_on_aptos`** - Testnet and mainnet funding strategies

### Frontend Guide (1 guide)
15. **`write_a_frontend`** - Complete frontend integration guidance

## Cutting-Edge Aptos Features Supported

### 1. Aptos Geomi Gas Station (Sponsored Transactions)
- **What Geomi Provides:** Managed gas station infrastructure for sponsored transactions
- **What MCP Automates:** Complete gas station setup and rule configuration (instant vs. 15-20 minutes manual)
- **What Agents Learn:** How to integrate sponsored transactions in applications
- **Alternative:** Building custom gas station infrastructure (weeks of development with captcha, security, etc.)
- **User Benefit:** Web2-like experience with no native gas requirements

### 2. No-Code Indexer
- **What Geomi Provides:** No-code blockchain data indexing service
- **What MCP Automates:** N/A (guidance-only feature)
- **What Agents Learn:** How to integrate and use the no-code indexer
- **User Benefit:** Rapid data access without custom indexing code

### 3. Improved Rate Limits via API Keys
- **What Geomi Provides:** Higher rate limits for applications with API keys
- **What MCP Automates:** API key creation and configuration (instant vs. 5-10 minutes manual)
- **What Agents Learn:** How to properly integrate API keys in applications
- **User Benefit:** Production-ready performance and reliability

### 4. Google Login Integration
- **What Geomi Provides:** N/A (this is wallet adapter functionality)
- **What MCP Automates:** N/A (guidance-only feature)
- **What Agents Learn:** How to implement Google login with Aptos wallet adapters
- **User Benefit:** Familiar authentication experience

### 5. Current Move Development Patterns
- **What Geomi Provides:** N/A (this is development guidance)
- **What MCP Automates:** N/A (guidance-only feature)
- **What Agents Learn:** Up-to-date Move language best practices and patterns
- **User Benefit:** Code that compiles and works on first try

## Clear Capability Boundaries

### What the MCP Does Directly
✅ **Automates Aptos Geomi platform interactions** (instant vs. 5-15 minutes manual per capability)  
✅ **Eliminates manual web interface navigation** through programmatic API calls  
✅ **Handles complex multi-step configurations** in single commands  
✅ **Manages infrastructure as code** for Aptos Geomi resources  

### What the MCP Empowers AI Agents To Do
✅ **Use current Aptos development patterns** instead of outdated knowledge  
✅ **Write Move code that compiles on first try** with current best practices  
✅ **Implement cutting-edge features** like sponsored transactions and no-code indexers  
✅ **Follow proper Aptos CLI usage** and wallet creation workflows  
✅ **Integrate modern wallet adapters** and authentication patterns  

### What the MCP Cannot Do
❌ **Replace the Aptos Geomi platform** (it automates interactions with it)  
❌ **Create wallets directly** (guides agents through correct CLI steps)  
❌ **Compile or deploy contracts directly** (provides guidance for proper procedures)  
❌ **Replace developer knowledge** (enhances and guides the development process)  
❌ **Work without Aptos Geomi Bot API keys** (requires proper authentication)  

### What Aptos Geomi Platform Provides (External to MCP)
- **Managed infrastructure** for organizations, projects, and applications
- **Gas station infrastructure** for sponsored transactions (vs. weeks of custom development)
- **API key management** and rate limiting
- **No-code indexer service** for blockchain data
- **Web dashboard** for manual management (5-15 minutes per capability vs. instant MCP automation)

## Integration Requirements

- **Node.js and npm** (node ≥ 20, npm ≥ 5.2.0)
- **Aptos Geomi Bot API Key** (for platform automation)
- **Aptos Geomi account** (Google login required at https://geomi.dev/)
- **Compatible AI agent** (Cursor, Claude Code, or MCP-compatible interface)
- **Aptos CLI** (for local development and deployment - agents guided through installation)

## Success Metrics

- **Time savings:** 5-15 minutes manual Geomi setup per capability → Instant automation by AI agents
- **Code quality:** First-try compilation success with current Move patterns
- **Feature adoption:** Users discover and implement sponsored transactions
- **Development speed:** Faster progression from concept to production
- **Best practices compliance:** Consistent use of current Aptos patterns instead of outdated generic blockchain knowledge
- **Infrastructure alternative:** Instant gas station setup vs. weeks of custom infrastructure development

---

*This audit represents a comprehensive analysis of the Aptos MCP Server capabilities as of September 5, 2025. The server continues to evolve with Aptos platform updates and Geomi platform changes.*