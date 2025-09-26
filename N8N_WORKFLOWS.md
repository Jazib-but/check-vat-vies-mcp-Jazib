# n8n Integration Guide for VAT Validation API

## Prerequisites
- VAT Validation API deployed and accessible
- n8n instance running
- API endpoint URL (e.g., `https://vat-api.yourdomain.com`)

## Workflow Examples

### 1. Basic VAT Validation Workflow

```json
{
  "name": "VAT Validation Basic",
  "nodes": [
    {
      "name": "Start",
      "type": "n8n-nodes-base.start",
      "position": [250, 300]
    },
    {
      "name": "HTTP Request - Validate VAT",
      "type": "n8n-nodes-base.httpRequest",
      "position": [450, 300],
      "parameters": {
        "method": "POST",
        "url": "https://vat-api.yourdomain.com/api/validate/auto",
        "responseFormat": "json",
        "jsonParameters": true,
        "options": {},
        "bodyParametersJson": {
          "vat": "={{$json.vatNumber}}"
        }
      }
    },
    {
      "name": "IF Valid",
      "type": "n8n-nodes-base.if",
      "position": [650, 300],
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "={{$json.data.isValid}}",
              "value2": true
            }
          ]
        }
      }
    }
  ]
}
```

### 2. Batch VAT Validation from Google Sheets

```json
{
  "name": "Batch VAT Validation",
  "nodes": [
    {
      "name": "Google Sheets - Read",
      "type": "n8n-nodes-base.googleSheets",
      "position": [250, 300],
      "parameters": {
        "operation": "read",
        "sheetId": "your-sheet-id",
        "range": "A2:B100"
      }
    },
    {
      "name": "Loop Over Items",
      "type": "n8n-nodes-base.splitInBatches",
      "position": [450, 300],
      "parameters": {
        "batchSize": 1
      }
    },
    {
      "name": "Validate VAT",
      "type": "n8n-nodes-base.httpRequest",
      "position": [650, 300],
      "parameters": {
        "method": "POST",
        "url": "https://vat-api.yourdomain.com/api/validate/auto",
        "responseFormat": "json",
        "jsonParameters": true,
        "bodyParametersJson": {
          "vat": "={{$json.vatNumber}}"
        }
      }
    },
    {
      "name": "Set Validation Result",
      "type": "n8n-nodes-base.set",
      "position": [850, 300],
      "parameters": {
        "values": {
          "string": [
            {
              "name": "companyName",
              "value": "={{$json.data.companyName || 'Not found'}}"
            },
            {
              "name": "isValid",
              "value": "={{$json.data.isValid ? 'Valid' : 'Invalid'}}"
            },
            {
              "name": "vatNumber",
              "value": "={{$json.data.countryCode}}{{$json.data.vatNumber}}"
            }
          ]
        }
      }
    },
    {
      "name": "Google Sheets - Update",
      "type": "n8n-nodes-base.googleSheets",
      "position": [1050, 300],
      "parameters": {
        "operation": "update",
        "sheetId": "your-sheet-id",
        "range": "C{{$item(0).$index + 2}}:E{{$item(0).$index + 2}}",
        "data": "={{[$json.isValid, $json.companyName, $json.vatNumber]}}"
      }
    }
  ]
}
```

### 3. CRM Integration with VAT Validation

```json
{
  "name": "CRM VAT Validation",
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300],
      "webhookId": "vat-validation-webhook",
      "parameters": {
        "path": "validate-company",
        "method": "POST"
      }
    },
    {
      "name": "Extract VAT",
      "type": "n8n-nodes-base.set",
      "position": [450, 300],
      "parameters": {
        "values": {
          "string": [
            {
              "name": "vatNumber",
              "value": "={{$json.body.vatNumber}}"
            },
            {
              "name": "companyId",
              "value": "={{$json.body.companyId}}"
            }
          ]
        }
      }
    },
    {
      "name": "Validate VAT",
      "type": "n8n-nodes-base.httpRequest",
      "position": [650, 300],
      "parameters": {
        "method": "POST",
        "url": "https://vat-api.yourdomain.com/api/validate/auto",
        "responseFormat": "json",
        "bodyParametersJson": {
          "vat": "={{$json.vatNumber}}"
        }
      }
    },
    {
      "name": "Update CRM",
      "type": "n8n-nodes-base.httpRequest",
      "position": [850, 300],
      "parameters": {
        "method": "PATCH",
        "url": "https://your-crm.com/api/companies/{{$json.companyId}}",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "bodyParametersJson": {
          "vat_valid": "={{$json.data.isValid}}",
          "vat_number": "={{$json.data.countryCode}}{{$json.data.vatNumber}}",
          "vat_company_name": "={{$json.data.companyName}}",
          "vat_company_address": "={{$json.data.companyAddress}}",
          "vat_check_date": "={{$json.data.requestDate}}"
        }
      }
    },
    {
      "name": "Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "position": [1050, 300],
      "parameters": {
        "respondWith": "json",
        "responseBody": {
          "success": true,
          "vatValid": "={{$json.data.isValid}}",
          "companyName": "={{$json.data.companyName}}"
        }
      }
    }
  ]
}
```

### 4. Scheduled VAT Status Check

```json
{
  "name": "Daily VAT Service Status Check",
  "nodes": [
    {
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "position": [250, 300],
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "hours",
              "hoursInterval": 24,
              "triggerAtHour": 9
            }
          ]
        }
      }
    },
    {
      "name": "Check VIES Status",
      "type": "n8n-nodes-base.httpRequest",
      "position": [450, 300],
      "parameters": {
        "method": "GET",
        "url": "https://vat-api.yourdomain.com/api/status",
        "responseFormat": "json"
      }
    },
    {
      "name": "IF Service Down",
      "type": "n8n-nodes-base.if",
      "position": [650, 300],
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "={{$json.data.isAvailable}}",
              "value2": false
            }
          ]
        }
      }
    },
    {
      "name": "Send Alert Email",
      "type": "n8n-nodes-base.emailSend",
      "position": [850, 200],
      "parameters": {
        "fromEmail": "alerts@yourdomain.com",
        "toEmail": "admin@yourdomain.com",
        "subject": "VIES Service Unavailable",
        "text": "The VIES VAT validation service is currently unavailable.\n\nLast checked: {{$json.data.lastChecked}}\n\nPlease check manually or wait for the service to recover."
      }
    },
    {
      "name": "Log Success",
      "type": "n8n-nodes-base.noOp",
      "position": [850, 400],
      "parameters": {}
    }
  ]
}
```

## n8n HTTP Request Node Configuration

### Basic Configuration:
```javascript
{
  "method": "POST",
  "url": "https://vat-api.yourdomain.com/api/validate/auto",
  "authentication": "none",  // or "genericCredentialType" if using API key
  "responseFormat": "json",
  "jsonParameters": true,
  "headers": {
    "Content-Type": "application/json"
    // "X-API-Key": "your-api-key"  // if authentication is enabled
  },
  "bodyParametersJson": {
    "vat": "={{$json.vatNumber}}"  // or use expression
  }
}
```

### With Error Handling:
```javascript
{
  "continueOnFail": true,
  "alwaysOutputData": true,
  "timeout": 10000,
  "retry": {
    "maxTries": 3,
    "waitBetweenTries": 1000
  }
}
```

## Expression Examples for n8n

### Extract Country Code:
```javascript
// From full VAT number
={{$json.vatNumber.substring(0, 2)}}
```

### Format VAT Response:
```javascript
// Create formatted message
={{$json.data.isValid ? '✅ Valid VAT: ' + $json.data.companyName : '❌ Invalid VAT Number'}}
```

### Conditional Company Data:
```javascript
// Use company name or default
={{$json.data.companyName || 'Company name not available'}}
```

## Function Node Examples

### 1. Batch Processing with Rate Limiting:
```javascript
// In a Function node
const vatNumbers = $input.all();
const results = [];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

for (const item of vatNumbers) {
  // Add 1 second delay between requests
  await delay(1000);

  const response = await $http.request({
    method: 'POST',
    url: 'https://vat-api.yourdomain.com/api/validate/auto',
    body: {
      vat: item.json.vatNumber
    },
    returnFullResponse: true
  });

  results.push({
    original: item.json.vatNumber,
    ...response.body.data
  });
}

return results;
```

### 2. Parse and Validate Multiple Formats:
```javascript
// Handle different VAT formats
const vatInput = $input.first().json.vat;
let cleanVat = vatInput
  .toUpperCase()
  .replace(/[^A-Z0-9]/g, ''); // Remove special characters

// Add country code if missing
if (!/^[A-Z]{2}/.test(cleanVat)) {
  cleanVat = 'DE' + cleanVat; // Default to DE
}

return [{
  json: {
    originalInput: vatInput,
    cleanedVat: cleanVat
  }
}];
```

## Error Handling

### IF Node for Validation Errors:
```javascript
// Check if request failed
{
  "conditions": {
    "boolean": [
      {
        "value1": "={{$json.success}}",
        "value2": false
      }
    ]
  }
}
```

### Switch Node for Different Statuses:
```javascript
{
  "dataType": "string",
  "value1": "={{$json.error}}",
  "rules": [
    {
      "value2": "Validation error",
      "output": 0
    },
    {
      "value2": "VIES API error",
      "output": 1
    },
    {
      "value2": "Service unavailable",
      "output": 2
    }
  ],
  "fallbackOutput": 3
}
```

## Tips for n8n Integration

1. **Use Webhook Nodes** for real-time validation triggers
2. **Implement Caching** with Set/Get nodes to avoid repeated API calls
3. **Add Rate Limiting** with Wait nodes (minimum 1 second between calls)
4. **Log Results** to a database for audit trails
5. **Set Up Alerts** for invalid VAT numbers or API failures
6. **Use Split In Batches** node for processing large datasets
7. **Enable "Continue On Fail"** for batch processing
8. **Use Function Items** node for complex data transformations

## Troubleshooting

### Common Issues:

1. **Connection Timeout**:
   - Increase timeout in HTTP Request node settings
   - Check if API is accessible from n8n server

2. **CORS Errors** (if calling from browser):
   - Ensure CORS is configured in API
   - Use n8n's HTTP Request node instead of Code node

3. **Rate Limiting**:
   - Add Wait nodes between requests
   - Implement exponential backoff in Function nodes

4. **Invalid JSON Response**:
   - Check API health endpoint first
   - Verify response format matches expected structure