import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { BUSINESS } from '../data/business';
import { AUTHORISED_CITIES, AUTHORISED_TUPLES } from '../data/authorised';
import { buildableServices } from '../data/services';

/**
 * SEGMENTED SITEMAP INDEX — Keystone v3.2, adopted item 19.
 *
 * "Per-tier sitemaps make the M1 consolidation question a number instead of a
 * judgement call." One flat sitemap tells you the site has N URLs. A sitemap per
 * page type tells you Search Console's indexation rate PER TIER — so when the geo
 * tier is indexed at 40% and the library at 100%, that is visible as a number
 * rather than as a hunch, and the decision to consolidate has evidence behind it.
 *
 * That is not hypothetical here: the legacy site had 138 of 287 URLs never shown
 * once, and nobody knew because there was one sitemap.
 */
export const prerender = true;

export const GET: APIRoute = async () => {
  const tiers = ['core', 'services', 'geo', 'problems', 'library', 'compliance', 'trust'];
  const body = tiers
    .map((t) => `  <sitemap><loc>${BUSINESS.siteUrl}/sitemap-${t}.xml</loc></sitemap>`)
    .join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
};

/** Shared by the per-tier routes below. */
export async function tierUrls(tier: string): Promise<Array<{ loc: string; lastmod?: string }>> {
  const u = (p: string, d?: Date) => ({ loc: `${BUSINESS.siteUrl}${p}`, lastmod: d?.toISOString().slice(0, 10) });
  switch (tier) {
    case 'core':
      return [u('/'), u('/services/'), u('/locations/'), u('/surface-library/'), u('/compliance/')];
    case 'services':
      return buildableServices().map((s) => u(`/services/${s.slug}/`));
    case 'geo':
      return [
        ...AUTHORISED_CITIES.map((c) => u(`/locations/${c}/`)),
        ...Object.entries(AUTHORISED_TUPLES).flatMap(([c, svcs]) =>
          svcs.map((s) => u(`/locations/${c}/${s}/`))),
      ];
    case 'problems':
      return (await getCollection('problem')).map((p) => u(`/services/${p.data.parentService}/${p.slug}/`, p.data.updated));
    case 'library':
      return (await getCollection('library')).map((p) => u(`/surface-library/${p.slug}/`, p.data.updated));
    case 'compliance':
      return (await getCollection('compliance')).map((p) => u(`/compliance/${p.slug}/`, p.data.updated));
    case 'trust':
      // /privacy/ and /case-studies/ are noindex while empty — excluded on purpose.
      return [u('/about/'), u('/contact/'), u('/reviews/'), u('/team/randy-fee/')];
    default:
      return [];
  }
}
