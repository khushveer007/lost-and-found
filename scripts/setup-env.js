// Simple environment setup script that works with ES modules
import { writeFileSync } from 'fs';

try {
  // Create basic .env file for deployment
  const envContent = `VITE_SUPABASE_URL=${process.env.VITE_SUPABASE_URL || ''}
VITE_SUPABASE_ANON_KEY=${process.env.VITE_SUPABASE_ANON_KEY || ''}
`;

  writeFileSync('.env', envContent);
  console.log('Environment variables set up successfully!');
} catch (error) {
  console.error('Error setting up environment variables:', error);
  // Don't fail the build if this fails
  process.exit(0);
}
