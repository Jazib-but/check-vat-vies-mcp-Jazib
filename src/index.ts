#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { ViesApiClient } from './client.js';
import {
  checkVatNumberSchema,
  checkVatTestSchema,
  EU_MEMBER_STATES,
} from './schemas.js';

class ViesMCPServer {
  private server: Server;
  private viesClient: ViesApiClient;

  constructor() {
    this.server = new Server({
      name: 'vies-vat-checker',
      version: '1.0.0',
    });

    this.viesClient = new ViesApiClient();
    this.setupToolHandlers();
  }

  private setupToolHandlers(): void {
    // Tool listing handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'check_vat_number',
            description: 'Validate EU VAT number using VIES service / Overiť IČ DPH v EÚ pomocou služby VIES',
            inputSchema: {
              type: 'object',
              properties: {
                countryCode: {
                  type: 'string',
                  enum: [...EU_MEMBER_STATES],
                  description: 'EU member state code (e.g., SK, CZ, DE) / Kód členského štátu EÚ',
                },
                vatNumber: {
                  type: 'string',
                  description: 'VAT number without country prefix / IČ DPH bez predpony krajiny',
                  minLength: 1,
                  maxLength: 20,
                },
              },
              required: ['countryCode', 'vatNumber'],
            },
          },
          {
            name: 'check_vat_test_service',
            description: 'Test VIES service integration with test VAT numbers / Testovať integráciu so službou VIES',
            inputSchema: {
              type: 'object',
              properties: {
                countryCode: {
                  type: 'string',
                  enum: [...EU_MEMBER_STATES],
                  description: 'EU member state code / Kód členského štátu EÚ',
                },
                vatNumber: {
                  type: 'string',
                  enum: ['100', '200'],
                  description: 'Test VAT number: 100 (valid), 200 (invalid) / Testové IČ DPH: 100 (platné), 200 (neplatné)',
                },
              },
              required: ['countryCode', 'vatNumber'],
            },
          },
          {
            name: 'check_vies_status',
            description: 'Check VIES service status and member state availability / Skontrolovať stav služby VIES a dostupnosť členských štátov',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'list_eu_member_states',
            description: 'List all EU member state codes for VAT validation / Zobraziť všetky kódy členských štátov EÚ pre validáciu IČ DPH',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ],
      };
    });

    // Tool execution handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'check_vat_number': {
            const params = checkVatNumberSchema.parse(args);
            const result = await this.viesClient.checkVatNumber(params);
            
            const responseText = this.formatVatValidationResult(result);
            
            return {
              content: [
                {
                  type: 'text',
                  text: responseText,
                },
              ],
            };
          }

          case 'check_vat_test_service': {
            const params = checkVatTestSchema.parse(args);
            const result = await this.viesClient.checkVatTestService(params);
            
            const responseText = this.formatVatValidationResult(result, true);
            
            return {
              content: [
                {
                  type: 'text',
                  text: responseText,
                },
              ],
            };
          }

          case 'check_vies_status': {
            const result = await this.viesClient.checkStatus();
            
            const responseText = this.formatStatusResult(result);
            
            return {
              content: [
                {
                  type: 'text',
                  text: responseText,
                },
              ],
            };
          }

          case 'list_eu_member_states': {
            const memberStates = EU_MEMBER_STATES.map(code => {
              const countryNames: Record<string, string> = {
                'AT': 'Austria / Rakúsko',
                'BE': 'Belgium / Belgicko',
                'BG': 'Bulgaria / Bulharsko',
                'CY': 'Cyprus / Cyprus',
                'CZ': 'Czech Republic / Česká republika',
                'DE': 'Germany / Nemecko',
                'DK': 'Denmark / Dánsko',
                'EE': 'Estonia / Estónsko',
                'EL': 'Greece / Grécko',
                'ES': 'Spain / Španielsko',
                'FI': 'Finland / Fínsko',
                'FR': 'France / Francúzsko',
                'HR': 'Croatia / Chorvátsko',
                'HU': 'Hungary / Maďarsko',
                'IE': 'Ireland / Írsko',
                'IT': 'Italy / Taliansko',
                'LT': 'Lithuania / Litva',
                'LU': 'Luxembourg / Luxembursko',
                'LV': 'Latvia / Lotyšsko',
                'MT': 'Malta / Malta',
                'NL': 'Netherlands / Holandsko',
                'PL': 'Poland / Poľsko',
                'PT': 'Portugal / Portugalsko',
                'RO': 'Romania / Rumunsko',
                'SE': 'Sweden / Švédsko',
                'SI': 'Slovenia / Slovinsko',
                'SK': 'Slovakia / Slovensko',
              };
              return `${code}: ${countryNames[code] || code}`;
            });

            return {
              content: [
                {
                  type: 'text',
                  text: `EU Member States for VAT Validation / Členské štáty EÚ pre validáciu IČ DPH:\n\n${memberStates.join('\n')}`,
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
          content: [
            {
              type: 'text',
              text: `Error / Chyba: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private formatVatValidationResult(result: any, isTest = false): string {
    const testPrefix = isTest ? '[TEST] ' : '';
    const header = isTest
      ? `${testPrefix}VAT Test Service Result / Výsledok testovej služby IČ DPH:`
      : `${testPrefix}VAT Validation Result / Výsledok validácie IČ DPH:`;

    let response = `${header}\n\n`;
    response += `Country Code / Kód krajiny: ${result.countryCode}\n`;
    response += `VAT Number / IČ DPH: ${result.vatNumber}\n`;
    response += `Valid / Platné: ${result.isValid ? 'YES / ÁNO' : 'NO / NIE'}\n`;
    response += `Request Date / Dátum požiadavky: ${result.requestDate}\n`;

    if (result.companyName) {
      response += `Company Name / Názov spoločnosti: ${result.companyName}\n`;
    }

    if (result.companyAddress) {
      response += `Company Address / Adresa spoločnosti: ${result.companyAddress}\n`;
    }

    if (result.wasPreprocessed && result.originalVatNumber) {
      response += `\nNote / Poznámka: VAT number was preprocessed / IČ DPH bolo predspracované\n`;
      response += `Original VAT Number / Pôvodné IČ DPH: ${result.originalVatNumber}\n`;
      if (result.originalCountryCode) {
        response += `Original Country Code / Pôvodný kód krajiny: ${result.originalCountryCode}\n`;
      }
    }

    return response;
  }

  private formatStatusResult(result: any): string {
    let response = `VIES Service Status / Stav služby VIES:\n\n`;
    response += `Overall Status / Celkový stav: ${result.isAvailable ? 'AVAILABLE / DOSTUPNÁ' : 'UNAVAILABLE / NEDOSTUPNÁ'}\n`;
    response += `Last Checked / Posledná kontrola: ${result.lastChecked}\n\n`;
    response += `Member States Status / Stav členských štátov:\n`;

    for (const ms of result.memberStates) {
      const statusText = ms.status === 'AVAILABLE' ? 'AVAILABLE / DOSTUPNÁ' :
                        ms.status === 'UNAVAILABLE' ? 'UNAVAILABLE / NEDOSTUPNÁ' :
                        'TIMEOUT / ČASOVÝ LIMIT';
      response += `${ms.code}: ${statusText}\n`;
    }

    return response;
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('VIES VAT Checker MCP server running on stdio');
  }
}

const server = new ViesMCPServer();
server.run().catch(console.error);
