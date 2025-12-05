#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Preparing for npm publishing...\n');

// Check if user is logged in to npm
try {
  const whoami = execSync('npm whoami', { encoding: 'utf8' }).trim();
  console.log(`✅ Logged in as: ${whoami}`);
} catch (error) {
  console.log('❌ Not logged in to npm. Please run: npm login');
  process.exit(1);
}

// Check package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
console.log(`📦 Package: ${packageJson.name}@${packageJson.version}`);

// Validate required fields
const required = ['name', 'version', 'description', 'main', 'bin'];
const missing = required.filter(field => !packageJson[field]);

if (missing.length > 0) {
  console.log(`❌ Missing required fields in package.json: ${missing.join(', ')}`);
  process.exit(1);
}

// Check if bin field points to existing file
const binPath = packageJson.bin.aimind || packageJson.bin[packageJson.name];
if (binPath && !fs.existsSync(binPath)) {
  console.log(`❌ Bin file not found: ${binPath}`);
  process.exit(1);
}

// Run tests
console.log('\n🧪 Running tests...');
try {
  execSync('npm test', { stdio: 'inherit' });
  console.log('✅ Tests passed');
} catch (error) {
  console.log('❌ Tests failed');
  process.exit(1);
}

// Dry run publish
console.log('\n📋 Dry run publish...');
try {
  execSync('npm pack --dry-run', { stdio: 'inherit' });
  console.log('✅ Dry run successful');
} catch (error) {
  console.log('❌ Dry run failed');
  process.exit(1);
}

console.log('\n🎉 Ready for publishing!');
console.log('Run the following commands:');
console.log('  npm publish --dry-run  # Final check');
console.log('  npm publish            # Publish to npm');

if (packageJson.repository && packageJson.repository.url) {
  console.log('\n📝 Remember to:');
  console.log('  - Push code to repository');
  console.log('  - Create GitHub release for automated publishing');
}