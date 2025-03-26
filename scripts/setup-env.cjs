const fs = require('fs');

// Create .env file
const envContent = `VITE_SUPABASE_URL=${process.env.VITE_SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${process.env.VITE_SUPABASE_ANON_KEY}
`;

fs.writeFileSync('.env', envContent);

console.log('Environment variables set up successfully!');
