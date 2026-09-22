#!/usr/bin/env node
/**
 * Generate src/data/photo-index.json from src/data/photos.ts.
 *
 * WHY A GENERATED FILE. astro.config.mjs places photographs inside markdown
 * bodies (see rehypePhotos), and a rehype plugin cannot import a .ts module. The
 * alternative was a second hand-maintained copy of every caption, which is how
 * the two drift apart. This transpiles the real source with esbuild — already a
 * dependency of Astro — imports it, and writes the plain JSON the plugin reads.
 *
 * Run it after editing photos.ts: `npm run photos:index` (the build runs it too).
 */
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const TMP = path.join('node_modules', '.cache', 'photo-index.mjs');
fs.mkdirSync(path.dirname(TMP), { recursive: true });

await build({
  entryPoints: ['src/data/photos.ts'],
  outfile: TMP,
  format: 'esm',
  bundle: false,
  platform: 'node',
  logLevel: 'silent',
});

const m = await import(pathToFileURL(path.resolve(TMP)).href + `?t=${Date.now()}`);

const out = {
  service: m.SERVICE_PHOTOS_BY_SLUG ?? {},
  cityService: m.CITY_SERVICE_PHOTOS ?? {},
  city: m.CITY_PHOTOS ?? {},
  problem: m.PROBLEM_PHOTOS ?? {},
  library: Object.fromEntries(Object.entries(m.LIBRARY_HERO ?? {}).map(([k, v]) => [k, [v]])),
  compliance: Object.fromEntries(Object.entries(m.COMPLIANCE_HERO ?? {}).map(([k, v]) => [k, [v]])),
  pairs: m.BEFORE_AFTER ?? [],
  // T9 case studies carry their own photographs — one property, one day — rather
  // than drawing from the service pool, so the plugin reads them per study.
  // Shape differs from the maps above: { hero, pairs[], photos[] } per slug.
  caseStudy: m.CASE_STUDY_PHOTOS ?? {},
};

// SERVICE_PHOTOS is keyed by service slug already; keep the name the plugin uses.
out.service = m.SERVICE_PHOTOS ?? {};

fs.writeFileSync('src/data/photo-index.json', JSON.stringify(out, null, 1) + '\n');
const size = (v) => (Array.isArray(v) ? v.length : 1 + v.pairs.length + v.photos.length);
const count = Object.values(out).reduce(
  (n, v) => n + (Array.isArray(v) ? v.length : Object.values(v).reduce((a, b) => a + size(b), 0)), 0);
console.log(`photo-index: ${count} entries across ${Object.keys(out).length} maps`);
