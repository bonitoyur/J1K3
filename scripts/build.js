import fs from 'node:fs/promises';
// Explicit allowlist: secrets, server sources and legacy configs are not public assets.
await fs.mkdir('dist', { recursive: true });
await fs.copyFile('index.html', 'dist/index.html');
await fs.copyFile('firebase-config.js', 'dist/firebase-config.js');
for (const dir of ['src', 'assets']) await fs.cp(dir, `dist/${dir}`, { recursive: true });
console.log('Static site built in dist/');
