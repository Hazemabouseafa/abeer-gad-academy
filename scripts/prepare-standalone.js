const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy public, .next/static, and data into .next/standalone
const standaloneDir = path.join(__dirname, '..', '.next', 'standalone');
if (fs.existsSync(standaloneDir)) {
  const publicSrc = path.join(__dirname, '..', 'public');
  const publicDest = path.join(standaloneDir, 'public');
  copyDir(publicSrc, publicDest);

  const staticSrc = path.join(__dirname, '..', '.next', 'static');
  const staticDest = path.join(standaloneDir, '.next', 'static');
  copyDir(staticSrc, staticDest);

  const dataSrc = path.join(__dirname, '..', 'data');
  const dataDest = path.join(standaloneDir, 'data');
  copyDir(dataSrc, dataDest);

  console.log('✓ Successfully prepared .next/standalone with static, public, and data files.');
} else {
  console.log('Notice: .next/standalone not found, skipped prepare step.');
}
