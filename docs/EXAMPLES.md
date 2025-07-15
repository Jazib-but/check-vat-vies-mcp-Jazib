# VIES VAT Checker MCP Server - Examples

## Basic Usage Examples

### 1. Validating a Slovak VAT Number

```json
{
  "tool": "check_vat_number",
  "arguments": {
    "countryCode": "SK",
    "vatNumber": "2020000000"
  }
}
```

**Expected Response:**
```
VAT Validation Result / Výsledok validácie IČ DPH:

Country Code / Kód krajiny: SK
VAT Number / IČ DPH: 2020000000
Valid / Platné: YES / ÁNO
Request Date / Dátum požiadavky: 2024-01-15T10:30:00Z
Company Name / Názov spoločnosti: Example Company s.r.o.
Company Address / Adresa spoločnosti: Bratislava, Slovakia
```

### 2. Testing Service Integration

```json
{
  "tool": "check_vat_test_service",
  "arguments": {
    "countryCode": "DE",
    "vatNumber": "100"
  }
}
```

**Expected Response:**
```
[TEST] VAT Test Service Result / Výsledok testovej služby IČ DPH:

Country Code / Kód krajiny: DE
VAT Number / IČ DPH: 100
Valid / Platné: YES / ÁNO
Request Date / Dátum požiadavky: 2024-01-15T10:30:00Z
```

### 3. Checking Service Status

```json
{
  "tool": "check_vies_status",
  "arguments": {}
}
```

**Expected Response:**
```
VIES Service Status / Stav služby VIES:

Overall Status / Celkový stav: AVAILABLE / DOSTUPNÁ
Last Checked / Posledná kontrola: 2024-01-15T10:30:00Z

Member States Status / Stav členských štátov:
AT: AVAILABLE / DOSTUPNÁ
BE: AVAILABLE / DOSTUPNÁ
BG: UNAVAILABLE / NEDOSTUPNÁ
...
```

### 4. Listing EU Member States

```json
{
  "tool": "list_eu_member_states",
  "arguments": {}
}
```

**Expected Response:**
```
EU Member States for VAT Validation / Členské štáty EÚ pre validáciu IČ DPH:

AT: Austria / Rakúsko
BE: Belgium / Belgicko
BG: Bulgaria / Bulharsko
CY: Cyprus / Cyprus
CZ: Czech Republic / Česká republika
DE: Germany / Nemecko
...
```

## Common Use Cases

### Validating Multiple VAT Numbers

```javascript
// Example of validating multiple VAT numbers
const vatNumbers = [
  { countryCode: "SK", vatNumber: "2020000000" },
  { countryCode: "CZ", vatNumber: "12345678" },
  { countryCode: "DE", vatNumber: "123456789" }
];

for (const vat of vatNumbers) {
  // Call check_vat_number for each
}
```

### Error Handling Examples

**Invalid Country Code:**
```json
{
  "tool": "check_vat_number",
  "arguments": {
    "countryCode": "XX",
    "vatNumber": "123456789"
  }
}
```

**Response:**
```
Error / Chyba: Invalid EU member state code
```

**Invalid VAT Number Format:**
```json
{
  "tool": "check_vat_number",
  "arguments": {
    "countryCode": "SK",
    "vatNumber": ""
  }
}
```

**Response:**
```
Error / Chyba: VAT number is required
```

## Integration Examples

### Claude Desktop Configuration

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "vies-vat-checker": {
      "command": "node",
      "args": ["/path/to/check-vat-vies-mcp/dist/index.js"],
      "env": {},
      "description": "EU VAT number validation using VIES service"
    }
  }
}
```

### Augment Configuration

Add to your Augment configuration:

```json
{
  "mcpServers": {
    "vies-vat-checker": {
      "command": "node",
      "args": ["./dist/index.js"],
      "cwd": "/path/to/check-vat-vies-mcp",
      "env": {},
      "description": "EU VAT number validation using VIES service"
    }
  }
}
```

## Testing the Server

Run the test script to verify functionality:

```bash
node scripts/test-server.js
```

This will test all available tools and verify the server is working correctly.
