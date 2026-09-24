#!/usr/bin/env node
/**
 * Rewrite vercel.json's `redirects` from architecture/redirect-map.csv.
 *
 * WHY THIS EXISTS. The CSV is the source of truth and vercel.json is the thing
 * that actually serves, and on 24 Sep 2026 they had silently drifted: two rows
 * in the CSV pointed at pages that were never written, while vercel.json pointed
 * those same legacy URLs somewhere real. Nobody would have noticed until someone
 * regenerated the JSON from the CSV and shipped two redirects into 404s.
 *
 * Run it after editing the CSV: `npm run redirects`. It is deliberately NOT part
 * of `npm run build` — rewriting what the edge serves is not something a routine
 * build should do silently.
 *
 * It refuses to write a destination with no page in dist/, which is the failure
 * mode that matters: a 301 into a 404 is worse than leaving the URL alone,
 * because it spends the crawler's trust as well as the visitor's click.
 */
import fs from 'node:fs';
import path from 'node:path';

const CSV = path.join('..', 'architecture', 'redirect-map.csv');
const JSON_PATH = 'vercel.json';
const DIST = 'dist';

const rows = fs.readFileSync(CSV, 'utf8').trim().split('\n').slice(1)
  .filter(Boolean)
  .map((line) => {
    const [source, destination, code] = line.split(',');
    return { source: source.trim(), destination: destination.trim(), permanent: (code || '301').trim() === '301' };
  });

/* Duplicate sources are a silent hazard: the edge takes the first and the second
   is dead weight nobody can see. */
const seen = new Map();
const dupes = [];
for (const r of rows) {
  if (seen.has(r.source) && seen.get(r.source) !== r.destination) dupes.push(r.source);
  seen.set(r.source, r.destination);
}

/* A destination is only valid if it is a page we build, or another redirect's
   source (a chain we then flatten rather than serve). */
const built = (p) => fs.existsSync(path.join(DIST, p.replace(/^\/|\/$/g, ''), 'index.html')) || p === '/';
const missing = rows.filter((r) => !built(r.destination) && !seen.has(r.destination));

if (dupes.length || missing.length) {
  for (const d of dupes) console.error(`duplicate source with conflicting destinations: ${d}`);
  for (const m of missing) console.error(`destination does not exist: ${m.source} -> ${m.destination}`);
  console.error('\nvercel.json NOT written.');
  process.exit(1);
}

/* Flatten chains so every legacy URL reaches its final page in ONE hop. Google
   follows chains but spends crawl budget doing it, and each hop is a chance to
   lose the signal. */
let flattened = 0;
for (const r of rows) {
  const seenHops = new Set([r.source]);
  while (seen.has(r.destination) && !seenHops.has(r.destination)) {
    seenHops.add(r.destination);
    r.destination = seen.get(r.destination);
    flattened++;
  }
}

const config = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
config.redirects = rows;
fs.writeFileSync(JSON_PATH, JSON.stringify(config, null, 2) + '\n');
console.log(`redirects: ${rows.length} rules written${flattened ? ` · ${flattened} chain hop(s) flattened` : ''}`);
