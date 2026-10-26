#!/bin/sh
set -e

# Ensure persistent directories exist and are writable regardless of volume mount ownership
mkdir -p /app/data /app/public/uploads
chmod -R 777 /app/data /app/public/uploads 2>/dev/null || true

# If academy-store.json is missing in a freshly mounted Coolify volume, create default empty state
if [ ! -f /app/data/academy-store.json ]; then
  cat << 'EOF' > /app/data/academy-store.json
{
  "courses": [],
  "resources": [],
  "slots": [],
  "transactions": [],
  "students": []
}
EOF
  chmod 666 /app/data/academy-store.json 2>/dev/null || true
fi

exec "$@"
