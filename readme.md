# AI Product Description Writer 🚀

An AI-powered web tool designed to automatically generate detailed, attractive, and high-converting product descriptions for e-commerce stores.

---

## 📌 Problem Statement

Writing compelling product descriptions at scale is time-consuming for e-commerce businesses. Standard descriptions often fail to engage customers or highlight key value propositions, leading to lower conversion rates.

**Product Description Writer** solves this by leveraging AI to generate tailored, persuasive descriptions focused on driving sales and improving conversion rates.

---
## ✨ Features

- **Photo-Grounded Copy**: Generates a title, description, and benefit bullets from a single product photo.
- **Brand-Aware Voice**: Weaves your brand name in naturally without inventing details.
- **Strict Guardrails**: Never fabricates dimensions, materials, certifications, or other invisible specs.
- **One-Click Workflow**: Drag & drop, preview, generate, copy, and regenerate on a single screen.
- **Robust States**: Clear inline feedback for missing images, invalid formats, oversized files, timeouts, and API failures.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 / Vite / Tailwind CSS
- **Backend**: Python / FastAPI
- **AI Model**: Gemini 2.5 Flash (`google-genai`)

---

## 🔌 API Contract

`POST /api/generate-description` — `multipart/form-data`

| Field | Type | Rules |
| :--- | :--- | :--- |
| `image` | file | JPG, PNG, or WEBP · max 10 MB |
| `brand` | text | Required · max 80 characters |

```json
{
  "title": "Short product title",
  "description": "Two-paragraph product description",
  "benefits": ["Grounded benefit one", "Grounded benefit two", "Grounded benefit three"]
}
```

`GET /api/health` returns the service status and active model.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+ and [uv](https://docs.astral.sh/uv/)
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### Quick start (both services)

```bash
# Linux / macOS / WSL (works from any directory, including fish)
bash run.sh
```

```bat
:: Windows
run.bat
```

The launchers:

- resolve the project root automatically, so they work from any directory;
- create `server/.env` from `.env.example` only when it is missing;
- **never overwrite an existing `server/.env` or your API keys**;
- install missing dependencies with `uv` and `npm`;
- start FastAPI on `http://127.0.0.1:8000` and Vite on `http://127.0.0.1:5173`;
- stop the API when the frontend exits (`run.sh`) or leave it in its own window (`run.bat`).

### Manual setup

Run these commands from the project root (`CurioCET/`).

#### 1. Backend (FastAPI + Gemini)

```bash
cd server
uv venv .venv
uv pip install --python .venv/bin/python -r requirements.txt
cp -n .env.example .env     # only creates it; existing keys are kept
./.venv/bin/uvicorn main:app --reload --port 8000
```

The API is now at `http://127.0.0.1:8000` (`GET /api/health`, `POST /api/generate-description`).
Set `MOCK_AI=1` in `server/.env` to run the full flow without a Gemini key using demo copy.

#### 2. Frontend (React + Vite + Tailwind)

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` requests to the FastAPI server, so no
frontend environment variables are required.

#### Production build

```bash
cd client && npm run build
```

Serve `client/dist` behind any static host and point its `/api` route at the FastAPI service.

---

## 🎯 Hackathon Rubric Alignment

- **Innovation & Creativity**: Uses strict visual grounding and brand-aware prompt engineering to produce honest, on-brand copy instead of generic filler.
- **Technical Execution**: Multimodal Gemini 2.5 Flash integration with a responsive React UI, typed API contract, and resilient error handling.
- **Practical Impact**: Reduces copy creation time from hours to seconds while protecting merchants from inaccurate product claims.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.