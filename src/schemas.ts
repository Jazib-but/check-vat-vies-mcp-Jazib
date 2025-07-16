import { z } from 'zod';

// EU Member State codes for VAT validation
export const EU_MEMBER_STATES = [
  'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'EL', 'ES', 'FI', 'FR',
  'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO',
  'SE', 'SI', 'SK'
] as const;

// Input validation schemas
export const checkVatNumberSchema = z.object({
  countryCode: z.enum(EU_MEMBER_STATES, {
    errorMap: () => ({ message: 'Invalid EU member state code' })
  }),
  vatNumber: z.string().min(1, 'VAT number is required').max(20, 'VAT number too long'),
});

export const checkVatTestSchema = z.object({
  countryCode: z.enum(EU_MEMBER_STATES),
  vatNumber: z.enum(['100', '200'], {
    errorMap: () => ({ message: 'Test VAT number must be 100 (valid) or 200 (invalid)' })
  }),
});

// VIES API response schemas
export const vatValidationResponseSchema = z.object({
  valid: z.boolean(),
  requestDate: z.string(),
  userError: z.string().optional(),
  name: z.string().optional(),
  address: z.string().optional(),
  requestIdentifier: z.string().optional(),
  originalVatNumber: z.string().optional(),
  vatNumber: z.string().optional(),
  originalCountryCode: z.string().optional(),
  countryCode: z.string().optional(),
});

export const memberStateStatusSchema = z.object({
  memberStateCode: z.string(),
  availability: z.enum(['AVAILABLE', 'UNAVAILABLE', 'TIMEOUT']),
});

export const statusResponseSchema = z.object({
  availabilityStatus: z.enum(['AVAILABLE', 'UNAVAILABLE']),
  memberStates: z.array(memberStateStatusSchema),
});

export const errorResponseSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  details: z.string().optional(),
});

// Export types
export type CheckVatNumberParams = z.infer<typeof checkVatNumberSchema>;
export type CheckVatTestParams = z.infer<typeof checkVatTestSchema>;
export type VatValidationResponse = z.infer<typeof vatValidationResponseSchema>;
export type StatusResponse = z.infer<typeof statusResponseSchema>;
export type MemberStateStatus = z.infer<typeof memberStateStatusSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type EUMemberState = typeof EU_MEMBER_STATES[number];
