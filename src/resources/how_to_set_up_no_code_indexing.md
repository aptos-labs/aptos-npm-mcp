# How to Set Up No-Code Indexing with Aptos Build

No-Code Indexing allows you to create real-time blockchain data indexers without writing custom indexing logic or managing infrastructure. Use it when you need to query smart contract events in real-time for your dApp frontend, analytics, or notifications.

## Prerequisites

- Deployed Move smart contract with events on Testnet or Mainnet
- Contract address and event structures in the deployed contract
- Aptos Build account

## Project Setup in Aptos Build

1. Go to [Aptos Build](https://build.aptoslabs.com/) and sign in with your account.

2. Create a new project:
   - Click "Create New Project" from the dashboard
   - Choose "Processor" as the project type
   - Name your project (3-32 characters, lowercase, numbers, `_` or `-`)

3. Navigate to your project and click "Create Processor".

## Processor Configuration

1. **Name your processor** with a descriptive name like `billboard-events-processor`.

2. **Select network** (Testnet or Mainnet) matching where your contract is deployed.

3. **Choose starting version**:
   - Use "Current Version" if you just deployed and have no events yet
   - Use a specific transaction version if you want to index from contract deployment
   - Find the deployment transaction in [Aptos Explorer](https://explorer.aptoslabs.com/) if needed

4. **Configure the visual processor**:
   - Add your contract address as an Event Data Source
   - Select the specific event you want to index
   - Create a new table as Data Destination
   - Name your table descriptively (e.g., `billboard_messages`)

5. **Define table schema**:
   - Add columns matching your event fields
   - Set appropriate data types (text, integer, timestamp, etc.)
   - Configure primary keys if needed

6. **Connect data flow**:
   - Drag connections from Event fields to Table columns
   - Map each event field to the corresponding table column

7. Click "Create Processor" and wait for deployment (may show errors initially while starting up).

## Hasura Console Setup

1. **Access Hasura Console**:
   - Once processor status shows "Running", click the Console URL
   - Enter the Hasura admin secret when prompted

2. **Track your table**:
   - In the left sidebar, expand `processordb` → `public`
   - If your table appears in "Untracked tables", click "Track"
   - If already visible in the sidebar, it's already tracked

3. **Configure permissions** (critical step):
   - Click on your table name in the left sidebar
   - Go to the "Permissions" tab
   - Click on "anonymous" role
   - Click the ✓ under "select"
   - Choose "Without any checks"
   - Enable all columns you want to query
   - Click "Save Permissions"

4. **Test GraphQL query**:
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

## API Integration

1. **Get API credentials**:
   - Return to Aptos Build dashboard
   - Navigate to your project → API Keys section
   - Copy the API key (starts with `aptoslabs_...`)
   - Note your processor ID from the API URL

2. **Test with curl**:

```bash
curl -X POST https://api.testnet.aptoslabs.com/nocode/v1/api/YOUR_PROCESSOR_ID/v1/graphql \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { your_table_name { column1 column2 } }"}'
```

## Frontend Integration

1. **Install dependencies**:

```bash
npm install @apollo/client graphql
```

2. **Set up environment variables**:

```env
NEXT_PUBLIC_INDEXER_API_KEY=aptoslabs_YOUR_API_KEY_HERE
NEXT_PUBLIC_INDEXER_ENDPOINT=https://api.testnet.aptoslabs.com/nocode/v1/api/YOUR_PROCESSOR_ID/v1/graphql
NEXT_PUBLIC_NETWORK=testnet
```

3. **Create GraphQL client**:

```tsx
// src/lib/graphql.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_INDEXER_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${process.env.NEXT_PUBLIC_INDEXER_API_KEY}`,
    }
  }
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

4. **Define TypeScript interfaces**:

```tsx
// src/types/indexer.ts
export interface IndexedEvent {
  id: string;
  author_address: string;
  message: string;
  timestamp: string;
  transaction_hash: string;
}

export interface QueryResponse {
  your_table_name: IndexedEvent[];
}
```

5. **Create data fetching hook**:

```tsx
// src/hooks/useIndexedData.ts
import { useQuery, gql } from '@apollo/client';
import { QueryResponse } from '../types/indexer';

const GET_EVENTS = gql`
  query GetEvents($limit: Int, $offset: Int) {
    your_table_name(
      limit: $limit
      offset: $offset
      order_by: { timestamp: desc }
    ) {
      id
      author_address
      message
      timestamp
      transaction_hash
    }
  }
`;

export const useIndexedData = (limit = 10, offset = 0) => {
  const { data, loading, error, refetch } = useQuery<QueryResponse>(GET_EVENTS, {
    variables: { limit, offset },
    pollInterval: 5000, // Poll every 5 seconds for real-time updates
  });

  return {
    events: data?.your_table_name || [],
    loading,
    error,
    refetch,
  };
};
```

6. **Use in React component**:

```tsx
// src/components/EventsList.tsx
import { useIndexedData } from '../hooks/useIndexedData';

export const EventsList = () => {
  const { events, loading, error } = useIndexedData();

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Recent Events</h2>
      {events.map((event) => (
        <div key={event.id} className="event-card">
          <p><strong>From:</strong> {event.author_address}</p>
          <p><strong>Message:</strong> {event.message}</p>
          <p><strong>Time:</strong> {new Date(event.timestamp).toLocaleString()}</p>
          <a 
            href={`https://explorer.aptoslabs.com/txn/${event.transaction_hash}?network=${process.env.NEXT_PUBLIC_NETWORK}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Transaction
          </a>
        </div>
      ))}
    </div>
  );
};
```

7. **Set up Apollo Provider**:

```tsx
// src/app/layout.tsx or pages/_app.tsx
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '../lib/graphql';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider client={apolloClient}>
          {children}
        </ApolloProvider>
      </body>
    </html>
  );
}
```

## Advanced Queries

1. **Filtering by address**:

```graphql
query GetEventsByAddress($address: String!) {
  your_table_name(where: { author_address: { _eq: $address } }) {
    id
    message
    timestamp
  }
}
```

2. **Pagination with cursor**:

```graphql
query GetEventsPaginated($cursor: String, $limit: Int!) {
  your_table_name(
    where: { timestamp: { _lt: $cursor } }
    order_by: { timestamp: desc }
    limit: $limit
  ) {
    id
    message
    timestamp
    author_address
  }
}
```

3. **Real-time subscriptions** (if supported):

```graphql
subscription NewEvents {
  your_table_name(
    order_by: { timestamp: desc }
    limit: 1
  ) {
    id
    message
    timestamp
    author_address
  }
}
```

## Error Handling

1. **Common issues and solutions**:

```tsx
// src/utils/errorHandling.ts
export const handleIndexerError = (error: any) => {
  if (error.networkError) {
    console.error('Network error:', error.networkError);
    return 'Network connection failed. Please check your internet connection.';
  }
  
  if (error.graphQLErrors?.length > 0) {
    const graphQLError = error.graphQLErrors[0];
    if (graphQLError.message.includes('permission')) {
      return 'Permission denied. Please check Hasura permissions configuration.';
    }
    return `GraphQL error: ${graphQLError.message}`;
  }
  
  return 'An unexpected error occurred.';
};
```

2. **Retry logic**:

```tsx
// src/hooks/useIndexedDataWithRetry.ts
import { useState, useEffect } from 'react';
import { apolloClient } from '../lib/graphql';

export const useIndexedDataWithRetry = (query: any, variables: any) => {
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const { data, loading, error, refetch } = useQuery(query, {
    variables,
    errorPolicy: 'all',
    onError: (error) => {
      if (retryCount < maxRetries) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          refetch();
        }, 1000 * Math.pow(2, retryCount)); // Exponential backoff
      }
    }
  });

  return { data, loading, error, refetch, retryCount };
};
```

## Verification

1. **Test the complete pipeline**:
   - Trigger an event from your smart contract
   - Check that data appears in Hasura console within seconds
   - Verify your frontend receives the new data
   - Confirm API authentication works correctly

2. **Monitor usage**:
   - Check Aptos Build dashboard → Usage tab
   - Monitor API rate limits and costs
   - Set up alerts for processor errors

## Common Troubleshooting

- **No data appearing**: Verify events are being emitted and processor is running
- **Permission errors**: Double-check Hasura permissions for anonymous role
- **API authentication failures**: Verify API key is correct and has proper permissions
- **GraphQL errors**: Check table and column names match exactly
- **Network issues**: Ensure you're using the correct network endpoint (testnet/mainnet)

## Best Practices

- Use environment variables for all API keys and endpoints
- Implement proper error handling and retry logic
- Set up monitoring and alerting for processor health
- Use TypeScript for better type safety
- Implement pagination for large datasets
- Consider caching strategies for frequently accessed data
- Test thoroughly on testnet before mainnet deployment