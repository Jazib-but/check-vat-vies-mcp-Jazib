// Re-export types from schemas for convenience
export type {
  CheckVatNumberParams,
  CheckVatTestParams,
  VatValidationResponse,
  StatusResponse,
  MemberStateStatus,
  ErrorResponse,
  EUMemberState,
} from './schemas.js';

// Additional utility types
export class ViesApiError extends Error {
  status?: number;
  statusText?: string;
  response?: unknown;

  constructor(message: string, status?: number, statusText?: string, response?: unknown) {
    super(message);
    this.name = 'ViesApiError';
    this.status = status;
    this.statusText = statusText;
    this.response = response;
  }
}

export interface VatNumberInfo {
  countryCode: string;
  vatNumber: string;
  isValid: boolean;
  companyName?: string;
  companyAddress?: string;
  requestDate: string;
  wasPreprocessed?: boolean;
  originalVatNumber?: string;
  originalCountryCode?: string;
}

export interface ServiceStatus {
  isAvailable: boolean;
  memberStates: Array<{
    code: string;
    status: 'AVAILABLE' | 'UNAVAILABLE' | 'TIMEOUT';
  }>;
  lastChecked: string;
}
