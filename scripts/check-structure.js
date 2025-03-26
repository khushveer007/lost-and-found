const fs = require('fs');
const path = require('path');

console.log('Current directory:', process.cwd());
console.log('Files in current directory:');
fs.readdirSync(process.cwd()).forEach(file => {
  console.log(`- ${file}`);
});
