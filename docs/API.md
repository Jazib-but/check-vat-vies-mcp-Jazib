# VIES VAT Checker MCP Server API Documentation

## Overview

This MCP server provides tools for validating EU VAT numbers using the official VIES (VAT Information Exchange System) REST API.

## Available Tools

### 1. check_vat_number

Validates a real EU VAT number using the VIES service.

**Parameters:**
- `countryCode` (string, required): EU member state code (e.g., "SK", "CZ", "DE")
- `vatNumber` (string, required): VAT number without country prefix (1-20 characters)

**Example:**
```json
{
  "countryCode": "SK",
  "vatNumber": "2020000000"
}
```

**Response:**
Returns formatted text with validation result including:
- Country code and VAT number
- Validation status (valid/invalid)
- Company name and address (if available)
- Request timestamp
- Information about VAT number preprocessing (if applied)

### 2. check_vat_test_service

Tests the VIES service integration using predefined test VAT numbers.

**Parameters:**
- `countryCode` (string, required): EU member state code
- `vatNumber` (string, required): Test VAT number ("100" for valid, "200" for invalid)

**Example:**
```json
{
  "countryCode": "SK",
  "vatNumber": "100"
}
```

**Response:**
Similar to `check_vat_number` but marked as test result.

### 3. check_vies_status

Checks the current status of the VIES service and individual member states.

**Parameters:** None

**Response:**
Returns formatted text with:
- Overall VIES service availability
- Status of each EU member state service
- Last check timestamp

### 4. list_eu_member_states

Lists all supported EU member state codes with country names in Slovak and English.

**Parameters:** None

**Response:**
Returns formatted list of all EU member states with their codes and names.

## Supported EU Member States

AT (Austria), BE (Belgium), BG (Bulgaria), CY (Cyprus), CZ (Czech Republic), DE (Germany), DK (Denmark), EE (Estonia), EL (Greece), ES (Spain), FI (Finland), FR (France), HR (Croatia), HU (Hungary), IE (Ireland), IT (Italy), LT (Lithuania), LU (Luxembourg), LV (Latvia), MT (Malta), NL (Netherlands), PL (Poland), PT (Portugal), RO (Romania), SE (Sweden), SI (Slovenia), SK (Slovakia)

## Error Handling

The server provides comprehensive error handling:
- Input validation using Zod schemas
- Network error handling with meaningful messages
- VIES API error parsing and reporting
- Bilingual error messages (Slovak/English)

## Rate Limiting

The VIES service has rate limiting. For production use, implement appropriate request throttling.

## Security

- No authentication required for VIES API
- All requests are made over HTTPS
- No sensitive data is stored or logged

## Dependencies

- VIES REST API: `https://ec.europa.eu/taxation_customs/vies/rest-api`
- Official documentation: [VIES Swagger](https://ec.europa.eu/taxation_customs/vies/swagger_publicVAT.yaml)
