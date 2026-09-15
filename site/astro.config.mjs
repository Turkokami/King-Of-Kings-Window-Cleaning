import { defineConfig } from 'astro/config';

// Keystone 7A deployment checklist: the canonical https origin lives here and
// every absolute @id in the schema graph reads from it. Vercel's Framework
// Preset must be set to Astro explicitly or every route 404s on a "successful"
// build.
export default defineConfig({
  site: 'https://www.kingofkingswindowcleaning.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  // A self-growing sitemap that maps over the same data arrays the routes do,
  // so a new market cannot be live and missing from the sitemap.
  // (@astrojs/sitemap added in Phase 1 once the route set is final.)
});
