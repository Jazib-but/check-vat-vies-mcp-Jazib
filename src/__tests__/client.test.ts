import { ViesApiClient } from '../client';
import { CheckVatNumberParams, CheckVatTestParams } from '../schemas';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ViesApiClient', () => {
  let client: ViesApiClient;
  let mockAxiosInstance: any;

  beforeEach(() => {
    mockAxiosInstance = {
      post: jest.fn(),
      get: jest.fn(),
      interceptors: {
        response: {
          use: jest.fn(),
        },
      },
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    client = new ViesApiClient();
    jest.clearAllMocks();
  });

  describe('checkVatNumber', () => {
    it('should validate a VAT number successfully', async () => {
      const mockResponse = {
        data: {
          valid: true,
          requestDate: '2024-01-01T10:00:00Z',
          name: 'Test Company',
          address: 'Test Address',
          countryCode: 'SK',
          vatNumber: '2020000000',
        },
      };

      // Mock axios post method
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const params: CheckVatNumberParams = {
        countryCode: 'SK',
        vatNumber: '2020000000',
      };

      const result = await client.checkVatNumber(params);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/check-vat-number', {
        countryCode: 'SK',
        vatNumber: '2020000000',
      });

      expect(result).toEqual({
        countryCode: 'SK',
        vatNumber: '2020000000',
        isValid: true,
        companyName: 'Test Company',
        companyAddress: 'Test Address',
        requestDate: '2024-01-01T10:00:00Z',
        wasPreprocessed: false,
      });
    });

    it('should handle invalid VAT number', async () => {
      const mockResponse = {
        data: {
          valid: false,
          requestDate: '2024-01-01T10:00:00Z',
          countryCode: 'SK',
          vatNumber: '1234567890',
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const params: CheckVatNumberParams = {
        countryCode: 'SK',
        vatNumber: '1234567890',
      };

      const result = await client.checkVatNumber(params);

      expect(result.isValid).toBe(false);
      expect(result.companyName).toBeUndefined();
      expect(result.companyAddress).toBeUndefined();
    });
  });

  describe('checkVatTestService', () => {
    it('should test with valid test VAT number', async () => {
      const mockResponse = {
        data: {
          valid: true,
          requestDate: '2024-01-01T10:00:00Z',
          countryCode: 'SK',
          vatNumber: '100',
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const params: CheckVatTestParams = {
        countryCode: 'SK',
        vatNumber: '100',
      };

      const result = await client.checkVatTestService(params);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/check-vat-test-service', {
        countryCode: 'SK',
        vatNumber: '100',
      });

      expect(result.isValid).toBe(true);
      expect(result.wasPreprocessed).toBe(false);
    });

    it('should test with invalid test VAT number', async () => {
      const mockResponse = {
        data: {
          valid: false,
          requestDate: '2024-01-01T10:00:00Z',
          countryCode: 'SK',
          vatNumber: '200',
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const params: CheckVatTestParams = {
        countryCode: 'SK',
        vatNumber: '200',
      };

      const result = await client.checkVatTestService(params);

      expect(result.isValid).toBe(false);
    });
  });

  describe('checkStatus', () => {
    it('should return service status', async () => {
      const mockResponse = {
        data: {
          availabilityStatus: 'AVAILABLE',
          memberStates: [
            { memberStateCode: 'SK', availability: 'AVAILABLE' },
            { memberStateCode: 'CZ', availability: 'UNAVAILABLE' },
          ],
        },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await client.checkStatus();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/check-status');

      expect(result.isAvailable).toBe(true);
      expect(result.memberStates).toHaveLength(2);
      expect(result.memberStates[0]).toEqual({
        code: 'SK',
        status: 'AVAILABLE',
      });
      expect(result.memberStates[1]).toEqual({
        code: 'CZ',
        status: 'UNAVAILABLE',
      });
    });
  });
});
