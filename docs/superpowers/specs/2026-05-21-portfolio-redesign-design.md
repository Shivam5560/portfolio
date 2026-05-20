# Portfolio Redesign — Warm Editorial × Shaders × 3D

## Overview

Transform the current dark-themed portfolio into a warm, editorial light-theme portfolio with premium shader backgrounds, 3D elements, and AI/ML creative motifs. The design blends Hermes Agent's calm parchment warmth with bold creative motion and cutting-edge WebGL visuals.

**Target audience:** Recruiters, fellow engineers, potential collaborators — anyone evaluating an AI/ML engineer.

**Personality:** Sophisticated, creative, technically impressive. Warm and approachable, yet undeniably premium.

---

## Color System

| Token | Hex | Role |
|---|---|---|
| Warm Cream (canvas) | `#FCF9F5` | Page background, main surface |
| Warm Parchment | `#F5EDE4` | Card backgrounds, section alt |
| Terracotta | `#C47F5A` | Primary accent, warm emphasis |
| Plum | `#8B5E7C` | Secondary accent, depth |
| Dusty Blue | `#5B8A9E` | Tertiary accent, links |
| Sage | `#A0C8B0` | Fresh pop, success state |
| Rich Ink | `#0A0908` | Text, headings, contrast |
| Soft Sand | `#C6AC8F` | Metadata, borders, muted text |
| Warm Brown | `#5B3A29` | Gradient text base |

Gradient text on headings uses a 4-stop warm spectrum: `#5B3A29 → #C47F5A → #8B5E7C → #5B8A9E`.

---

## Typography

Split system inspired by Hermes Agent:

| Usage | Font | Weight | Size |
|---|---|---|---|
| Hero name | Georgia, serif | 700-800 | 46-54px |
| Section headings | Georgia, serif | 600-700 | 28-36px |
| Body / prose | Georgia, serif | 400 | 14-16px |
| UI labels, chips | -apple-system, Inter, sans-serif | 500-600 | 11-13px |
| Code, data | SF Mono, ui-monospace | 500 | 11px |
| Accent labels | Georgia, italic | 400 | 12-14px |

---

## Section Architecture

Same sections as current, fully redesigned:

1. **Navbar** — Transparent → frosted glass on scroll, serif logo mark
2. **Hero** — Shader background + 3D shapes, gradient name, skill chips, CTAs
3. **About** — Editorial two-column, portrait/text, background morphing blob
4. **Experience** — Timeline with scroll-triggered reveals, card-based
5. **Projects** — 3D tilt cards with gradient borders, featured + grid
6. **Skills** — Animated skill bars/circles, category groupings
7. **Education** — Clean timeline, minimal
8. **Contact** — Warm form or link cluster with shader accents
9. **Footer** — Minimal, ink-on-cream

---

## Animation System

Built on Framer Motion 12 (already installed).

### Scroll-Triggered
- **Reveal:** Elements fade + slide up on enter viewport (stagger children)
- **Parallax:** Background blobs/shapes move at different rates
- **Progress:** Section progress indicators

### Micro-Interactions
- **Magnetic buttons:** Spring physics on hover (already implemented, keep)
- **3D tilt cards:** Mouse-position-driven rotation (already implemented, enhance)
- **Hover glows:** Soft colored glow on interactive elements
- **Staggered text:** Character-by-character or word-by-word reveals

### Page-Level
- **Shader background:** Continuously flowing gradient noise, responds subtly to cursor
- **3D scene:** Geometric shapes orbiting in hero background via @react-three/fiber
- **Section transitions:** Color washes between sections

---

## Shader Background

**Implementation:** Custom GLSL fragment shader rendered full-screen behind content.

**Visual:** Warm gradient noise — terracotta, plum, dusty blue particles flowing slowly like an embedding space visualization. Organic, alive, subtle opacity so it doesn't distract from content.

**Technical:**
- Rendered via a full-screen canvas or @react-three/fiber plane
- Uses simplex/perlin noise for organic flow
- Color palette matches the warm light system
- Subtle mouse interaction — noise field shifts slightly toward cursor
- Low GPU impact: single quad, lightweight shader

---

## 3D Elements

**Implementation:** @react-three/fiber + @react-three/drei in hero background.

**Elements:**
- 2-3 floating geometric shapes (icosahedron, torus knot, octahedron)
- Wireframe or semi-transparent materials in warm palette colors
- Slow autonomous rotation + subtle mouse-driven parallax
- `Float` component from drei for gentle bobbing

**Constraint:** Rendered behind content, low poly count, no heavy post-processing. Must run smoothly on mid-range devices.

---

## AI/ML Creative Motifs

Visual metaphors woven throughout:

| Motif | Implementation | Where |
|---|---|---|
| Embedding particles | Small colored dots drifting/orbiting in shader | Hero bg, section transitions |
| Neural connections | Thin animated SVG/framer lines between nodes | Project cards, about section |
| Token cascade | Staggered text reveals like streaming tokens | Hero name, section headings |
| Attention highlight | Subtle blur→focus transitions on scroll | Section reveals |
| Data matrix | Warm-toned character rain (subtle, decorative) | Background layer |

---

## Component Architecture

```
src/
├── App.tsx                    # Main layout orchestration
├── main.tsx                   # Entry point
├── index.css                  # Tailwind + custom theme tokens
├── components/
│   ├── ShaderBackground.tsx   # NEW: GLSL shader canvas
│   ├── ThreeScene.tsx         # NEW: 3D geometric elements
│   ├── Navbar.tsx             # Redesign: warm light
│   ├── Hero.tsx               # Redesign: shader + 3D + editorial
│   ├── About.tsx              # Redesign: editorial layout
│   ├── Experience.tsx         # Redesign: warm timeline
│   ├── Projects.tsx           # Redesign: enhanced tilt cards
│   ├── Skills.tsx             # Redesign: animated indicators
│   ├── Education.tsx          # Redesign: clean timeline
│   ├── Contact.tsx            # Redesign: warm form
│   ├── Footer.tsx             # Redesign: minimal ink
│   ├── Reveal.tsx             # Enhanced: more animation variants
│   ├── SectionTransition.tsx  # NEW: color-wash transitions
│   └── Icons.tsx              # Keep existing
```

---

## Technical Stack

| Package | Purpose | Status |
|---|---|---|
| react + react-dom 19 | UI framework | Installed |
| typescript 6 | Type safety | Installed |
| tailwindcss 4 | Styling | Installed |
| framer-motion 12 | Animations | Installed |
| lucide-react | Icons | Installed |
| three | 3D library | **New** |
| @react-three/fiber | React Three.js renderer | **New** |
| @react-three/drei | Three.js helpers | **New** |
| vite 8 | Build tool | Installed |

---

## Edge Cases & Constraints

- **Mobile:** Shader and 3D elements disabled or severely simplified below `md` breakpoint
- **Performance:** 3D scene uses low poly counts, shader is single-pass. `prefers-reduced-motion` respected
- **Accessibility:** All text content readable without animations. Color contrast meets WCAG AA on light background
- **Loading:** Shader/3D assets load progressively, content visible immediately
- **Fallback:** If WebGL unavailable, fall back to CSS gradient blobs (similar to current MeshGradient)
