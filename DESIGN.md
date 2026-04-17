# Design Brief

**App Type:** Government Health Platform | Bangladesh | Admin + Customer Portal

## Tone
Professional, authoritative, trustworthy, calming. Minimal decoration. High information density. Security-focused.

## Differentiation
Card-based layout with distinct surface treatments. Admin panel: sidebar navigation with clear hierarchy. Customer portal: centered, minimal distractions. All surfaces intentionally differentiated (card, sidebar, popover). Strong visual hierarchy through color and spacing.

## Palette

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| Primary | 0.55 0.15 255 (Blue) | 0.75 0.15 255 | Authority, trust, healthcare, CTAs |
| Secondary | 0.65 0.12 155 (Green) | 0.75 0.12 155 | Health, vitality, accent only |
| Muted | 0.92 0 0 (Light Grey) | 0.2 0 0 | Backgrounds for sections |
| Destructive | 0.55 0.22 25 (Red) | 0.65 0.19 22 | Danger, delete, warnings |
| Border | 0.88 0 0 | 0.25 0 0 | Subtle divisions |

## Fonts

| Category | Font | Weight | Purpose |
|----------|------|--------|---------|
| Display | Space Grotesk | 400–700 | Headings, admin labels |
| Body | Plus Jakarta Sans | 400–700 | Content, form labels, descriptions |
| Mono | JetBrains Mono | 400–700 | Transaction IDs, data, reference numbers |

## Radius & Depth
- Border radius: 6px (cards), 4px (inputs), 0px (buttons)
- Shadows: `subtle` (0 2px 4px) for cards, `elevated` (0 4px 12px) for modals
- Elevation: `card-elevated` utility for surfaces

## Structural Zones

| Zone | Surface | Treatment |
|------|---------|-----------|
| Header | Card | Subtle border-bottom, shadow-subtle |
| Sidebar | Sidebar tokens | Light background, border-right, primary accent for active |
| Main Content | Background | Muted/40 for alternating sections |
| Card Grid | Card tokens | border-border, rounded-md, shadow-subtle |
| Footer | Muted/30 | border-top, lighter background |

## Component Patterns
- **Input fields:** `bg-input`, `border-border`, `focus:ring-1 focus:ring-ring`
- **Buttons:** Primary (bg-primary), Secondary (bg-muted), Destructive (bg-destructive) with hover states
- **Form labels:** Bold, font-display, 0.18 lightness (dark text on light)
- **Data tables:** Alternating row backgrounds using `muted/50`
- **Modals:** Card with elevated shadow, centered on screen

## Motion
- **Smooth transition:** 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- **Interactive states:** Opacity changes on hover/focus, no bounce or decoration
- **Page transitions:** Fade in/out 200ms (if needed for SPA)

## Constraints
- No gradients, decorative icons, or animations beyond transitions
- High contrast for accessibility (AA+)
- Mobile-first: `sm:` (640px), `md:` (768px), `lg:` (1024px)
- Dark mode: intentionally tuned (not inverted lightness), enhanced for readability

## Signature Detail
Clean card separations with subtle borders and shadows create visual rhythm without decoration. Information hierarchy through color (primary blue for actions, muted for secondary) and typography (display font for headings, body for content). Trustworthy through restraint—every element has purpose.
