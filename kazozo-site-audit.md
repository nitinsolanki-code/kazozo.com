# Kazozo.com — Full Site Audit

**Date:** March 19, 2026
**Audited by:** Claude for Nitin Solanki
**Overall Score:** B+ (85/100)

---

## Executive Summary

Kazozo.com is a well-built, modern landing page with strong SEO fundamentals — proper meta tags, structured data, a complete sitemap, and fast load times from minimal external dependencies. The design is polished with a cohesive dark theme and clear visual hierarchy. However, there are critical accessibility gaps (broken keyboard navigation, missing focus styles), zero images on the page hurting visual engagement, and significant content/SEO gaps versus competitors like Lindy.ai, Gumloop, and Zapier. The three highest-impact priorities are: (1) fix accessibility violations, (2) add visual content (images, screenshots, social proof), and (3) build comparison and educational content to capture search traffic.

---

## 1. SEO Audit

### On-Page Fundamentals

| Element | Status | Details |
|---------|--------|---------|
| Title tag | 🟢 Good | "Kazozo — Enterprise-Grade AI Agents at SMB Prices" (60 chars, keyword-rich) |
| Meta description | 🟢 Good | Clear, benefit-driven, ~160 chars with CTA |
| Canonical URL | 🟢 Good | Properly set to `https://kazozo.com/` |
| Open Graph tags | 🟢 Good | Complete: og:title, og:description, og:url, og:type, og:image, og:site_name |
| Twitter Card | 🟢 Good | twitter:card, twitter:title, twitter:description, twitter:image all present |
| H1 tag | 🟢 Good | Single H1: "Stop losing deals to slow follow-ups and manual busywork" |
| H2/H3 hierarchy | 🟡 Warning | H3s appear before parent H2s in some sections — confusing for screen readers |
| Image alt text | 🔴 Critical | **Zero images on the entire page** — no `<img>` tags found |
| Schema/JSON-LD | 🟢 Good | Organization + FAQPage schema present and valid |
| Robots.txt | 🟢 Good | Properly configured, blocks test/demo pages, includes sitemap URL |
| Sitemap.xml | 🟢 Good | 32 URLs indexed with priorities — homepage, 27 industry verticals, legal pages |

### Heading Hierarchy Issues

The document outline has gaps. Some H3 elements (agent names, pricing tiers) appear without clear H2 parents, creating a confusing structure for screen readers and search engines. The H1 targets emotional pain ("losing deals") rather than the primary keyword ("AI agents for business"). Consider an H1 like: "Enterprise AI Agents for Sales, Support & Ops — at SMB Prices."

### Internal Linking

| Check | Status | Details |
|-------|--------|---------|
| Links to industry pages | 🔴 Missing | 27 industry vertical pages exist in sitemap but homepage doesn't link to them directly |
| Links to blog/content | 🔴 Missing | No blog, guides, or educational content linked |
| Nav anchor links | 🟢 Good | Agents, Pricing, Industries, Simulation sections linked in nav |
| Footer links | 🟡 Minimal | Only Privacy, Terms, and social media |

### Keyword Targeting

**Primary keywords present in meta:**
- "Enterprise-grade AI agents" ✓
- "SMB prices" ✓
- "Sales, support & ops" ✓

**Keywords missing from body copy:**
- "AI customer support" — only implied, never stated
- "Lead qualification automation" — not present
- "Salesforce alternative" — only in schema, not visible copy
- "AI sales agent" — agent names use it but no standalone targeting

**Long-tail gaps:**
- "AI agents for [industry]" — pages exist but no internal linking
- "How to automate [task] with AI" — no educational content
- "Kazozo vs [competitor]" — no comparison content

---

## 2. Technical Audit

### Performance

| Check | Status | Details |
|-------|--------|---------|
| Page size | 🟢 Good | ~89 KB (HTML + inline CSS + inline JS) — very lightweight |
| External requests | 🟢 Good | ~5-8 total (Google Fonts CSS, 3 font files, widget script) |
| Render-blocking resources | 🟢 Good | CSS is inline, widget script is async, nav JS at end of body |
| Google Fonts | 🟡 Warning | 3 font families (Playfair Display, Inter, Space Grotesk) — consider reducing to 2 |
| CSS minification | 🟡 Warning | Inline CSS is unminified (~60 KB readable) — could save ~10-15% |
| JS minification | 🟢 Good | Minimal JS footprint, minification savings negligible |
| Images | 🔴 Critical | No images = no optimization needed, but major content gap |
| Lazy loading | N/A | No images to lazy-load |

### Infrastructure

| Check | Status | Details |
|-------|--------|---------|
| HTTPS | 🟢 Good | All URLs use HTTPS, no mixed content |
| Mobile viewport | 🟢 Good | `width=device-width, initial-scale=1.0` — allows user zoom |
| Font display:swap | 🟢 Good | Prevents FOIT, falls back to system fonts while loading |
| Widget loading | 🟢 Good | Chat widget loads async from Railway — non-blocking |
| Preconnect hints | 🟢 Good | `rel="preconnect"` for Google Fonts domains |

### Accessibility

| Check | Status | Details |
|-------|--------|---------|
| Keyboard navigation | 🔴 Critical | Multiple links use `href="javascript:void(0)"` with onclick — breaks keyboard nav |
| Focus visible styles | 🔴 Critical | No `:focus-visible` styles defined — keyboard users can't see focus |
| ARIA labels | 🟢 Good | Hamburger menu, scroll-to-top, social links all have aria-labels |
| Color contrast | 🟡 Warning | Muted text (#7D7A8C) on dark bg (#0C0B12) needs WCAG verification |
| Heading structure | 🟡 Warning | H3s without parent H2s break screen reader navigation |
| Form labels | 🟢 Good | No forms on homepage (login/signup are separate pages) |

### Animated Elements

The page uses 3 CSS-animated gradient orbs with `backdrop-filter: blur()`. These are GPU-intensive and may cause jank on lower-end devices. Consider adding `will-change: transform` or reducing blur on mobile.

---

## 3. Design & UX Audit

### Visual Design

| Aspect | Rating | Notes |
|--------|--------|-------|
| Brand consistency | 🟢 Strong | Coral (#ff6b5a) accent used consistently across nav, CTAs, pricing, agent cards |
| Typography | 🟢 Strong | 3-font system works well: Playfair Display (headlines), Inter (body), Space Grotesk (UI) |
| Dark theme | 🟢 Strong | Modern, professional dark UI with subtle gradients and glows |
| Visual hierarchy | 🟡 Needs work | All-text page with no images — sections blur together without visual anchors |
| Whitespace | 🟢 Good | Generous spacing between sections, cards are well-padded |
| Card design | 🟢 Good | Agent cards, industry cards, pricing cards — all consistent with subtle borders |

### Navigation & Layout

| Aspect | Rating | Notes |
|--------|--------|-------|
| Sticky nav | 🟢 Good | Glassmorphism nav stays visible on scroll |
| CTA placement | 🟢 Good | "Talk to Kaz" prominent in nav, "See Your Agent Stack" + "Compare to Salesforce" hero CTAs |
| Mobile nav | 🟢 Good | Hamburger menu with Login/Get Started buttons in mobile drawer |
| Section flow | 🟢 Good | Hero → Stats → Agents → Expansion → Pricing → Industries → Salesforce comparison → FAQ → Footer |
| Login/Get Started | 🟢 Good | Visible in nav bar, coral outline style distinguishes from "Talk to Kaz" |

### Key UX Issues

1. **No social proof visible** — No logos, testimonials, case studies, or customer counts. For a B2B SaaS targeting SMBs, this is a major trust gap.
2. **No product screenshots/demos** — Users can't visualize what they're buying. The "Simulation" nav link hints at a demo but isn't prominent.
3. **Wall of text** — Without images, the page feels dense despite good spacing. Agent cards and industry cards help but aren't enough.
4. **"Talk to Kaz" vs. "Get Started"** — Two coral-toned CTAs competing for attention. "Talk to Kaz" (solid coral) and "Get Started" (coral outline) are close enough to cause confusion about which action to take.

---

## 4. Content & Copy Audit

### Messaging Strengths

- **Headline** — "Stop losing deals to slow follow-ups and manual busywork" is specific, pain-driven, and immediately resonant for SMB owners.
- **Subhead** — "The same AI agent technology Fortune 500s pay six figures for" — great anchoring for price perception.
- **Stats bar** — 93% faster lead response, 40% more deals closed, $0.10 starting cost, 24/7, 1-2 week go-live. Concrete and compelling.
- **Pricing transparency** — Per-resolution pricing with clear tiers. The "Industry average: $1.50-$2.00. Kazozo starts at $0.10" comparison is powerful.
- **Industry specificity** — Home Services, Real Estate, Marketing Agencies, Recruiting, E-commerce with specific use cases and CRM integrations.

### Messaging Weaknesses

- **No proof points** — Stats like "93% faster" and "40% more deals" have no source citation. Are these from customer data? Industry benchmarks?
- **No customer testimonials** — Zero social proof on the entire page.
- **No case studies** — "See results" type content is completely absent.
- **Vague agent descriptions** — Agent cards say what they do but not HOW (no screenshots, workflows, or example interactions).
- **Missing urgency** — No limited-time offers, no "companies like yours are already using" triggers.
- **FAQ section** — Likely present but could be stronger with competitor comparison questions.

### CTA Analysis

| CTA | Location | Strength |
|-----|----------|----------|
| "See Your Agent Stack →" | Hero | 🟢 Action-oriented, curiosity-driven |
| "Compare to Salesforce" | Hero | 🟢 Smart competitive positioning |
| "Talk to Kaz" | Nav (persistent) | 🟡 What does this do? Chat? Demo? Unclear. |
| "Get Started" | Nav | 🟢 Clear intent |
| "See all 27 industries →" | Industries section | 🟢 Good, drives to vertical pages |

---

## 5. Competitor Comparison

### Market Landscape

Kazozo competes in the "AI agents for SMBs" space against:

| Dimension | Kazozo | Lindy.ai | Gumloop | Zapier/Make |
|-----------|--------|----------|---------|-------------|
| Positioning | AI agents for sales/support/ops | No-code AI agents (general) | AI automation (speed) | Workflow automation (breadth) |
| Target | SMBs by vertical | SMBs (general) | Mid-market | Everyone |
| Pricing | $149-899/mo + per-resolution | ~$49-299/mo | Custom | $20-600/mo |
| Content depth | 1 page + 27 verticals | Blog, guides, comparisons | Blog, tutorials | Massive content library |
| SEO presence | Minimal | Strong — ranks for "best AI agents" | Growing | Dominant |
| Social proof | None visible | Customer logos, testimonials | Enterprise logos | Millions of users |

### Key Gaps vs. Competitors

1. **Lindy.ai** appears in every "best AI agents" comparison list — Kazozo appears in none.
2. **Zapier** has thousands of SEO-optimized pages targeting long-tail automation queries.
3. **All competitors** have visible customer logos, testimonials, or case study links.
4. **All competitors** publish regular blog content targeting educational and comparison keywords.

---

## 6. Keyword Opportunities

| Keyword | Difficulty | Opportunity | Current Ranking | Intent | Recommended Content |
|---------|-----------|-------------|-----------------|--------|-------------------|
| AI agents for small business | Hard | High | Not ranking | Commercial | Homepage optimization |
| Salesforce alternative for small business | Medium | High | Not ranking | Commercial | Comparison landing page |
| AI lead qualification | Medium | High | Not ranking | Commercial | Feature page / blog post |
| AI customer support automation | Medium | High | Not ranking | Commercial | Feature page |
| Kazozo vs Lindy | Easy | High | Not ranking | Commercial | Comparison page |
| AI agents for HVAC companies | Easy | High | Not ranking | Commercial | Already have vertical page — needs SEO |
| AI agents for real estate | Medium | High | Not ranking | Commercial | Already have vertical page — needs SEO |
| What is agentic AI | Medium | Medium | Not ranking | Informational | Blog post / guide |
| AI sales agent software | Medium | Medium | Not ranking | Commercial | Feature page |
| Best AI agents 2026 | Hard | Medium | Not ranking | Commercial | Comparison / listicle |
| How to automate lead follow-up | Easy | Medium | Not ranking | Informational | Blog post + product tie-in |
| AI agents ROI for small business | Easy | Medium | Not ranking | Informational | Calculator / blog post |
| Intercom alternative for small business | Medium | Medium | Not ranking | Commercial | Comparison page |
| AI scheduling automation | Easy | Low | Not ranking | Commercial | Blog post |
| No-code AI agent builder | Hard | Low | Not ranking | Commercial | Feature page |

---

## 7. Prioritized Action Plan

### Quick Wins (This Week)

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 1 | **Fix keyboard navigation** — Replace all `javascript:void(0)` links with proper `<button>` elements | High | 1 hour |
| 2 | **Add focus-visible styles** — Add `:focus-visible { outline: 2px solid var(--coral); outline-offset: 2px; }` globally | High | 15 min |
| 3 | **Fix heading hierarchy** — Ensure all H3s have parent H2s, wrap agent/pricing sections properly | Medium | 30 min |
| 4 | **Add internal links to industry pages** — Link "Home Services", "Real Estate" etc. cards directly to their vertical pages | Medium | 30 min |
| 5 | **Optimize H1** — Include primary keyword: "AI Agents for Sales, Support & Ops — Stop Losing Deals to Manual Busywork" | Medium | 5 min |
| 6 | **Add source citations to stats** — "93% faster lead response" needs a footnote or "(based on customer data)" | Medium | 15 min |

### Strategic Investments (This Quarter)

| # | Action | Impact | Effort | Dependencies |
|---|--------|--------|--------|-------------|
| 1 | **Add social proof section** — Customer logos, testimonials, or a "Trusted by X businesses" counter | Very High | 1-2 days | Need customer permissions |
| 2 | **Add product screenshots/video** — Show the dashboard, chat widget, agent workflows in action | Very High | 2-3 days | Need design assets |
| 3 | **Create 3 comparison pages** — "Kazozo vs Salesforce Agentforce", "Kazozo vs Lindy", "Kazozo vs Intercom" | High | 1 day each | Competitor research |
| 4 | **Launch a blog** — Start with 5 posts: "What is Agentic AI", "AI Agents ROI for SMBs", 3 industry guides | High | 1 week | Content writing |
| 5 | **SEO-optimize all 27 vertical pages** — Add unique meta descriptions, H1s with industry keywords, internal links | High | 2-3 days | Access to vertical pages |
| 6 | **Build an ROI calculator** — Interactive tool: "How much would AI agents save your business?" | Medium | 2-3 days | Development |
| 7 | **Get listed in comparison articles** — Reach out to sites publishing "Best AI Agents" lists for inclusion | High | Ongoing | PR/outreach |
| 8 | **Minify CSS** — Run inline CSS through a minifier to save ~10 KB | Low | 30 min | Build tooling |

---

## Summary

**Strongest assets:** Clean design, transparent pricing, strong value proposition, excellent SEO fundamentals, 27 industry vertical pages ready to be leveraged.

**Biggest gaps:** No images or visual content, no social proof, no blog/educational content, critical accessibility violations, not appearing in any competitor comparison lists.

**If you fix three things this month:** Add social proof (testimonials/logos), add product visuals (screenshots/demo video), and create 3 comparison pages targeting high-intent keywords. These alone would dramatically improve both conversion rate and organic search visibility.
