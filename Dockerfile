# Dockerfile for VAT Validation API Server
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install ALL dependencies (including devDependencies for building)
RUN npm ci

# Copy source files
COPY src ./src
COPY api-server.js ./

# Build TypeScript
RUN npm run build

# Remove devDependencies after build
RUN npm prune --production

# Create .env file placeholder
RUN touch .env

# Expose port (default 3000, can be overridden)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3000) + '/health', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})" || exit 1

# Start the API server
CMD ["node", "api-server.js"]