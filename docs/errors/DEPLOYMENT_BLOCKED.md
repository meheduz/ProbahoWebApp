# DEPLOYMENT_BLOCKED

**Category:** Deployment  
**HTTP Status:** 403  
**Severity:** High

## Description

This error occurs when a deployment is blocked by Vercel's security systems or configuration policies. The deployment cannot proceed due to security violations, policy restrictions, or detected malicious content.

## Common Causes

1. **Security policy violations** (malware, suspicious code)
2. **Resource usage limits** exceeded
3. **Team/organization policies** blocking deployment
4. **Suspicious file patterns** detected
5. **Large file uploads** exceeding limits
6. **Prohibited dependencies** in package.json
7. **Environment variable restrictions**
8. **Build process violations**

## Example Scenarios

### 1. Suspicious Code Patterns
```javascript
// ❌ May trigger security scan
eval(userInput);
new Function(userCode);
document.write(userContent);
```

### 2. Large File Uploads
```
❌ File size: 100MB+ (exceeds limits)
✅ File size: <50MB (within limits)
```

### 3. Prohibited Dependencies
```json
// ❌ package.json with suspicious packages
{
  "dependencies": {
    "suspicious-package": "^1.0.0",
    "malware-package": "^2.0.0"
  }
}
```

## Solutions

### 1. Review Security Policies
```bash
# Check deployment logs for specific violations
vercel logs [deployment-url]

# Review build output for security warnings
vercel build --debug
```

### 2. Remove Suspicious Code
```javascript
// ❌ Remove dangerous patterns
// eval(userInput);
// new Function(userCode);

// ✅ Use safe alternatives
const result = JSON.parse(userInput);
const safeFunction = (x) => x * 2;
```

### 3. Optimize File Sizes
```bash
# Check file sizes
find . -type f -size +50M

# Compress large files
gzip large-file.json

# Use CDN for large assets
# Move large files to external storage
```

### 4. Review Dependencies
```bash
# Audit dependencies for vulnerabilities
npm audit

# Check for suspicious packages
npm ls --depth=0

# Remove unused dependencies
npm prune
```

### 5. Update Package.json
```json
// ✅ Clean package.json
{
  "dependencies": {
    "react": "^18.0.0",
    "next": "^13.0.0"
  },
  "devDependencies": {
    "typescript": "^4.0.0"
  }
}
```

## Debugging Steps

1. **Check deployment logs** for specific error messages
2. **Review build output** for security warnings
3. **Scan codebase** for suspicious patterns
4. **Audit dependencies** for vulnerabilities
5. **Check file sizes** and remove large files
6. **Review environment variables** for sensitive data
7. **Contact Vercel support** if unclear

## Common Security Violations

### Code Patterns to Avoid
```javascript
// ❌ Dangerous patterns
eval(userInput);
new Function(code);
document.write(content);
innerHTML = userContent;
setTimeout(code, 0);
setInterval(code, 1000);
```

### File Patterns to Avoid
```
❌ Large files: >50MB
❌ Executable files: .exe, .bat, .sh
❌ Suspicious extensions: .pkg, .dmg
❌ Hidden files: .env.local, .git
```

### Dependencies to Avoid
```json
// ❌ Suspicious packages
"crypto-miner": "^1.0.0",
"keylogger": "^2.0.0",
"backdoor": "^3.0.0"
```

## Prevention Strategies

### 1. Code Security
```javascript
// ✅ Safe code patterns
const safeEval = (expression) => {
  // Use a safe expression evaluator
  return math.evaluate(expression);
};

// Sanitize user input
const sanitizeInput = (input) => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};
```

### 2. File Management
```bash
# Use .vercelignore for large files
echo "*.log" >> .vercelignore
echo "node_modules" >> .vercelignore
echo "*.mp4" >> .vercelignore
```

### 3. Dependency Management
```bash
# Regular security audits
npm audit fix

# Use only trusted packages
npm install --save-exact package-name

# Review package sources
npm info package-name
```

### 4. Environment Variables
```bash
# Use Vercel's environment variable system
vercel env add SECRET_KEY

# Don't commit secrets to code
echo "*.env*" >> .gitignore
```

## Team Policy Configuration

### 1. Set Deployment Policies
```bash
# Configure team policies
vercel teams update [team-name] --policy-file policies.json
```

### 2. Review Team Settings
- Go to Team Settings → Security
- Configure deployment restrictions
- Set up approval workflows
- Enable security scanning

## Monitoring and Alerts

```javascript
// Example: Add security monitoring
export default function handler(req, res) {
  // Log suspicious activity
  if (req.body && req.body.length > 10000) {
    console.warn('Large request body detected', {
      size: req.body.length,
      ip: req.headers['x-forwarded-for'],
      timestamp: new Date().toISOString()
    });
  }
  
  // Continue with normal processing
  res.status(200).json({ message: 'OK' });
}
```

## Related Errors

- `DEPLOYMENT_DISABLED` - Deployment is disabled
- `DEPLOYMENT_PAUSED` - Deployment is paused
- `FUNCTION_PAYLOAD_TOO_LARGE` - Request payload too large
- `REQUEST_HEADER_TOO_LARGE` - Request headers too large

## Additional Resources

- [Vercel Security Documentation](https://vercel.com/docs/security)
- [Deployment Policies](https://vercel.com/docs/teams/security)
- [Security Best Practices](https://vercel.com/docs/security/best-practices)
- [Team Security Settings](https://vercel.com/docs/teams/security/settings)