---
name: Synthetic Intelligence Process Console
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353942'
  surface-container-lowest: '#0a0e16'
  surface-container-low: '#181c24'
  surface-container: '#1c2028'
  surface-container-high: '#262a33'
  surface-container-highest: '#31353e'
  on-surface: '#dfe2ee'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#dfe2ee'
  inverse-on-surface: '#2c3039'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#c0c1ff'
  on-tertiary: '#1000a9'
  tertiary-container: '#9699ff'
  on-tertiary-container: '#1d17b2'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#0f131c'
  on-background: '#dfe2ee'
  surface-variant: '#31353e'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies the precision, depth, and focused intelligence of an enterprise-grade AI diagnostic engine. It rejects consumer novelty in favor of an authoritative "operational cockpit" aesthetic: deeply immersive dark canvases layered with luminous, data-rich telemetry. 

The emotional response sought is absolute clarity under complexity, executive confidence, and high-velocity workflow execution. Visuals are grounded in calibrated technical minimalism mixed with targeted dark-mode glassmorphism, accentuating real-time machine intelligence through disciplined light emission rather than decorative clutter.

## Colors

The palette establishes an ultra-deep charcoal baseline with strategic chromatic accents to delineate system state, conversational flow, and business process telemetry:

- **Canvas & Surface Tiering:**
  - Base Canvas (`#0B0F17`): Deep structural void providing infinite contrast.
  - Surface Panel (`#111827`): Primary elevated plane for structured modular panels.
  - Surface Layered (`#1F2937`): Translucent structural backdrops and interactive wells.
  - Glass Border (`rgba(255, 255, 255, 0.08)`): Crisp boundary definition separating functional cards.

- **Luminescent Accent Roles:**
  - **Electric Emerald (`#10B981`):** Primary action token, verification state, system optimization milestones, and completed diagnostic nodes.
  - **Electric Cyan (`#06B6D4`):** Real-time AI agent status, dynamic speech waveforms, live processing signals, and focused field highlights.
  - **Hyper Indigo (`#6366F1`):** Secondary navigation links, pipeline orchestrations, and context tags.

- **Data & Text Hierarchy:**
  - Primary Content: `#F9FAFB` (high-contrast readouts).
  - Secondary Content: `#9CA3AF` (subtitles, metadata, keyboard shortcuts).
  - Muted/Inactive: `#4B5563` (disabled nodes, secondary track strokes).

## Typography

The typographic system pairs the razor-sharp geometric authority of **Space Grotesk** for display headers with the balanced readability of **Plus Jakarta Sans** for complex diagnostic questionnaires and transcript narratives. 

Technical identifiers, keyboard bindings, latency timings, and code outputs leverage **JetBrains Mono** to ground the conversational AI interface in programmatic reliability. All sizes above 24px strictly enforce tightened negative letter tracking to retain density against high-contrast dark backdrops.

## Layout & Spacing

The interface operates on a disciplined 12-column responsive fluid grid pinned to an absolute maximum layout width of 1440px for desktop diagnostic views. 

- **Desktop (>=1024px):** 12 columns, 24px gutters, 32px canvas margins. Left-hand dynamic stepper panel locks at a fixed 320px column width, while the core diagnostic conversational canvas fluidly occupies the remaining columns.
- **Tablet (768px - 1023px):** 8 columns, 20px gutters, 24px margins. Diagnostic questions collapse into a central interactive stack; step telemetry docks to a top horizontal micro-bar.
- **Mobile (<768px):** 4 columns, 16px gutters, 16px margins. Full single-column linear progression with persistent quick-answer actions docked to the safe viewport bottom.

## Elevation & Depth

Depth is defined through disciplined atmospheric luminescences rather than opaque drop shadows. Surfaces project layered priority through optical transmissivity and translucent boundaries:

1. **Layer 0 (Canvas):** Pure `#0B0F17` structural plane, accented occasionally by an extremely faint radial gradient mesh of `#10B98108` and `#06B6D406` placed off-center behind active AI nodes.
2. **Layer 1 (Card/Container Panels):** Background set to `rgba(17, 24, 39, 0.72)` combined with `backdrop-filter: blur(16px)` and a subtle 1px perimeter border of `rgba(255, 255, 255, 0.08)`.
3. **Layer 2 (Active/Floating Inspector Modals):** Background set to `rgba(31, 41, 55, 0.85)` with `backdrop-filter: blur(24px)`, bounded by a 1px border of `rgba(6, 182, 212, 0.3)`.
4. **Neon Perimeter Highlights:** Interactive elements in a focused or active processing state project an external glow using `box-shadow: 0 0 20px -4px rgba(16, 185, 129, 0.25)`.

## Shapes

The design system implements a controlled `roundedness: 2` (0.5rem / 8px base radius). This produces balanced corners that soften dark high-contrast visuals while maintaining the structural sharpness of an enterprise productivity terminal:

- Form fields, input boxes, and buttons use `8px` (`0.5rem`).
- Glassmorphic process cards and conversational dialogue bubbles scale to `rounded-lg` (`16px` / `1rem`).
- Floating command bars, neural badges, audio status pills, and keyboard shortcut chips leverage full pill styling (`9999px`).

## Components

### Buttons
- **Primary Action:** Solid `#10B981` fill with `#0B0F17` text (JetBrains Mono, bold), transition glow of `0 0 16px rgba(16, 185, 129, 0.4)` on hover.
- **Secondary Glass:** `rgba(255, 255, 255, 0.04)` fill, `1px solid rgba(255, 255, 255, 0.12)`, text in `#F9FAFB`. On hover: border transitions to `rgba(6, 182, 212, 0.5)`.

### Input Fields & Quick-Answer Tags
- **Input Fields:** Recessed `rgba(11, 15, 23, 0.6)` background, 1px border `rgba(255, 255, 255, 0.1)`. Focus states trigger a 1px border in `#06B6D4` paired with an inner glow.
- **Quick-Answer Tags:** Pill-shaped interactive tokens with `rgba(99, 102, 241, 0.1)` surface and `1px solid rgba(99, 102, 241, 0.25)`. When selected, they shift to `#10B981` text with an emerald glow.

### Process Cards & Glassmorphism Surfaces
- Glass containers utilize layered blur filters, 1px perimeter outlines, and internal paddings driven by `space-lg`. Selected cards illuminate with a perimeter boundary gradient from `#06B6D4` to `#10B981`.

### Keyboard Shortcuts (Kbd Badges)
- Inline components styled with `JetBrains Mono`, featuring a `rgba(255, 255, 255, 0.06)` background, subtle 1px border `rgba(255, 255, 255, 0.15)`, and a light box-shadow underneath simulating a mechanical key cap.

### Audio Wave & Neural Pulse Indicators
- Speech activity is visualized via an array of vertical pill bars fluctuating dynamically between 4px and 32px height, colored in `#06B6D4` with CSS animation pulses.
- Background process automation utilizes breathing neon boundary rings with infinite ease-in-out opacity scaling (`0.3` to `0.8`).

### Step Indicators
- Connected vertical and horizontal nodes with a 2px connective track (`rgba(255, 255, 255, 0.1)`). Completed steps display a solid `#10B981` node with an integrated check mark; the current active step pulses with an outer `#06B6D4` ring.