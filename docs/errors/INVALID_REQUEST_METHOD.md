# INVALID_REQUEST_METHOD

**Category:** Request  
**HTTP Status:** 405  
**Severity:** Medium

## Description

This error occurs when a request is made using an HTTP method that is not allowed or supported by the target endpoint. The server understands the request but refuses to process it due to method restrictions.

## Common Causes

1. **Using wrong HTTP method** for the endpoint
2. **Missing method handling** in API routes
3. **CORS preflight issues** with unsupported methods
4. **Middleware blocking** certain methods
5. **Serverless function** not configured for the method
6. **Static file serving** with unsupported methods
7. **API Gateway restrictions** on methods

## Example Scenarios

### 1. Wrong Method for Endpoint
```javascript
// ❌ API route only handles GET
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // Handle GET request
}

// ❌ Client sends POST to GET-only endpoint
fetch('/api/data', { method: 'POST' }); // Will return 405
```

### 2. Missing Method Handling
```javascript
// ❌ No method checking
export default function handler(req, res) {
  // This will work for any method, but may not be intended
  res.status(200).json({ message: 'Hello' });
}
```

### 3. CORS Issues
```javascript
// ❌ Missing OPTIONS handling for CORS
export default function handler(req, res) {
  if (req.method === 'OPTIONS') {
    // Missing CORS headers
    return res.status(200).end();
  }
  // Handle other methods
}
```

## Solutions

### 1. Proper Method Handling
```javascript
// ✅ Correct - handle multiple methods
export default function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    case 'PUT':
      return handlePut(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    case 'OPTIONS':
      return handleOptions(req, res);
    default:
      return res.status(405).json({ 
        error: 'Method not allowed',
        allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      });
  }
}
```

### 2. Next.js API Route Method Handling
```javascript
// ✅ Correct - Next.js API route
export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ data: 'GET response' });
  }
  
  if (req.method === 'POST') {
    return res.status(201).json({ data: 'POST response' });
  }
  
  // Handle unsupported methods
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json({ error: 'Method not allowed' });
}
```

### 3. CORS Preflight Handling
```javascript
// ✅ Correct - handle CORS preflight
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Handle actual request
  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
```

### 4. Middleware Method Filtering
```javascript
// ✅ Correct - middleware with method filtering
export function middleware(req) {
  // Only allow specific methods
  const allowedMethods = ['GET', 'POST'];
  
  if (!allowedMethods.includes(req.method)) {
    return new Response('Method not allowed', { 
      status: 405,
      headers: {
        'Allow': allowedMethods.join(', ')
      }
    });
  }
}

export const config = {
  matcher: '/api/:path*'
};
```

### 5. Client-Side Error Handling
```javascript
// ✅ Correct - handle 405 errors on client
async function makeRequest(url, method = 'GET', data = null) {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : null,
    });
    
    if (response.status === 405) {
      const error = await response.json();
      console.error('Method not allowed:', error);
      throw new Error(`Method ${method} not allowed for ${url}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}
```

## Debugging Steps

1. **Check the request method** being sent
2. **Verify endpoint supports** the method
3. **Review API route implementation** for method handling
4. **Check CORS configuration** for preflight requests
5. **Test with different methods** to isolate the issue
6. **Review middleware** that might block methods
7. **Check serverless function** configuration

## Common HTTP Methods

### Safe Methods (Idempotent)
- **GET**: Retrieve data
- **HEAD**: Get headers only
- **OPTIONS**: Get allowed methods

### Unsafe Methods (Not Idempotent)
- **POST**: Create new resource
- **PUT**: Update/replace resource
- **PATCH**: Partial update
- **DELETE**: Remove resource

## Method-Specific Best Practices

### GET Requests
```javascript
// ✅ GET - retrieve data
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET allowed' });
  }
  
  const data = fetchData(req.query);
  res.status(200).json(data);
}
```

### POST Requests
```javascript
// ✅ POST - create data
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }
  
  const newData = createData(req.body);
  res.status(201).json(newData);
}
```

### PUT Requests
```javascript
// ✅ PUT - update data
export default function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Only PUT allowed' });
  }
  
  const updatedData = updateData(req.body);
  res.status(200).json(updatedData);
}
```

### DELETE Requests
```javascript
// ✅ DELETE - remove data
export default function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Only DELETE allowed' });
  }
  
  deleteData(req.query.id);
  res.status(204).end();
}
```

## Testing Different Methods

```bash
# Test GET request
curl -X GET https://your-app.vercel.app/api/data

# Test POST request
curl -X POST https://your-app.vercel.app/api/data \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'

# Test unsupported method
curl -X PATCH https://your-app.vercel.app/api/data
# Should return 405 Method Not Allowed
```

## Related Errors

- `MALFORMED_REQUEST_HEADER` - Invalid request headers
- `REQUEST_HEADER_TOO_LARGE` - Headers exceed size limit
- `URL_TOO_LONG` - Request URL too long
- `RANGE_*` - Invalid range request headers

## Additional Resources

- [HTTP Methods Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Vercel Functions](https://vercel.com/docs/functions)