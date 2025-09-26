import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const EU_MEMBER_STATES = [
  'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'EL', 'ES',
  'FI', 'FR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT',
  'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'
];

const VIES_API_BASE = 'https://ec.europa.eu/taxation_customs/vies/rest-api';

const vatValidationSchema = z.object({
  countryCode: z.string().length(2).refine(code => EU_MEMBER_STATES.includes(code), {
    message: 'Invalid EU member state code'
  }),
  vatNumber: z.string().min(1).max(20)
});

function preprocessVatInput(input) {
  let processedInput = input.trim().toUpperCase();
  processedInput = processedInput.replace(/[\s\-\.]/g, '');

  let countryCode = '';
  let vatNumber = '';

  const countryMatch = processedInput.match(/^([A-Z]{2})/);
  if (countryMatch) {
    countryCode = countryMatch[1];
    vatNumber = processedInput.substring(2);
  } else {
    vatNumber = processedInput;
  }

  return { countryCode, vatNumber };
}

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'VAT Validation API',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/member-states', (req, res) => {
  const memberStates = EU_MEMBER_STATES.map(code => {
    const countryNames = {
      'AT': 'Austria',
      'BE': 'Belgium',
      'BG': 'Bulgaria',
      'CY': 'Cyprus',
      'CZ': 'Czech Republic',
      'DE': 'Germany',
      'DK': 'Denmark',
      'EE': 'Estonia',
      'EL': 'Greece',
      'ES': 'Spain',
      'FI': 'Finland',
      'FR': 'France',
      'HR': 'Croatia',
      'HU': 'Hungary',
      'IE': 'Ireland',
      'IT': 'Italy',
      'LT': 'Lithuania',
      'LU': 'Luxembourg',
      'LV': 'Latvia',
      'MT': 'Malta',
      'NL': 'Netherlands',
      'PL': 'Poland',
      'PT': 'Portugal',
      'RO': 'Romania',
      'SE': 'Sweden',
      'SI': 'Slovenia',
      'SK': 'Slovakia'
    };
    return {
      code: code,
      name: countryNames[code] || code
    };
  });

  res.json({ memberStates });
});

app.post('/api/validate', async (req, res) => {
  try {
    const { countryCode, vatNumber } = vatValidationSchema.parse(req.body);

    const response = await axios.post(
      `${VIES_API_BASE}/check-vat-number`,
      { countryCode, vatNumber },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000
      }
    );

    res.json({
      success: true,
      data: {
        countryCode: response.data.countryCode,
        vatNumber: response.data.vatNumber,
        isValid: response.data.valid,
        requestDate: response.data.requestDate,
        companyName: response.data.name || null,
        companyAddress: response.data.address || null
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        error: 'VIES API error',
        message: error.response.data?.message || 'Unknown error'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.post('/api/validate/auto', async (req, res) => {
  try {
    const { vat } = req.body;

    if (!vat || typeof vat !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'VAT number is required'
      });
    }

    const { countryCode, vatNumber } = preprocessVatInput(vat);

    if (!countryCode || !EU_MEMBER_STATES.includes(countryCode)) {
      return res.status(400).json({
        success: false,
        error: 'Could not determine valid EU country code from input'
      });
    }

    const response = await axios.post(
      `${VIES_API_BASE}/check-vat-number`,
      { countryCode, vatNumber },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000
      }
    );

    res.json({
      success: true,
      input: vat,
      processed: {
        countryCode,
        vatNumber
      },
      data: {
        countryCode: response.data.countryCode,
        vatNumber: response.data.vatNumber,
        isValid: response.data.valid,
        requestDate: response.data.requestDate,
        companyName: response.data.name || null,
        companyAddress: response.data.address || null
      }
    });

  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        error: 'VIES API error',
        message: error.response.data?.message || 'Unknown error'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.get('/api/status', async (req, res) => {
  try {
    const response = await axios.get(
      `${VIES_API_BASE}/status`,
      {
        headers: {
          'Accept': 'application/json'
        },
        timeout: 10000
      }
    );

    res.json({
      success: true,
      data: {
        isAvailable: response.data?.vow?.available || false,
        lastChecked: new Date().toISOString(),
        memberStates: response.data?.memberStates || []
      }
    });

  } catch (error) {
    res.status(503).json({
      success: false,
      error: 'Service unavailable',
      message: 'Could not check VIES service status'
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`VAT Validation API Server running on http://localhost:${PORT}`);
  console.log('\nAvailable endpoints:');
  console.log(`GET  http://localhost:${PORT}/health - Health check`);
  console.log(`GET  http://localhost:${PORT}/api/member-states - List EU member states`);
  console.log(`POST http://localhost:${PORT}/api/validate - Validate VAT with country code and number`);
  console.log(`POST http://localhost:${PORT}/api/validate/auto - Auto-detect and validate VAT`);
  console.log(`GET  http://localhost:${PORT}/api/status - Check VIES service status`);
});