/**
 * geo.ts — differentiated geo copy, with a fallback that is honest about being one.
 *
 * Keystone 6.3: "Real facts beat volume. A page grounded in 'the Pigeon River, the
 * fieldstone foundations, the 1920s housing stock' cannot read as a template."
 *
 * This module never writes a page. It assembles the RESEARCHED facts from
 * markets.ts into copy scaffolding for a human or an agent writer, and it refuses
 * to produce hyper-local claims for a market whose research rows are empty.
 */

import { AUTHORISED_CITIES, AUTHORISED_TUPLES } from '../data/authorised';
import { type Market, marketBySlug, isBuildable, MARKETS } from '../data/markets';
import { serviceBySlug } from '../data/services';

/** Deterministic pick so the same market always gets the same variant. */
function pick<T>(arr: T[], seed: string, offset = 0): T | null {
  if (!arr.length) return null;
  let h = offset;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return arr[h % arr.length];
}

const list = (items: string[]): string =>
  items.length <= 1 ? (items[0] ?? '')
    : items.length === 2 ? `${items[0]} and ${items[1]}`
    : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

/**
 * The generic fallback (Keystone 12.3: "provide a genericLocal() fallback
 * everywhere; never !-assert optional data"). It is deliberately plain — it
 * makes no hyper-local claim, so an unresearched market cannot ship a page that
 * sounds specific while saying nothing.
 */
export function genericLocal(m: Market): string {
  return `${m.name} sits in ${m.county} County, in the same wet, mild maritime climate as the rest of our service area: long grey winters, heavy conifer cover and enough rain that organic growth on roofs and siding is a maintenance item rather than an occasional surprise.`;
}

export interface GeoCopy {
  /** True when this text rests on researched facts rather than the fallback. */
  specific: boolean;
  conditions: string;
  pressureLead: string | null;
  landmarkLead: string | null;
  regulatoryLead: string | null;
  waterLead: string | null;
  /** Blocking reasons, if the market has not cleared the research floor. */
  blockers: string[];
}

export function geoCopy(slug: string, serviceSlug?: string): GeoCopy {
  const m = marketBySlug(slug);
  if (!m) throw new Error(`geoCopy: unknown market "${slug}"`);
  const gate = isBuildable(m);
  const d = m.differentiators;

  const pressureLead = d.pressures.length
    ? `In ${m.name} the load on exterior surfaces is not generic. ${list(d.pressures)} ${d.pressures.length > 1 ? 'all leave' : 'leaves'} a residue that ordinary rain does not rinse off.`
    : null;

  const landmarkLead = d.landmarks.length
    ? `Crews working ${m.name} know ${list(d.landmarks)} — exposure changes street by street here, and so does the method.`
    : null;

  const regulatoryLead = d.regulatory.length
    ? `${m.name} carries obligations most exterior-cleaning outfits never mention: ${list(d.regulatory)}.`
    : null;

  const waterLead = d.water ? d.water : null;

  const conditions = pressureLead ?? genericLocal(m);

  return {
    specific: Boolean(pressureLead || landmarkLead || regulatoryLead),
    conditions,
    pressureLead,
    landmarkLead,
    regulatoryLead,
    waterLead,
    blockers: gate.ok ? [] : [gate.reason!],
  };
}

/**
 * The AEO Quick Answer — 40–60 words, written to be quoted verbatim, and reused
 * three ways (meta description, first FAQ answer, Speakable target).
 * Returns null when the market is unresearched: better no page than a fake one.
 */
export function quickAnswer(marketSlug: string, serviceSlug: string): string | null {
  const m = marketBySlug(marketSlug);
  const s = serviceBySlug(serviceSlug);
  if (!m || !s) return null;
  const d = m.differentiators;
  if (!d.pressures.length) return null;
  const p = pick(d.pressures, `${marketSlug}:${serviceSlug}`);
  return `${s.name} in ${m.name}, WA runs about ${'{PRICE_BAND}'} for a typical home and takes ${'{DURATION}'}. Local crews handle ${p} the way ${m.name} homes actually need. Licensed, L&I insured, free on-site quote.`;
}

/**
 * Lateral links (M3): siblings in the same city, plus the same service nearby.
 *
 * KEYSTONE v3.2 PART 6A — every href here is filtered against the committed
 * demand map. The previous version built links from the tier list and from the
 * market's `neighbours` array, which means it happily linked to (geo, service)
 * combinations the gate declined. On a 45-page geo tier drawn from a 355-slot
 * candidate set, that is not an edge case: most neighbours of an authorised city
 * are NOT authorised themselves. Unfiltered, this one function would have
 * generated the majority of the site's dead links.
 *
 * M3 says nothing is ever orphaned. It does not say link to pages that do not
 * exist — and a wheel spoke pointing at a 404 is worse than a missing spoke.
 */
export function wheel(marketSlug: string, serviceSlug: string, tierServices: string[]) {
  const m = marketBySlug(marketSlug)!;
  const authorisedHere = AUTHORISED_TUPLES[m.slug] ?? [];
  return {
    up: AUTHORISED_CITIES.includes(m.slug) ? `/locations/${m.slug}/` : '/locations/',
    hub: `/services/${serviceSlug}/`,
    siblingServices: tierServices
      .filter((s) => s !== serviceSlug && authorisedHere.includes(s))
      .map((s) => ({ slug: s, href: `/locations/${m.slug}/${s}/` })),
    nearbyCities: m.neighbours
      .filter((n) => (AUTHORISED_TUPLES[n] ?? []).includes(serviceSlug))
      .map((n) => ({ slug: n, href: `/locations/${n}/${serviceSlug}/` })),
  };
}

/** Build-time report: which markets still owe research before they can ship. */
export function researchReport() {
  return MARKETS.map((m) => ({ slug: m.slug, name: m.name, tier: m.tier, legacy: m.legacy, ...isBuildable(m) }));
}
