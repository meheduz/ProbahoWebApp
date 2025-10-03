# Probaho Deployment Guide

This guide covers deploying the Probaho application to various platforms and environments.

## 🚀 Quick Start

### Local Development
```bash
# Start the development server
./start-perfect.sh

# Or manually
node dev-server.js
```

### Production Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📦 Deployment Options

### 1. Vercel (Recommended)

[Vercel](https://vercel.com) is the easiest way to deploy Next.js applications.

#### Setup:
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Configure environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_BASE_URL`
   - `PAYMENT_SECRET`

#### Vercel Configuration (`vercel.json`):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_BASE_URL": "@next_public_base_url",
    "PAYMENT_SECRET": "@payment_secret"
  }
}
```

### 2. Netlify

#### Setup:
1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Build the project:
   ```bash
   npm run build
   npm run export
   ```

3. Deploy:
   ```bash
   netlify deploy --prod --dir=out
   ```

#### Netlify Configuration (`netlify.toml`):
```toml
[build]
  command = "npm run build && npm run export"
  publish = "out"

[build.environment]
  NEXT_PUBLIC_BASE_URL = "https://your-domain.netlify.app"
  PAYMENT_SECRET = "your-secret-key"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### 3. AWS Amplify

#### Setup:
1. Connect your repository to AWS Amplify
2. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: out
       files:
         - '**/*'
   ```

3. Set environment variables in Amplify console

### 4. Docker Deployment

#### Dockerfile:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Docker Compose:
```yaml
version: '3.8'
services:
  probaho:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_BASE_URL=http://localhost:3000
      - PAYMENT_SECRET=your-secret-key
      - NODE_ENV=production
```

#### Deploy with Docker:
```bash
# Build image
docker build -t probaho .

# Run container
docker run -p 3000:3000 probaho
```

### 5. Traditional Server Deployment

#### Prerequisites:
- Node.js 18+
- PM2 (Process Manager)
- Nginx (Reverse Proxy)

#### Setup:
1. Clone repository:
   ```bash
   git clone <repository-url>
   cd probaho-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build application:
   ```bash
   npm run build
   ```

4. Install PM2:
   ```bash
   npm install -g pm2
   ```

5. Start with PM2:
   ```bash
   pm2 start npm --name "probaho" -- start
   ```

6. Configure Nginx:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔧 Environment Configuration

### Required Environment Variables:

```env
# Application URL
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Security
PAYMENT_SECRET=your-secure-secret-key

# Environment
NODE_ENV=production

# Optional: Database
DATABASE_URL=your-database-url

# Optional: MFS API Keys
BKASH_API_KEY=your-bkash-api-key
NAGAD_API_KEY=your-nagad-api-key
ROCKET_API_KEY=your-rocket-api-key
UPAY_API_KEY=your-upay-api-key
```

### Security Considerations:

1. **Use strong secrets**: Generate secure random strings for `PAYMENT_SECRET`
2. **HTTPS only**: Always use HTTPS in production
3. **Environment isolation**: Use different secrets for different environments
4. **API rate limiting**: Implement rate limiting for API endpoints
5. **Input validation**: Validate all user inputs
6. **CORS configuration**: Configure CORS properly for production

## 📊 Performance Optimization

### 1. Build Optimization:
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer

# Optimize images
npm install next-optimized-images
```

### 2. Caching:
- Enable browser caching for static assets
- Implement Redis for session storage
- Use CDN for global content delivery

### 3. Monitoring:
- Set up error tracking (Sentry)
- Monitor performance (Google Analytics)
- Set up uptime monitoring

## 🔍 Testing in Production

### Health Check Endpoint:
```javascript
// Add to your API routes
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
});
```

### Load Testing:
```bash
# Install artillery
npm install -g artillery

# Run load test
artillery quick --count 10 --num 5 http://localhost:3000
```

## 🚨 Troubleshooting

### Common Issues:

1. **Port already in use**:
   ```bash
   # Find process using port 3000
   lsof -i :3000
   
   # Kill process
   kill -9 <PID>
   ```

2. **Build failures**:
   ```bash
   # Clear cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Environment variables not loading**:
   - Check `.env.local` file exists
   - Restart development server
   - Verify variable names match exactly

4. **API endpoints not working**:
   - Check server is running
   - Verify CORS configuration
   - Check network tab in browser dev tools

### Debug Mode:
```bash
# Enable debug logging
DEBUG=* npm run dev

# Or specific modules
DEBUG=probaho:* npm run dev
```

## 📈 Scaling Considerations

### Horizontal Scaling:
- Use load balancers (Nginx, HAProxy)
- Implement session storage (Redis)
- Use CDN for static assets

### Database Scaling:
- Implement database connection pooling
- Use read replicas for read-heavy operations
- Consider database sharding for large datasets

### Microservices:
- Split API into separate services
- Use message queues (RabbitMQ, Kafka)
- Implement service discovery

## 🔐 Security Checklist

- [ ] HTTPS enabled
- [ ] Strong secrets configured
- [ ] Input validation implemented
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Security headers set
- [ ] Error messages sanitized
- [ ] Logging configured
- [ ] Monitoring set up
- [ ] Backup strategy implemented

## 📞 Support

For deployment issues:
- Check the troubleshooting section
- Review server logs
- Contact support: support@probaho.com

---

**Happy Deploying! 🚀**