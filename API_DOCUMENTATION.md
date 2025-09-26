# VAT Validation API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
No authentication required for public endpoints.

## Endpoints

### 1. Health Check
Check if the API server is running.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok",
  "service": "VAT Validation API",
  "timestamp": "2025-09-26T18:00:00.000Z"
}
```

### 2. List EU Member States
Get a list of all EU member states that support VAT validation.

**Endpoint:** `GET /api/member-states`

**Response:**
```json
{
  "memberStates": [
    {
      "code": "DE",
      "name": "Germany"
    },
    {
      "code": "FR",
      "name": "France"
    }
    // ... more countries
  ]
}
```

### 3. Validate VAT Number
Validate a VAT number with explicit country code.

**Endpoint:** `POST /api/validate`

**Request Body:**
```json
{
  "countryCode": "DE",
  "vatNumber": "123456789"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "countryCode": "DE",
    "vatNumber": "123456789",
    "isValid": false,
    "requestDate": "2025-09-26T18:00:00.000Z",
    "companyName": null,
    "companyAddress": null
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "message": "Invalid EU member state code",
      "path": ["countryCode"]
    }
  ]
}
```

### 4. Auto-Validate VAT Number
Automatically detect country code and validate VAT number.

**Endpoint:** `POST /api/validate/auto`

**Request Body:**
```json
{
  "vat": "DE123456789"
}
```

Or with spaces/formatting:
```json
{
  "vat": "DE 123 456 789"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "input": "DE123456789",
  "processed": {
    "countryCode": "DE",
    "vatNumber": "123456789"
  },
  "data": {
    "countryCode": "DE",
    "vatNumber": "123456789",
    "isValid": false,
    "requestDate": "2025-09-26T18:00:00.000Z",
    "companyName": null,
    "companyAddress": null
  }
}
```

### 5. Check VIES Service Status
Check if the VIES service is available.

**Endpoint:** `GET /api/status`

**Response:**
```json
{
  "success": true,
  "data": {
    "isAvailable": true,
    "lastChecked": "2025-09-26T18:00:00.000Z",
    "memberStates": [
      {
        "countryCode": "DE",
        "availability": "AVAILABLE"
      }
      // ... more states
    ]
  }
}
```

## Error Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Endpoint doesn't exist |
| 500 | Internal Server Error |
| 503 | Service Unavailable - VIES service is down |

## Example Usage

### Using cURL

```bash
# Check VAT number with explicit country
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{"countryCode":"DE","vatNumber":"123456789"}'

# Auto-validate with full VAT number
curl -X POST http://localhost:3000/api/validate/auto \
  -H "Content-Type: application/json" \
  -d '{"vat":"DE123456789"}'

# Get member states
curl http://localhost:3000/api/member-states

# Check service status
curl http://localhost:3000/api/status
```

### Using JavaScript (fetch)

```javascript
// Validate VAT number
const response = await fetch('http://localhost:3000/api/validate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    countryCode: 'DE',
    vatNumber: '123456789'
  })
});

const result = await response.json();
console.log('Is Valid:', result.data.isValid);
```

### Using Python (requests)

```python
import requests

# Auto-validate VAT
response = requests.post(
    'http://localhost:3000/api/validate/auto',
    json={'vat': 'DE123456789'}
)

result = response.json()
print(f"Valid: {result['data']['isValid']}")
```

## Rate Limiting
The VIES service may impose rate limiting. Please implement appropriate caching and rate limiting in production environments.

## Environment Variables

Create a `.env` file to configure:

```env
PORT=3000  # API server port (default: 3000)
```

## Running the Server

```bash
# Start the API server
node api-server.js

# Or with a custom port
PORT=8080 node api-server.js
```