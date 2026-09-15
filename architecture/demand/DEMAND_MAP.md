# Part 6A — Demand Mapping · King of Kings Window Cleaning

**Status: measured. 45 of 355 geo slots are authorised; 310 are declined.**

Updated 2026-09-14, on the client's own 16-month Search Console export. Two of the
five demand signals are now measured and a third is attested. This file is no
longer a scaffold waiting for data — it is a decision made on evidence.

**The finding that matters most:** the existing 150-page city × service lattice
produced **388 impressions and 1 click in sixteen months** — 0.6% of the site's
impressions and 0.1% of its clicks, at a median position of 41. Eighty-eight of
the 150 were never shown once. That is not an underperforming geo tier. It is an
inert one, and it is precisely the pattern Part 6A exists to prevent.

---

## What Part 6A changed

Keystone v1 built pages from a services tree crossed with a towns array, and
nothing in eighteen parts said how either list was decided. v2 added the missing
half: *"A page is earned by evidence of demand, not by the existence of a slot in
the lattice."* Every URL traces to a cluster in a committed map; every cluster
traces to **two or more of five independent demand signals**; a slot with fewer
than two is an `areaServed` mention on its parent city page, not a page.

The King of Kings legacy site is the textbook case for why this exists. It ran
150 city × service pages and 12 neighborhood pages built from exactly this kind
of ungated lattice, and the audit found Bellingham window-cleaning intent split
across eight URLs.

---

## The five signals, and where each one stands

| # | Signal | Status | Who supplies it |
|---|---|---|---|
| S1 | Non-zero volume at metro geo | **UNMEASURED** | Google Ads API `GenerateKeywordHistoricalMetrics` (needs Basic access) or DataForSEO |
| S2 | ≥10 GSC impressions per quarter | **MEASURED 2026-09-14** | 16-month Search Console export, supplied by the client |
| S3 | A conversion in Ads Matched Locations | **UNMEASURED** | Client Google Ads account, if one is running |
| S4 | A dedicated page on ≥2 of the top five competitors | **MEASURED 2026-09-11** | This session — full sitemap enumeration |
| S5 | Documented job history in that geography | **SATISFIED, territory-wide** | Owner attestation, 2026-09-12 |

Three of the five are measurements. Prime directive 8 forbids an agent from
generating a measurement, so they are recorded as unmeasured rather than filled
with a plausible number.

**S5 resolved 2026-09-12.** The operator runs hundreds of jobs a year across every
city in the declared territory, small markets included — Acme was named
specifically. That is job history in the Part 6A sense, and because it is
territory-wide rather than concentrated in a handful of big markets, it also sets
the Part 3.4 hard cap to the full declared market count instead of zero.

One qualification, recorded rather than glossed: this is **attested, not
exported**. A per-geography job count from the scheduling system would harden it
and would additionally *rank* the territory, which an attestation cannot do. It is
enough to open the gate. It is not enough to decide what to build first.

With S5 in hand, every slot starts at 1 of 5 and clears wherever a second signal
is present. Today that means the slots carrying S4: **38 of them — 10 city pages
and 28 city × service pages** across Anacortes, Bellingham, Birch Bay, Blaine,
Burlington, Everson, Ferndale, Lynden, Mount Vernon and Sudden Valley. Those are
the first wave and they are authorised now.

---

## What S4 actually found

Full enumeration of all five competitors' sitemaps, fetched anonymously from each
competitor's own origin. Nothing sampled, nothing inferred.

| Competitor | URLs | Shape | Geo pages |
|---|---|---|---|
| mtbakerwindows.com | 213 | 7 services × 26 cities | 175 |
| pnwwash.com | 85 | 5 services × 10 cities | 50 |
| pureshinenw.com | 30 | city pages, not a lattice | 14 |
| nwwindowcleaningbellingham.com | 8 | flat | 0 |
| whatcomgrc.com | 12 | flat | 0 |

Three findings worth carrying into the build:

**1. Mt. Baker leaves Bellingham out of six of its seven geo runs.**
The head market is absent from solar, gutters, windows, roof, house washing and
pressure washing — it is targeted from the homepage and the bare service hubs
instead. Only the Christmas-lights run includes it. So a Bellingham × service
page is contested by a *hub*, not by a geo page. That is a different fight, and
it is a better one.

**2. Eighteen of the 41 declared markets have no competitor page of any kind.**
Bay View, Big Lake, Clear Lake, Concrete, Conway, Edison, Guemes Island,
Hamilton, Kendall, Lummi Island, Lyman, Nooksack, Oak Harbor, Rockport, Samish
Island, Semiahmoo, Van Zandt, Wickersham. Whitespace is the optimistic read. The
realistic read is that five local operators independently declined to build them,
which is itself weak evidence about demand — and it is exactly the signal the
v1 lattice had no way to hear.

**3. Whatcom GRC blocks AI crawlers by name in robots.txt** — `anthropic-ai`,
`AI2Bot`, `Amazonbot`, `Applebot-Extended`, `Bytespider` and others. They will
not appear in assistant answers regardless of how they rank. That belongs in
scorecard dimension 13, and it is a free competitive gap.

S4 distribution across the 328 geo slots: **38 slots** have two or more
competitors holding a dedicated page, **136** have exactly one, **154** have none.

---

## Client-designated priority zones

Separate from the five signals, and worth keeping separate rather than blurring
into them.

**Chuckanut** — the owner names it as one of the top-value areas in the territory
(stated 2026-09-12). That is real commercial intelligence and it now carries
through the build: it is added to `build_architecture.py` as a Bellingham **area
page**, not a neighborhood, because it is a real, multiply-sourced place name
(Chuckanut Drive / SR 11; the USGS GNIS features Chuckanut Bay, Chuckanut
Mountain and Chuckanut Village) that the City's official 25-neighborhood list
does not carry — it spans south Bellingham into unincorporated Whatcom County.
Prime directive 8 forbids inventing a place name; it does not forbid using a real
one the City's planning taxonomy happens not to cover, and the separate bucket
keeps the official-25 count honest.

What the measurement already says about it: **no page exists on the legacy site,
and none of the five competitors builds one.** It is uncontested.

Where it stands after S5: job history now covers it like everywhere else, so the
signal count is 1. No competitor builds it, so S4 does not fire. Chuckanut
therefore waits on the GSC pull for its second signal — and because it is a
sub-area of Bellingham rather than a city, it also sits behind Part 3.4 item 4,
which requires Bellingham to be measured as ranking first. GSC answers both
questions in the same export.

## What Search Console actually said

Threshold is 10 impressions per quarter. The export covers 488 days — 5.35
quarters — so a geography needs **53.5 impressions over the window** to clear S2.

**One city clears it. Bellingham, with 21,409 impressions — 69% of all query
impressions on the property.** Every other declared market, over sixteen months:

| Market | Impressions | Clicks |
|---|---:|---:|
| Bellingham | 21,409 | 52 |
| Lynden | 27 | 0 |
| Ferndale | 21 | 0 |
| Mount Vernon | 17 | 0 |
| Anacortes | 12 | 0 |
| Burlington | 9 | 0 |
| Oak Harbor | 3 | 0 |
| Blaine | 1 | 0 |

Thirty-three of the 41 planned markets return nothing above noise.

**Read that carefully, because it is easy to over-read.** GSC impressions measure
*this site's exposure*, not market demand. A town where the site has no visible
page reports near-zero by construction, which makes a zero partly self-fulfilling.
That is exactly why Part 6A requires two signals rather than one — and the system
demonstrably works here: **Birch Bay, Everson and Sudden Valley have zero GSC
impressions and still clear**, because two or more competitors build dedicated
pages for them. Demand is evidenced there even though this site is invisible in it.

## The 45

Ten city pages and 35 city × service pages.

**Bellingham** carries three signals and clears across all seven services — it is
the only geography where GSC, competitor coverage and job history all agree.
**Ferndale, Lynden, Blaine, Burlington, Anacortes, Everson and Sudden Valley**
clear on window cleaning, gutters, roof and house washing. **Mount Vernon and
Birch Bay** clear at city level only, because only one competitor builds their
service tuples.

The other 310 slots become `areaServed` mentions on their parent city page. That
is not a retreat — under the v2 scorecard a geography correctly declined for lack
of evidence costs nothing, while a built page that cannot clear the substance gate
costs a point. Ten evidenced cities will score higher than forty-one empty ones.

## Where the fastest wins actually are

Part 6A step 8 asks for striking-distance terms — positions 8 to 20 carrying real
impressions. There are 32 of them, and they are almost entirely one market and one
service:

- `window cleaning bellingham` — position 9.4, 2,194 impressions, 28 clicks
- `bellingham window cleaning` — position 14.6, 1,635 impressions
- `window cleaning bellingham wa` — position 11.0, 638 impressions
- `solar panel cleaning bellingham` — position 14.2, 523 impressions
- `bellingham solar panel cleaning` — position 15.9, 512 impressions

The fastest available wins are not new pages in new towns. They are Bellingham
head terms already sitting on the edge of page one, on a site with no
LocalBusiness node, no named expert and a homepage doing 79% of the work.

## The two hard caps that also bind

Beyond the signal gate, Part 3.4 adds two structural limits that the v1
architecture did not have:

> **City pages may not exceed the count of cities with documented job history.**

Resolved. Job history is territory-wide, so the cap is the full declared market
count — 41 — and it stops being the binding constraint.

> **Neighborhood pages are built only inside cities that already rank — never as
> the way into a market.**

"Already rank" is a GSC or rank-tracker measurement. The 25 Bellingham
neighborhood pages and every other neighborhood slot stay unbuilt until it
exists. The legacy site's 12 neighborhood pages were built as the way into
Bellingham, which is precisely the pattern this clause forbids.

---

## The unblock path, cheapest first

1. **S5 — job history.** A per-geography job count from Randy's own records.
   Costs nothing, needs no API, and it is the signal both hard caps are written
   against. Combined with the 38 slots where S4 is already met, this alone opens
   the first real wave.
2. **S2 — GSC.** Free, and the client already owns the data. 16-month retention,
   so it should be pulled and archived on a schedule regardless. Catches the
   implicit-local and near-me queries every third-party tool reports as zero.
3. **S1 — volume.** $25–75 for the initial pull. Also produces the twelve-month
   `monthly_searches` array, which is the per-market seasonality dataset for
   Part 6A.3 and has no substitute.
4. **S3 — Ads matched locations.** Only if the client runs Ads.

Until step 1 lands, the correct state of this build is: service tier and problem
tier proceed, geo tier does not.

---

## Files

| File | What it is |
|---|---|
| `competitor-geo-inventory.json` | The measured S4 harvest, with method and corrections to the 2026-09-10 competitor set |
| `taxonomy-exterior-cleaning.yaml` | Part 6A.1 step 1 — the vertical taxonomy, agency IP, reused portfolio-wide |
| `demand-map.csv` | The committed keyword → URL map: 355 rows — 328 city-level slots plus the 25 official Bellingham neighborhoods and 2 area pages — with all five signal columns and the decision |
| `demand-map-summary.json` | Machine-readable roll-up |
| `build_demand_map.py` | Regenerates the map from the inventory and `markets.ts`, so territory and map cannot drift |
| `../../site/scripts/keyword-map-check.mjs` | Part 9.2 harness item 6 — fails the wave on a tuple collision, a URL collision, an unmapped geo page, or a geo page built ahead of its gate |
