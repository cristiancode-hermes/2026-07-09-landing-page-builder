const { execSync } = require('child_process');
const v = require('@angular-devkit/build-angular/package.json').version;
console.log('@angular-devkit/build-angular version:', v);
console.log('Angular core version:', require('@angular/core/package.json').version);
console.log('TypeScript version:', require('typescript/package.json').version);
