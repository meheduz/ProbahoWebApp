# Vercel Error Codes

When developing your application with Vercel, you may encounter a variety of errors. They can reflect issues that happen with external providers such as domain services or internal problems at the level of your application's deployment or your usage of platform features.

For general error handling guidance, that covers dashboard related errors, see [General Errors](/docs/errors/error-list).

## Table of Contents

- [Application Errors](#application-errors)
- [Platform Errors](#platform-errors)

## Application Errors

These errors are related to your application's deployment, functions, routing, and request handling.

### Function Errors

| Error Code | Category | HTTP Status | Description |
|------------|----------|-------------|-------------|
| `BODY_NOT_A_STRING_FROM_FUNCTION` | Function | 502 | The function returned a response body that is not a string |
| `EDGE_FUNCTION_INVOCATION_FAILED` | Function | 500 | Edge function failed to execute properly |
| `EDGE_FUNCTION_INVOCATION_TIMEOUT` | Function | 504 | Edge function exceeded the maximum execution time |
| `FUNCTION_INVOCATION_FAILED` | Function | 500 | Serverless function failed to execute properly |
| `FUNCTION_INVOCATION_TIMEOUT` | Function | 504 | Serverless function exceeded the maximum execution time |
| `FUNCTION_PAYLOAD_TOO_LARGE` | Function | 413 | Request payload exceeds the maximum allowed size |
| `FUNCTION_RESPONSE_PAYLOAD_TOO_LARGE` | Function | 500 | Function response exceeds the maximum allowed size |
| `FUNCTION_THROTTLED` | Function | 503 | Function execution is being throttled due to high usage |
| `NO_RESPONSE_FROM_FUNCTION` | Function | 502 | Function did not return a valid response |

### Deployment Errors

| Error Code | Category | HTTP Status | Description |
|------------|----------|-------------|-------------|
| `DEPLOYMENT_BLOCKED` | Deployment | 403 | Deployment is blocked due to policy restrictions |
| `DEPLOYMENT_DELETED` | Deployment | 410 | Deployment has been deleted and is no longer available |
| `DEPLOYMENT_DISABLED` | Deployment | 402 | Deployment is disabled due to billing or policy issues |
| `DEPLOYMENT_NOT_FOUND` | Deployment | 404 | The requested deployment could not be found |
| `DEPLOYMENT_NOT_READY_REDIRECTING` | Deployment | 303 | Deployment is not ready and is redirecting to a temporary location |
| `DEPLOYMENT_PAUSED` | Deployment | 503 | Deployment is paused and temporarily unavailable |
| `NOT_FOUND` | Deployment | 404 | The requested resource could not be found |

### DNS Errors

| Error Code | Category | HTTP Status | Description |
|------------|----------|-------------|-------------|
| `DNS_HOSTNAME_EMPTY` | DNS | 502 | DNS hostname is empty or not provided |
| `DNS_HOSTNAME_NOT_FOUND` | DNS | 502 | DNS hostname could not be resolved |
| `DNS_HOSTNAME_RESOLVE_FAILED` | DNS | 502 | DNS resolution failed for the hostname |
| `DNS_HOSTNAME_RESOLVED_PRIVATE` | DNS | 404 | DNS hostname resolved to a private IP address |
| `DNS_HOSTNAME_SERVER_ERROR` | DNS | 502 | DNS server returned an error |

### Cache Errors

| Error Code | Category | HTTP Status | Description |
|------------|----------|-------------|-------------|
| `FALLBACK_BODY_TOO_LARGE` | Cache | 502 | Fallback response body exceeds maximum size |

### Runtime Errors

| Error Code | Category | HTTP Status | Description |
|------------|----------|-------------|-------------|
| `INFINITE_LOOP_DETECTED` | Runtime | 508 | Infinite loop detected in the application code |

### Image Optimization Errors

| Error Code | Category | HTTP Status | Description |
|------------|----------|-------------|-------------|
| `INVALID_IMAGE_OPTIMIZE_REQUEST` | Image | 400 | Invalid request for image optimization |
| `OPTIMIZED_EXTERNAL_IMAGE_REQUEST_FAILED` | Image | 502 | External image optimization request failed |
| `OPTIMIZED_EXTERNAL_IMAGE_REQUEST_INVALID` | Image | 502 | External image optimization request is invalid |
| `OPTIMIZED_EXTERNAL_IMAGE_REQUEST_UNAUTHORIZED` | Image | 502 | External image optimization request is unauthorized |
| `OPTIMIZED_EXTERNAL_IMAGE_TOO_MANY_REDIRECTS` | Image | 502 | Too many redirects for external image optimization |

### Request Errors

| Error Code | Category | HTTP Status | Description |
|------------|----------|-------------|-------------|
| `INVALID_REQUEST_METHOD` | Request | 405 | The HTTP method is not allowed for this endpoint |
| `MALFORMED_REQUEST_HEADER` | Request | 400 | Request contains malformed headers |
| `RANGE_END_NOT_VALID` | Request | 416 | Invalid range end value in request |
| `RANGE_GROUP_NOT_VALID` | Request | 416 | Invalid range group in request |
| `RANGE_MISSING_UNIT` | Request | 416 | Range request is missing the unit specification |
| `RANGE_START_NOT_VALID` | Request | 416 | Invalid range start value in request |
| `RANGE_UNIT_NOT_SUPPORTED` | Request | 416 | Range unit is not supported |
| `REQUEST_HEADER_TOO_LARGE` | Request | 431 | Request headers exceed maximum size |
| `RESOURCE_NOT_FOUND` | Request | 404 | The requested resource was not found |
| `TOO_MANY_RANGES` | Request | 416 | Too many range requests in a single request |
| `URL_TOO_LONG` | Request | 414 | Request URL exceeds maximum length |

### Routing Errors

| Error Code | Category | HTTP Status | Description |
|------------|----------|-------------|-------------|
| `ROUTER_CANNOT_MATCH` | Routing | 502 | Router cannot match the request to a route |
| `ROUTER_EXTERNAL_TARGET_CONNECTION_ERROR` | Routing | 502 | Connection error to external routing target |
| `ROUTER_EXTERNAL_TARGET_ERROR` | Routing | 502 | Error with external routing target |
| `ROUTER_EXTERNAL_TARGET_HANDSHAKE_ERROR` | Routing | 502 | Handshake error with external routing target |
| `ROUTER_TOO_MANY_HAS_SELECTIONS` | Routing | 502 | Too many has() selections in routing configuration |
| `TOO_MANY_FILESYSTEM_CHECKS` | Routing | 502 | Too many filesystem checks during routing |
| `TOO_MANY_FORKS` | Routing | 502 | Too many process forks during routing |

### Middleware Errors

| Error Code | Category | HTTP Status | Description |
|------------|----------|-------------|-------------|
| `MICROFRONTENDS_MIDDLEWARE_ERROR` | Function | 500 | Error in microfrontends middleware |
| `MICROFRONTENDS_MISSING_FALLBACK_ERROR` | Function | 400 | Missing fallback error in microfrontends |
| `MIDDLEWARE_INVOCATION_FAILED` | Function | 500 | Middleware failed to execute properly |
| `MIDDLEWARE_INVOCATION_TIMEOUT` | Function | 504 | Middleware exceeded the maximum execution time |
| `MIDDLEWARE_RUNTIME_DEPRECATED` | Runtime | 503 | Middleware runtime is deprecated |

### Sandbox Errors

| Error Code | Category | HTTP Status | Description |
|------------|----------|-------------|-------------|
| `SANDBOX_NOT_FOUND` | Sandbox | 404 | Sandbox environment not found |
| `SANDBOX_NOT_LISTENING` | Sandbox | 502 | Sandbox is not listening for requests |
| `SANDBOX_STOPPED` | Sandbox | 410 | Sandbox has been stopped |

## Platform Errors

The following errors are related to the Vercel platform. If you encounter one of these errors, contact [Vercel support](/help).

### Internal Function Errors

| Error Code | Category | HTTP Status | Description |
|------------|----------|-------------|-------------|
| `FUNCTION_THROTTLED` | Internal | 500 | Internal function throttling error |
| `INTERNAL_FUNCTION_INVOCATION_FAILED` | Internal | 500 | Internal function invocation failed |
| `INTERNAL_FUNCTION_INVOCATION_TIMEOUT` | Internal | 500 | Internal function invocation timeout |
| `INTERNAL_FUNCTION_NOT_FOUND` | Internal | 500 | Internal function not found |
| `INTERNAL_FUNCTION_NOT_READY` | Internal | 500 | Internal function not ready |
| `INTERNAL_FUNCTION_SERVICE_UNAVAILABLE` | Internal | 500 | Internal function service unavailable |

### Internal Edge Function Errors

| Error Code | Category | HTTP Status | Description |
|------------|----------|-------------|-------------|
| `INTERNAL_EDGE_FUNCTION_INVOCATION_FAILED` | Internal | 500 | Internal edge function invocation failed |
| `INTERNAL_EDGE_FUNCTION_INVOCATION_TIMEOUT` | Internal | 500 | Internal edge function invocation timeout |

### Internal Cache Errors

| Error Code | Category | HTTP Status | Description |
|------------|----------|-------------|-------------|
| `INTERNAL_CACHE_ERROR` | Internal | 500 | Internal cache system error |
| `INTERNAL_CACHE_KEY_TOO_LONG` | Internal | 500 | Internal cache key exceeds maximum length |
| `INTERNAL_CACHE_LOCK_FULL` | Internal | 500 | Internal cache lock is full |
| `INTERNAL_CACHE_LOCK_TIMEOUT` | Internal | 500 | Internal cache lock timeout |
| `INTERNAL_MISSING_RESPONSE_FROM_CACHE` | Internal | 500 | Missing response from internal cache |

### Internal Deployment Errors

| Error Code | Category | HTTP Status | Description |
|------------|----------|-------------|-------------|
| `INTERNAL_DEPLOYMENT_FETCH_FAILED` | Internal | 500 | Internal deployment fetch failed |

### Internal Microfrontends Errors

| Error Code | Category | HTTP Status | Description |
|------------|----------|-------------|-------------|
| `INTERNAL_MICROFRONTENDS_BUILD_ERROR` | Internal | 500 | Internal microfrontends build error |
| `INTERNAL_MICROFRONTENDS_INVALID_CONFIGURATION_ERROR` | Internal | 500 | Internal microfrontends configuration error |
| `INTERNAL_MICROFRONTENDS_UNEXPECTED_ERROR` | Internal | 500 | Internal microfrontends unexpected error |

### Internal Image Optimization Errors

| Error Code | Category | HTTP Status | Description |
|------------|----------|-------------|-------------|
| `INTERNAL_OPTIMIZED_IMAGE_REQUEST_FAILED` | Internal | 500 | Internal optimized image request failed |

### Internal Router Errors

| Error Code | Category | HTTP Status | Description |
|------------|----------|-------------|-------------|
| `INTERNAL_ROUTER_CANNOT_PARSE_PATH` | Internal | 500 | Internal router cannot parse path |

### Internal Static Request Errors

| Error Code | Category | HTTP Status | Description |
|------------|----------|-------------|-------------|
| `INTERNAL_STATIC_REQUEST_FAILED` | Internal | 500 | Internal static request failed |

### Internal Archive Errors

| Error Code | Category | HTTP Status | Description |
|------------|----------|-------------|-------------|
| `INTERNAL_UNARCHIVE_FAILED` | Internal | 500 | Internal unarchive operation failed |

### General Internal Errors

| Error Code | Category | HTTP Status | Description |
|------------|----------|-------------|-------------|
| `INTERNAL_UNEXPECTED_ERROR` | Internal | 500 | Internal unexpected error |

## Error Handling Best Practices

1. **Monitor Error Rates**: Set up monitoring to track error rates and patterns
2. **Implement Retry Logic**: For transient errors, implement exponential backoff retry logic
3. **Log Error Details**: Include relevant context in error logs for debugging
4. **Graceful Degradation**: Handle errors gracefully to maintain user experience
5. **Contact Support**: For platform errors, contact Vercel support with detailed error information

## Getting Help

- For application errors, check the [Vercel documentation](https://vercel.com/docs)
- For platform errors, contact [Vercel support](https://vercel.com/help)
- Check the [Vercel status page](https://vercel-status.com) for service outages