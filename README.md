# 🇪🇺 VAT Validation API & MCP Server

[![Docker Image](https://github.com/jazib/check-vat-vies-mcp/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/jazib/check-vat-vies-mcp/actions/workflows/docker-publish.yml)
[![Tests](https://github.com/jazib/check-vat-vies-mcp/actions/workflows/test.yml/badge.svg)](https://github.com/jazib/check-vat-vies-mcp/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Complete VAT validation solution for EU businesses - REST API server with n8n integration and MCP support for Claude Desktop.

## 🚀 Quick Deploy Options

### Deploy to Coolify
[![Deploy to Coolify](https://img.shields.io/badge/Deploy%20to-Coolify-6B46C1?style=for-the-badge)](COOLIFY_DEPLOYMENT.md)

### Deploy with Docker
```bash
docker run -p 3000:3000 ghcr.io/jazib/check-vat-vies-mcp:latest
```

### Deploy to Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/deploy?template=https://github.com/jazib/check-vat-vies-mcp&envs=PORT&optionalEnvs=PORT&PORTDesc=Port+for+the+API+server&PORTDefault=3000)

### Deploy to Render
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/jazib/check-vat-vies-mcp)

## ✨ Features

- 🔍 **Real-time VAT Validation** - Validate EU VAT numbers using official VIES service
- 🤖 **REST API** - Simple HTTP endpoints for easy integration
- 🔗 **n8n Ready** - Pre-built workflows and examples
- 🖥️ **MCP Server** - Claude Desktop integration for AI-powered validation
- 🐳 **Docker Support** - Production-ready containerization
- 🌍 **All EU Countries** - Support for all 27 EU member states
- ⚡ **Auto-detection** - Automatically extract country code from VAT numbers
- 📊 **Health Monitoring** - Built-in health check and status endpoints

## 📦 Installation

### Option 1: Run the API Server

```bash
# Clone the repository
git clone https://github.com/jazib/check-vat-vies-mcp.git
cd check-vat-vies-mcp

# Install dependencies
npm install

# Build TypeScript
npm run build

# Start the API server
node api-server.js
```

### Option 2: Docker

```bash
# Using Docker Compose
docker-compose up

# Or build and run manually
docker build -f Dockerfile.api -t vat-api .
docker run -p 3000:3000 vat-api
```

### Option 3: Use Pre-built Docker Image

```bash
docker run -p 3000:3000 ghcr.io/jazib/check-vat-vies-mcp:latest
```

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/member-states` | GET | List all EU countries |
| `/api/validate` | POST | Validate with country code + number |
| `/api/validate/auto` | POST | Auto-detect and validate |
| `/api/status` | GET | Check VIES service status |

### Example Request

```bash
curl -X POST http://localhost:3000/api/validate/auto \
  -H "Content-Type: application/json" \
  -d '{"vat":"DE215891388"}'
```

### Example Response

```json
{
  "success": true,
  "input": "DE215891388",
  "processed": {
    "countryCode": "DE",
    "vatNumber": "215891388"
  },
  "data": {
    "countryCode": "DE",
    "vatNumber": "215891388",
    "isValid": true,
    "requestDate": "2025-09-26T18:00:00.000Z",
    "companyName": "Example GmbH",
    "companyAddress": "Berlin, Germany"
  }
}
```

## 🔧 n8n Integration

Ready-to-use n8n workflows for:
- Single VAT validation
- Batch processing from Google Sheets
- CRM integration with webhooks
- Scheduled VIES status monitoring

See [N8N_WORKFLOWS.md](N8N_WORKFLOWS.md) for complete examples.

## 🤖 MCP Server (Claude Desktop)

Add to your Claude Desktop config:

```json
{
  "mcpServers": {
    "vies-vat-checker": {
      "command": "node",
      "args": ["/path/to/check-vat-vies-mcp/dist/index.js"],
      "env": {},
      "description": "EU VAT validation"
    }
  }
}
```

## 🌍 Supported Countries

All 27 EU member states:
`AT` `BE` `BG` `CY` `CZ` `DE` `DK` `EE` `EL` `ES` `FI` `FR` `HR` `HU` `IE` `IT` `LT` `LU` `LV` `MT` `NL` `PL` `PT` `RO` `SE` `SI` `SK`

## 🔒 Environment Variables

```env
PORT=3000                  # API server port
NODE_ENV=production        # Node environment
RATE_LIMIT=60             # Requests per minute (optional)
ALLOWED_ORIGINS=*         # CORS configuration (optional)
API_KEY=secret            # API authentication (optional)
```

## 📚 Documentation

- [API Documentation](API_DOCUMENTATION.md) - Complete API reference
- [Coolify Deployment](COOLIFY_DEPLOYMENT.md) - Deploy to Coolify guide
- [n8n Workflows](N8N_WORKFLOWS.md) - Integration examples
- [Contributing](CONTRIBUTING.md) - How to contribute

## 🧪 Development

```bash
# Run in development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Build TypeScript
npm run build
```

## 🐳 Docker Hub

The Docker image is automatically built and published to GitHub Container Registry:

```bash
docker pull ghcr.io/jazib/check-vat-vies-mcp:latest
```

## 📄 License

MIT - see [LICENSE](LICENSE) file

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## 🐛 Issues

Found a bug? [Report it here](https://github.com/jazib/check-vat-vies-mcp/issues)

## ⭐ Support

If you find this project useful, please give it a star!

---

Made with ❤️ for the EU business community
