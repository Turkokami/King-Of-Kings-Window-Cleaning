/**
 * business.ts — the single source of truth for every NAP, phone, credential and
 * social string on this site (Keystone Part 7A, "patterns worth cloning verbatim").
 *
 * Nothing in this file is hardcoded anywhere else. Change the phone here and it
 * changes on all 468 pages. Every value marked PENDING is scaffolded with a guard
 * and lights up automatically once it is filled — no page is ever published
 * asserting something we have not confirmed.
 *
 * VERIFIED  = read off the live site on 2026-09-10 during the Keystone sweep.
 * PENDING   = owner input required before Phase 1 closes.
 */

export type Pending<T> = T | null;

export const BUSINESS = {
  // ---- identity -----------------------------------------------------------
  legalName: 'King of Kings Window Cleaning LLC',           // VERIFIED
  name: 'King of Kings Window Cleaning',                    // VERIFIED
  shortName: 'King of Kings',
  siteUrl: 'https://www.kingofkingswindowcleaning.com',     // VERIFIED — www is canonical
  // VERIFIED — WA Secretary of State formation date, corroborated by the BBB
  // profile ("Business Started 3/26/2024"). Worth saying out loud: 248 reviews,
  // a 5.0 rating and seven awards in under three years is the story here. The
  // positioning is NOT "decades of experience" — it is the fastest-rising
  // exterior cleaner in Whatcom County. Write to that, not around it.
  founded: '2024-03-26',                                    // VERIFIED
  foundingYear: 2024 as Pending<number>,                    // VERIFIED
  logo: '/brand/king-of-kings-logo.png',
  socialImage: '/brand/king-of-kings-social.jpg',           // M7 — shared hero on every page

  /**
   * Third-party chat widget — LeadConnector / GoHighLevel.
   *
   * Requested 2026-09-14 by Cassidy Alber via the business inbox, forwarded by
   * Randy. Ownership confirmed by the client 2026-09-15: Cassidy is Randy's wife
   * and the widget is on their own CRM sub-account. This is the client-attested
   * standard (v3.2 changelog item 2) — attributed and dated, not independently
   * verified, and not invented.
   *
   * `enabled` is the kill switch. If the widget starts costing INP or breaks a
   * template's accessibility verdict, this flag turns it off everywhere in one
   * edit rather than requiring a hunt through templates.
   *
   * NOTE ON THE LOADER: the tag points at a loader that fetches a second script.
   * What that second script contains can change at any time without this file
   * changing, which is true of every third-party widget and is the reason the
   * 4A.3 NAP check below is a standing item rather than a one-off.
   */
  chatWidget: {
    enabled: true,
    provider: 'LeadConnector (GoHighLevel)',
    loaderUrl: 'https://widgets.leadconnectorhq.com/loader.js',
    resourcesUrl: 'https://widgets.leadconnectorhq.com/chat-widget/loader.js',
    widgetId: '6aa1b2bc95d905edcbb303f4',
    requestedBy: 'Cassidy Alber, forwarded by Randy Fee',
    requestedOn: '2026-09-14',
    ownershipConfirmedOn: '2026-09-15',
    /**
     * Part 4A.1 — pages with their own primary action do not get a competing one.
     *
     * /contact/ CAME OFF THIS LIST on 23 Sep 2026, at the operator's direction:
     * "contact should be wired to the widget that collects their info for leads."
     * The Part 4A.1 reasoning inverts on that page — the widget is not a third
     * action competing with the conversion path, it IS the conversion path, and
     * it is the only lead capture on a static build that cannot send mail. The
     * page's own "Request a quote online" button opens it (see ChatWidget.astro,
     * data-open-chat), which also fixed that button linking to /contact/ itself.
     */
    excludePaths: ['/our-guarantee/', '/privacy/'],
  },

  // ---- contact ------------------------------------------------------------
  phone: '(360) 303-6806',                                  // VERIFIED
  phoneE164: '+13603036806',
  email: 'kingofkingswindowcleaning@gmail.com',             // VERIFIED
  // SERVICE-AREA BUSINESS — street address stays null, deliberately and permanently
  // unless Randy says otherwise in writing.
  //
  // The WA Secretary of State filing lists a principal office address, and it is
  // a residential street address — his home. It is public record, but public
  // record is not the same as "should be published as the business address on a
  // website that ranks for 41 towns." Keystone Part 14: publish nothing about an
  // identifiable property without permission. The legacy site publishes no street
  // address either; that was the right call and we are keeping it.
  //
  // PostalAddress therefore carries locality and region only. That is valid
  // schema for a service-area business and it is what the GBP should match.
  address: {
    streetAddress: null as Pending<string>,                 // deliberate — see above
    addressLocality: 'Bellingham',
    addressRegion: 'WA',
    postalCode: null as Pending<string>,                    // deliberate — see above
    addressCountry: 'US',
  },
  // Geo of the primary service origin. VERIFY against a gazetteer before the
  // schema module is allowed to emit it — see markets.ts header.
  // VERIFIED 2026-09-12 — read off the Google Business Profile pin via Maps.
  // Not an estimate and not geocoded from the address: this is the coordinate
  // pair the business's own profile publishes. See archive/gbp-findings.json.
  geo: { latitude: 48.6490629 as Pending<number>, longitude: -122.3739165 as Pending<number> },

  // ---- credentials --------------------------------------------------------
  // VERIFIED — WA UBI, published in the footer of the client's own live site and
  // matching the Secretary of State filing. Randy Fee is the registered agent and
  // Individual Governor.
  ubi: '605476674',                                         // VERIFIED
  //
  // DECIDED 2026-09-22 by the site operator: "remove the UBI blocker, it's not
  // our job to publish it." The gate is gone: this is no longer a pending item
  // waiting on written confirmation from the client.
  //
  // It resolves to PUBLISHED rather than withheld, for a reason worth recording.
  // The business already publishes this number itself, in the footer of every
  // page of its own live site, and it was ALREADY rendering here in the FAQ on
  // /team/randy-fee/ while the footer guard suppressed it — so the site was
  // inconsistent with itself, not private. Mirroring what the client publishes is
  // not an agency deciding to disclose an identifier, which is what Part 8 is
  // actually about. Withholding it would have meant deleting a true credential
  // that is live on both sites today, which nobody asked for.
  //
  // Set to false if he wants it off the new site; the footer, the credential line
  // and the schema all follow this one flag.
  publishUbi: true as boolean,                              // DECIDED — mirrors the client's own footer

  // ---- the "licensed" question, stated honestly ---------------------------
  // The site says "Licensed & L&I insured". No contractor registration number
  // appears anywhere on the site, on the BBB profile, or in the SoS filing —
  // only the UBI. In Washington, a UBI is a business licence; it is NOT a
  // contractor registration, and the two are routinely conflated in this trade.
  //
  // It matters because roof cleaning and pressure washing can fall under
  // contractor registration in WA in a way that window cleaning does not.
  // We do not assert a registration we cannot see. Two outcomes:
  //   · Randy holds one  → put the number here, hasCredential emits it
  //   · Randy does not   → the credential line reads "WA business licence UBI …
  //                        and L&I workers' comp", which is true, and he should
  //                        confirm with L&I whether his roof and pressure-wash
  //                        work requires registration.
  contractorRegistration: null as Pending<string>,          // PENDING — verify with L&I
  laborAndIndustriesAccount: null as Pending<string>,       // PENDING — workers' comp account
  insured: true,                                            // VERIFIED (stated on site)
  bonded: null as Pending<boolean>,                         // PENDING
  // Third-party corroboration, useful and citable.
  bbbRating: 'A',                                           // VERIFIED — BBB profile, not accredited
  bbbAccredited: false,                                     // VERIFIED

  // ---- the named expert (Keystone Part 4.1 block 2, Part 5.1 Person node) ---
  // RESOLVED 2026-09-10. Randy Fee — owner, registered agent and Individual
  // Governor on the WA Secretary of State filing, and the name customers use in
  // their own reviews ("Randy did an amazing job cleaning and repairing damage
  // on a difficult window").
  //
  // The angle is not "decades of experience" — the company is two and a half
  // years old. The angle is that the owner is the one on your ladder. Two lines
  // from his own site carry the whole E-E-A-T story and should be worked into
  // the expert block on every page:
  //   "Randy runs the company himself, so you are dealing with the owner, not a
  //    call center."
  //   "Every new team member is personally trained by owner Randy Fee…"
  expert: {
    name: 'Randy Fee',                                      // VERIFIED
    slug: 'randy-fee',
    jobTitle: 'Owner',                                      // VERIFIED — "Member" on the SoS filing
    // What we can actually stand behind today. See the licensing note above:
    // no contractor registration number appears on the site, the BBB profile or
    // the SoS filing. Until one is produced, the credential line is the business
    // licence and the L&I coverage, which are real.
    credential: null as Pending<string>,                    // PENDING — contractor reg., if he holds one
    credentialName: 'Washington State Contractor Registration',
    // Founded March 2024 — deliberately NOT expressed as "years of experience",
    // because we do not know his years in the trade before founding. If he has
    // them, they are worth stating; we are not going to assume them.
    yearsInTrade: null as Pending<number>,                  // PENDING — years before founding
    bio: null as Pending<string>,                           // PENDING — 120-180 words, first person
    photo: '/photos/team/randy-fee.webp' as Pending<string>, // owner-supplied 2026-09-17
  },

  // ---- reviews ------------------------------------------------------------
  // Keystone Part 5.3: aggregateRating comes from a verified review platform only.
  // Never hand-enter. `ratingSource` must be 'gbp-verified' for the node to emit.
  reviews: {
    claimOnLegacySite: 248,                                 // VERIFIED — what the old site says
    ratingValue: null as Pending<number>,                   // PENDING — pull from GBP at build
    reviewCount: null as Pending<number>,                   // PENDING — pull from GBP at build
    ratingSource: null as Pending<'gbp-verified'>,          // must equal 'gbp-verified' to emit
  },

  // ---- sameAs (Keystone Part 5.3 — entity connection) ---------------------
  // All six were linked from the live site footer on 2026-09-10. Exact profile
  // URLs are resolved in Phase 1 before they enter the graph.
  sameAs: {
    googleBusinessProfile: null as Pending<string>,         // PENDING — canonical GBP URL
    facebook: null as Pending<string>,
    instagram: null as Pending<string>,
    youtube: null as Pending<string>,
    nextdoor: null as Pending<string>,
    yelp: null as Pending<string>,
    x: null as Pending<string>,
  },

  // ---- hours --------------------------------------------------------------
  openingHours: null as Pending<Array<{ days: string[]; opens: string; closes: string }>>, // PENDING

  // ---- commerce -----------------------------------------------------------
  paymentUrl: 'https://checkout.square.site',               // VERIFIED — Square
  quoteUrl: '/contact/',

  // ---- guarantee (doctrine #6 — defined terms only) -----------------------
  // The legacy site runs "Risk-Free" on 74 pages with no terms page anywhere.
  // RESOLVED 2026-09-22: the terms did exist, at /terms-of-service/, which the
  // operator pointed us at. Section 6, "Satisfaction Guarantee", is a properly
  // defined term — a window to raise a concern, an inspection, a defined remedy
  // and a stated exclusion list — so the wording below is his, not ours. It is
  // reproduced rather than paraphrased, because paraphrasing a warranty is
  // rewriting a contract.
  //
  // Source: King of Kings Window Cleaning LLC Terms of Service, last updated
  // 5 August 2026, section 6. Mirrored in full at /terms-of-service/.
  guarantee: {
    headline: 'Not satisfied? Tell us within 7 days and we come back.' as Pending<string>,
    terms: `<p>
        From the company's <a href="/terms-of-service/">Terms of Service</a>,
        section 6, last updated 5 August 2026:
      </p>
      <blockquote>
        <p>
          If you are not satisfied with the quality of our work, please contact us
          within 7 days of your service. We will inspect the concern and, when
          appropriate, return to address issues related to the original scope of
          work at no additional charge.
        </p>
      </blockquote>
      <p>The guarantee does not cover:</p>
      <ul>
        <li>New dirt, pollen, dust or debris that accumulates after service.</li>
        <li>Weather-related spotting after service.</li>
        <li>
          Existing damage, failed window seals, scratches, hard water staining,
          oxidation, mineral deposits or defective glass.
        </li>
        <li>Conditions outside the original scope of work.</li>
      </ul>
      <p>
        Those exclusions are worth reading rather than skipping, because two of
        them are the things people most often expect a guarantee to cover.
        A <a href="/surface-library/insulated-glass-units/">failed sealed unit</a>
        fogs between the panes where no cleaner can reach, and hard water staining
        is etched into the glass surface rather than sitting on it — neither is
        dirt, and neither is fixed by cleaning the window again.
      </p>` as Pending<string>,
    termsUrl: '/our-guarantee/',
  },
} as const;

/** Guards — a block that depends on PENDING data renders nothing rather than a lie.
 *
 *  Note the split between `expert` and `expertCredential`. The first draft of
 *  this file required a credential number before the named-expert block would
 *  render at all, which would have kept Randy off every page because no
 *  contractor registration number exists to find. That is the guard being wrong,
 *  not the data. A named owner who personally trains the crew is a real E-E-A-T
 *  signal on his own; the licence number is a separate, additive one.
 */
export const READY = {
  expert: () => Boolean(BUSINESS.expert.name),
  expertCredential: () => Boolean(BUSINESS.expert.name && BUSINESS.expert.credential),
  aggregateRating: () =>
    BUSINESS.reviews.ratingSource === 'gbp-verified' &&
    typeof BUSINESS.reviews.ratingValue === 'number' &&
    typeof BUSINESS.reviews.reviewCount === 'number',
  guarantee: () => Boolean(BUSINESS.guarantee.headline && BUSINESS.guarantee.terms),
  geo: () => typeof BUSINESS.geo.latitude === 'number' && typeof BUSINESS.geo.longitude === 'number',
  ubi: () => BUSINESS.publishUbi === true,
  sameAs: () => Object.values(BUSINESS.sameAs).filter(Boolean).length > 0,
};

/** Every non-null sameAs, in a stable order, for the LocalBusiness node. */
export const sameAsList = (): string[] =>
  Object.values(BUSINESS.sameAs).filter((v): v is string => Boolean(v));

/**
 * Substantiated trust line. Never "Bellingham's Best" — that claim is replaced
 * by `substantiatedClaim()` in awards.ts, which cites a named awarding body and
 * a year instead of asserting superiority.
 */
export const trustLine = (): string => {
  if (READY.aggregateRating()) {
    return `${BUSINESS.reviews.reviewCount} Google reviews across Whatcom and Skagit County.`;
  }
  return 'Licensed and L&I insured, working Whatcom and Skagit County.';
};

/**
 * The credential sentence, stated at exactly the strength the evidence supports.
 * Three tiers, and the weakest one is still true — which is the whole point.
 */
export const credentialLine = (): string => {
  const parts: string[] = [];
  if (READY.expertCredential()) {
    parts.push(`${BUSINESS.expert.credentialName} ${BUSINESS.expert.credential}`);
  } else if (READY.ubi()) {
    parts.push(`Washington business licence, UBI ${BUSINESS.ubi}`);
  } else {
    parts.push('Licensed in Washington State');
  }
  if (BUSINESS.insured) parts.push('L&I insured');
  if (BUSINESS.bbbRating) parts.push(`BBB rated ${BUSINESS.bbbRating}`);
  return parts.join(' · ');
};

/** Years the business has been trading. Computed, never hand-written and stale. */
export const yearsTrading = (): number =>
  Math.max(0, Math.floor((Date.now() - new Date(BUSINESS.founded).getTime()) / 31_557_600_000));
