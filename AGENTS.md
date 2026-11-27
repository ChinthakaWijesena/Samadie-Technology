# AGENTS.md — Samadie Technology (samadie.lk)

Instructions for AI coding agents (Claude Code, Cursor, Codex, Copilot, etc.) working on this repository.
Read this whole file before changing anything.

---

## 1. Mission

Rebuild and polish **https://www.samadie.lk/** into a **modern, fast, animated, fully responsive** website that looks like a premium tech brand, while keeping all real business information exactly as it is.

**Goal in one line:** a dark, precise, "micro-soldering / circuit board" themed one-page site with smooth animations, modern CSS, and a flawless mobile experience.

Keep it **lightweight**. Most visitors are on mobile data in Sri Lanka, so speed matters as much as looks.

---

## 2. Business context (do not change facts)

**Samadie Technology** is a computer repair shop and hardware store in Bibile, Sri Lanka. It specialises in **laptop motherboard chip-level repair** (BGA, micro-soldering) and also sells computers and accessories.

| Field | Value (keep exactly) |
|---|---|
| Name | Samadie Technology |
| Address | No 18, Rathupasketiya Road, Bibile |
| Telephone | 055 2265005 (`tel:0552265005`) |
| Mobile / WhatsApp | 077 3152001 (`https://wa.me/94773152001`) |
| Facebook | https://www.facebook.com/SamadieTechnolnogy (the spelling is intentional, do not "fix" the URL) |
| Google Maps | Keep the existing Google Maps link from the current site |
| Domain | https://www.samadie.lk/ |
| Footer | © 2026 Samadie Technology. All rights reserved. |

**Page title:** `Samadie Technology | Specialist Chip-Level Repairs & Computer Store`
**Meta description:** `No 18, Rathupasketiya Road, Bibile. Specialists in laptop motherboard repairs, computer sales, and tech accessories.`

### Current page structure (keep these section IDs and nav order)

1. **Header / Nav:** Home (`#home`), Repairs (`#services`), Inventory (`#products`), Contact (`#contact`), plus a **Chat Now** WhatsApp button
2. **Hero (`#home`):** "Expert Laptop Motherboard Repair", sub-text, buttons *View Sales* and *Locate Us*, hero image
3. **Services (`#services`):** Motherboard Chip Level, BIOS & IC Programming, Display & Hinges
4. **Products (`#products`):** Premium Laptops (from 45,000 LKR), Laptop Motherboards (contact for price), High-Speed Storage (SATA & NVMe SSD, 128GB to 1TB), HD & IPS Monitors, Printers & Scanners (EPSON, Canon, HP), RAM Upgrades (DDR2 to DDR5)
5. **Contact (`#contact`):** address, phone, WhatsApp, Facebook, Google Maps card
6. **Footer**

### Content rules

- **Never invent** opening hours, prices, stats, years in business, customer counts, reviews, testimonials, warranty claims, or brand logos that are not listed above. If something is missing, leave a clearly marked `<!-- TODO: ask owner -->` comment instead.
- Only mention brands already on the site: HP, Dell, ASUS, Acer, EPSON, Canon.
- Copy may be tightened or improved for clarity, but the meaning must stay the same.
- Language is English. Keep markup ready for an optional Sinhala version later (`lang` attributes, no text baked into images).

---

## 3. First steps for the agent

1. **Inspect the repo.** If it already uses a framework or build tool (Astro, Next, Vite, Tailwind, etc.), **follow it**. Do not migrate stacks without being asked.
2. If the repo is empty or plain HTML, use the **default stack** below.
3. Make a short plan, then implement in small steps. Keep the site working after every step.
4. Run the checks in section 12 before saying you are done.

### Default stack (plain static site)

```
/
├─ index.html
├─ AGENTS.md
├─ css/
│  └─ styles.css          # single file, organised with @layer
├─ js/
│  └─ main.js             # vanilla JS, ES modules, < 15 KB
├─ assets/
│  ├─ img/                # self-hosted, optimised (AVIF/WebP + fallback)
│  ├─ icons/              # inline SVG preferred
│  └─ fonts/              # optional self-hosted variable fonts
├─ favicon.svg
├─ robots.txt
└─ sitemap.xml
```

- No jQuery, no Bootstrap, no heavy animation libraries. Plain CSS and a little vanilla JS are enough.
- If a library is truly needed (for example GSAP), explain why in the PR/summary first.

---

## 4. Design direction

**Concept:** "Precision engineering". Think dark PCB board, glowing traces, gold solder pads, clean glass panels. Professional, trustworthy, a bit futuristic, never cluttered.

**Mood words:** precise, technical, confident, clean, glowing, smooth.

### Colour tokens (dark theme first)

Define as CSS custom properties on `:root`. Use `color-mix()` for tints instead of adding new hex values.

```css
:root {
  --bg:        #0a0e14;   /* page background */
  --surface:   #111823;   /* cards */
  --surface-2: #172131;   /* raised / hover */
  --line:      #243044;   /* borders */
  --text:      #e6edf3;
  --muted:     #8b98a9;
  --accent:    #22d3ee;   /* electric cyan: traces, links, focus */
  --accent-2:  #fbbf24;   /* solder gold: prices, highlights */
  --success:   #25d366;   /* WhatsApp only */
  --radius:    16px;
  --shadow:    0 10px 40px -10px rgb(0 0 0 / .6);
}
```

- Text on background must pass **WCAG AA** (4.5:1 for body text).
- Use accent colours sparingly: one main accent (cyan) and one highlight (gold). WhatsApp green is only for the chat button.
- Optional: add a light theme via `prefers-color-scheme` or a toggle. Dark is the default and priority.

### Typography

- **Headings:** `Space Grotesk` or `Sora` (600 to 700)
- **Body:** `Inter` (400 to 500)
- **Labels, prices, tags:** `JetBrains Mono` (gives the "chip spec" feel)
- Self-host as variable `woff2` if possible. Otherwise Google Fonts with `preconnect` and `display=swap`.
- Always set a good fallback stack (`system-ui, -apple-system, "Segoe UI", sans-serif`).
- Use **fluid type** with `clamp()`:

```css
--step-0: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
--step-3: clamp(2rem, 1.4rem + 3vw, 3.75rem);   /* h1 */
```

- Add `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs.

### Layout and spacing

- Container: `width: min(1200px, 100% - 2rem); margin-inline: auto;`
- Spacing scale based on `clamp()` (for example `--space-section: clamp(4rem, 8vw, 8rem)`).
- Generous white space. One clear focal point per section.
- Cards use rounded corners, 1px border, subtle inner glow. Glass effect with `backdrop-filter: blur()` only where it helps (header, floating elements).

### Section ideas

- **Hero:** big headline with a gradient accent word ("Motherboard"), two CTA buttons, hero image inside a glowing frame with animated circuit traces behind it. A small status chip such as "Chip-level repair specialists" is fine (no fake claims).
- **Services:** 3 cards with inline SVG icons (chip, code/BIOS, screen). Number labels `01 / 02 / 03` in mono font.
- **Products:** **bento grid** on desktop. Laptops is a large tile, Motherboards is a wide tile, the rest are small tiles. Collapses to a single column on mobile (or a horizontal scroll-snap row for the small tiles).
- **Brand strip:** slow marquee of text logos: HP, Dell, ASUS, Acer, EPSON, Canon. Text only, no copyrighted logo files.
- **Contact:** two columns on desktop (details + map card), stacked on mobile. Big tap-friendly buttons for **Call**, **WhatsApp**, **Directions**.
- **Footer:** minimal, repeats address and phone.

---

## 5. Modern CSS requirements

Use current, well-supported CSS. Add `@supports` or a plain fallback for anything newer.

- **Architecture:** `@layer reset, tokens, base, layout, components, utilities;`
- **Native nesting**, `:is()`, `:where()`, `:has()`
- **Logical properties** (`margin-inline`, `padding-block`, `inset`)
- **Grid and Flexbox** with `repeat(auto-fit, minmax(min(100%, 280px), 1fr))`
- **Subgrid** for card rows so titles and prices line up
- **Container queries** (`container-type: inline-size`) for card internals
- `aspect-ratio`, `object-fit`, `clamp()`, `min()`, `max()`
- `color-mix()` and optionally `oklch()` for tints and gradients
- `@property` for animatable gradient angles/positions
- `dvh` / `svh` units for full-height hero (never plain `100vh` on mobile)
- `scroll-behavior: smooth` and `scroll-margin-top` on sections (account for sticky header)
- `scroll-snap` for horizontal mobile carousels
- `accent-color`, `color-scheme: dark`
- `@starting-style` or `popover` / `<dialog>` for the mobile menu where practical

**Do not:** use `!important` (except in the reduced-motion reset), inline styles, ID selectors for styling, or deep selector chains. Keep specificity low and use BEM-ish class names (`.card`, `.card__title`, `.card--wide`).

---

## 6. Animation requirements

Animations must feel **smooth, purposeful, and subtle**. Animate only `transform` and `opacity` where possible (GPU friendly). Never animate `width`, `height`, `top`, or `left`.

### Must-have

1. **Page load:** hero headline, paragraph, buttons, and image fade-up with a staggered delay (`animation-delay` using a `--i` custom property).
2. **Scroll reveal:** sections and cards fade/slide in as they enter the viewport.
   - Preferred: CSS scroll-driven animations (`animation-timeline: view()`) inside `@supports (animation-timeline: view())`.
   - Fallback: `IntersectionObserver` adds `.is-visible` once, then stops observing.
3. **Hero background:** animated SVG circuit traces (`stroke-dasharray` / `stroke-dashoffset`) glowing slowly, plus a soft moving radial gradient. Must be cheap to render.
4. **Sticky header:** transparent at top, becomes a blurred glass bar with a bottom border after scrolling a few pixels. Active nav link highlights based on the current section.
5. **Cards:** hover lift (`translateY(-6px)`), border glow, and a **cursor spotlight** effect:

```css
.card {
  --mx: 50%; --my: 50%;
  background:
    radial-gradient(400px circle at var(--mx) var(--my),
      color-mix(in oklab, var(--accent) 18%, transparent), transparent 60%),
    var(--surface);
  transition: transform .35s cubic-bezier(.2,.8,.2,1), border-color .35s;
}
.card:hover { transform: translateY(-6px); border-color: var(--accent); }
```

```js
// main.js: set --mx / --my on pointermove (only for hover-capable devices)
if (matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}
```

6. **Buttons:** shine sweep on hover, small press effect on `:active`.
7. **Floating WhatsApp button:** fixed bottom-right, gentle pulse ring, respects safe-area insets (`env(safe-area-inset-bottom)`).
8. **Brand marquee:** infinite CSS marquee, pauses on hover.
9. **Image treatment:** hero image has a slow float or subtle parallax; product images zoom slightly on card hover (`overflow: hidden` on the wrapper).

### Nice-to-have

- Gradient text shimmer on the hero keyword
- Animated underline on nav links
- Mobile menu slide/fade transition
- Magnetic effect on the main CTA (desktop only)

### Accessibility for motion (mandatory)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- No content may be **hidden permanently** if JS fails. Use a `.js` class on `<html>` to enable the pre-reveal hidden state, so the site still works without JavaScript.
- No flashing or fast strobing effects. Keep durations roughly 300 to 700 ms for UI, longer for ambient loops.

---

## 7. Responsive requirements

**Mobile-first.** Write base styles for small screens, then enhance with `min-width` queries or container queries.

Suggested breakpoints: `480px`, `768px`, `1024px`, `1280px`. Prefer fluid sizing over many breakpoints.

| Width | Expected behaviour |
|---|---|
| 320 to 479 | Single column, hamburger menu, stacked hero, full-width buttons |
| 480 to 767 | Single column / 2-column small tiles, larger type |
| 768 to 1023 | 2-column grids, nav may collapse or show compact |
| 1024 to 1439 | Full nav, bento grid, side-by-side hero |
| 1440+ | Container capped (max 1200 to 1280px), nothing stretches awkwardly |

Rules:

- **No horizontal scrolling** at any width from 320px up.
- Touch targets at least **44 x 44 px**, with spacing between them.
- Body text at least 16px on mobile.
- Mobile nav: accessible toggle button with `aria-expanded`, closes on link click and on `Esc`.
- Images use `srcset` / `sizes` and always have `width` and `height` (prevents layout shift).
- Test in portrait and landscape. Respect notches with `env(safe-area-inset-*)`.
- Sticky header must not cover anchor targets (`scroll-margin-top`).

---

## 8. Accessibility

- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<section>` (each with a heading), `<footer>`.
- **Skip link** to `#main` as the first focusable element.
- One `<h1>`. Headings in logical order.
- Visible `:focus-visible` outlines (accent colour, 2 to 3px offset).
- Meaningful `alt` text on images (`alt=""` for decorative ones). Decorative SVGs get `aria-hidden="true"`.
- Icon-only links and buttons need `aria-label`.
- Mark the current nav item with `aria-current="true"` while scrolling.
- Colour is never the only way to convey meaning.
- Phone numbers use `tel:` links, WhatsApp uses `wa.me`, and external links that open new tabs use `rel="noopener noreferrer"`.

---

## 9. Performance budget

| Metric | Target |
|---|---|
| Lighthouse (mobile) Performance | 90+ |
| Lighthouse Accessibility / Best Practices / SEO | 95+ |
| LCP | under 2.5 s |
| CLS | under 0.1 |
| INP | under 200 ms |
| Total JS | under 15 KB (gzipped) |
| Total CSS | under 40 KB (gzipped) |
| Page weight (first load) | under 800 KB, excluding the map embed |

How:

- The current site hotlinks **Unsplash** images. Replace them with **self-hosted, compressed AVIF/WebP** in `/assets/img/` (with JPEG fallback) if the licence allows it and the files are available. Otherwise keep the Unsplash URLs but request sensible sizes (`w=`, `q=`, `fm=webp`).
- Hero image: `fetchpriority="high"`, **not** lazy-loaded. All other images: `loading="lazy"` and `decoding="async"`.
- Preload only the critical font file. Subset fonts if self-hosting.
- Use inline SVG for icons (no icon font libraries).
- Do not embed the Google Maps iframe on load. Use a styled card that links to Maps (or lazy-load the iframe on click).
- `defer` all scripts. Avoid layout thrash in scroll handlers (use `IntersectionObserver`, passive listeners, `requestAnimationFrame`).

---

## 10. SEO and metadata

- Keep the existing `<title>` and meta description (section 2).
- Add: canonical URL, Open Graph and Twitter card tags, `theme-color`, an SVG favicon plus Apple touch icon.
- Add **JSON-LD** `LocalBusiness` (or `ComputerStore`) schema using only the confirmed facts: name, address (Bibile, Sri Lanka), telephone, URL, and `sameAs` (Facebook). Do **not** add geo coordinates, opening hours, or ratings unless provided.
- Include `robots.txt` and `sitemap.xml`.
- Use descriptive link text (not "click here").

---

## 11. Code style

- HTML: semantic, lowercase, 2-space indent, no inline event handlers.
- CSS: one concern per layer, comments only for non-obvious decisions.
- JS: vanilla ES modules, `const` / `let`, small functions, feature-detect (`'IntersectionObserver' in window`), no global leaks.
- File names: lowercase, kebab-case.
- No console logs, dead code, or commented-out blocks in the final result.
- Keep every phone, address, and URL in **one place** where possible so it is easy to update.

---

## 12. Verify before you finish (Definition of Done)

Run a local server (for example `npx serve .` or `python3 -m http.server 8080`) and check:

- [ ] All section IDs and nav links work, and smooth-scroll lands correctly under the sticky header
- [ ] Looks right at **320, 375, 414, 768, 1024, 1440, 1920** px with no horizontal scroll
- [ ] Mobile menu opens, closes, and is keyboard and screen-reader friendly
- [ ] Every animation works, and is **disabled/reduced** with `prefers-reduced-motion: reduce`
- [ ] The page is still readable and usable with **JavaScript disabled**
- [ ] Call, WhatsApp, Facebook, and Maps links all open the right targets
- [ ] Business details match section 2 exactly (name, address, numbers)
- [ ] No invented facts, hours, prices, or testimonials
- [ ] Lighthouse mobile scores meet section 9 targets
- [ ] No console errors, no broken images, no layout shift on load
- [ ] Keyboard-only navigation works, focus is always visible
- [ ] HTML validates and there are no duplicate IDs

When finished, give a **short summary**: what changed, any new files, any TODOs that need the owner's input (opening hours, real photos of the shop, etc.), and how to run the site locally.

---

## 13. Things to avoid

- Heavy frameworks or large animation libraries for a one-page site
- Autoplay video or audio, or huge background videos
- Parallax or animation that causes motion sickness or janky scroll
- Stock-photo clichés that do not match the brand (prefer close-up circuit, chip, and soldering visuals)
- Text inside images
- Cookie banners, popups, or modals that block the page
- Changing the business name, contact info, or URLs
- Large rewrites unrelated to the design goal
- Committing secrets, API keys, or personal data

---

## 14. Suggested future improvements (only if asked)

- Optional Sinhala language toggle (සිංහල / English)
- A simple "Repair request" form that opens WhatsApp with a pre-filled message (`wa.me/94773152001?text=...`)
- Real shop and workbench photos replacing stock images
- A lightweight "Recent repairs" gallery (before/after) using the owner's own photos
- Google Business Profile review link once provided