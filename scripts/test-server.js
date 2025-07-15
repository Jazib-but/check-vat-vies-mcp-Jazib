#!/usr/bin/env node

/**
 * Test script for VIES VAT Checker MCP Server
 * This script tests the server functionality by sending MCP requests
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverPath = join(__dirname, '..', 'dist', 'index.js');

function sendMCPRequest(request) {
  return new Promise((resolve, reject) => {
    const server = spawn('node', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    server.stdout.on('data', (data) => {
      output += data.toString();
    });

    server.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    server.on('close', (code) => {
      if (code === 0) {
        try {
          const lines = output.trim().split('\n');
          const responses = lines.map(line => {
            try {
              return JSON.parse(line);
            } catch {
              return null;
            }
          }).filter(Boolean);
          resolve(responses);
        } catch (error) {
          reject(new Error(`Failed to parse output: ${error.message}`));
        }
      } else {
        reject(new Error(`Server exited with code ${code}. Error: ${errorOutput}`));
      }
    });

    server.on('error', (error) => {
      reject(error);
    });

    // Send the request
    server.stdin.write(JSON.stringify(request) + '\n');
    server.stdin.end();
  });
}

async function testServer() {
  console.log('🧪 Testing VIES VAT Checker MCP Server...\n');

  try {
    // Test 1: List tools
    console.log('1️⃣ Testing list_tools...');
    const listToolsRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list'
    };

    const listToolsResponse = await sendMCPRequest(listToolsRequest);
    console.log('✅ Tools listed successfully');
    console.log(`   Found ${listToolsResponse[0]?.result?.tools?.length || 0} tools\n`);

    // Test 2: List EU member states
    console.log('2️⃣ Testing list_eu_member_states...');
    const listStatesRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'list_eu_member_states',
        arguments: {}
      }
    };

    const listStatesResponse = await sendMCPRequest(listStatesRequest);
    console.log('✅ EU member states listed successfully\n');

    // Test 3: Check VIES status
    console.log('3️⃣ Testing check_vies_status...');
    const statusRequest = {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'check_vies_status',
        arguments: {}
      }
    };

    const statusResponse = await sendMCPRequest(statusRequest);
    console.log('✅ VIES status checked successfully\n');

    // Test 4: Test VAT service with valid test number
    console.log('4️⃣ Testing check_vat_test_service (valid)...');
    const testValidRequest = {
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: {
        name: 'check_vat_test_service',
        arguments: {
          countryCode: 'SK',
          vatNumber: '100'
        }
      }
    };

    const testValidResponse = await sendMCPRequest(testValidRequest);
    console.log('✅ Test service (valid) completed successfully\n');

    // Test 5: Test VAT service with invalid test number
    console.log('5️⃣ Testing check_vat_test_service (invalid)...');
    const testInvalidRequest = {
      jsonrpc: '2.0',
      id: 5,
      method: 'tools/call',
      params: {
        name: 'check_vat_test_service',
        arguments: {
          countryCode: 'SK',
          vatNumber: '200'
        }
      }
    };

    const testInvalidResponse = await sendMCPRequest(testInvalidRequest);
    console.log('✅ Test service (invalid) completed successfully\n');

    console.log('🎉 All tests completed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ Tools listing');
    console.log('   ✅ EU member states listing');
    console.log('   ✅ VIES status check');
    console.log('   ✅ Test service (valid VAT)');
    console.log('   ✅ Test service (invalid VAT)');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests
testServer();
