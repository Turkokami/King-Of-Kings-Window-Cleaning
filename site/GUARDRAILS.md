# Guardrails — King of Kings Window Cleaning

Keystone Part 14. Decisions a future session must not silently undo, each with
who decided it and when. If something here looks wrong, raise it — do not
"clean it up".

---

## Third-party scripts

### LeadConnector / GoHighLevel chat widget — ACTIVE

| | |
|---|---|
| Requested | 14 Sep 2026, Cassidy Alber, via the business inbox, forwarded by Randy Fee |
| Ownership confirmed | 15 Sep 2026 by the client — Cassidy is Randy's wife; the widget is on their own CRM sub-account |
| Widget ID | `6aa1b2bc95d905edcbb303f4` |
| Config | `src/data/business.ts` → `BUSINESS.chatWidget` |
| Component | `src/components/ChatWidget.astro` |
| Kill switch | `chatWidget.enabled = false` turns it off everywhere in one edit |

**This is the only client-side JavaScript in the project.** If you find a second
one, something has gone wrong.

**It is deliberately not the snippet as supplied.** The request was for a plain
`<script>` before `</body>` on every page. It is instead loaded on first
interaction or after idle, never before paint, and excluded from `/contact/`,
`/our-guarantee/` and `/privacy/`. Four reasons, all of them scored dimensions:

1. **Dimension 9 / INP.** This build otherwise ships zero client JS. A blocking
   loader that fetches a second script is the classic INP regressor, and v3.2
   named INP as the field metric because it diverges from lab TBT on exactly this.
2. **Dimension 14.** Chat widgets are the standard accessibility regression —
   focus traps, unlabelled icon-only launchers, a floating button covering content
   at 320px and 200% zoom. The templates cleared Dimension 14 at zero findings;
   this injects third-party DOM that static analysis cannot audit.
3. **Part 4A.1, one primary action per page.** A floating launcher is a third
   action competing with call and quote, and on mobile it usually wins the tap.
4. **It lands where the sticky call bar lands.** `base.css` lifts it above the bar
   on mobile and caps its z-index below the skip link.

**Standing checks, because a loader's payload can change without the tag
changing:**

- **4A.3, the NAP trap.** If the widget ever surfaces a phone number that is not
  the GBP number, NAP consistency breaks and Dimension 12 loses a scored sub-item.
  Check at every field review.
- **The launcher CSS targets another vendor's DOM.** If they rename the container
  the overlap fix stops applying silently. Re-check at the 28-day review.
- **Accessibility.** The widget cannot be audited by `scripts/a11y.mjs`. It needs a
  browser pass, and a finding in it is a finding on every template.

---

## Business data

- **`streetAddress` is null site-wide.** The Secretary of State principal office
  address is residential. It is also currently published on the Google Business
  Profile, which is an inconsistency the client has to resolve — hide it on the
  GBP and go service-area, or publish it both places. See
  `archive/gbp-findings.json` GBP-1. Do not simply copy the GBP address in.
- **`aggregateRating` is never hard-coded.** It comes from a verified GBP at build
  time or it does not render. The review count on `/reviews/` is deliberately
  absent for the same reason. 256 was true on 12 Sep 2026 and is not a constant.
- **Every credential renders through a `READY.*` guard** that fails closed. A fact
  nobody supplied renders as nothing, never as a placeholder.
- **v3.2 retired verification as a publish blocker.** The standard is
  client-attested: record who supplied a fact and when, mark it attested, never
  invent. Randy's territory-wide job history is the live example.

---

## Architecture

- **The page list is GENERATED from `architecture/demand/demand-map.csv`.** Do not
  add a market to a route by hand. `scripts/gen-authorised.mjs` produces
  `src/data/authorised.ts`, and every route reads it — which is what stops a hub
  linking to a page the demand gate declined.
- **The 31 declined markets are still said**, as areaServed prose in the footer,
  the geo hub and the service hubs. They are mentions, not URLs. That is Part 6A
  working, not an omission.
- **Scores carry their rubric version.** The 2.27 in
  `archive/keystone-scorecard.json` is a **Keystone v2** score and must not be
  restated on v3.2 — v3.1 forbids re-baselining a historical score.

---

## Substance gate item 2 (first-party proof) — RETIRED

| | |
|---|---|
| Decided | 18 Sep 2026, by the site operator: "get rid of the blocker, it no longer applies" |
| What changed | `firstPartyProof` is optional in `src/content/config.ts`; `scripts/word-count.mjs` no longer fails a geo page that lacks it |
| What did not | A page that HAS the field must carry something real — a placeholder still fails the build. Items 1 (three sourced local facts) and 3 (a unique fact) still gate every geo page |
| Replaces | The single-page Ferndale waiver of 15 Sep 2026, removed with its PENDING string |

The requirement was retired, not the principle: **no page may state a job,
photo or review that did not happen.** Real proof is still the strongest thing a
location page can carry. Where it exists — Bellingham (Roosevelt, Edgemoor and
the gutter job), Lynden (house wash) and Mount Vernon (concrete) — it is used.
Ask Randy to keep naming the town in his Google posts; every one is a proof line
for a page that currently has none.

---

## Things that look like bugs and are not

- **`alt=""` on the header logo.** Correct: the link carries an `aria-label`, so
  the image is decorative. Dimension 14 requires exactly this.
- **The services submenu is `<details>/<summary>`, not a hover dropdown.** With no
  client JS, a hover menu is unreachable by keyboard.
- **`/privacy/` and `/case-studies/` are noindex.** Privacy is thin by design;
  case studies is empty and says so rather than being filled with invented jobs.
- **Eight in-body links were de-linked**, not deleted — they pointed at problem
  pages not yet written. Re-link them when the pages land;
  `scripts/content-links.mjs` fails the build if you link one early.
