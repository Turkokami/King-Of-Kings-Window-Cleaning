/**
 * seo.ts — title and meta description discipline (Keystone mandate M5).
 *
 * Legacy baseline measured 2026-09-10: 26 of 287 titles over 60 characters
 * (longest 92), 39 meta descriptions outside the 110–165 band.
 *
 * The dangling-ending trap (Keystone 12.3): a long variable plus a fixed suffix
 * overflows and the description ends mid-word. `trimDescription` cuts at a
 * sentence or clause boundary and always ends on punctuation — and
 * `validateMeta` runs across the FULL page set before any of it is written,
 * not after.
 */

export const TITLE_MAX = 60;
export const DESC_MIN = 110;
export const DESC_MAX = 165;

/**
 * Keyword and city front-loaded, brand appended only if it still fits.
 * Never cut mid-word, never ship a truncated title.
 */
export function buildTitle(core: string, brand = 'King of Kings'): string {
  if (core.length > TITLE_MAX) {
    throw new Error(`Title core is ${core.length} chars, over the ${TITLE_MAX} limit before brand: "${core}"`);
  }
  const withBrand = `${core} | ${brand}`;
  return withBrand.length <= TITLE_MAX ? withBrand : core;
}

/** Cut to the band on a sentence boundary; guarantee a terminal punctuation mark. */
export function trimDescription(text: string): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= DESC_MAX) return endsWellOrThrow(clean);

  // Prefer a full sentence.
  const sentences = clean.match(/[^.!?]+[.!?]+/g) ?? [];
  let out = '';
  for (const s of sentences) {
    if ((out + s).trim().length > DESC_MAX) break;
    out += s;
  }
  out = out.trim();
  if (out.length >= DESC_MIN) return out;

  // Fall back to a clause boundary, then close it properly.
  const cut = clean.slice(0, DESC_MAX);
  const lastBreak = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf(', '), cut.lastIndexOf(' — '), cut.lastIndexOf(' '));
  out = cut.slice(0, lastBreak).trim().replace(/[,;:—-]$/, '');
  if (!/[.!?]$/.test(out)) out += '.';
  // The full stop is appended AFTER the cut, so a break landing on DESC_MAX
  // returned DESC_MAX + 1. Re-cut once rather than trusting the arithmetic.
  if (out.length > DESC_MAX) {
    const back = out.slice(0, DESC_MAX - 1).replace(/[\s,;:—-]+$/, '');
    out = /[.!?]$/.test(back) ? back : `${back}.`;
  }
  return out;
}

function endsWellOrThrow(s: string): string {
  if (!/[.!?]$/.test(s)) return `${s}.`;
  return s;
}

export interface MetaRow { path: string; title: string; description: string }

/**
 * Run this across every page BEFORE the content wave is written (Keystone 12.3).
 * Catches the three defects the legacy site actually has: over-long titles,
 * out-of-band descriptions, and duplicates.
 */
export function validateMeta(rows: MetaRow[]) {
  const errors: string[] = [];
  const titles = new Map<string, string[]>();
  const descs = new Map<string, string[]>();

  for (const r of rows) {
    if (!r.title) errors.push(`${r.path}: missing title`);
    else if (r.title.length > TITLE_MAX) errors.push(`${r.path}: title ${r.title.length} chars (max ${TITLE_MAX})`);

    if (!r.description) errors.push(`${r.path}: missing meta description`);
    else {
      if (r.description.length < DESC_MIN || r.description.length > DESC_MAX) {
        errors.push(`${r.path}: description ${r.description.length} chars (band ${DESC_MIN}-${DESC_MAX})`);
      }
      if (!/[.!?]$/.test(r.description.trim())) {
        errors.push(`${r.path}: description does not end on punctuation — dangling ending`);
      }
    }
    titles.set(r.title, [...(titles.get(r.title) ?? []), r.path]);
    descs.set(r.description, [...(descs.get(r.description) ?? []), r.path]);
  }

  for (const [t, paths] of titles) if (paths.length > 1) errors.push(`duplicate title on ${paths.length} pages: "${t}" → ${paths.join(', ')}`);
  for (const [d, paths] of descs) if (paths.length > 1) errors.push(`duplicate description on ${paths.length} pages → ${paths.join(', ')}`);

  return { ok: errors.length === 0, errors };
}

/**
 * Image alt formula (Keystone 6.4): [what's shown] + [action/context] + [local
 * where the page is city-specific]. Max 125 chars, no stuffing, describes the
 * image and not the keyword.
 */
export function altText(shown: string, context: string, local?: string): string {
  const parts = [shown, context, local].filter(Boolean);
  const alt = parts.join(', ');
  if (alt.length > 125) throw new Error(`Alt text ${alt.length} chars (max 125): "${alt}"`);
  return alt;
}

/* ===========================================================================
 * CTR DISCIPLINE — added 2026-09-14 on measured evidence, not on theory.
 *
 * The legacy site ranks better than it earns. Search Console, sixteen months:
 *   "window cleaning bellingham"  position  9.4 · 2,194 impressions ·  28 clicks (1.3%)
 *   "bellingham window cleaning"  position 14.6 · 1,635 impressions ·   3 clicks (0.2%)
 *   sitewide desktop              0.86% CTR on 28,505 impressions
 *   sitewide mobile               4.70% CTR on 14,044 impressions
 *
 * A 1.3% CTR at position nine on a local commercial term is not a ranking
 * problem. Those impressions are already won. The title and description are
 * failing to convert them, and that is the cheapest fix available on this site.
 *
 * Two things below. `buildGeoTitle` builds the title in the word order people
 * actually type — measured from the query export, not guessed. `auditCtr` fails
 * a title that carries nothing a searcher could choose it for.
 * ======================================================================== */

/**
 * Word order matters and we have the data for it. In this market the dominant
 * phrasing is "{service} {city}" (2,194 impressions) ahead of "{city} {service}"
 * (1,635). So the title leads with the service and follows with the city, which
 * matches the higher-volume pattern and reads naturally as a phrase.
 *
 * "in" is deliberate: it turns a keyword pair into a sentence fragment a person
 * can read, at a cost of three characters.
 */
export function buildGeoTitle(service: string, city: string, suffix?: string): string {
  const core = `${service} in ${city}`;
  const withSuffix = suffix ? `${core} — ${suffix}` : core;
  return buildTitle(withSuffix.length <= TITLE_MAX ? withSuffix : core);
}

/**
 * Tokens that give a searcher a reason to pick this result over the nine above
 * it. A title carrying none of them is competing on position alone, which is
 * exactly the losing position the measurement above describes.
 */
const CTR_TOKENS: Array<{ name: string; pattern: RegExp }> = [
  { name: 'place', pattern: /\b(in|near)\s+[A-Z]/ },
  { name: 'proof', pattern: /\b(\d+(\.\d+)?★|\d{2,}\s*reviews?|5\.0|since\s*\d{4}|\d+\s*years?)\b/i },
  { name: 'specificity', pattern: /\b(soft\s*wash|water[- ]fed|purified|no\s*pressure|same[- ]day|free\s*quote|insured|licen[cs]ed)\b/i },
];

/** Strings that made the legacy site's titles interchangeable with anyone's. */
const CTR_ANTIPATTERNS: Array<{ name: string; pattern: RegExp }> = [
  { name: 'bare service + brand', pattern: /^[A-Za-z ]+\s*\|\s*King of Kings$/ },
  { name: 'unsubstantiated superlative', pattern: /\b(best|#1|number one|top rated)\b/i },
  { name: 'filler words', pattern: /\b(services?|solutions?|company|professional)\b.*\b(services?|solutions?|company|professional)\b/i },
];

export interface CtrFinding { path: string; severity: 'fail' | 'warn'; message: string }

/**
 * Run alongside validateMeta. Antipatterns fail; a title with no click-earning
 * token warns, because there are page types (a privacy policy) where that is
 * fine and page types (a city page at position nine) where it is the whole
 * problem. The caller decides which are fatal.
 */
export function auditCtr(rows: MetaRow[]): CtrFinding[] {
  const out: CtrFinding[] = [];
  for (const r of rows) {
    if (!r.title) continue;
    for (const ap of CTR_ANTIPATTERNS) {
      if (ap.pattern.test(r.title)) {
        out.push({ path: r.path, severity: 'fail', message: `title antipattern (${ap.name}): "${r.title}"` });
      }
    }
    const carried = CTR_TOKENS.filter((t) => t.pattern.test(r.title)).map((t) => t.name);
    if (carried.length === 0) {
      out.push({ path: r.path, severity: 'warn', message: `title carries no place, proof or specificity token: "${r.title}"` });
    }
    // A description that only restates the title wastes the one line of copy
    // Google will show. Measured failure mode on the legacy site.
    if (r.description && r.title) {
      const t = r.title.toLowerCase().replace(/[^a-z ]/g, '');
      const d = r.description.toLowerCase().slice(0, t.length);
      if (t && d.startsWith(t.slice(0, Math.min(28, t.length)))) {
        out.push({ path: r.path, severity: 'warn', message: 'description opens by restating the title' });
      }
    }
  }
  return out;
}
