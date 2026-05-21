# Portfolio Shader Enhancement — Section-Specific WebGL + GitHub Pages

## Overview

Enhance the existing warm editorial portfolio with section-specific shader treatments, a neural particle field for the hero, and force-directed skill graph. Deploy to GitHub Pages. Builds on the existing redesign spec (2026-05-21-portfolio-redesign-design.md).

**Direction:** Technically impressive — advanced WebGL shaders, particle systems, interactive visualizations that showcase both AI/ML domain knowledge and frontend engineering skill.

---

## Section Shader Assignments

| Section | Shader Treatment | Technical Approach |
|---|---|---|
| Hero | Neural Particle Field | WebGL point cloud with simplex-noise-driven self-organization. 2000 particles max. Cursor acts as attention attractor. |
| About | Morphing Organic Blob | Single GLSL fragment shader — raymarched metaball in warm tones, slow deformation via layered noise. |
| Experience | Data Stream Lines | GLSL fragment — thin horizontal flowing lines like microservice pipelines, subtle parallax by scroll position. |
| Projects | Grid Wave Distortion | GLSL fragment — dot grid that ripples/distorts near card hover positions (passed as uniforms). |
| Skills | Force-Directed Skill Graph | R3F — interactive 3D graph. Nodes = skill categories, edges = relationships. Hover highlights connections. |
| Contact | Interactive Ripple Field | GLSL fragment — water ripple simulation from cursor position. Warm terracotta on cream. |

---

## Architecture

```
Shaders managed by SectionShaders.tsx:
  - Renders a full-screen WebGL canvas (or R3F canvas for Skills/Hero)
  - Uses Intersection Observer to detect visible section
  - Swaps GLSL programs or scene content based on active section
  - Respects prefers-reduced-motion (static gradient fallback)
  - Disabled below md breakpoint (CSS gradient fallbacks)

Shader source organization:
  src/shaders/
    neuralParticles.ts    — Hero particle field (WebGL + points)
    organicBlob.ts        — About metaball shader
    dataStreams.ts        — Experience flowing lines
    gridWave.ts           — Projects dot grid
    rippleField.ts        — Contact water ripple
    skillGraph.tsx         — Skills R3F force graph
```

---

## Component Changes

### New
- `src/components/SectionShaders.tsx` — manages which shader is active, handles WebGL context lifecycle
- `src/components/NeuralParticleField.tsx` — hero particle system (WebGL points, instanced rendering)
- `src/components/SkillGraph.tsx` — R3F force-directed graph for skills section

### Modified
- `src/App.tsx` — replace ShaderBackground + ThreeScene with SectionShaders
- `src/components/Hero.tsx` — remove old 3D references, integrate NeuralParticleField
- `src/components/About.tsx` — add organic blob shader background
- `src/components/Experience.tsx` — add data stream shader background
- `src/components/Projects.tsx` — add grid wave shader, enhance card tilt
- `src/components/Skills.tsx` — rebuild with SkillGraph component
- `src/components/Contact.tsx` — add ripple field shader background
- `src/index.css` — add section-specific CSS gradient fallbacks

### Removed
- `src/components/ShaderBackground.tsx` — replaced by SectionShaders
- `src/components/ThreeScene.tsx` — replaced by NeuralParticleField + SkillGraph

---

## GitHub Pages Deployment

### Vite Config
```ts
base: '/portfolio/'  // repo name; change to '/' for custom domain
```

### GitHub Actions Workflow
- Trigger: push to `main`
- Build: `npm ci && npm run build`
- Deploy: `dist/` → `gh-pages` branch via `peaceiris/actions-gh-pages`

### Post-Deploy
- Repo Settings → Pages → Source: `gh-pages` branch, `/ (root)`

---

## Performance Constraints

- Max 2 simultaneous WebGL contexts (hero particle field unloads when scrolled past)
- Particle count: 2000 max in hero, 100 max in skill graph
- Shader resolution: capped at devicePixelRatio ≤ 2
- Mobile (< md): all shaders replaced with CSS gradient fallbacks
- `prefers-reduced-motion`: all shader animation → static gradient
- Shader uniforms update via requestAnimationFrame; no per-frame React re-renders

---

## Edge Cases

- **WebGL unavailable:** CSS gradient fallbacks for every section
- **Context loss:** SectionShaders listens for `webglcontextlost`, falls back to CSS gradients
- **Tab visibility:** Pause rAF loops when tab hidden via `visibilitychange`
- **SSR/SSG safety:** All WebGL code behind `typeof window !== 'undefined'` guards
- **Touch devices:** Shaders render static (no mouse interaction), skill graph uses touch gestures
