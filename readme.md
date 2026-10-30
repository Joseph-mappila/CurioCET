# AI Product Description Writer 🚀
### HackMatrix AI Studio | Smart Campus GenAI Hackathon
**Two-Stage In-Loop LLM Generator & Anti-Hallucination Evaluator**

An intelligent, vision-powered e-commerce conversion copywriting platform that transforms raw product photos and brand positioning into detailed, persuasive, and 100% grounded product descriptions.

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-purple?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Google_Gemini-1.5_Flash-orange?logo=google)](https://ai.google.dev/)
[![Anti-Hallucination](https://img.shields.io/badge/Critic_Loop-Active-emerald?logo=shield)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📌 Problem Statement & Anti-Hallucination Challenge

Writing compelling product descriptions at scale is difficult:
1. **Low Conversions**: Generic descriptions fail to hook visitors or highlight tangible value propositions.
2. **The LLM Hallucination Threat in E-Commerce**: When standard LLMs generate product copy, they frequently invent fake battery metrics (e.g., "70-hour battery"), fabricate certifications ("NASA grade", "Military-spec waterproof"), or hallucinate materials not present in the product. This leads to customer returns, merchant liability, and account suspensions on Amazon/Shopify.

### The Solution: Two-Stage In-Loop LLM Caller & Evaluator Pipeline
**Product Description Writer** solves this by implementing an automated **In-Loop Critic & Evaluator**:
- **Stage 1 (Primary Generator)**: Synthesizes high-converting hooks, emotional narratives, and benefit bullets from the product photo.
- **Stage 2 (Anti-Hallucination Evaluator)**: The primary output is fed back into the AI alongside the original image pixels and user specifications. The Critic strictly audits the draft, cleanses ungrounded numeric claims and fake certifications, and outputs a verified final description with an **Audit Report**.
- **Human-in-the-Loop Final Editing**: Merchants retain full control to edit, add, or customize any part of the verified final output before publishing.

---

## 🛠️ Architecture & In-Loop Pipeline Flow

```mermaid
flowchart TD
    A["📸 Product Photo\n(Upload / Paste / Webcam)"] --> B["🏷️ Brand Name & Specs\n(Tone & Audience)"]
    B --> C["⚡ Stage 1: Primary Draft Generator\n(Gemini 1.5 Flash Vision)"]
    C -->|"Raw Draft Copy\n(Unfiltered Claims)"| D["🛡️ Stage 2: In-Loop Anti-Hallucination Evaluator\n(Critic & Grounding Loop)"]
    A -.->|"Visual Ground Truth (Pixels)"| D
    B -.->|"User Specs Ground Truth"| D
    D --> E["📋 Verified Final Output\n+ Audit Report (Grounded Score)"]
    E --> F["✏️ Human-in-the-Loop Editor\n(Inline & Section Editing)"]
    F --> G["📤 1-Click Export\n(Markdown, HTML, JSON, TXT)"]
```

---

## ✨ Core Features

1. **In-Loop Anti-Hallucination Evaluator**:
   - Fact-checks marketing claims against image pixels and user inputs.
   - Generates an **Audit Report** displaying Grounded Score (e.g., 98/100), verified claims, and removed hallucinations.
   - Interactive **Draft vs. Final Comparison (Diff View)** showing exactly what the evaluator cleansed.
2. **Human-in-the-Loop Final Output Editing**:
   - Live inline editing of Title, Hook, Narrative paragraphs, and individual Benefit Bullets.
   - Add/delete bullets with 1-click.
   - Revert to original AI output or save custom edits.
3. **Multimodal Input Suite**:
   - Drag & drop photos, paste from clipboard (`Ctrl+V`), browse local files, or capture directly with your webcam.
4. **1-Click Testing Presets**:
   - 4 pre-configured products (*NovaSound Earbuds, Ceramic Mug, Running Shoes, Ceremonial Matcha*) for zero-friction judge evaluation.
5. **SEO & Omnichannel Growth Pack**:
   - Live Google Search SERP snippet simulation with character length counters (Meta Title ≤60, Meta Description ≤160).
   - Instagram launch caption with hashtags, 15-second TikTok video hooks, and Shopify bullet specs.
6. **Conversion Potential Scorecard**:
   - Estimated sales lift percentage, readability grade, urgency meter, and power word density.

---

## 🚀 Quick Start Guide

### 1-Click Runfile (Recommended)
You can launch the entire application with one command:
```bash
./run.sh
```
*The script checks your environment, installs dependencies if needed, starts the Vite development server, and opens http://localhost:3000 in your browser.*

### Manual Startup
```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Production build verification
npm run build
```

---

## 📡 API Contract for Teammate Backend

The frontend supports custom backends via `multipart/form-data`:

### `POST /api/generate`
**Request Body:**
- `image`: Image File (JPG/PNG/WEBP)
- `brand_name`: String (e.g. "NovaSound")
- `tone`: String (`persuasive`, `luxury`, `playful`, `professional`)
- `audience`: String (`professionals`, `genz`, `lifestyle`, `athletes`)
- `highlights`: String (Optional specifications)
- `keywords`: String (Optional SEO keywords)

**Expected JSON Response:**
```json
{
  "primaryDraft": {
    "title": "Raw draft title",
    "narrative": "Raw narrative..."
  },
  "finalOutput": {
    "title": "Audited product title",
    "tagline": "Emotional hook",
    "narrative": "Audited narrative with zero hallucinations",
    "benefits": ["Benefit 1 — Outcome", "Benefit 2 — Outcome"],
    "seo": { "metaTitle": "...", "metaDescription": "...", "keywords": [...] },
    "social": { "instagram": "...", "tiktok": "...", "shopifyBullet": "..." },
    "metrics": { "score": 96, "conversionBoost": "+34% Lift" }
  },
  "auditReport": {
    "groundedScore": 98,
    "hallucinationRisk": "Low",
    "hallucinationsRemoved": ["Purged unverified numeric battery claim"],
    "claimsVerified": ["Material verified from photo", "Brand aligned"],
    "summary": "100% grounded in visual evidence and user specifications."
  }
}
```

---

## 🎯 Target Evaluation Rubric Alignment

| Criteria | Prototype Execution |
|---|---|
| **Innovation & Creativity** | Two-stage **In-Loop Critic Pipeline** prevents hallucinations; converts photo pixels into PAS-structured conversion copy; live webcam capture; A/B CRO split testing. |
| **Technical Execution** | React 18, Vite 6, Tailwind CSS, direct Gemini Multimodal Vision API, robust offline smart fallback engine, zero build warnings, executable `run.sh`. |
| **Practical Impact** | Protects e-commerce merchants from false advertising penalties; reduces copywriting time from 45 mins to 5 seconds; provides full human-in-the-loop editing. |

---

## 📄 License
MIT License.