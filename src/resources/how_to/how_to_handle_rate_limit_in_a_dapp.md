# How to handle a Rate Limit in an Aptos dapp

Rate limiting is a common issue when developing Aptos dapps, especially when making frequent API calls to Aptos full nodes. This guide helps to diagnose and resolve rate limit issues in Aptos applications.

Rate limits occur when your application exceeds the number of allowed requests per time period. Without proper configuration, your dapp may be subject to significantly lower rate limits as an "anonymous" client.

This guide is designed for agents to follow when troubleshooting rate limit issues.
It provides a systematic approach to identify and resolve rate limiting problems.

## 🟩 Step 1: Check for APTOS_API_KEY Configuration

### 1.1 Verify API Key Presence

First, check if the dapp has an `APTOS_API_KEY` configured:

1. **Check the .env file** for:

   ```
   APTOS_API_KEY=<your-api-key>
   ```

2. **Check the AptosWalletAdapterProvider** configuration:

   ```ts
   <AptosWalletAdapterProvider
     autoConnect={true}
     dappConfig={{
       network: Network.MAINNET,
       aptosApiKeys: {
         [Network.MAINNET]: process.env.APTOS_API_KEY, // or similar
       }
     }}
   >
   ```

3. **Check the Aptos client configuration**:
   ```ts
   const aptos = new Aptos(
     new AptosConfig({
       network: NETWORK,
       clientConfig: { API_KEY: process.env.APTOS_API_KEY },
     }),
   );
   ```

### 1.2 If No API Key is Configured

❗ **If no `APTOS_API_KEY` is found**, this is likely the root cause of the rate limit issue.

**Action Required**: Follow the [How to config a Full Node API Key guide](./how_to_config_a_full_node_api_key_in_a_dapp.md) to set up proper API authentication.

⚠️ **Do not proceed with other steps until the API key is properly configured.**

## 🟩 Step 2: Verify API Key Network Compatibility

### 2.1 Check Network Matching

Ensure the configured API key network matches the network your dapp is using:

1. **Identify the dapp's current network**:

   - Check the `network` property in `AptosWalletAdapterProvider`
   - Check the `network` in `AptosConfig`
   - Common networks: `Network.MAINNET`, `Network.TESTNET`, `Network.DEVNET`

2. **Verify API key network**:
   - Check your Geomi console to see which network the API key was created for
   - API keys are network-specific and cannot be used across different networks

### 2.2 If Networks Don't Match

❗ **If there's a network mismatch**:

1. Either update your dapp to use the correct network, or
2. Create a new API key for the desired network following the [API key configuration guide](./how_to_config_a_full_node_api_key_in_a_dapp.md)

## 🟩 Step 3: Check and Adjust Rate Limit Settings

### 3.1 Examine `httpRateLimitPerIp` Configuration

If you have a properly configured API key but still experience rate limits:

1. **Check your API key's rate limit settings** in the Geomi console:

   - Look for the `httpRateLimitPerIp` property
   - This determines how many requests per second your application can make

2. **Assess if the limit is appropriate**:
   - Consider your dapp's usage patterns
   - High-frequency trading apps, real-time data apps, or apps with many concurrent users may need higher limits

### 3.2 Increase Rate Limits if Necessary

If the current `httpRateLimitPerIp` is too low:

1. **Navigate to your Geomi console**
2. **Select your API key**
3. **Increase the `httpRateLimitPerIp` value** to a more appropriate level
4. **Save the changes**

⚠️ **Note**: Higher rate limits may incur additional costs depending on your Geomi plan.

## 🟩 Step 4: Implement Rate Limit Error Handling in Code

Implement proper error handling for rate limit responses:

```ts
try {
  const response = await aptos.getAccountInfo({ accountAddress });
  return response;
} catch (error) {
  if (error.status === 429) {
    // Rate limit exceeded
    console.warn("Rate limit exceeded, implementing backoff strategy...");
  }
  throw error;
}
```

## 🟩 Step 5: Validation and Testing

### 5.1 Test Rate Limit Resolution

1. **Make test requests** to verify the rate limit issues are resolved
2. **Monitor request frequency** to ensure you're staying within limits
3. **Check error logs** for any remaining 429 (Too Many Requests) errors

### 5.2 Performance Monitoring

Implement monitoring to track:

- Request success rates
- Response times
- Rate limit hit frequency
- API key usage patterns

## 🟩 Troubleshooting Common Issues

### Issue: Still getting rate limited with API key

**Solution**:

- Verify the API key is correctly injected into all Aptos client instances
- Check if multiple clients are using the same key simultaneously
- Consider increasing the `httpRateLimitPerIp` limit

### Issue: Different rate limits for different endpoints

**Solution**:

- Some endpoints may have different rate limits
- Check Aptos documentation for endpoint-specific limits
- Implement per-endpoint rate limiting strategies

### Issue: Rate limits in development vs production

**Solution**:

- Use different API keys for different environments
- Consider using TESTNET/DEVNET for development with separate API keys
- Configure environment-specific rate limits

## 🟩 Additional Resources

- [Geomi API Keys Guide](https://geomi.dev/docs/start/api-keys)
- [How to config a Full Node API Key in a dapp](./how_to_config_a_full_node_api_key_in_a_dapp.md)
