# DESIGN.md — Tri-Color Design System & Theme Guidelines

This document outlines the core design tokens, color palette, typography scaling, and component layout guidelines for maintaining a cohesive tri-color aesthetic across the application.

---

## 1. Color Palette & Tokens

The tri-color system is structured around three primary anchors: a dominant foundational tone, a vibrant accent, and a high-contrast supporting neutral.

| Token Name | Hex Code | Tailwind Equivalent / Custom Var | Usage Context |
| :--- | :--- | :--- | :--- |
| **Primary (Base)** | `#0F172A` | `bg-slate-900` | Backgrounds, dark surface containers, primary text, and high-contrast structural elements. |
| **Secondary (Accent)** | `#6366F1` | `bg-indigo-500` / `text-indigo-500` | Interactive states, primary action buttons, active borders, and focus rings. |
| **Tertiary (Highlight)** | `#14B8A6` | `text-teal-400` / `border-teal-500` | Badges, success indicators, glowing accents, and secondary call-to-action highlights. |
| **Neutral Surface** | `#1E293B` | `bg-slate-800` | Card backgrounds, modals, dropdown containers, and elevated panels. |
| **Neutral Muted** | `#94A3B8` | `text-slate-400` | Secondary body text, placeholder states, and subtle border dividers (`border-slate-700`). |

---

## 2. Typography Scale

Clean modular scale built for readability across high-density layouts and terminal-inspired dark environments.

- **Display / H1**: `2.25rem` (36px) — Line height: `2.5rem`, Weight: `700`, Color: `#F8FAFC`
- **Heading 2 / H2**: `1.875rem` (30px) — Line height: `2.25rem`, Weight: `600`, Color: `#F1F5F9`
- **Heading 3 / H3**: `1.5rem` (24px) — Line height: `2rem`, Weight: `600`, Color: `#E2E8F0`
- **Body Large**: `1.125rem` (18px) — Line height: `1.75rem`, Weight: `400`, Color: `#CBD5E1`
- **Body Base**: `1rem` (16px) — Line height: `1.5rem`, Weight: `400`, Color: `#94A3B8`
- **Caption / Mono**: `0.875rem` (14px) — Line height: `1.25rem`, Weight: `500`, Font family: `JetBrains Mono`, monospace

---

## 3. Spacing & Layout Tokens

Consistent spacing scale based on a `4px` grid multiplier.

- **`space-1`**: `4px` (Tight gaps, icon padding)
- **`space-2`**: `8px` (Inline element separation)
- **`space-4`**: `16px` (`p-4`, standard card padding, form field gaps)
- **`space-6`**: `24px` (`p-6`, section padding, container gutters)
- **`space-8`**: `32px` (`p-8`, major layout spacing)
- **Border Radius**: `8px` (`rounded-lg`) for interactive cards and panels; `4px` (`rounded-md`) for buttons and badges.

---

## 4. Component Rules

### Buttons & Interactive Elements
- **Primary Button**: Filled with the **Secondary (Accent)** color (`#6366F1`), white text, `rounded-md`, and smooth `hover:bg-indigo-600 hover:opacity-90 transition-all`.
- **Secondary / Outline Button**: Transparent background with a **Neutral Muted** border (`border-slate-700`), shifting to a **Tertiary (Highlight)** border (`border-teal-400`) on hover.
- **Focus States**: All focusable elements must display a `2px` ring matching the **Secondary** accent color (`ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900`).

### Cards & Panels
- Surface background must use **Neutral Surface** (`#1E293B`) layered over the **Primary (Base)** canvas (`#0F172A`).
- Subtle borders (`1px solid #334155`) paired with soft drop shadows (`shadow-xl`) to create clean elevation without heavy visual clutter.