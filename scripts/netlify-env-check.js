import { execSync } from 'child_process';
import fs from 'fs';

console.log('=== NETLIFY ENVIRONMENT CHECK ===');

// Print environment information
console.log('Node version:', process.version);
try {
  console.log('NPM version:', execSync('npm --version').toString().trim());
} catch (error) {
  console.log('Failed to get NPM version');
}

// Print all environment variables starting with NETLIFY
console.log('\nNetlify Environment Variables:');
Object.keys(process.env)
  .filter(key => key.startsWith('NETLIFY') || key.includes('VERSION') || key.includes('PYTHON'))
  .forEach(key => {
    console.log(`${key}=${process.env[key]}`);
  });

// Check if any Python is installed and ensure we're not trying to use Node as Python
console.log('\nChecking Python installation:');
try {
  const pythonVersion = execSync('python --version').toString().trim();
  console.log(`System Python: ${pythonVersion}`);
} catch (error) {
  console.log('Python is not installed or not in PATH');
}

// Write runtime.txt file to ensure correct Python version
console.log('\nUpdating runtime files...');
try {
  // Write Python version file
  fs.writeFileSync('.python-version', '3.9\n');
  console.log('Created .python-version file with 3.9');
  
  // Make sure runtime.txt has correct Node version and not Python
  fs.writeFileSync('runtime.txt', '18.18.0\n');
  console.log('Updated runtime.txt with Node version');
  
  // Create a build-info.json file with proper runtime info
  const buildInfo = {
    runtimes: {
      nodejs: '18.18.0',
      python: '3.9'
    },
    buildTime: new Date().toISOString()
  };
  fs.writeFileSync('build-info.json', JSON.stringify(buildInfo, null, 2));
  console.log('Created build-info.json with runtime information');
  
} catch (error) {
  console.error('Failed to update runtime files:', error);
}

console.log('\nEnvironment check complete. Continuing with build...');
