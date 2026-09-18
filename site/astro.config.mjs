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
export default defineConfig({
  site: 'https://www.kingofkingswindowcleaning.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  markdown: { rehypePlugins: [rehypeSectionize] },
  // A self-growing sitemap that maps over the same data arrays the routes do,
  // so a new market cannot be live and missing from the sitemap.
  // (@astrojs/sitemap added in Phase 1 once the route set is final.)
});
