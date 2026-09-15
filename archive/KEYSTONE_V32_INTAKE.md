# Keystone v3.2 intake — what changed in this build

Standard issued 14 September 2026. Supersedes v3.1, v3.0, v2, the v2.1 amendment,
v1 and the Smart Site Master Plan. This file records what the new standard changed
here, what it retired, and what is now outstanding.

---

## Two gates retired — and one of them we were enforcing

**1 · The documented-job-history cap is gone.** v2's Part 3.4 capped city pages at
the number of cities with recorded job history and forbade neighborhood pages in
cities that did not already rank. This build implemented both. v3.2 retires them:
job history is one of the five demand signals, never a ceiling and never a
prerequisite, and *a market with no job history yet can be entered at the
neighborhood layer*.

Removed from `build_demand_map.py` and `build_architecture.py`. The Bellingham
sub-area tier was previously blocked by the structural rule; it is now judged on
demand evidence like everything else.

**The page count did not change.** All 27 sub-areas are still declined — but now
on evidence (no query demand in the 16-month export, no competitor builds one)
rather than on a rule. That the outcome held when the rule was removed is the
evidence doing the work, which is the better reason to decline.

**2 · Verification is never a publish blocker.** Nothing in this build gates on
independent verification of a client-supplied fact. The client-attested standard
applies: record who supplied it and when, mark it attested, never invent. Randy's
territory-wide job history is the live case — attested, recorded, used.

Worth stating plainly: the substance gate is NOT a verification gate. Ferndale is
blocked for want of a first-party proof, which is a Part 6.1 content requirement,
not an audit of the client. That block stands.

---

## New contracts, implemented

**Part 4.3 — the snippet-shape contract.** Every page now declares one
`snippetShape` in frontmatter, and `scripts/citability.mjs` fails the build if the
declared shape is not present in real semantic markup. This was not cosmetic: the
check found **27 pages declaring a shape they did not carry**, and fixing them was
real content work.

| Page type | Shape | What was added |
|---|---|---|
| T2 service spoke | paragraph + table | A "what each visit covers" table on all nine hubs — scope against interval. No price band, because we do not have prices and will not invent them. |
| T3 problem page | paragraph + ordered list | A "what to do now" list of imperative steps on five pages. Problem-aware queries are procedural queries. |
| T6 library profile | paragraph + table + list | An "at a glance" property table and an identification list on all six profiles. |
| T8 compliance | paragraph + table | Jurisdiction against obligation against what it means on a job. |
| T4/T5 geo | paragraph | Quick Answer only — a table here is padding. |

The standard's own honest framing is carried into the code comment: this buys
extraction-*readiness*, not snippet placement. No audit claims a snippet as a
deliverable.

**Part 6.5 — citability.** Four signals in frontmatter: a quantified sourced fact
*about the world rather than about us*, a named primary authority cited in the
visible sentence, a stated position the top five do not make, and first-party data
where it exists.

Enforcement is deliberate. Dimension 13 scores "the SHARE of indexable pages
carrying all four signals" — a proportion, not a publish condition — so the fields
are optional in the schema and `citability.mjs` reports the share. Making them
hard-required would brick a build over something the standard itself scores as a
percentage, in a revision whose entire changelog was about retiring gates that
blocked shipping without catching anything.

Current: **0 of 25 pages carry all four; 5 carry three or more.** Backfilled first
on the pages with genuinely sourced material — the compliance page, Cherry Point,
the Bellingham city and window pages, and insulated glass units. `firstPartyData`
is null everywhere: route-level seasonality does not exist yet, and prime
directive 8 forbids estimating one.

**M5 — social tags named.** `og:title`, `og:description`, `og:image`, `og:url`,
`og:type` and `twitter:card` now fail the SEO audit individually rather than being
inherited from M7's shared-image rule.

**Part 6.6 — content decay.** The `updated` field is documented as a visible
last-updated date tied to a substantive edit. Bumping it without the content
moving is fabrication.

---

## Rubric: fourteen dimensions, and a rule about scores

**Dimension 14, Accessibility, added.** Scored per *template*, not per page, and a
finding on a template blocks that template's first publish as a P0. Seven
components and three layouts exist here and none has been audited.

It is also the cheapest item on the board: it needs no client input and no
measurement window. We can move it alone.

**The re-baselining rule, and an admission.** v3.1 says: *never restate a
historical score on a newer rubric — state the rubric version with every score
quoted.*

This file previously restated the v1 score of 2.55 as 2.27 on the v2 rubric. v3
now forbids exactly that move. So **2.27 stays labelled a Keystone v2 score and is
not converted**. A v3.2 figure requires a fresh pass against the new definitions —
Dimension 14, the redefined Dimension 2 decline exemption, the Dimension 13
citability sub-score, the named Dimension 12 citation core — not arithmetic on the
old one. That pass is outstanding.

**Dimension 2 sharpened.** "A geography declined for lack of job history is not a
correct decline and does not earn the exemption." Every decline here is on demand
evidence, so all 310 qualify as correct declines and cost nothing.

**Dimension 9 — INP named** as the field metric, distinct from lab TBT, "because a
passing TBT does not imply a passing INP, and on page-builder themes they diverge
routinely." Neither is measured here; the 3 stays provisional.

**Dimension 12 — the citation core is now a named list**, four tiers, selected on
entity contribution rather than Domain Rating. Only the GBP has been read.

---

## Outstanding, in the order I would take them

1. **Accessibility audit per template.** No dependencies. Blocks first publish of
   each template, so it is on the critical path whether or not it feels urgent.
2. **A v3.2 scoring pass** across all fourteen dimensions, properly labelled.
3. **Citability backfill** on the 20 pages short of four signals.
4. **Part 3.5 navigation shell**, including the Nav Location column in the
   keyword→URL map — which moves the orphan check to plan time.
5. **Segment pages**, the ninth page type: `[service] for [segment]` is orthogonal
   to (service, geo), so it adds inventory without touching tuple uniqueness.
6. **Segmented XML sitemaps by page type** and the writer-register scanner as the
   eighth harness script.
7. **GA4 measurement hygiene (16.6)** — retention past the two-month default,
   internal traffic excluded, referral exclusions set, and no summing of
   platform-claimed conversions.
8. **Dimension 13 measurement per 10.4** — 3–5 runs per prompt with the rate
   reported against its sample size, rather than v2's single fixed-set number that
   moved on its own.

---

## Deliberately not done

The standard's own instruction, carried here: we do not instrument the owner's
phone. No "how did you hear about us" field, no call-derived lead counting. The
measurement basis is search data and on-site form and `tel:` events. Where a
question cannot be answered from that basis, the answer is that the instrument
does not exist — never a modelled number.
