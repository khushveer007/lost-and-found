// Simple environment setup script that works with ES modules
import { writeFileSync } from 'fs';
import { execSync } from 'child_process';

console.log('Setting up environment variables...');

try {
  // Get environment variables from Netlify if they exist
  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
  
  console.log(`SUPABASE_URL available: ${supabaseUrl ? 'Yes' : 'No'}`);
  console.log(`SUPABASE_ANON_KEY available: ${supabaseAnonKey ? 'Yes' : 'No'}`);
  
  // Create basic .env file for deployment
  const envContent = `VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseAnonKey}
`;

  writeFileSync('.env', envContent);
  console.log('Environment variables set up successfully!');
  
  // Print current directory structure for debugging
  console.log('Current directory structure:');
  const files = execSync('ls -la').toString();
  console.log(files);
  
} catch (error) {
  console.error('Error setting up environment variables:', error);
  // Don't fail the build if this fails
  process.exit(0);
}
