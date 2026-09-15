# King of Kings Window Cleaning — Keystone 7A build

Greenfield static rebuild of `kingofkingswindowcleaning.com`, replacing the live
WordPress/Elementor install. Astro static output → Vercel.

**Read `CONTENT_BRIEF.md` first.** It is the operating file for every writer.

## Where things are

| Path | What it is |
|---|---|
| `src/data/business.ts` | Every NAP, phone, credential and social string. Change the phone here, it changes on all 468 pages. `READY.*` guards fail closed on anything unconfirmed. |
| `src/data/markets.ts` | The 41-market geo lattice, tiered. `isBuildable()` is the anti-slop gate — a market with thin research cannot generate pages. |
| `src/data/services.ts` | The service tree. `confirmed: false` means a competitor sells it and the owner has not. Not built, not linked, not in schema. |
| `src/lib/schema.ts` | The **only** JSON-LD emitter. 7-node graph, one shared root `@id`. |
| `src/lib/seo.ts` | M5 title/description discipline + the dangling-ending validator. |
| `src/lib/geo.ts` | Differentiated geo copy with an honest `genericLocal()` fallback. |
| `src/content/config.ts` | Collection schemas. Bad data fails at build, not in production. |
| `scripts/` | The five-script verification harness. `npm run verify`. |

## The gold standard

`src/content/cityService/ferndale/window-cleaning.md` — 3,135 words. Depth,
structure and voice bar for every fan-out writer. Its `verify:` frontmatter block
lists every claim a human must confirm before it publishes.

## Phase 0/1 status

Foundation complete: entity module, schema graph, geo helper, SEO discipline,
block components, collection schemas, T4 route, harness, content brief, exemplar.

**Resolved 2026-09-10:** named expert is **Randy Fee**, owner — wired into
`business.ts`, the Person node, the expert block on every page, and his own
entity page at `/team/randy-fee/`. Founding date confirmed (26 March 2024).
Seven dated awards captured in `src/data/awards.ts` and emitting on the
LocalBusiness `award` property — these replace the unsubstantiated
"Bellingham's Best" claim the audit flagged as P0-5.

**Blocked on owner input** (see `business.ts`, every `PENDING`):
Randy's bio and photo · his years in the trade before founding · a contractor
registration number, if he holds one (the site says "Licensed" but only a UBI
exists — see CONTENT_BRIEF §1) · guarantee terms · GBP and social profile URLs ·
verified coordinates · opening hours · written confirmation to publish the UBI ·
confirmation of the four unconfirmed services · the Oak Harbor retain-or-drop
decision.

**Blocked on research:** run `npm run research` for the market backlog. 41
markets are defined; most carry empty `differentiators` rows and cannot ship
until they are filled. This is deliberate — a thin geo page is worse than none.

## Build

```bash
npm install
npm run dev        # local
npm run build      # astro check + build + verify (all five scripts must pass)
npm run research   # which markets still owe research
```

Vercel: set the **Framework Preset to Astro explicitly**. If it is unset every
route returns a platform 404 on a build that reports success.
