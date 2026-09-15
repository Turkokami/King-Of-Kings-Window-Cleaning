import type { APIRoute } from 'astro';
import { tierUrls } from './sitemap.xml';

/** One sitemap per page type — see the note in sitemap.xml.ts. */
export const prerender = true;

export function getStaticPaths() {
  return ['core', 'services', 'geo', 'problems', 'library', 'compliance', 'trust']
    .map((tier) => ({ params: { tier } }));
}

export const GET: APIRoute = async ({ params }) => {
  const urls = await tierUrls(String(params.tier));
  const body = urls
    .map((x) => `  <url><loc>${x.loc}</loc>${x.lastmod ? `<lastmod>${x.lastmod}</lastmod>` : ''}</url>`)
    .join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
};
