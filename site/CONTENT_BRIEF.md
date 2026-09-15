# CONTENT_BRIEF.md — King of Kings Window Cleaning

**Every writer reads this file before writing a word.** It carries the verbatim
business facts, the anti-slop rules, the exact frontmatter and section spec per
page type, the internal-linking rules, the valid slug list, and the brand voice.
It is the highest-leverage file in the build (Keystone 6.1).

Read it with the gold-standard exemplar at
`src/content/cityService/ferndale/window-cleaning.md`. That page is the depth,
structure and voice bar. Match it.

---

## 1 · Verbatim business facts

Use these exactly. Never paraphrase a NAP string, never round a number, never
invent one that isn't here.

| Fact | Value |
|---|---|
| Legal name | King of Kings Window Cleaning LLC |
| Trading name | King of Kings Window Cleaning |
| **Owner / named expert** | **Randy Fee** — owner, registered agent and Individual Governor on the WA filing |
| Founded | **26 March 2024** |
| Phone | (360) 303-6806 |
| Email | kingofkingswindowcleaning@gmail.com |
| WA UBI | 605476674 — *do not publish until owner confirms in writing* |
| Base | Bellingham, WA (service-area business — **street address is deliberately not published; see below**) |
| Territory | Whatcom County + Skagit County (+ Oak Harbor, retained legacy) |
| Reviews | 248 Google reviews / 5.0 claimed on the legacy site — **do not cite a number until it is pulled from the verified GBP** |
| BBB | Rated A, not accredited |
| Payments | Square |

### Randy Fee — how to write him

He is the E-E-A-T layer on all 468 pages. Two facts carry it, both from his own
site, both worth repeating in your own words rather than copying verbatim:

> "Randy runs the company himself, so you are dealing with the owner, not a call
> center."

> "Every new team member is personally trained by owner Randy Fee to ensure they
> understand not only the proper cleaning techniques for each service we offer,
> but also the customer service standards that have become the foundation of our
> reputation."

**Do not write "years of experience" or "decades in the trade."** The company is
two and a half years old and we do not know what he did before it. The real
story is better and it is true: a company founded in March 2024 that has
collected hundreds of reviews and seven local awards, where the owner is still
the one on the ladder. Write to *that*.

### The awards — and the end of "Bellingham's Best"

Seven, all third-party, all dated, all on his own `/awards/` page:

| Year | Award | Result | Awarded by |
|---|---|---|---|
| 2026 | Cascades Best | **Gold — Best Cleaning Service** | The Bellingham Herald |
| 2026 | Cascades Best | Silver — Best Customer Service | The Bellingham Herald |
| 2025 | Cascades Best | **Gold — Best Cleaning Service** | The Bellingham Herald |
| 2025 | CommunityVotes Bellingham | **Platinum — Best Window Cleaning** | CommunityVotes Bellingham |
| 2025 | Nextdoor | Neighborhood Fave | Nextdoor |
| 2024 | Nextdoor | Neighborhood Fave | Nextdoor |
| 2024 | Whatcom Business Alliance | Finalist — Start-Up Business of the Year | Whatcom Business Alliance |

This is the fix for the audit's P0-5. The legacy site claims "Bellingham's Best"
in an `<h2>` on 74 pages, which is unsubstantiated puffery. He does not need to
claim it — the Herald's readers voted him Gold for Best Cleaning Service two
years running. **Cite the award, never assert superiority.** `substantiatedClaim()`
and `streakClaim()` in `src/data/awards.ts` render the approved wording.

### The licensing question — be precise

The site says "Licensed & L&I insured". **No contractor registration number
exists** on the site, on the BBB profile, or in the Secretary of State filing —
only the UBI, which is a *business licence*, not a contractor registration. The
two get conflated constantly in this trade.

Write "Washington business licence and L&I coverage", which is true. **Never
write or imply a contractor registration number we have not seen.** Open item
for Randy: confirm with L&I whether his roof cleaning and pressure washing work
requires contractor registration — window cleaning generally does not, those two
may.

### The address — deliberately absent

The Secretary of State filing lists a principal office address and it is
residential. It is public record; that does not make it publishable as the
business address on a site ranking for 41 towns. `streetAddress` stays null,
schema carries locality and region only, and no page names a street. This
matches the legacy site's own choice, which was correct.

**Still PENDING in `src/data/business.ts`:** Randy's bio and photo · his years in
the trade before founding · contractor registration, if he holds one · opening
hours · the guarantee terms · canonical GBP and social profile URLs · verified
coordinates · written confirmation to publish the UBI.

---

## 2 · The anti-slop rules

These are the difference between 468 pages that rank and 468 pages Google files
under "Crawled – currently not indexed."

1. **Research before writing.** Every page pulls real local facts — housing stock
   and era, roofing and siding materials common there, water hardness, named
   roads and waterways, prevailing weather exposure, local industry, seasonal
   timing — *before* a sentence is written. This is the engine, not a nicety.
2. **The page title never appears verbatim inside a sentence.** If you find
   yourself writing "When it comes to window cleaning in Ferndale WA, …", delete
   the paragraph and start again.
3. **No template variables in body copy.** A generated sentence must read as if a
   person wrote it about that specific place.
4. **Boilerplate lives in components, never in bodies.** Process descriptions,
   CTAs and positioning prose that repeat across pages are rendered from
   `Cta.astro` / `Footer.astro`. If you paste the same sentence into two
   markdown bodies, you have created the defect this build exists to fix — the
   legacy site has one identical `<h2>` on **74 pages**.
5. **No sentence of 10+ words may appear on 3 or more pages.** `scripts/dedup.mjs`
   fails the build on this. NAP lines, legal statements and headings are exempt.
6. **The substance gate, and a word band. Not a word floor.** *(Changed in
   Keystone v2 — this replaces the old 3,000–5,000 rule entirely.)*

   **There is no word minimum.** v2 removed the 3,000-word floor as the one
   requirement in the standard with no evidence behind it and material evidence
   against it: writing to a word count is on Google's own helpful-content
   "avoid" list, and padding toward a quota moves a page *toward* the
   scaled-content definition, not away from it.

   What a page must clear instead is the **four-item substance gate**:

   - **three verifiable local specifics** — sourced, in the `localFacts`
     frontmatter so they are auditable rather than asserted
   - **one first-party proof from that geography** — a real job, photo or review
     from that place (`firstPartyProof`)
   - **one fact the top five competitors don't carry** (`uniqueFact`)
   - **zero sentences shared with a sibling page** — enforced by `dedup.mjs`

   Then it sits inside the **word band for its page type**:

   | Template | Page type | Band |
   |---|---|---|
   | T1 | Home / hub | 600–1,200 |
   | — | Services hub | 800–1,500 |
   | T2 | Core service spoke | 1,200–2,500 |
   | T3 | Problem micro page | 700–1,400 |
   | T4 | City page | 800–1,600 |
   | T5 | Neighborhood page | 400–900 |
   | T6 | Library profile | 1,200–2,500 |
   | T8 | Compliance page | 900–1,800 |
   | T9 | Case study | 500–1,200 |
   | — | Blog / Q&A post | 700–1,500 |

   These are editorial defaults, **not thresholds** — v2 is explicit that no
   agent may treat them as a new floor. Out-of-band warns a human; it does not
   fail a build. The substance gate does fail the build.

   The unchanged half is the part that was always doing the real work: **if the
   evidence to clear the gate does not exist yet, the page is not published.** It
   becomes an `areaServed` mention on a neighbouring city page instead. A thin
   geo page is still worse than no geo page.

   Practically, this means depth moves from *words per page* to *pages that clear
   the gate* — and a service hub that has more to say than 2,500 words should
   spend the overflow on a problem micro page or a library profile, which are
   separate URLs that need the content anyway.

7. **Never generate a measurement.** *(New in v2 — prime directive 8.)* You do
   not estimate search volume or keyword difficulty. You do not decide SERP
   overlap. And you **do not invent a place name, neighborhood or subdivision**.
   Those are measured values from named sources. This is "never fabricate"
   applied to the input side of the build, and it is the most likely way an agent
   quietly corrupts one.

   This rule has already caught a real error in this build: an earlier draft of
   the architecture listed Downtown, Mount Baker, Guide Meridian and Van Wyck as
   Bellingham neighborhoods. None appear on the City of Bellingham's official
   list of 25. The corrected list is in `build_architecture.py`, sourced.
7. **Never fabricate.** No invented reviews, ratings, stats, job counts, prices,
   years in business, awards or certifications. If you do not have it, leave the
   field null and it renders nothing.
8. **Never write an unqualified guarantee.** No "risk-free", "guaranteed" or
   "lifetime" without defined terms, and every such word links to
   `/our-guarantee/`. No superiority claims — "Bellingham's Best" is out. Say
   something verifiable instead.
9. **Credential boundaries are hard.** He holds a contractor registration. He is
   not a roofing inspector, not an engineer, not a licensed pesticide applicator.
   Never imply inspection authority, structural assessment or a treatment
   licence — not in body copy, not in an FAQ answer.

---

## 3 · The universal block order

Every indexable page, in this order, no exceptions (Keystone Part 4.1):

1. **AEO Quick Answer** — 40–60 words, at the very top, written to be quoted
   verbatim. This same string is the meta description and the first FAQ answer.
2. **Named-expert block** — real person, credential shown. Component-rendered.
3. **Q&A body sections** — question-formed H2s, answer-first inside each.
4. **Local proof** — real job photos, explicit service area, a pulled review
   specific to that market where one exists.
5. **FAQ block** — 6–8 questions, exactly one block per URL, feeding FAQPage
   schema from the same array.
6. **CTA** — named to this page's market. Never a generic sitewide banner.

---

## 4 · Frontmatter, by page type

### `cityService` — `/locations/{market}/{service}/` (230 pages)

```yaml
title: "Window Cleaning in Ferndale WA"      # ≤60 chars, city front-loaded
answer: "…"                                   # 40–60 words, the Quick Answer
metaDescription: "…"                          # 110–165 chars, ends on punctuation
heroImage: "/photos/ferndale-window-cleaning-01.webp"
heroAlt: "…"                                  # ≤125 chars, [shown]+[context]+[local]
market: "ferndale"
service: "window-cleaning"
localFacts:                                   # ≥4. The anti-slop receipt.
  - "Cherry Point industrial fallout settles on north-facing glass"
  - "Nooksack Valley agricultural dust in late summer"
priceBand: null                               # null until the owner gives real numbers
caseStudy: null
faqs:                                         # 6–8
  - q: "…"
    a: "…"
updated: 2026-09-10
```

**Section spec** — Quick Answer → local conditions (the real ones, named) →
what's included → method and equipment → what it costs in *this* town → problem
page links → local proof → guarantee → FAQ → CTA.

### `neighborhood` — `/locations/{market}/{neighborhood}/` (62 pages)

Same shape, plus `neighborhood`. Section spec: Quick Answer →
neighborhood-specific conditions → parent city link → sibling neighborhood links
→ service links → FAQ → CTA.

**Neighborhood names are never invented.** They come from Whatcom/Skagit County
assessor plat records, USPS delivery areas, City of Bellingham's own recognised
neighborhood list, and the owner's route knowledge. A subdivision you cannot
source does not become a page.

### `service` — `/services/{service}/` (9 pages)

Quick Answer → expert block → what's included → method → what it costs →
problem-page links → local proof → guarantee link → FAQ → CTA.
**Build the hub before its spokes** (Keystone 3.1, the cardinal rule, promoted to
the top of the architecture *after the King of Kings build*).

### `library` — `/surface-library/{surface}/` (25 pages)

Identification → behaviour and season → risk → signs → treatment approach →
prevention → linked service spoke → FAQ.

### `compliance` — `/compliance/{topic}/` (8 pages)

The rule stated plainly → who it applies to → obligations → penalties → how we
help → **source citation and review date** → FAQ. Every factual/legal claim
carries a source; the schema requires it.

### `caseStudy` — `/case-studies/{slug}/` (20 pages)

Service + property type + neighborhood + method + outcome. Wire it **into** the
parent service spoke, the city page and the hub — a case study is simultaneously
a geo page, a service page and a proof asset. Never a fabricated rating or date.

---

## 5 · Internal linking (M3 — nothing is ever orphaned)

Every page links **up** to its parent, **in** to its hub, and **laterally** to its
siblings. The `wheel()` helper in `src/lib/geo.ts` generates the set; use it.

- City × service → up to the city page, in to the service hub, laterally to the
  other services in that city and to the same service in neighbouring markets.
- Neighborhood → up to its city, laterally to sibling neighborhoods.
- Problem micro page → up to its parent service.
- Library profile → laterally to every service spoke that touches that surface.
- Case study → into its service spoke, its city page and the hub.

The legacy site has **zero orphans** — keep it that way. What it lacks is
hierarchy: the homepage absorbs 292 inbound links and passes only 15 out. The hub
must distribute.

---

## 6 · Voice

Plain, specific, first-person where the expert speaks. The operator's own voice
on the legacy site is already good — this is the tone to keep:

> "King of Kings is locally owned and works Ferndale several times a week, so a
> booking here does not mean waiting for a crew to come up from…"

That is the register. Concrete, unhurried, faintly proud, never salesy. Avoid:
"unparalleled", "cutting-edge", "we pride ourselves", "in today's world",
"look no further", "when it comes to". Avoid stacked adjectives. Prefer the
specific noun — *Cherry Point*, *composition shingle*, *Whatcom Chief ferry* —
over the general one.

Write to a homeowner standing in their driveway looking up at their gutters, not
to a search engine.

---

## 7 · Images (M6)

- Alt formula: `[what's shown] + [action/context] + [local, where city-specific]`,
  ≤125 chars, no keyword stuffing. **Judge by sight, never by filename** — the
  legacy library's filenames are SEO-stuffed and routinely wrong.
- WebP with explicit `width`/`height`, lazy-loaded below the fold. Legacy
  baseline: 3.3% WebP, 305 images with no alt at all, zero lazy-loading on the
  sampled page.
- One hero (on-topic, geo-matched to the page's city) plus one inline image per
  ~300–400 words, plus an optional before/after pair on service pages.
- Real field photography leads. The legacy site's own job photos are the asset —
  stock is the fallback, never the default.

---

## 8 · Valid slugs

Services: `window-cleaning` · `gutter-cleaning` · `roof-cleaning` ·
`moss-removal` · `pressure-washing` · `house-washing` · `solar-panel-cleaning` ·
`commercial-window-cleaning`

**Not confirmed, do not write:** `moss-prevention`, `gutter-installation`,
`gutter-guards`, `christmas-lights`. Competitors sell these. The owner has not
said he does. Keystone Part 14: a page for work he doesn't do is a liability.

Markets: see `src/data/markets.ts` — 41 slugs, tiered. `TIER_SERVICES` decides
which services each market gets. Do not add a market to the file without filling
its `differentiators` rows first; `isBuildable()` will block it.

---

## 9 · Before you hand a batch back

Run `npm run verify`. Five scripts, all must pass:

- `dead-links.mjs` — every internal href resolves to a built file
- `seo-audit.mjs` — one H1, unique title/description in band, alt on every image
- `word-count.mjs` — M1 floor, measured on the markdown source not rendered HTML
- `dedup.mjs` — no 10+ word sentence on 3+ pages
- `validate-schema.mjs` — graph parses, nodes connect, no orphan `@id`

Batches are 3–5 pages per writer, 10 pages per production session, and each batch
passes the gate before the next begins.
