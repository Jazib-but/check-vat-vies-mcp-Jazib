import axios from 'axios';

async function checkVAT(countryCode, vatNumber) {
  try {
    const response = await axios.post(
      'https://ec.europa.eu/taxation_customs/vies/rest-api/check-vat-number',
      {
        countryCode: countryCode,
        vatNumber: vatNumber
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log('VAT Validation Result:');
    console.log('Country Code:', response.data.countryCode);
    console.log('VAT Number:', response.data.vatNumber);
    console.log('Valid:', response.data.valid ? 'YES' : 'NO');
    console.log('Request Date:', response.data.requestDate);

    if (response.data.name) {
      console.log('Company Name:', response.data.name);
    }
    if (response.data.address) {
      console.log('Company Address:', response.data.address);
    }

  } catch (error) {
    if (error.response) {
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Check DE123456789
checkVAT('DE', '123456789');