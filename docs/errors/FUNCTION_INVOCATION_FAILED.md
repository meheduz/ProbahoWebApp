# FUNCTION_INVOCATION_FAILED

**Category:** Function  
**HTTP Status:** 500  
**Severity:** High

## Description

This error indicates that a serverless function failed to execute properly. The function was invoked but encountered an error during execution, resulting in a 500 Internal Server Error response.

## Common Causes

1. **Unhandled exceptions** in function code
2. **Missing dependencies** or modules
3. **Environment variable issues** (undefined or incorrect values)
4. **Database connection failures**
5. **External API failures** without proper error handling
6. **Memory or timeout issues**
7. **Syntax errors** in the function code
8. **Import/require errors** for missing modules

## Example Problematic Code

```javascript
// ❌ Wrong - unhandled exception
export default function handler(req, res) {
  const data = JSON.parse(req.body); // Will throw if req.body is invalid JSON
  return { statusCode: 200, body: JSON.stringify(data) };
}

// ❌ Wrong - missing error handling for external API
export default async function handler(req, res) {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json(); // Will throw if API fails
  return { statusCode: 200, body: JSON.stringify(data) };
}
```

## Solutions

### 1. Add Proper Error Handling
```javascript
// ✅ Correct - with try-catch
export default function handler(req, res) {
  try {
    const data = JSON.parse(req.body);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON' })
    };
  }
}
```

### 2. Handle External API Calls
```javascript
// ✅ Correct - with proper error handling
export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.example.com/data');
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('API call failed:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to fetch data' })
    };
  }
}
```

### 3. Validate Environment Variables
```javascript
// ✅ Correct - check required environment variables
export default function handler(req, res) {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.error('API_KEY environment variable is not set');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server configuration error' })
    };
  }
  
  // Continue with function logic...
}
```

### 4. Use Next.js API Route Error Handling
```javascript
// ✅ Correct - using Next.js error handling
export default async function handler(req, res) {
  try {
    const data = await processRequest(req);
    res.status(200).json(data);
  } catch (error) {
    console.error('Function error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

## Debugging Steps

1. **Check function logs** in Vercel dashboard
2. **Test locally** using `vercel dev`
3. **Add console.log statements** for debugging
4. **Verify environment variables** are set correctly
5. **Check function dependencies** in package.json
6. **Review function timeout settings**

## Common Debugging Commands

```bash
# Test function locally
vercel dev

# Check function logs
vercel logs [deployment-url]

# Inspect function
vercel inspect [deployment-url]
```

## Prevention Strategies

1. **Always use try-catch blocks** for async operations
2. **Validate inputs** before processing
3. **Check environment variables** at function start
4. **Implement proper logging** for debugging
5. **Test functions thoroughly** before deployment
6. **Use TypeScript** for better error catching
7. **Set appropriate timeouts** for external calls
8. **Implement circuit breakers** for external services

## Monitoring and Alerting

```javascript
// Example: Add monitoring to your function
export default async function handler(req, res) {
  const startTime = Date.now();
  
  try {
    // Your function logic here
    const result = await processData(req);
    
    // Log success metrics
    console.log('Function completed successfully', {
      duration: Date.now() - startTime,
      timestamp: new Date().toISOString()
    });
    
    res.status(200).json(result);
  } catch (error) {
    // Log error metrics
    console.error('Function failed', {
      error: error.message,
      stack: error.stack,
      duration: Date.now() - startTime,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

## Related Errors

- `FUNCTION_INVOCATION_TIMEOUT` - Function exceeded time limit
- `FUNCTION_PAYLOAD_TOO_LARGE` - Request body too large
- `FUNCTION_RESPONSE_PAYLOAD_TOO_LARGE` - Response body too large
- `FUNCTION_THROTTLED` - Function rate limited

## Additional Resources

- [Vercel Functions Documentation](https://vercel.com/docs/functions)
- [Error Handling Best Practices](https://vercel.com/docs/functions/serverless-functions#error-handling)
- [Function Monitoring](https://vercel.com/docs/functions/monitoring)