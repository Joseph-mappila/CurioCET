#!/usr/bin/env bash
#
# CurioCET one-command dev launcher (Linux / macOS / WSL).
# - Works from any directory: resolves the project root from this file.
# - Creates server/.env from the template only when it is missing.
# - NEVER overwrites or exports API keys. An existing server/.env is left untouched.
# - Starts FastAPI on :8000 and Vite on :5173, then stops the API when Vite exits.
#
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$ROOT_DIR/server"
CLIENT_DIR="$ROOT_DIR/client"
API_HOST="127.0.0.1"
API_PORT="8000"
WEB_PORT="5173"

BACKEND_PID=""

info() { printf '\033[1;36m[CurioCET]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[CurioCET]\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m[CurioCET]\033[0m %s\n' "$*" >&2; exit 1; }

cleanup() {
  if [ -n "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    info "Stopping API (pid $BACKEND_PID)..."
    kill "$BACKEND_PID" 2>/dev/null || true
    wait "$BACKEND_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

command -v node >/dev/null 2>&1 || fail "Node.js is required. Install Node.js 18+ and retry."
command -v npm >/dev/null 2>&1 || fail "npm is required. Install Node.js 18+ and retry."

# ---------------------------------------------------------------------------
# Environment file: create only when missing; never modify existing keys.
# ---------------------------------------------------------------------------
if [ ! -f "$SERVER_DIR/.env" ]; then
  cp "$SERVER_DIR/.env.example" "$SERVER_DIR/.env"
  warn "Created server/.env from the template."
  warn "Add GEMINI_API_KEY in server/.env, or set MOCK_AI=1 there for demo mode."
else
  info "Using existing server/.env (API keys are left untouched)."
  if grep -q '^GEMINI_API_KEY=your_gemini_api_key_here' "$SERVER_DIR/.env"; then
    warn "server/.env still contains the example key placeholder. Replace it with a real key, or set MOCK_AI=1 for demo mode."
  fi
fi

# ---------------------------------------------------------------------------
# Backend dependencies (uv)
# ---------------------------------------------------------------------------
if [ ! -x "$SERVER_DIR/.venv/bin/uvicorn" ]; then
  command -v uv >/dev/null 2>&1 || fail "uv is required. Install it from https://docs.astral.sh/uv/ and retry."
  if [ ! -d "$SERVER_DIR/.venv" ]; then
    info "Creating Python virtual environment with uv..."
    (cd "$SERVER_DIR" && uv venv .venv)
  fi
  info "Installing backend dependencies..."
  (cd "$SERVER_DIR" && uv pip install --python .venv/bin/python -r requirements.txt)
fi

# ---------------------------------------------------------------------------
# Frontend dependencies (npm)
# ---------------------------------------------------------------------------
if [ ! -d "$CLIENT_DIR/node_modules" ]; then
  info "Installing frontend dependencies..."
  (cd "$CLIENT_DIR" && npm install --no-audit --no-fund)
fi

# ---------------------------------------------------------------------------
# Start FastAPI
# ---------------------------------------------------------------------------
info "Starting FastAPI at http://$API_HOST:$API_PORT ..."
(
  cd "$SERVER_DIR"
  exec .venv/bin/uvicorn main:app --host "$API_HOST" --port "$API_PORT" --reload
) &
BACKEND_PID=$!

# Give the API a moment, then confirm it is alive before starting Vite.
if command -v curl >/dev/null 2>&1; then
  API_READY=0
  for _ in $(seq 1 30); do
    if curl -fsS "http://$API_HOST:$API_PORT/api/health" >/dev/null 2>&1; then
      API_READY=1
      info "API is ready."
      break
    fi
    if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
      fail "API exited during startup. Check the log output above."
    fi
    sleep 1
  done
  if [ "$API_READY" -ne 1 ]; then
    fail "API did not become ready within 30 seconds. Check the log output above."
  fi
else
  sleep 2
fi

# ---------------------------------------------------------------------------
# Start Vite (foreground)
# ---------------------------------------------------------------------------
info "Starting Vite at http://$API_HOST:$WEB_PORT ..."
info "Press Ctrl+C to stop both services."
cd "$CLIENT_DIR"
npm run dev -- --host "$API_HOST" --port "$WEB_PORT"
