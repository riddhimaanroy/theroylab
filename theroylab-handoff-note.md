# TheRoyLab.com — Portfolio Website Handoff Note

> **Date:** March 24, 2026
> **Owner:** Riddhimaan Roy
> **Domain:** theroylab.com (registered on Cloudflare, deployed on Vercel)
> **GitHub:** github.com/riddhimaanroy/theroylab
> **Live URL:** https://theroylab.com
> **Vercel Dashboard:** vercel.com (logged in as riddhimaanroy)

---

## Project Overview

Personal portfolio website for Riddhimaan Roy, Senior Data Scientist. Inspired by dennissnellenberg.com (W2) and kysondana.com (W1). Built with React + GSAP + Lenis. Dark, typography-forward, minimal but impactful design.

---

## Project Location on Local Machine

```
C:\Users\riddh\portfolio-website\hero-v2\        ← ACTIVE project (deployed)
C:\Users\riddh\portfolio-website\hero-v2-frozen\  ← Backup of hero section only
C:\Users\riddh\portfolio-website\hero-v2-backup\  ← Another backup
```

**Skill file location:**
```
C:\Users\riddh\portfolio-website\.claude\skills\portfolio-website-designer\SKILL.md
C:\Users\riddh\portfolio-website\.claude\skills\portfolio-website-designer\references\portfolio-website-blueprint.md
```

---

## Tech Stack

- **React 18** — functional components, hooks
- **GSAP 3 + ScrollTrigger** — scroll animations, parallax, text reveals
- **Lenis** — smooth scroll
- **Framer Motion** — mount/unmount transitions (could be removed to save ~90KB)
- **Vite** — build tool, dev server
- **CSS Modules** — scoped styles per component

**Build stats:** 117KB gzipped total. Clean build, no warnings. 5 runtime dependencies.

---

## Architecture

```
hero-v2/src/
├── components/
│   ├── Hero/           ← Hero section (warm beige bg, photo, name parallax)
│   ├── About/          ← About section (typography, constellation, LinkedIn bubble)
│   │   ├── About.jsx
│   │   ├── About.module.css
│   │   ├── Constellation.jsx    ← Canvas dot network + shooting stars
│   │   └── MagneticBubble.jsx   ← LinkedIn magnetic bubble
│   ├── Loader/         ← Greeting intro (Hello/Namaste cycling)
│   │   └── GreetingLoader.jsx
│   ├── Projects/       ← Project list + Toolkit cards
│   │   ├── Projects.jsx          ← W2-style hover project list
│   │   ├── ProjectPreview.jsx    ← Cursor-following image preview
│   │   ├── CapabilityCards.jsx   ← "THE TOOLKIT" animated cards
│   │   └── Projects.module.css
│   ├── Contact/        ← Contact/footer section
│   │   └── Contact.jsx
│   ├── Nav/            ← Navigation + hamburger menu
│   │   ├── Nav.jsx
│   │   └── SlideOutMenu.jsx
│   └── Cursor/         ← Custom cursor (if separate component)
├── hooks/
│   └── useSmoothScroll.js
├── utils/
│   └── lerp.js
├── data/
│   └── projects.json
├── styles/
│   └── globals.css
└── main.jsx
```

---

## Sections — Current State

### Section 1: Hero (FROZEN ✅)
- Warm beige background (#D4CBC2 range)
- Placeholder photo (Unsplash — man with cap, looking to side)
- Name "Riddhimaan Roy" in thin font-weight at bottom, drifts horizontally on scroll
- "Senior Data Scientist" label with arrow, right side
- "Located in India" badge, bottom-left
- Navigation: "Riddhimaan Roy" left, "Work | About | Contact" right, hamburger button far right
- Greeting intro: cycles Hello/Namaste/Konnichiwa/Bonjour/Hola on dark screen before hero reveals
- Ombre transition: warm beige gradually blends into dark #1C1D20 for the About section
- Photo parallax: moves at ~0.5x scroll speed (slower than other elements)

### Section 2: About (DONE ✅)
- Dark background #1C1D20
- "01 / ABOUT" label
- Headline: "I hunt for the signal everyone else missed." — word-by-word spotlight animation on scroll
- Bio text about Mastercard, Accenture, 8 years, NLP
- Metadata pills: Mastercard, Accenture, NLP, 8 Years
- LinkedIn magnetic bubble (beige, 140px, blue icon, opens linkedin)
- Canvas constellation: dots connect to cursor, turn blue near LinkedIn bubble
- Shooting stars: random streaks every 4-6 seconds
- Beige accent line between headline and body text

### Section 3: Projects / Work (DONE ✅)
- Transitions from dark to beige background (ombre)
- "RECENT WORK" label
- 4 project rows with hover image previews (cursor-following)
  - Transaction Classifier — NLP & Text Classification
  - Churn Predictor — Predictive Analytics
  - Visual Inspector — Computer Vision
  - Fraud Shield — Real-time ML Systems
- Cursor expands to show "View" on hover
- "More work" pill button at bottom

### Section 4: The Toolkit (DONE ✅)
- Same beige background, continuation of Projects section
- "THE TOOLKIT" label + subheadline
- 10 animated capability cards in 2 rows (5 each)
  - Top row scrolls LEFT on page scroll
  - Bottom row scrolls RIGHT on page scroll
- Cards: Python & R, NLP & Transformers, Predictive Modeling, Computer Vision, Real-time Systems, Dashboards & Viz, Deep Learning, Cloud & MLOps, SQL & Data Eng, Rapid Prototyping
- Each card has unique CSS animation inside (code typing, charts drawing, counters, etc.)

### Section 5: Contact / Footer (DONE ✅)
- Curved SVG divider between beige and dark
- Dark background #1C1D20
- "Let's work together" headline with circular photo
- "Get in touch" magnetic bubble (accent blue #455CE9)
- Email: riddhimaan1994roy@gmail.com (pill button)
- Phone: +91-8390160679 (pill button)
- Footer bar: VERSION (2026 © Edition), LOCAL TIME (live JS clock), SOCIALS (LinkedIn, GitHub, Twitter)

### Hamburger Menu (DONE ✅)
- Slide-out from right, dark background
- Navigation items: Home, Work, About, Contact
- Socials row at bottom

---

## Phase 2: What Needs to Be Done

### Priority Fixes (Bugs / Incomplete)
1. **Toolkit card borders** — borders keep failing to apply. Need manual CSS edit with !important or direct inline styles
2. **Curved divider direction** — currently concave (dipping down), should be convex (bulging up into beige). SVG path needs correction
3. **"Riddhimaan Roy" name persists** — should fade out after hero section via GSAP ScrollTrigger
4. **Hamburger X transition** — hamburger icon doesn't animate into X when menu opens. Same button should toggle with CSS transform rotation
5. **Hamburger button color** — should be dark on beige sections, light on dark sections, blue when menu is open
6. **Contact section arrow** — random floating arrow, either fix position or remove entirely
7. **Magnetic bubble pull range** — LinkedIn and "Get in touch" bubbles need larger detection range (~350-400px) and stronger displacement (~40-50px)

### Content Updates
8. **Replace placeholder photo** with Riddhimaan's actual photo (hero section)
9. **Update social URLs** with real LinkedIn, GitHub, Twitter profiles
10. **Review all copy** — headline, bio, project descriptions
11. **Add a real profile photo** to the contact section circular image

### Mobile Optimization
12. Hide/disable canvas constellation on mobile (performance)
13. Stack layouts vertically on screens < 768px
14. Adjust font sizes for mobile
15. Hide cursor effects on touch devices
16. Toolkit cards: single column, no parallax on mobile
17. Test on 375px (iPhone SE), 390px (iPhone 14), 768px (iPad)

### SEO & Meta
18. Add page title: "Riddhimaan Roy | Senior Data Scientist — TheRoyLab"
19. Add meta description
20. Add Open Graph tags (og:title, og:description, og:image) for social sharing
21. Add favicon
22. Add structured data (JSON-LD for Person)
23. Add robots.txt and sitemap.xml

### Performance Optimization
24. Consider removing framer-motion (~90KB) — replace with GSAP/CSS
25. Optimize images (use WebP, add width/height attributes)
26. Lazy load below-fold sections
27. Add font preloading to prevent FOUT

### Nice-to-Haves
28. Page loader animation (counter 0→100 or similar before greeting)
29. Cursor "View" label on project hover
30. Elastic menu opening animation (curved clip-path)
31. Menu items stagger animation on open
32. Back-to-top smooth scroll
33. Keyboard accessibility (tab navigation, focus states)

---

## Deployment Workflow

Any time changes are made:
```powershell
cd C:\Users\riddh\portfolio-website\hero-v2
git add .
git commit -m "description of what changed"
git push
```
Vercel auto-deploys from GitHub. Live site updates in ~30 seconds.

---

## Design System Reference

### Colors
- Hero background: warm beige (#D4CBC2 or #E8E4DE)
- Dark sections: #1C1D20
- Primary text (on dark): #E8E8E8
- Secondary text: #999999
- Accent: #455CE9 (blue — used sparingly)
- Beige accent: #D4CBC2 (lines, pill borders, constellation dots)
- LinkedIn blue: #0A66C2

### Typography
- Display font: thin/light weight (300), used for hero name and "Let's work together"
- Headline font: bold (700), used for section headlines
- Body font: regular weight, #C8C8C8 on dark backgrounds
- Labels: uppercase, letter-spacing +0.1em, small size, #999

### Animation Easing
- Smooth reveals: cubic-bezier(0.76, 0, 0.24, 1)
- Snappy interactions: cubic-bezier(0.25, 1, 0.5, 1)
- In-out: cubic-bezier(0.87, 0, 0.13, 1)
- Never use linear or default ease

### Reference Sites
- W1: kysondana.com (wide project cards, multilingual greeting, editorial layout)
- W2: dennissnellenberg.com (dark bg, thin type, custom cursor, magnetic buttons, GSAP + Locomotive)

---

## How to Start a Phase 2 Chat

Paste this at the start of any new Claude/Claude Code session:

```
I'm continuing work on my portfolio website theroylab.com.

Project: C:\Users\riddh\portfolio-website\hero-v2
Skill file: .claude/skills/portfolio-website-designer/SKILL.md
GitHub: github.com/riddhimaanroy/theroylab
Live: theroylab.com (auto-deploys from GitHub via Vercel)
Cloudflare: DNS for theroylab.com

Read the SKILL.md and blueprint before making changes. The hero section is FROZEN — do not modify it.

[Then describe what you want to work on]
```

---

## Account Credentials (services used)
- **Cloudflare** — domain registrar + DNS (riddhimaan1994roy@gmail.com)
- **Vercel** — hosting + deployment (GitHub OAuth login)
- **GitHub** — code repository (riddhimaanroy)

---

*This document is the complete context for continuing the build. Reference it at the start of each Phase 2 session.*
