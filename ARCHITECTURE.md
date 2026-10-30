# ARCHITECTURE.md

# System Architecture & Data Flow

This document details the modular layout, API contracts, and execution flow for the Photo-to-Product-Description application, ensuring clear scalability boundaries for post-hackathon expansion.

---

## 1. Directory Structure

```text
product-ai-generator/
├── client/                     # Frontend (React / Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── InputPanel.jsx  # Image dropzone, preview, and brand input
│   │   │   ├── ResultsPanel.jsx# Title, description, bullets, and copy/regenerate actions
│   │   │   └── icons.jsx       # Inline SVG icon set
│   │   ├── App.jsx             # State machine (empty, generating, success, error)
│   │   ├── index.css           # Tailwind directives & theme configuration
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js          # Dev proxy: /api -> http://127.0.0.1:8000
├── server/                     # Backend (FastAPI Python service)
│   ├── services/
│   │   ├── __init__.py
│   │   └── ai_service.py       # Encapsulated Gemini 2.5 Flash multimodal call
│   ├── .env.example            # API key, model, timeout, CORS, mock-mode settings
│   ├── main.py                 # FastAPI endpoints, validation & CORS middleware
│   └── requirements.txt        # FastAPI, uvicorn, google-genai, python-multipart, dotenv
└── ARCHITECTURE.md
```