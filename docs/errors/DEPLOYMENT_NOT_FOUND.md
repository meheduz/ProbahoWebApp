# DEPLOYMENT_NOT_FOUND

**Category:** Deployment  
**HTTP Status:** 404  
**Severity:** Medium

## Description

This error occurs when Vercel cannot find the specified deployment. The deployment may have been deleted, the URL is incorrect, or the deployment is not accessible due to permissions or configuration issues.

## Common Causes

1. **Incorrect deployment URL** or domain
2. **Deployment was deleted** from Vercel dashboard
3. **Deployment is from a different team** or account
4. **Deployment is in a different environment** (preview vs production)
5. **Domain configuration issues** with custom domains
6. **Deployment is still building** and not yet available
7. **Access permissions** - user doesn't have access to the deployment

## Example Scenarios

### 1. Incorrect URL
```
❌ Wrong: https://my-app-abc123.vercel.app
✅ Correct: https://my-app-xyz789.vercel.app
```

### 2. Wrong Environment
```
❌ Wrong: https://my-app.vercel.app (production)
✅ Correct: https://my-app-git-feature-branch.vercel.app (preview)
```

### 3. Deleted Deployment
```
❌ Deployment was deleted from dashboard
✅ Check deployment history or redeploy
```

## Solutions

### 1. Verify Deployment URL
```bash
# List all deployments
vercel ls

# Get specific deployment info
vercel inspect [deployment-url]

# Check deployment status
vercel logs [deployment-url]
```

### 2. Check Deployment Status
```bash
# Check if deployment exists and is ready
vercel inspect https://my-app-abc123.vercel.app

# Look for status: "READY" or "ERROR"
```

### 3. Redeploy if Necessary
```bash
# Create new deployment
vercel --prod

# Deploy specific branch
vercel --prod --target production
```

### 4. Check Team/Account Access
```bash
# Switch to correct team
vercel teams switch [team-name]

# Check current team
vercel whoami
```

### 5. Verify Domain Configuration
```bash
# List domains
vercel domains ls

# Check domain configuration
vercel domains inspect [domain-name]
```

## Debugging Steps

1. **Verify the URL** is correct and complete
2. **Check deployment status** in Vercel dashboard
3. **Confirm team/account access** permissions
4. **Look for typos** in the deployment URL
5. **Check if deployment is still building**
6. **Verify environment** (production vs preview)
7. **Check custom domain** configuration

## Common URL Patterns

### Vercel URLs
- **Production**: `https://your-app.vercel.app`
- **Preview**: `https://your-app-git-branch-name.vercel.app`
- **Specific deployment**: `https://your-app-abc123.vercel.app`

### Custom Domains
- **Custom domain**: `https://yourdomain.com`
- **Subdomain**: `https://app.yourdomain.com`

## Prevention Strategies

1. **Use environment variables** for deployment URLs
2. **Implement proper error handling** for 404 responses
3. **Set up monitoring** for deployment availability
4. **Use consistent naming** for deployments
5. **Document deployment URLs** in your project
6. **Implement health checks** for deployments

## Example Error Handling

```javascript
// Handle deployment not found in your application
async function checkDeploymentStatus(url) {
  try {
    const response = await fetch(url);
    
    if (response.status === 404) {
      console.error('Deployment not found:', url);
      return { status: 'not_found', error: 'Deployment not found' };
    }
    
    return { status: 'ok', data: await response.json() };
  } catch (error) {
    console.error('Error checking deployment:', error);
    return { status: 'error', error: error.message };
  }
}
```

## Related Errors

- `DEPLOYMENT_DELETED` - Deployment was intentionally deleted
- `DEPLOYMENT_DISABLED` - Deployment is disabled
- `DEPLOYMENT_PAUSED` - Deployment is paused
- `NOT_FOUND` - General resource not found

## Additional Resources

- [Vercel Deployments Documentation](https://vercel.com/docs/deployments)
- [Domain Configuration](https://vercel.com/docs/domains)
- [Team Management](https://vercel.com/docs/teams)
- [Deployment URLs](https://vercel.com/docs/deployments/overview#deployment-urls)