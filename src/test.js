#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Basic smoke test for the CLI
async function runTests() {
  console.log('🧪 Running basic tests...');

  try {
    // Test 1: Check if index.js exists and is executable
    const indexPath = path.join(__dirname, 'index.js');
    if (!await fs.pathExists(indexPath)) {
      throw new Error('index.js not found');
    }

    const indexContent = await fs.readFile(indexPath, 'utf8');
    if (!indexContent.includes('#!/usr/bin/env node')) {
      throw new Error('index.js missing shebang');
    }

    // Test 2: Check if templates directory exists
    const templatesPath = path.join(__dirname, 'templates');
    if (!await fs.pathExists(templatesPath)) {
      throw new Error('templates directory not found');
    }

    // Test 3: Check package.json structure
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));

    if (!packageJson.bin || !packageJson.bin.aimind) {
      throw new Error('package.json missing bin.aimind configuration');
    }

    if (!packageJson.files || !packageJson.files.includes('src/index.js')) {
      throw new Error('package.json files array should include src/index.js');
    }

    console.log('✅ All basic tests passed!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();