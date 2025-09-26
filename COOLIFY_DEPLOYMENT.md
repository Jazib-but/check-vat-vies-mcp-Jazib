# Coolify Deployment Guide for VAT Validation API

## Prerequisites
- Coolify server installed and configured
- GitHub/GitLab account for repository
- Domain or subdomain for the API (optional)

## Step 1: Prepare Repository

1. Push your code to GitHub/GitLab:
```bash
git add .
git commit -m "Add VAT validation API with Docker support"
git push origin main
```

## Step 2: Deploy on Coolify

### Option A: Deploy from GitHub/GitLab

1. **Login to Coolify Dashboard**
2. **Create New Resource** → Select "Application"
3. **Choose Source**:
   - Select "Public Repository" or "Private Repository"
   - Enter repository URL: `https://github.com/yourusername/check-vat-vies-mcp`
   - Branch: `main`

4. **Configure Build**:
   - Build Pack: `Dockerfile`
   - Dockerfile Location: `./Dockerfile.api`
   - Port: `3000`

5. **Environment Variables**:
   ```
   PORT=3000
   NODE_ENV=production
   ```

6. **Networking**:
   - Enable "Expose to Internet"
   - Add custom domain (optional): `vat-api.yourdomain.com`
   - Enable "Force HTTPS" (recommended)

7. **Deploy**: Click "Deploy"

### Option B: Deploy with Docker Image

1. **Build and push Docker image**:
```bash
# Build the image
docker build -f Dockerfile.api -t vat-validation-api:latest .

# Tag for your registry
docker tag vat-validation-api:latest your-registry.com/vat-validation-api:latest

# Push to registry
docker push your-registry.com/vat-validation-api:latest
```

2. **In Coolify**:
   - Create New Resource → Docker Image
   - Image: `your-registry.com/vat-validation-api:latest`
   - Port: `3000`
   - Add environment variables
   - Deploy

## Step 3: Configure Health Checks

In Coolify application settings:
- Health Check Path: `/health`
- Health Check Interval: `30`
- Health Check Timeout: `3`
- Health Check Retries: `3`

## Step 4: SSL Certificate

Coolify automatically provisions Let's Encrypt SSL certificates. Ensure:
- Domain DNS points to your Coolify server
- "Force HTTPS" is enabled

## Step 5: Verify Deployment

Test your deployed API:
```bash
# Replace with your actual domain
curl https://vat-api.yourdomain.com/health

# Test VAT validation
curl -X POST https://vat-api.yourdomain.com/api/validate/auto \
  -H "Content-Type: application/json" \
  -d '{"vat":"DE215891388"}'
```

## Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| PORT | API server port | 3000 | No |
| NODE_ENV | Node environment | production | No |
| RATE_LIMIT | Requests per minute | 60 | No |
| ALLOWED_ORIGINS | CORS domains (comma-separated) | * | No |
| API_KEY | Optional API key for auth | - | No |

## Monitoring & Logs

1. **View Logs**:
   - Coolify Dashboard → Your App → Logs
   - Real-time logs available

2. **Monitoring**:
   - Coolify provides basic metrics
   - Health endpoint: `/health`
   - Status endpoint: `/api/status`

## Scaling

In Coolify application settings:
- Adjust "Replicas" for horizontal scaling
- Configure resource limits:
  - Memory: `256Mi` (minimum)
  - CPU: `0.5` (minimum)

## Troubleshooting

### Common Issues:

1. **Port conflicts**: Ensure PORT env variable matches exposed port
2. **Health check failing**: Verify `/health` endpoint is accessible
3. **VIES API timeout**: Check EU VIES service status at `/api/status`

### Debug Commands:
```bash
# Check container logs
docker logs [container-id]

# Test from inside container
docker exec -it [container-id] sh
wget -qO- http://localhost:3000/health
```

## Backup & Recovery

1. No database required - stateless application
2. Configuration through environment variables
3. Easy to redeploy from repository

## Security Recommendations

1. **Enable API Key** (optional):
   - Set `API_KEY` environment variable
   - Modify `api-server.js` to check for API key in requests

2. **Rate Limiting**:
   - Configure `RATE_LIMIT` environment variable
   - Implement rate limiting middleware

3. **CORS Configuration**:
   - Set `ALLOWED_ORIGINS` to specific domains
   - Restrict to your n8n instance domain

## Cost Optimization

- Minimal resource requirements (256MB RAM, 0.5 CPU)
- Can run on smallest Coolify instance
- No database costs
- Stateless - easy to stop/start as needed