import fs from 'fs';

// Check if package-lock.json exists
if (!fs.existsSync('./package-lock.json')) {
  console.log('package-lock.json not found. Creating a minimal version...');
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  
  // Create a minimal package-lock.json
  const packageLock = {
    name: packageJson.name,
    version: packageJson.version,
    lockfileVersion: 3,
    requires: true,
    packages: {
      "": {
        name: packageJson.name,
        version: packageJson.version,
        dependencies: packageJson.dependencies,
        devDependencies: packageJson.devDependencies
      }
    }
  };
  
  fs.writeFileSync('./package-lock.json', JSON.stringify(packageLock, null, 2));
  console.log('Created minimal package-lock.json');
} else {
  console.log('package-lock.json exists.');
}
