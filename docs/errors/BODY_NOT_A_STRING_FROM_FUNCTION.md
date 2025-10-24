# BODY_NOT_A_STRING_FROM_FUNCTION

**Category:** Function  
**HTTP Status:** 502  
**Severity:** High

## Description

This error occurs when a serverless function returns a response body that is not a string. Vercel expects function responses to return string data, but the function is returning a different data type (such as an object, array, or binary data).

## Common Causes

1. **Returning objects directly** instead of JSON strings
2. **Returning arrays** without stringifying them
3. **Returning binary data** without proper encoding
4. **Missing Content-Type headers** for non-string responses
5. **Incorrect response formatting** in API routes

## Example Problematic Code

```javascript
// ❌ Wrong - returning object directly
export default function handler(req, res) {
  const data = { message: "Hello", status: 200 };
  return data; // This will cause BODY_NOT_A_STRING_FROM_FUNCTION
}

// ❌ Wrong - returning array directly
export default function handler(req, res) {
  const items = ["item1", "item2", "item3"];
  return items; // This will cause the error
}
```

## Solutions

### 1. Return JSON String
```javascript
// ✅ Correct - stringify the response
export default function handler(req, res) {
  const data = { message: "Hello", status: 200 };
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
}
```

### 2. Use Next.js API Route Format
```javascript
// ✅ Correct - using Next.js API route format
export default function handler(req, res) {
  const data = { message: "Hello", status: 200 };
  res.status(200).json(data);
}
```

### 3. Return Plain String
```javascript
// ✅ Correct - returning string directly
export default function handler(req, res) {
  return "Hello World";
}
```

### 4. Handle Binary Data
```javascript
// ✅ Correct - for binary data, use base64 encoding
export default function handler(req, res) {
  const buffer = Buffer.from("binary data");
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/octet-stream' },
    body: buffer.toString('base64')
  };
}
```

## Debugging Steps

1. **Check function return value** - Ensure it's a string or properly formatted response object
2. **Add logging** to see what's being returned:
   ```javascript
   console.log('Returning:', typeof response, response);
   ```
3. **Test locally** using `vercel dev` to catch issues early
4. **Review function logs** in Vercel dashboard

## Prevention

- Always use proper response formatting
- Test functions locally before deployment
- Use TypeScript for better type safety
- Implement consistent error handling patterns
- Use response helper functions for common formats

## Related Errors

- `FUNCTION_INVOCATION_FAILED` - General function execution error
- `NO_RESPONSE_FROM_FUNCTION` - Function doesn't return anything
- `FUNCTION_RESPONSE_PAYLOAD_TOO_LARGE` - Response body too large

## Additional Resources

- [Vercel Functions Documentation](https://vercel.com/docs/functions)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Serverless Functions Best Practices](https://vercel.com/docs/functions/serverless-functions)