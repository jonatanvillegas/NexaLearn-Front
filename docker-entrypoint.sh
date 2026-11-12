#!/bin/sh
set -eu

API_URL="${VITE_API_URL:-}"
cat > /usr/share/nginx/html/config.js <<EOF
window.APP_CONFIG = {
  API_URL: "${API_URL}"
}
EOF
