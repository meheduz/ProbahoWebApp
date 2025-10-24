# DNS_HOSTNAME_NOT_FOUND

**Category:** DNS  
**HTTP Status:** 502  
**Severity:** High

## Description

This error occurs when Vercel cannot resolve the hostname for your domain. The DNS lookup fails, meaning the domain name cannot be translated to an IP address. This typically happens with custom domains that are not properly configured.

## Common Causes

1. **DNS records not configured** for the domain
2. **Incorrect DNS record values** (wrong IP or CNAME)
3. **DNS propagation delays** after making changes
4. **Domain not added** to Vercel project
5. **Incorrect domain configuration** in Vercel dashboard
6. **DNS provider issues** or outages
7. **Domain expired** or suspended
8. **Typo in domain name** or subdomain

## Example Scenarios

### 1. Missing CNAME Record
```
❌ Domain: myapp.example.com
❌ DNS: No CNAME record pointing to Vercel
✅ DNS: CNAME myapp.example.com → cname.vercel-dns.com
```

### 2. Incorrect A Record
```
❌ Domain: myapp.example.com
❌ DNS: A record pointing to wrong IP
✅ DNS: A record pointing to Vercel's IP (or use CNAME)
```

### 3. Wrong Subdomain
```
❌ Domain: www.myapp.example.com
❌ Vercel config: myapp.example.com
✅ Match: Both should be the same
```

## Solutions

### 1. Add Domain to Vercel Project
```bash
# Add domain via CLI
vercel domains add myapp.example.com

# Or add via dashboard:
# Project Settings → Domains → Add Domain
```

### 2. Configure DNS Records

#### For Root Domain (example.com)
```
Type: A
Name: @
Value: 76.76.19.61

Type: A  
Name: @
Value: 76.76.21.61
```

#### For Subdomain (app.example.com)
```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

### 3. Verify DNS Configuration
```bash
# Check DNS records
dig myapp.example.com
nslookup myapp.example.com

# Check specific record type
dig CNAME myapp.example.com
```

### 4. Wait for DNS Propagation
```bash
# Check propagation status
dig @8.8.8.8 myapp.example.com
dig @1.1.1.1 myapp.example.com

# Use online tools
# https://dnschecker.org
```

### 5. Check Domain Status in Vercel
```bash
# List domains
vercel domains ls

# Check domain configuration
vercel domains inspect myapp.example.com
```

## Debugging Steps

1. **Verify domain is added** to Vercel project
2. **Check DNS records** are correctly configured
3. **Test DNS resolution** from different locations
4. **Wait for propagation** (can take up to 48 hours)
5. **Check domain expiration** status
6. **Verify subdomain configuration** matches exactly
7. **Test with different DNS providers**

## Common DNS Record Types

### A Records (IPv4)
```
Type: A
Name: @ (for root domain) or subdomain
Value: IP address (e.g., 76.76.19.61)
```

### CNAME Records
```
Type: CNAME
Name: subdomain
Value: cname.vercel-dns.com
```

### AAAA Records (IPv6)
```
Type: AAAA
Name: @ or subdomain
Value: IPv6 address
```

## DNS Provider Examples

### Cloudflare
1. Go to DNS settings
2. Add CNAME record: `app` → `cname.vercel-dns.com`
3. Set proxy status to "DNS only" (gray cloud)

### GoDaddy
1. Go to DNS Management
2. Add CNAME record: `app` → `cname.vercel-dns.com`
3. Save changes

### Namecheap
1. Go to Advanced DNS
2. Add CNAME record: `app` → `cname.vercel-dns.com`
3. Save changes

## Verification Commands

```bash
# Check if domain resolves
ping myapp.example.com

# Check DNS records
dig myapp.example.com ANY

# Check specific record type
dig CNAME myapp.example.com

# Check from different DNS servers
dig @8.8.8.8 myapp.example.com
dig @1.1.1.1 myapp.example.com
```

## Prevention Strategies

1. **Test DNS configuration** before going live
2. **Use DNS monitoring** services
3. **Document DNS settings** for your team
4. **Set up DNS health checks**
5. **Use multiple DNS providers** for redundancy
6. **Keep DNS records updated** when changing infrastructure

## Troubleshooting Checklist

- [ ] Domain added to Vercel project
- [ ] DNS records configured correctly
- [ ] DNS propagation completed (check multiple locations)
- [ ] Domain not expired or suspended
- [ ] Subdomain matches exactly in Vercel
- [ ] DNS provider is working correctly
- [ ] No typos in domain name
- [ ] Correct record type (A vs CNAME)

## Related Errors

- `DNS_HOSTNAME_EMPTY` - Hostname is empty or undefined
- `DNS_HOSTNAME_RESOLVE_FAILED` - DNS resolution failed
- `DNS_HOSTNAME_RESOLVED_PRIVATE` - Resolved to private IP
- `DNS_HOSTNAME_SERVER_ERROR` - DNS server error

## Additional Resources

- [Vercel Domains Documentation](https://vercel.com/docs/domains)
- [DNS Configuration Guide](https://vercel.com/docs/domains/configuration)
- [Custom Domains](https://vercel.com/docs/domains/custom-domains)
- [DNS Troubleshooting](https://vercel.com/docs/domains/troubleshooting)