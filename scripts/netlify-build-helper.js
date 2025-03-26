import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Display environment information
console.log(`Node version: ${process.version}`);
console.log(`NPM version: ${execSync('npm --version').toString().trim()}`);
console.log(`Current directory: ${process.cwd()}`);

// Ensure no Go-related files are present
const goFiles = [
  'go.mod',
  'go.sum',
  'main.go',
  'netlify/functions/go',
  'netlify/edge-functions-import-map.json'
];

for (const file of goFiles) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`Removing Go-related file: ${file}`);
    try {
      if (fs.statSync(filePath).isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(`Failed to remove ${file}:`, error);
    }
  }
}

// Run setup script
console.log('Setting up environment...');
try {
  // Ensure the .env file exists
  const envFile = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envFile)) {
    fs.writeFileSync(envFile, `VITE_SUPABASE_URL=${process.env.VITE_SUPABASE_URL || ''}\nVITE_SUPABASE_ANON_KEY=${process.env.VITE_SUPABASE_ANON_KEY || ''}\n`);
    console.log('.env file created');
  }
  
  // Run check dependencies script
  require('./check-dependencies.js');
  
  console.log('Environment setup complete');
} catch (error) {
  console.error('Environment setup failed:', error);
  // Don't fail the build
}

console.log('Ready to build!');
