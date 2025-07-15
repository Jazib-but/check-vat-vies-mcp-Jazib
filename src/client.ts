import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  CheckVatNumberParams,
  CheckVatTestParams,
  VatValidationResponse,
  StatusResponse,
  vatValidationResponseSchema,
  statusResponseSchema,
  errorResponseSchema,
} from './schemas.js';
import { ViesApiError, VatNumberInfo, ServiceStatus } from './types.js';

export class ViesApiClient {
  private client: AxiosInstance;
  private readonly baseURL = 'https://ec.europa.eu/taxation_customs/vies/rest-api';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'VIES-MCP-Server/1.0.0',
      },
    });

    // Error interceptor for better error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('VIES API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
        });

        const viesError = new ViesApiError(
          `VIES API request failed: ${error.message}`,
          error.response?.status,
          error.response?.statusText,
          error.response?.data
        );
        
        throw viesError;
      }
    );
  }

  /**
   * Validate a VAT number using the VIES service
   */
  async checkVatNumber(params: CheckVatNumberParams): Promise<VatNumberInfo> {
    try {
      const response = await this.client.post('/check-vat-number', {
        countryCode: params.countryCode,
        vatNumber: params.vatNumber,
      });

      const validatedData = vatValidationResponseSchema.parse(response.data);

      return {
        countryCode: validatedData.countryCode || params.countryCode,
        vatNumber: validatedData.vatNumber || params.vatNumber,
        isValid: validatedData.isValid,
        companyName: validatedData.name,
        companyAddress: validatedData.address,
        requestDate: validatedData.requestDate,
        wasPreprocessed: validatedData.originalVatNumber !== undefined,
        originalVatNumber: validatedData.originalVatNumber,
        originalCountryCode: validatedData.originalCountryCode,
      };
    } catch (error) {
      if (error instanceof ViesApiError) {
        // Try to parse error response
        try {
          const errorData = errorResponseSchema.parse(error.response);
          throw new Error(`VIES validation failed: ${errorData.error}${errorData.message ? ` - ${errorData.message}` : ''}`);
        } catch {
          throw error;
        }
      }
      throw error;
    }
  }

  /**
   * Test the VIES service integration using test VAT numbers
   */
  async checkVatTestService(params: CheckVatTestParams): Promise<VatNumberInfo> {
    try {
      const response = await this.client.post('/check-vat-test-service', {
        countryCode: params.countryCode,
        vatNumber: params.vatNumber,
      });

      const validatedData = vatValidationResponseSchema.parse(response.data);

      return {
        countryCode: validatedData.countryCode || params.countryCode,
        vatNumber: validatedData.vatNumber || params.vatNumber,
        isValid: validatedData.isValid,
        companyName: validatedData.name,
        companyAddress: validatedData.address,
        requestDate: validatedData.requestDate,
        wasPreprocessed: false, // Test service doesn't preprocess
      };
    } catch (error) {
      if (error instanceof ViesApiError) {
        try {
          const errorData = errorResponseSchema.parse(error.response);
          throw new Error(`VIES test service failed: ${errorData.error}${errorData.message ? ` - ${errorData.message}` : ''}`);
        } catch {
          throw error;
        }
      }
      throw error;
    }
  }

  /**
   * Check the status of the VIES service and member states
   */
  async checkStatus(): Promise<ServiceStatus> {
    try {
      const response = await this.client.get('/check-status');
      const validatedData = statusResponseSchema.parse(response.data);

      return {
        isAvailable: validatedData.availabilityStatus === 'AVAILABLE',
        memberStates: validatedData.memberStates.map(ms => ({
          code: ms.memberStateCode,
          status: ms.availability,
        })),
        lastChecked: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof ViesApiError) {
        try {
          const errorData = errorResponseSchema.parse(error.response);
          throw new Error(`VIES status check failed: ${errorData.error}${errorData.message ? ` - ${errorData.message}` : ''}`);
        } catch {
          throw error;
        }
      }
      throw error;
    }
  }
}
