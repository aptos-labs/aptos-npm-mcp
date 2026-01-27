# How to Set Up No-Code Indexing with Geomi

No-Code Indexing allows you to create real-time blockchain data indexers without writing custom indexing logic or managing/building infrastructure. Use it to query smart contract events in real-time for your dApp frontend. Geomi is the essential toolkit for Aptos developers.

## Prerequisites

- Deployed Move smart contract with events on Testnet or Mainnet
- Contract address and event structures
- Geomi account

## Project Setup in Geomi

1. **Create processor in Geomi**:
   - Go to [Geomi](https://geomi.dev/) and sign in
   - Click "Create New Project" → "Processor"
   - Name your project (3-32 characters, lowercase, numbers, `_` or `-`)

2. **Configure the processor**:
   - Name: `your-events-processor`
   - Network: Match your contract deployment (Testnet/Mainnet)
   - Starting version: Use "Current Version" for new contracts
   - Use a specific transaction version if you want to index from contract deployment
   - Find the deployment transaction in [Aptos Explorer](https://explorer.aptoslabs.com/) if needed
   - Add contract address as Event Data Source
   - Select the event you want to index
   - Create new table as Data Destination
   - Map event fields to table columns
      - Set appropriate data types (text, integer, timestamp, etc.)

Click "Create Processor" and wait for deployment (may show errors initially while starting up).

3. **Set up Hasura permissions**:
   - Once processor shows "Running", click Console URL
   - Enter Hasura admin secret
   - Track your table if needed (expand `processordb` → `public`)
   - If your table appears in "Untracked tables", click "Track"
   - If already visible in the sidebar, it's already tracked
   - Go to table → "Permissions" tab
   - Click "anonymous" role → ✓ under "select"
   - Choose "Without any checks"
   - Enable all columns you want to query
   - Click "Save Permissions"

- Go to the "GraphiQL" tab
- Test with a basic query:

```graphql
query {
  your_table_name {
    column1
    column2
    created_at
  }
}
```

4. **Get API credentials**:
   - Return to Geomi → your project → API Keys
   - Copy API key (starts with `aptoslabs_...`)
   - Note processor ID from API URL

**Note**: For enhanced rate limits when making additional SDK calls alongside your indexer queries, consider also setting up Full Node API keys. See [Full Node API Key Configuration](./how_to_config_a_full_node_api_key_in_a_dapp.md) for details.

## Frontend Integration

1. **Set up environment variables**:

```env
NO_CODE_INDEXER_API_KEY=aptoslabs_YOUR_API_KEY_HERE
INDEXER_API_URL=https://api.testnet.aptoslabs.com/nocode/v1/api/YOUR_PROCESSOR_ID/v1/graphql
NETWORK=testnet
```

2. **Create simple GraphQL client**:

```typescript
// src/lib/indexerClient.ts
interface IndexedMessage {
  author_address: string;
  time: string;
  message: string;
}

interface GraphQLResponse {
  data: {
    your_table_name: IndexedMessage[];
  };
}

class IndexerClient {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = INDEXER_API_URL || '';
    this.apiKey = NO_CODE_INDEXER_API_KEY || '';
  }

  private async executeQuery(query: string, variables: Record<string, unknown> = {}): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL API error: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    return result.data;
  }

  async getAllMessages(limit: number = 50): Promise<IndexedMessage[]> {
    const query = `
      query GetMessages($limit: Int) {
        your_table_name(limit: $limit, order_by: {time: desc}) {
          author_address
          time
          message
        }
      }
    `;

    try {
      const data = await this.executeQuery(query, { limit });
      return data.your_table_name || [];
    } catch (error) {
      console.error('Error fetching messages from indexer:', error);
      return [];
    }
  }

  async getMessagesByAuthor(authorAddress: string): Promise<IndexedMessage[]> {
    const query = `
      query GetMessagesByAuthor($authorAddress: String!) {
        your_table_name(where: {author_address: {_eq: $authorAddress}}, order_by: {time: desc}) {
          author_address
          time
          message
        }
      }
    `;

    try {
      const data = await this.executeQuery(query, { authorAddress });
      return data.your_table_name || [];
    } catch (error) {
      console.error('Error fetching messages by author:', error);
      return [];
    }
  }

  async getMessageCount(): Promise<number> {
    const query = `
      query GetMessageCount {
        your_table_name_aggregate {
          aggregate {
            count
          }
        }
      }
    `;

    try {
      const data = await this.executeQuery(query);
      return data.your_table_name_aggregate?.aggregate?.count || 0;
    } catch (error) {
      console.error('Error fetching message count:', error);
      return 0;
    }
  }
}

export const indexerClient = new IndexerClient();
```

3. **Use in React components**:

```tsx
// src/components/MessagesList.tsx
import { useState, useEffect } from 'react';
import { indexerClient } from '../lib/indexerClient';

interface IndexedMessage {
  author_address: string;
  time: string;
  message: string;
}

export const MessagesList = () => {
  const [messages, setMessages] = useState<IndexedMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const data = await indexerClient.getAllMessages(20);
      setMessages(data);
      setLoading(false);
    };

    fetchMessages();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading messages...</div>;

  return (
    <div>
      <h2>Recent Messages ({messages.length})</h2>
      {messages.map((message, index) => (
        <div key={`${message.author_address}-${message.time}-${index}`} className="message-card">
          <p><strong>From:</strong> {message.author_address.slice(0, 6)}...{message.author_address.slice(-4)}</p>
          <p><strong>Message:</strong> {message.message}</p>
          <p><strong>Time:</strong> {new Date(parseInt(message.time) / 1000).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};
```

**Note**: Timestamps from Aptos are in microseconds, so divide by 1000 for JavaScript Date objects. Use `address.slice(0, 6) + '...' + address.slice(-4)` to shorten addresses for display.

## Verification

1. **Test the complete pipeline**:
   - Trigger an event from your smart contract
   - Check data appears in Hasura console within seconds
   - Verify your frontend receives the new data

2. **Test with curl**:

```bash
curl -X POST https://api.testnet.aptoslabs.com/nocode/v1/api/YOUR_PROCESSOR_ID/v1/graphql \
  -H "Authorization: Bearer NO_CODE_INDEXER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { your_table_name { author_address time message } }"}'
```

3. **Common troubleshooting**:
   - **No data**: Verify events are being emitted and processor is running
   - **Permission errors**: Check Hasura permissions for anonymous role
   - **API errors**: Verify API key and endpoint are correct
   - **GraphQL errors**: Check table and column names match exactly

Replace `your_table_name` with your actual table name and adjust column names to match your event structure.

