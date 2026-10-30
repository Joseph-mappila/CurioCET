#!/usr/bin/env bash

# ==============================================================================
# AI Product Description Writer - In-Loop Evaluator Prototype
# TCS HackMatrix AI Studio | Smart Campus GenAI Hackathon
# ==============================================================================

set -e

# Terminal colors
BOLD='\033[1m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
RESET='\033[0m'

echo -e "${PURPLE}"
cat << "EOF"
  ____                 _            _     ____                             
 |  _ \ _ __ ___   __| |_   _  ___| |_  |  _ \  ___  ___  ___ _ __ _ __    
 | |_) | '__/ _ \ / _` | | | |/ __| __| | | | |/ _ \/ __|/ __| '__| '_ \   
 |  __/| | | (_) | (_| | |_| | (__| |_  | |_| |  __/\__ \ (__| |  | |_) |  
 |_|   |_|  \___/ \__,_|\__,_|\___|\__| |____/ \___||___/\___|_|  | .__/   
                                                                  |_|      
 >> Two-Stage In-Loop LLM Caller & Anti-Hallucination Evaluator Engine
EOF
echo -e "${RESET}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${CYAN}[1/3] Checking environment prerequisites...${RESET}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Error: Node.js is not installed. Please install Node.js v18 or higher.${RESET}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js detected: ${NODE_VERSION}${RESET}"

# Install dependencies if missing
if [ ! -d "node_modules" ]; then
    echo -e "${CYAN}[2/3] Installing project dependencies (npm install)...${RESET}"
    npm install
else
    echo -e "${GREEN}✓ Dependencies already installed in node_modules.${RESET}"
fi

echo -e "${CYAN}[3/3] Starting development server & in-loop LLM runner...${RESET}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${BOLD}  🚀 Server URL: http://localhost:3000${RESET}"
echo -e "  🛡️ Anti-Hallucination In-Loop Evaluator: ACTIVE"
echo -e "  📸 Vision Multimodal Input: READY (Upload / Paste / Webcam)"
echo -e "  ✏️ Editable Final Output: ENABLED"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${YELLOW}Press Ctrl+C to stop the server at any time.${RESET}\n"

# Launch Vite dev server
exec npx vite --port 3000 --open
