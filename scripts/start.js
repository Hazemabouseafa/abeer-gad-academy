// scripts/start.js - Production server starter for Coolify / Nixpacks / Standalone
const path = require('path');
const fs = require('fs');

process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0';
process.env.PORT = process.env.PORT || '3000';

const standaloneDir = path.join(__dirname, '..', '.next', 'standalone');
const standaloneServer = path.join(standaloneDir, 'server.js');

if (fs.existsSync(standaloneServer)) {
  console.log(`[Production] Starting standalone server on ${process.env.HOSTNAME}:${process.env.PORT}...`);
  process.chdir(standaloneDir);
  require(standaloneServer);
} else {
  console.log(`[Production] Standalone server not found. Starting next start on ${process.env.HOSTNAME}:${process.env.PORT}...`);
  process.argv = [process.argv[0], process.argv[1], 'start', '-p', process.env.PORT, '-H', process.env.HOSTNAME];
  require('next/dist/bin/next');
}
