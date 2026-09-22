import { defineConfig } from 'astro/config';

/*
 * Wrap each H2 and everything after it (up to the next H2) in its own
 * <section class="md-section">. Long-form bodies were one continuous white
 * column — 1,500+ words with nothing to mark where one topic ended and the next
 * began. As sections, base.css can run every other one as a full-width band,
 * which is the rhythm the legacy site has and the first build did not. No text
 * changes, no new dependency: this only regroups nodes the markdown already has.
 * Content before the first H2 is left where it is.
 */
function rehypeSectionize() {
  return (tree) => {
    const out = [];
    let current = null;
    for (const node of tree.children) {
      if (node.type === 'element' && node.tagName === 'h2') {
        current = { type: 'element', tagName: 'section', properties: { className: ['md-section'] }, children: [node] };
        out.push(current);
      } else if (current) {
        current.children.push(node);
      } else {
        out.push(node);
      }
    }
    tree.children = out;
  };
}

// Keystone 7A deployment checklist: the canonical https origin lives here and
// every absolute @id in the schema graph reads from it. Vercel's Framework
// Preset must be set to Astro explicitly or every route 404s on a "successful"
// build.
/*
 * Tables: wrap each one so it can scroll, and stamp every cell with its column
 * heading in `data-label`. Markdown cannot add a wrapper or a per-cell label, and
 * without them a three-column table on a phone squeezes each cell to one word per
 * line — which is what it was doing on the location pages. base.css uses the
 * labels to stack rows into cards below 700px. The <table> stays a real table in
 * the DOM at every width (Part 4.3: a hidden table is not extractable).
 */
function rehypeTables() {
  const text = (n) => (n.type === 'text' ? n.value : (n.children || []).map(text).join(''));
  const els = (n, tag) => (n.children || []).filter((c) => c.type === 'element' && c.tagName === tag);
  return (tree) => {
    const walk = (node) => {
      if (!node.children) return;
      node.children.forEach((child, i) => {
        if (child.type !== 'element') return;
        if (child.tagName === 'table') {
          const headRow = els(child, 'thead').flatMap((h) => els(h, 'tr'))[0];
          const labels = headRow ? els(headRow, 'th').map((th) => text(th).trim()) : [];
          for (const body of els(child, 'tbody')) {
            for (const row of els(body, 'tr')) {
              els(row, 'td').forEach((td, idx) => {
                if (labels[idx]) td.properties = { ...(td.properties || {}), 'data-label': labels[idx] };
              });
            }
          }
          node.children[i] = {
            type: 'element',
            tagName: 'div',
            properties: { className: ['table-scroll'] },
            children: [child],
          };
          return;
        }
        walk(child);
      });
    };
    walk(tree);
  };
}

import photoIndex from './src/data/photo-index.json' with { type: 'json' };

/*
 * Place photographs INSIDE a markdown body instead of dumping the whole run at
 * the bottom. A before/after pair goes in early, then single frames alternate
 * left and right further down, so a 1,700-word page is broken up the way the
 * legacy site's pages are.
 *
 * MATCHING IS THE POINT. Every candidate is classified by what the photograph
 * actually shows (from its file slug) and filtered to the page's own service, so
 * a gutter photograph cannot land on a roof cleaning page. A page whose service
 * has no photographs gets none - that is the correct outcome, not a stand-in.
 *
 * Sizes come from the same data the components use (src/data/photos.ts, via the
 * generated photo-index.json), so every inline image carries width and height and
 * nothing shifts as it loads.
 */
const SERVICE_OF = [
  ['solar-panel-cleaning', /solar|panel/],
  ['metal-roof-soft-washing', /metal-roof|standing-seam/],
  ['gutter-cleaning', /gutter|downspout/],
  ['moss-removal', /moss|skylight/],
  ['roof-cleaning', /roof|shingle|ridge/],
  ['house-washing', /siding|lap-siding|board-and-batten|exterior-wall/],
  ['pressure-washing', /concrete|driveway|walkway|surface-cleaner/],
  ['commercial-window-cleaning', /storefront|restaurant/],
  ['window-cleaning', /window|glass|waterfront|squeegee|pane/],
];
const serviceOfFile = (file) => (SERVICE_OF.find(([, re]) => re.test(file)) || [null])[0];

const figureNode = (photo, cls, tag) => ({
  type: 'element',
  tagName: 'figure',
  properties: { className: ['photo', ...cls] },
  children: [
    {
      type: 'element',
      tagName: 'img',
      properties: {
        src: photo.file, alt: photo.alt, width: photo.width, height: photo.height,
        loading: 'lazy', decoding: 'async',
      },
      children: [],
    },
    {
      type: 'element',
      tagName: 'figcaption',
      properties: {},
      children: [
        ...(tag
          ? [{ type: 'element', tagName: 'span',
               properties: { className: ['ba__tag', ...(tag === 'After' ? ['ba__tag--after'] : [])] },
               children: [{ type: 'text', value: tag }] },
             { type: 'text', value: ' ' }]
          : []),
        { type: 'text', value: photo.caption },
      ],
    },
  ],
});

/*
 * A before/after presented the way the trade presents it: one frame, split down
 * the middle, with the divider and a centre marker. The legacy site uses a
 * drag-handle widget for this; that is client JavaScript, and this build ships
 * none — so the split is fixed and BOTH halves are always visible, which also
 * means it works in print, with images disabled, and for anyone who never drags
 * anything. The corner labels are real text, not baked into the picture.
 */
const half = (photo, tag) => ({
  type: 'element', tagName: 'span',
  properties: { className: ['ba-split__half'] },
  children: [
    { type: 'element', tagName: 'img',
      properties: { src: photo.file, alt: photo.alt, width: photo.width, height: photo.height, loading: 'lazy', decoding: 'async' },
      children: [] },
    { type: 'element', tagName: 'span',
      properties: { className: ['ba-split__tag', ...(tag === 'After' ? ['ba-split__tag--after'] : [])] },
      children: [{ type: 'text', value: tag }] },
  ],
});

const splitNode = (pair) => ({
  type: 'element', tagName: 'figure',
  properties: { className: ['ba-split'] },
  children: [
    { type: 'element', tagName: 'span', properties: { className: ['ba-split__frame'] },
      children: [
        half(pair.before, 'Before'),
        half(pair.after, 'After'),
        { type: 'element', tagName: 'span', properties: { className: ['ba-split__handle'], 'aria-hidden': 'true' }, children: [] },
      ] },
    { type: 'element', tagName: 'figcaption', properties: {},
      children: [
        { type: 'element', tagName: 'strong', properties: {}, children: [{ type: 'text', value: pair.label }] },
        { type: 'text', value: ' — ' + pair.before.caption },
      ] },
  ],
});

/* Two photographs side by side, used when a case study has more frames than the
 * body has sections. Nothing is dropped: they double up rather than disappear. */
const photoPairNode = (a, b) => ({
  type: 'element', tagName: 'div', properties: { className: ['photo-pair'] },
  children: [figureNode(a, []), figureNode(b, [])],
});

const sectionsOf = (tree) => tree.children.filter(
  (n) => n.type === 'element' && n.tagName === 'section' &&
         ((n.properties && n.properties.className) || []).includes('md-section'));

/**
 * Case-study placement. Matched before/after frames lead, then the jobsite
 * photographs in the order the work happened, spread down the body so the
 * evidence sits beside the passage that describes it.
 */
function placeCaseStudy(tree, cs) {
  const sections = sectionsOf(tree);
  if (sections.length < 3) return;

  const nodes = (cs.pairs || []).map(splitNode);
  const singles = (cs.photos || []).slice();
  // Positions available after the opening section. Where there are more
  // photographs than positions, they go two to a row instead of being cut.
  const slots = Math.max(1, sections.length - 1 - nodes.length);
  // Two is the most that fits a row at reading width, so a very long shoot
  // clusters toward the end of the body rather than being truncated.
  const per = Math.min(2, Math.max(1, Math.ceil(singles.length / slots)));
  for (let i = 0; i < singles.length; i += per) {
    const chunk = singles.slice(i, i + per);
    nodes.push(chunk.length === 1
      ? figureNode(chunk[0], ['inset', nodes.length % 2 ? 'inset--left' : 'inset--right'])
      : photoPairNode(chunk[0], chunk[1]));
  }

  const step = Math.max(1, Math.floor((sections.length - 1) / Math.max(1, nodes.length)));
  const inserts = nodes.map((node, i) => ({
    after: sections[Math.min(1 + i * step, sections.length - 1)], node,
  }));

  for (const ins of inserts.reverse()) {
    const at = tree.children.indexOf(ins.after);
    if (at >= 0) tree.children.splice(at + 1, 0, ins.node);
  }
}

function rehypePhotos() {
  return (tree, file) => {
    const src = (file.history && file.history[0]) || '';
    const m = src.replace(/\\/g, '/').match(/src\/content\/([^/]+)\/(.+)\.mdx?$/);
    if (!m) return;
    const collection = m[1];
    const rest = m[2];
    const slug = rest.split('/').pop();

    let pool = [];
    let service = null;
    if (collection === 'cityService') {
      const parts = rest.split('/');
      service = parts[1];
      pool = photoIndex.cityService[rest] || photoIndex.service[service] || [];
    } else if (collection === 'city') {
      pool = photoIndex.city[slug] || [];
      if (!pool.length) {
        // A town we have not photographed: one frame from each of several
        // services rather than nothing. Captions still name where each was taken.
        pool = ['window-cleaning', 'gutter-cleaning', 'roof-cleaning', 'house-washing']
          .flatMap((s) => (photoIndex.service[s] || []).slice(0, 1));
      }
    } else if (collection === 'service') {
      service = slug;
      pool = photoIndex.service[slug] || [];
    } else if (collection === 'problem') {
      pool = photoIndex.problem[slug] || [];
    } else if (collection === 'library' || collection === 'compliance') {
      pool = (photoIndex[collection] || {})[slug] || [];
    } else if (collection === 'caseStudy') {
      /* A case study is the one page type where every photograph is from the
       * same property on the same day. It gets its own placement below: all of
       * them go in the body, in the order the job happened, because the
       * photographs ARE the evidence rather than decoration. */
      const cs = (photoIndex.caseStudy || {})[slug];
      if (!cs) return;
      placeCaseStudy(tree, cs);
      return;
    }
    if (!pool.length) return;

    // Never show another service's work on a service page.
    if (service) {
      const matched = pool.filter((p) => serviceOfFile(p.file) === service);
      if (matched.length) pool = matched;
    }

    const sections = tree.children.filter(
      (n) => n.type === 'element' && n.tagName === 'section' &&
             ((n.properties && n.properties.className) || []).includes('md-section'));
    if (sections.length < 3) return;

    /* Roof cleaning and moss removal are the same surface and the same visit, so
     * they share their before/after pairs; nothing else crosses over. */
    const AFFINITY = { 'roof-cleaning': ['roof-cleaning', 'moss-removal'], 'moss-removal': ['moss-removal', 'roof-cleaning'] };
    const used = new Set();
    let pair = null;
    if (service) {
      const want = AFFINITY[service] || [service];
      pair = photoIndex.pairs.find((p) => want.includes(serviceOfFile(p.before.file))) || null;
    } else {
      /* A town page: give it one pair, varied by town so neighbouring pages do
       * not all open on the same two photographs. */
      const h = [...slug].reduce((a, c) => a + c.charCodeAt(0), 0);
      pair = photoIndex.pairs[h % photoIndex.pairs.length] || null;
    }

    const inserts = [];
    if (pair) {
      used.add(pair.before.file);
      used.add(pair.after.file);
      inserts.push({ after: sections[1], node: splitNode(pair) });
    }

    pool.filter((p) => !used.has(p.file)).slice(0, 4).forEach((photo, i) => {
      const target = sections[3 + i * 2];
      if (!target) return;
      inserts.push({ after: target, node: figureNode(photo, ['inset', i % 2 ? 'inset--left' : 'inset--right']) });
    });

    for (const ins of inserts.reverse()) {
      const at = tree.children.indexOf(ins.after);
      if (at >= 0) tree.children.splice(at + 1, 0, ins.node);
    }
  };
}

export default defineConfig({
  site: 'https://www.kingofkingswindowcleaning.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  markdown: { rehypePlugins: [rehypeSectionize, rehypePhotos, rehypeTables] },
  // A self-growing sitemap that maps over the same data arrays the routes do,
  // so a new market cannot be live and missing from the sitemap.
  // (@astrojs/sitemap added in Phase 1 once the route set is final.)
});
