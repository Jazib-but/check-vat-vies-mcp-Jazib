
# MCP Server Technical Template & Blueprint

This document serves as a comprehensive technical template for developing Model Context Protocol (MCP) servers, based on analysis of a production-ready MCP server implementation.

## Technical Architecture Overview

### Core Technologies & Versions

**Runtime Environment:**
- **Node.js**: >=18.0.0 (ES2022 support)
- **Package Type**: ESM (ES Modules) - `"type": "module"` in package.json
- **TypeScript**: ^5.0.0 with strict mode enabled

**Core Dependencies:**
- **@modelcontextprotocol/sdk**: ^0.4.0 (Primary MCP framework)
- **axios**: ^1.6.0 (HTTP client for external APIs)
- **zod**: ^3.22.0 (Runtime type validation and schema definition)

**Development Dependencies:**
- **@types/node**: ^20.0.0
- **typescript**: ^5.0.0
- **eslint**: ^8.0.0 + @typescript-eslint plugins
- **jest**: ^29.0.0 (Testing framework)

## Project Structure Template

```
mcp-server-project/
├── src/                          # Source code
│   ├── index.ts                  # Main MCP server entry point
│   ├── client.ts                 # External API client (if needed)
│   ├── schemas.ts                # Zod validation schemas
│   ├── types.ts                  # TypeScript type definitions
│   └── __tests__/                # Unit tests
│       └── *.test.ts
├── dist/                         # Compiled JavaScript output
├── examples/                     # Configuration examples
│   ├── claude-desktop-config.json
│   ├── augment-config.json
│   └── docker-compose.yml
├── scripts/                      # Utility scripts
│   ├── setup.sh                  # Project setup script
│   └── test-server.js            # Server testing script
├── docs/                         # Documentation
│   ├── API.md
│   └── EXAMPLES.md
├── package.json                  # NPM configuration
├── tsconfig.json                 # TypeScript configuration
├── jest.config.js                # Jest testing configuration
├── .eslintrc.json               # ESLint configuration
├── .gitignore                   # Git ignore rules
├── .dockerignore                # Docker ignore rules
├── Dockerfile                   # Docker containerization
├── README.md                    # Project documentation
├── LICENSE                      # License file
├── SECURITY.md                  # Security policy
├── CONTRIBUTING.md              # Contribution guidelines
└── CHANGELOG.md                 # Version history
```

## Configuration Files Template

### package.json Structure
```json
{
  "name": "your-mcp-server",
  "version": "1.0.0",
  "description": "MCP server description",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "start": "node dist/index.js",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix"
  },
  "keywords": ["mcp", "server", "api"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.4.0",
    "axios": "^1.6.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "jest": "^29.0.0",
    "typescript": "^5.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### tsconfig.json Template
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### jest.config.js Template
```javascript
export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};
```

### .eslintrc.json Template
```json
{
  "env": {
    "es2022": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

## MCP Server Implementation Patterns

### 1. Main Server Class Structure
```typescript
#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

class YourMCPServer {
  private server: Server;
  private apiClient: YourAPIClient; // External API client if needed

  constructor() {
    this.server = new Server({
      name: 'your-mcp-server',
      version: '1.0.0',
    });

    this.apiClient = new YourAPIClient();
    this.setupToolHandlers();
  }

  private setupToolHandlers(): void {
    // Tool listing handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // Define your tools here
        ],
      };
    });

    // Tool execution handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      // Handle tool calls here
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP server running on stdio');
  }
}

const server = new YourMCPServer();
server.run().catch(console.error);
```

### 2. Tool Definition Pattern
```typescript
// In ListToolsRequestSchema handler
{
  name: 'tool_name',
  description: 'Tool description (support bilingual descriptions)',
  inputSchema: {
    type: 'object',
    properties: {
      param1: {
        type: 'string',
        description: 'Parameter description',
      },
      param2: {
        type: 'boolean',
        description: 'Boolean parameter',
        default: false,
      },
    },
    required: ['param1'], // Specify required parameters
  },
}
```

### 3. Error Handling Pattern
```typescript
// In CallToolRequestSchema handler
try {
  switch (name) {
    case 'your_tool': {
      const params = yourParamsSchema.parse(args); // Zod validation
      const result = await this.apiClient.callMethod(params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  return {
    content: [
      {
        type: 'text',
        text: `Error: ${errorMessage}`,
      },
    ],
    isError: true,
  };
}
```

### 4. Schema Definition Pattern (schemas.ts)
```typescript
import { z } from 'zod';

// Input validation schemas
export const toolParamsSchema = z.object({
  requiredParam: z.string(),
  optionalParam: z.string().optional(),
  dateParam: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  booleanParam: z.boolean().optional(),
});

// API response schemas for validation
export const apiResponseSchema = z.object({
  data: z.array(z.object({
    id: z.number(),
    name: z.string(),
    // Define your API response structure
  })),
  metadata: z.object({
    total: z.number(),
    page: z.number().optional(),
  }),
});

// Export types
export type ToolParams = z.infer<typeof toolParamsSchema>;
export type ApiResponse = z.infer<typeof apiResponseSchema>;
```

### 5. External API Client Pattern (client.ts)
```typescript
import axios, { AxiosInstance } from 'axios';
import { ToolParams, ApiResponse, apiResponseSchema } from './schemas.js';

export class YourAPIClient {
  private client: AxiosInstance;
  private readonly baseURL = 'https://api.example.com/v1';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Your-MCP-Server/1.0.0',
      },
    });

    // Error interceptor for logging
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
        });
        throw error;
      }
    );
  }

  async callMethod(params: ToolParams): Promise<ApiResponse> {
    // Input validation
    const hasRequiredParam = Object.values(params).some(value =>
      value !== undefined && value !== ''
    );
    if (!hasRequiredParam) {
      throw new Error('At least one parameter must be provided');
    }

    // Clean undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined)
    );

    try {
      const response = await this.client.get('/endpoint', {
        params: cleanParams,
      });

      // Validate response with Zod
      return apiResponseSchema.parse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`API request failed: ${error.message}`);
      }
      throw error;
    }
  }
}
```

## Development Workflow & Build System

### Build Scripts
- **`npm run build`**: Compile TypeScript to JavaScript
- **`npm run dev`**: Watch mode for development
- **`npm run start`**: Run the compiled server
- **`npm run test`**: Execute unit tests
- **`npm run lint`**: Code quality checks
- **`npm run lint:fix`**: Auto-fix linting issues

### Testing Strategy
- **Unit Tests**: Jest with TypeScript support
- **ESM Configuration**: Proper ES modules setup for Jest
- **Coverage Reports**: HTML, LCOV, and text formats
- **Test Structure**: `__tests__` directories alongside source files

### Code Quality Tools
- **ESLint**: TypeScript-aware linting with strict rules
- **TypeScript**: Strict mode with comprehensive type checking
- **Prettier Integration**: Code formatting (optional but recommended)

## Configuration Examples

### Claude Desktop Configuration
```json
{
  "mcpServers": {
    "your-server": {
      "command": "node",
      "args": ["/absolute/path/to/your-server/dist/index.js"],
      "env": {},
      "description": "Your MCP Server Description"
    }
  }
}
```

### Augment Configuration
```json
{
  "mcpServers": {
    "your-server": {
      "command": "node",
      "args": ["./dist/index.js"],
      "cwd": "/path/to/your-server",
      "env": {},
      "description": "Your MCP Server Description"
    }
  }
}
```

## Docker Support Template

### Dockerfile
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('Health check')" || exit 1

CMD ["node", "dist/index.js"]
```

## Best Practices Summary

### Code Organization
- **Separation of Concerns**: Separate server logic, API clients, schemas, and types
- **Type Safety**: Use TypeScript strict mode and Zod for runtime validation
- **Error Handling**: Comprehensive error handling with meaningful messages
- **Modular Design**: Clear module boundaries and dependencies

### Configuration Management
- **Environment Variables**: Use for sensitive configuration
- **Example Configurations**: Provide working examples for different platforms
- **Documentation**: Clear setup and configuration instructions

### Development Practices
- **Testing**: Comprehensive unit test coverage
- **Linting**: Consistent code style and quality
- **Documentation**: Bilingual support when applicable
- **Version Control**: Proper .gitignore and repository structure

### Deployment Considerations
- **Docker Support**: Multi-stage builds for production
- **CI/CD Integration**: Automated testing and building
- **Security**: Non-root user, dependency scanning
- **Monitoring**: Health checks and logging

This template provides a solid foundation for building production-ready MCP servers with modern TypeScript, comprehensive testing, and proper development workflows.
```

