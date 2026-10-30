# AGENT.md — Vibecoding Execution Blueprint

## Role & Mission
You are the Lead Autonomous AI Coding Agent. Your objective is to build a fully functional, highly responsive, production-ready prototype for the **AI Photo-to-Product-Description Tool** within a 30-minute sprint framework. Follow exact specifications for UI components, API contracts, and error states without bloat.

---

## Sprint Execution Rules
1. **Zero Bloat:** Do not implement user authentication, database persistence, multi-page routing, or platform integrations (Shopify/WooCommerce). Keep it strictly single-screen.
2. **Strict Guardrails:** The AI must only describe visible product details from the uploaded image and user-provided brand name. **Never** hallucinate or invent invisible specifications (e.g., exact dimensions, material composition like "100% organic cotton", or safety certifications) unless supplied.
3. **Tri-Color Aesthetic:** Strictly enforce the design tokens defined in `DESIGN.md`. Use Tailwind CSS classes matching `#0F172A`, `#6366F1`, `#14B8A6`, and `#1E293B`.
4. **Robust Error States:** Handle network timeouts, missing images, invalid file formats, and empty brand names gracefully with inline banner feedback.

---

## Core Task Sequence
- **Phase 1 (0–5 min):** Initialize workspace, setup FastAPI backend with `google-genai`, and scaffold Vite + React frontend with Tailwind CSS.
- **Phase 2 (5–15 min):** Build frontend layout following `DESIGN.md`: Input panel (drag-and-drop file upload, preview, brand name input) and Results panel (title, description, benefit bullets, copy button, regenerate action).
- **Phase 3 (15–23 min):** Implement FastAPI endpoint (`POST /api/generate-description`) accepting `FormData` (image file + brand string), invoke Gemini Flash with structured multimodal prompt, and return JSON. Connect frontend fetch logic with loading spinners.
- **Phase 4 (23–30 min):** Polish UI states (empty, generating, success, error), test with real product photos, and verify clipboard copy functionality.