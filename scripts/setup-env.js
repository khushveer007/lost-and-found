// Simple environment setup script
import { writeFileSync } from 'fs';

try {
  // Create basic .env file with empty values if needed
  const envContent = `VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
`;

  writeFileSync('.env', envContent);
  console.log('Environment variables template created. Please fill in the values.');
} catch (error) {
  console.error('Error setting up environment variables:', error);
  process.exit(1);
}
