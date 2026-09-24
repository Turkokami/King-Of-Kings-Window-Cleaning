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

**There are exactly two client-side scripts in this project**: this widget's
loader and `Analytics.astro`. If you find a third, something has gone wrong.

**It is the lead capture.** The widget is not a support chat — it opens "Get a
Free Estimate" and collects name, phone and a message with an SMS consent
checkbox. On a static build that cannot send mail, it is the only thing on the
site that takes a lead without a phone call.

**`/contact/` uses it, as of 23 Sep 2026**, at the operator's direction:
"contact should be wired to the widget that collects their info for leads." The
page's own "Request a quote online" button carries `data-open-chat` and the
widget script opens it. Two things that fixed: the widget had been excluded from
the one page whose job is conversion, and that button previously linked to
`BUSINESS.quoteUrl` — which is `/contact/`, the page it was on.

**The opener depends on a vendor method.** `window.leadConnector.chatWidget
.openWidget()`, confirmed in a real browser on 23 Sep 2026 (it flips the custom
element's `data-active` to true). It is not documented by the vendor, so treat
it as breakable: if it disappears, the button opens nothing and the vendor's own
floating launcher is the fallback. **Check it at every field review**, with the
rest of the widget checks below.

**It is deliberately not the snippet as supplied.** The request was for a plain
`<script>` before `</body>` on every page. It is instead loaded on first
interaction or after idle, never before paint, and excluded from
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
   That still holds everywhere except `/contact/`, where the widget is the
   conversion path rather than a competitor to it.
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
  browser pass, and a finding in it is a finding on every template. **Checked by
  the site operator on 22 Sep 2026 — "chat widget works great."** That closes the
  open browser pass. Re-check after any vendor change: the loader's payload can
  move without the tag moving, which is the whole reason this note exists.

### Analytics — GA4 and the Meta pixel, added 24 Sep 2026

Carried over from the legacy site at the operator's direction so the cutover does
not put a hole in the client's own data. GA4 `G-21TYNNYE42` continues the SAME
property — a fresh measurement ID would have reset sixteen months of history on
the day the site got better. Meta pixel `1514930130117745`; the business runs ads
off it. Kill switch: `BUSINESS.analytics.enabled = false`.

**Its idle cap is 1200ms, not the widget's 8000ms, and that is deliberate.** The
widget can wait for an interaction because a visitor who never interacts never
needed it. A pageview that waits for an interaction never fires at all: every
bounced visit vanishes, the numbers land under the legacy site's, and the
comparison the client will actually make — "is the new site doing better?" — is
corrupted in our favour. Undercounting your own traffic is worse than not
measuring it, because it looks like data.

**`/privacy/` names all three services in plain words** and has to be updated in
the same commit as anything added to `BUSINESS.analytics`. The page previously
promised it would name any analytics before they shipped; that promise was kept
on 24 Sep 2026, which is why the pixel is described as what it is rather than as
"marketing technologies".

---

## Business data

- **The UBI is published. DECIDED 22 Sep 2026** by the site operator: "remove the
  UBI blocker, it's not our job to publish it." It was previously gated behind a
  written-confirmation flag that nobody was going to send, while the number was
  simultaneously hard-coded into an FAQ on `/team/randy-fee/` — so the site was
  inconsistent with itself rather than discreet. One flag now governs it
  everywhere: `BUSINESS.publishUbi`. The business publishes the same number in
  the footer of every page of its own site. Set the flag to `false` if that ever
  changes.
- **The guarantee has real terms as of 22 Sep 2026.** They were never missing —
  they were at `/terms-of-service/` on the legacy site, section 6, last revised
  5 August 2026. `BUSINESS.guarantee.terms` reproduces that wording rather than
  paraphrasing it, because paraphrasing a warranty rewrites a contract, and
  `/terms-of-service/` mirrors the full document. `/our-guarantee/` is indexable
  now that it says something defined. **If the client revises his terms, both
  places have to move.**
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
- **`/privacy/` is noindex**, because it is thin by design. `/case-studies/` was
  too, while it was empty; it is indexable as of 22 Sep 2026 now that two real
  documented jobs are published there. The noindex is conditional on the
  collection being empty, so it comes back on its own if the studies are ever
  removed.
- **Case-study URLs match the legacy ones exactly** —
  `/case-studies/window-cleaning-bow-wa/` and
  `/case-studies/gutter-cleaning-bellingham-wa/`. That is deliberate: those paths
  are live on the WordPress site today, so the cutover needs no redirect for them.
  Do not "tidy" the slugs.
- **A case study only shows before/after pairs where the two frames are the same
  position.** The Bow job was photographed as matched pairs and declares three;
  the Bellingham gutter job was shot as a sequence and declares none, so it shows
  the sequence instead. Labelling two different gutter runs "before" and "after"
  would be the exact fabrication this build refuses everywhere else.
- **Eight in-body links were de-linked**, not deleted — they pointed at problem
  pages not yet written. Re-link them when the pages land;
  `scripts/content-links.mjs` fails the build if you link one early.
