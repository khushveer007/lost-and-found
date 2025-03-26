import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Current directory:', process.cwd());
console.log('Files in current directory:');
fs.readdirSync(process.cwd()).forEach(file => {
  console.log(`- ${file}`);
});
