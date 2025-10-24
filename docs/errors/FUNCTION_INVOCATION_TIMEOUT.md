# FUNCTION_INVOCATION_TIMEOUT

**Category:** Function  
**HTTP Status:** 504  
**Severity:** High

## Description

This error occurs when a serverless function exceeds its maximum execution time limit. Vercel has different timeout limits based on the plan and function type, and when exceeded, the function is terminated and returns a 504 Gateway Timeout error.

## Timeout Limits

### Vercel Plans
- **Hobby Plan**: 10 seconds
- **Pro Plan**: 15 seconds  
- **Enterprise Plan**: 900 seconds (15 minutes)

### Function Types
- **Serverless Functions**: Plan-dependent (10s-900s)
- **Edge Functions**: 30 seconds
- **Middleware**: 10 seconds

## Common Causes

1. **Long-running operations** without optimization
2. **Synchronous operations** that should be asynchronous
3. **Large data processing** without chunking
4. **External API calls** with long response times
5. **Database queries** without proper indexing
6. **File processing** without streaming
7. **Infinite loops** or recursive functions
8. **Blocking I/O operations**

## Example Problematic Code

```javascript
// ❌ Wrong - synchronous file processing
export default function handler(req, res) {
  const fs = require('fs');
  const data = fs.readFileSync('large-file.json'); // Blocks execution
  const processed = processLargeData(data); // Takes too long
  return { statusCode: 200, body: JSON.stringify(processed) };
}

// ❌ Wrong - blocking external API call
export default function handler(req, res) {
  const response = fetch('https://slow-api.com/data'); // No await
  const data = response.json(); // This will timeout
  return { statusCode: 200, body: JSON.stringify(data) };
}
```

## Solutions

### 1. Optimize Long-Running Operations
```javascript
// ✅ Correct - use streaming for large files
export default async function handler(req, res) {
  const fs = require('fs').promises;
  
  try {
    const fileHandle = await fs.open('large-file.json', 'r');
    const stream = fileHandle.createReadStream();
    
    let data = '';
    stream.on('data', chunk => {
      data += chunk;
    });
    
    stream.on('end', () => {
      const processed = processDataInChunks(data);
      res.status(200).json(processed);
    });
    
  } catch (error) {
    res.status(500).json({ error: 'File processing failed' });
  }
}
```

### 2. Use Asynchronous Operations
```javascript
// ✅ Correct - proper async/await
export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    
    // Process data in chunks to avoid timeout
    const processed = await processDataInChunks(data);
    
    res.status(200).json(processed);
  } catch (error) {
    res.status(500).json({ error: 'Request failed' });
  }
}
```

### 3. Implement Background Processing
```javascript
// ✅ Correct - trigger background job
export default async function handler(req, res) {
  try {
    // Start background job
    const jobId = await startBackgroundJob(req.body);
    
    // Return immediately
    res.status(202).json({ 
      message: 'Processing started',
      jobId: jobId,
      statusUrl: `/api/jobs/${jobId}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start processing' });
  }
}

// Separate function to check job status
export default async function handler(req, res) {
  const { jobId } = req.query;
  const status = await getJobStatus(jobId);
  res.status(200).json(status);
}
```

### 4. Use Edge Functions for Simple Operations
```javascript
// ✅ Correct - edge function for fast operations
export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  // Edge functions have 30s timeout
  const data = await processData(req);
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### 5. Implement Timeout Handling
```javascript
// ✅ Correct - with timeout handling
export default async function handler(req, res) {
  const timeout = 8000; // 8 seconds (leave buffer)
  
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Function timeout')), timeout);
  });
  
  const processPromise = processData(req.body);
  
  try {
    const result = await Promise.race([processPromise, timeoutPromise]);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Function timeout') {
      res.status(202).json({ 
        message: 'Processing will continue in background',
        status: 'processing'
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}
```

## Debugging Steps

1. **Check function execution time** in Vercel dashboard
2. **Add timing logs** to identify bottlenecks:
   ```javascript
   console.time('operation');
   // Your operation here
   console.timeEnd('operation');
   ```
3. **Profile the function** to find slow operations
4. **Test with smaller datasets** to isolate issues
5. **Check external API response times**
6. **Review database query performance**

## Performance Optimization Tips

### 1. Database Optimization
```javascript
// ✅ Use indexed queries and limit results
const users = await db.users
  .find({ status: 'active' })
  .limit(100)
  .select('id name email'); // Only select needed fields
```

### 2. Caching
```javascript
// ✅ Implement caching for expensive operations
const cacheKey = `processed-${JSON.stringify(req.body)}`;
let result = await cache.get(cacheKey);

if (!result) {
  result = await expensiveOperation(req.body);
  await cache.set(cacheKey, result, 3600); // Cache for 1 hour
}
```

### 3. Parallel Processing
```javascript
// ✅ Process multiple items in parallel
const promises = items.map(item => processItem(item));
const results = await Promise.all(promises);
```

## Monitoring and Alerting

```javascript
// Example: Add performance monitoring
export default async function handler(req, res) {
  const startTime = Date.now();
  
  try {
    const result = await processData(req.body);
    
    const duration = Date.now() - startTime;
    console.log('Function completed', { duration, timestamp: new Date().toISOString() });
    
    // Alert if approaching timeout
    if (duration > 8000) { // 8 seconds warning
      console.warn('Function approaching timeout', { duration });
    }
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Function failed', { error: error.message, duration: Date.now() - startTime });
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

## Related Errors

- `FUNCTION_INVOCATION_FAILED` - General function execution error
- `EDGE_FUNCTION_INVOCATION_TIMEOUT` - Edge function timeout
- `MIDDLEWARE_INVOCATION_TIMEOUT` - Middleware timeout
- `FUNCTION_THROTTLED` - Function rate limited

## Additional Resources

- [Vercel Functions Documentation](https://vercel.com/docs/functions)
- [Function Timeout Limits](https://vercel.com/docs/functions/serverless-functions#timeout)
- [Performance Optimization](https://vercel.com/docs/functions/serverless-functions#performance)
- [Edge Functions](https://vercel.com/docs/functions/edge-functions)