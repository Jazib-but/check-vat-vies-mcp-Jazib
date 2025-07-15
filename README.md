# VIES VAT Checker MCP Server

MCP server pre overenie platnosti IČ DPH v členských štátoch Európskej únie pomocou služby VIES (VAT Information Exchange System).

## Funkcie / Features

- **Validácia IČ DPH** - Overenie platnosti IČ DPH v reálnom čase
- **Testovacia služba** - Testovanie integrácie pomocou testovacích IČ DPH
- **Kontrola stavu** - Monitoring dostupnosti služby VIES a jednotlivých členských štátov
- **Viacjazyčná podpora** - Slovenčina a angličtina
- **Predspracovanie** - Automatické opravy bežných chýb v IČ DPH

## Inštalácia / Installation

```bash
# Klonujte repozitár
git clone <repository-url>
cd check-vat-vies-mcp

# Nainštalujte závislosti
npm install

# Skompilujte TypeScript
npm run build
```

## Konfigurácia / Configuration

### Claude Desktop

Pridajte do `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "vies-vat-checker": {
      "command": "node",
      "args": ["/absolute/path/to/check-vat-vies-mcp/dist/index.js"],
      "env": {},
      "description": "EU VAT number validation using VIES service"
    }
  }
}
```

### Augment

Pridajte do konfigurácie:

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

## Použitie / Usage

### Dostupné nástroje / Available Tools

1. **check_vat_number** - Validácia IČ DPH
   - `countryCode`: Kód členského štátu EÚ (napr. SK, CZ, DE)
   - `vatNumber`: IČ DPH bez predpony krajiny

2. **check_vat_test_service** - Testovacia služba
   - `countryCode`: Kód členského štátu EÚ
   - `vatNumber`: Testové IČ DPH (100 = platné, 200 = neplatné)

3. **check_vies_status** - Kontrola stavu služby
   - Žiadne parametre

4. **list_eu_member_states** - Zoznam členských štátov EÚ
   - Žiadne parametre

### Príklady / Examples

```typescript
// Validácia slovenského IČ DPH
{
  "countryCode": "SK",
  "vatNumber": "2020000000"
}

// Test služby
{
  "countryCode": "SK", 
  "vatNumber": "100"
}
```

## Podporované krajiny / Supported Countries

AT, BE, BG, CY, CZ, DE, DK, EE, EL, ES, FI, FR, HR, HU, IE, IT, LT, LU, LV, MT, NL, PL, PT, RO, SE, SI, SK

## Vývoj / Development

```bash
# Vývojový režim s watch
npm run dev

# Spustenie testov
npm run test

# Linting
npm run lint
npm run lint:fix
```

## API Dokumentácia

Server používa oficiálne VIES REST API:
- Base URL: `https://ec.europa.eu/taxation_customs/vies/rest-api`
- Dokumentácia: [VIES REST API](https://ec.europa.eu/taxation_customs/vies/swagger_publicVAT.yaml)

## Licencia / License

MIT
