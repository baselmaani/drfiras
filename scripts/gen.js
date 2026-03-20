const { execSync } = require('child_process');
execSync('./node_modules/.bin/prisma generate', { stdio: 'inherit' });
