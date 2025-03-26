// Simple environment setup script
import { writeFileSync } from 'fs';

try {
  // Get environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
  
  // Create basic .env file for deployment
  const envContent = `VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseAnonKey}
`;

  writeFileSync('.env', envContent);
  console.log('Environment variables set up successfully!');
} catch (error) {
  console.error('Error setting up environment variables:', error);
  // Don't fail the build if this fails
  process.exit(0);
}
