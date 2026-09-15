#!/usr/bin/env node
/**
 * 6 · Citability and snippet-shape auditor — Keystone v3.2, Parts 6.5 and 4.3.
 *
 * TWO CHECKS, TWO DIFFERENT SEVERITIES, DELIBERATELY.
 *
 * SNIPPET SHAPE (4.3) is a per-page contract and it FAILS. A page declaring a
 * list shape has to carry a real ordered or unordered list; one declaring a table
 * has to carry a real table with a header row. The standard is explicit that a
 * styled stack of divs is not a list and a flex grid is not a table, and names
 * this as "the single most common way a page-builder site loses a shape it
 * otherwise deserves." A declared-but-absent shape is a broken promise in the
 * data, so it fails.
 *
 * CITABILITY (6.5) is SCORED, not gated. Dimension 13 asks for "the share of
 * indexable pages carrying all four Part 6.5 signals" — a proportion. So this
 * reports the share and names the gaps, and does not block. v3.2 spent its entire
 * changelog retiring gates that blocked shipping without catching anything; this
 * is not the place to add a new one.
 *
 * Measured on the markdown source. Rendered HTML would let nav and footer markup
 * satisfy a shape the page body does not actually carry.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'src/content';
const walk = (d, out = []) => {
  if (!fs.existsSync(d)) return out;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    e.isDirectory() ? walk(p, out) : /\.md$/.test(p) && out.push(p);
  }
  return out;
};

const files = walk(ROOT);
if (!files.length) { console.log('citability: no content yet'); process.exit(0); }

const failures = [];
const rows = [];

for (const f of files) {
  const rel = f.replace(`${ROOT}/`, '');
  const raw = fs.readFileSync(f, 'utf8');
  const fm = (raw.match(/^---\n([\s\S]*?)\n---/) || [, ''])[1];
  const body = raw.replace(/^---[\s\S]*?\n---\n/, '');

  // ---- 4.3 snippet shape, against real markup --------------------------------
  const shape = (fm.match(/^snippetShape:\s*["']?([a-z+]+)["']?/m) || [])[1];
  if (!shape) {
    failures.push(`SNIPPET SHAPE  ${rel}: no snippetShape declared (Part 4.3)`);
  } else {
    // Markdown list: two or more item markers at line start. Counted rather than
    // matched as a consecutive run, because a real list item wraps onto indented
    // continuation lines and a run-based regex misses every well-formatted list.
    const listItems = (body.match(/^[ \t]*([-*+]|\d+\.)[ \t]+\S/gm) || []).length;
    const hasList = listItems >= 2 || /<[ou]l\b/.test(body);
    // Markdown table: a header row followed by a delimiter row.
    const hasTable = /^\|.+\|\s*\n\s*\|[\s:|-]+\|\s*$/m.test(body) || /<table\b[\s\S]*<th\b/.test(body);
    if (shape.includes('list') && !hasList) {
      failures.push(`SNIPPET SHAPE  ${rel}: declares "${shape}" but carries no real list — a styled stack is not a list`);
    }
    if (shape.includes('table') && !hasTable) {
      failures.push(`SNIPPET SHAPE  ${rel}: declares "${shape}" but carries no real table with a header row`);
    }
  }

  // ---- 6.5 citability, four signals -----------------------------------------
  const signals = {
    quantifiedFact: /^quantifiedFact:/m.test(fm),
    primaryAuthority: /^primaryAuthority:/m.test(fm),
    statedPosition: /^statedPosition:/m.test(fm),
    firstPartyData: /^firstPartyData:\s*(?!null\s*$)\S/m.test(fm),
  };
  // Anti-pattern from 6.5: a sources block at the foot that no sentence points to.
  const footerSourcesOnly = /\n#+\s*Sources?\b/i.test(body) && !/\b(says|puts|documents|states|reports|according to)\b/i.test(body);
  if (footerSourcesOnly) {
    failures.push(`CITABILITY     ${rel}: has a Sources block but no sentence names an authority in the visible text (6.5 anti-pattern)`);
  }
  rows.push({ rel, shape, signals, n: Object.values(signals).filter(Boolean).length });
}

const complete = rows.filter((r) => r.n === 4).length;
const withThree = rows.filter((r) => r.n >= 3).length;

failures.forEach((f) => console.error(f));

console.log('\ncitability — Dimension 13 input sub-score (Keystone v3.2, 6.5):');
for (const r of rows.filter((r) => r.n < 4).sort((a, b) => a.n - b.n)) {
  const missing = Object.entries(r.signals).filter(([, v]) => !v).map(([k]) => k);
  console.log(`  ${r.n}/4  ${r.rel}  — missing: ${missing.join(', ')}`);
}
console.log(
  `\ncitability: ${complete}/${rows.length} pages carry all four signals ` +
  `(${Math.round((100 * complete) / rows.length)}%) · ${withThree} carry three or more · ` +
  `${failures.length} blocking snippet-shape failures`
);
process.exit(failures.length ? 1 : 0);
