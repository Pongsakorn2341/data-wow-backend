#!/bin/bash

# Function to log messages with a prefix
log() {
  echo "[SCRIPT] $1"
}
set -e

log "Build Process..."
pnpm build

pnpm prune --prod

sleep 10
npx prisma db push

log "Starting development environment..."
pnpm start
