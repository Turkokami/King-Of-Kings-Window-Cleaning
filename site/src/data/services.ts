/**
 * services.ts — the service tree.
 *
 * Keystone Part 14: "Never invent services or verticals. Build only the confirmed
 * set. A vertical page for a business type the owner doesn't serve is a liability."
 *
 * BENCHMARK: the owner has confirmed the live site is current for services, so
 * kingofkingswindowcleaning.com/services/ IS the definition of the service set.
 * Nine services, each with its own page. Read 2026-09-10.
 *
 * Two corrections that came out of taking the site as the benchmark rather than
 * assuming:
 *   · Metal roof soft washing is a SERVICE with its own page, not a problem page
 *     under roof cleaning. It is also the deepest page on the legacy site at
 *     3,154 words — the only one clearing the M1 floor. Promoted to a spoke.
 *   · Moss removal covers "roofs, walkways and pavers", not roofs alone. The
 *     hub reflects that scope.
 *
 * `confirmed: true`  — on the live services page. Build it.
 * `confirmed: false` — NOT on the live services page. He does not sell it.
 *                      Not built, not linked, not in schema, not in the nav.
 */

export interface Service {
  slug: string;
  name: string;
  /** Short label for nav and breadcrumbs. */
  short: string;
  /** Does this service get a city × service page in the geo lattice? */
  geo: boolean;
  confirmed: boolean;
  /** Legacy root URL(s) that 301 into this spoke. */
  legacyPaths: string[];
  /** Problem micro pages hanging off this spoke (Keystone Part 3.4 type 3). */
  problems: Array<{ slug: string; title: string }>;
  /**
   * Whether this service leads. Measured, not assumed — see the GSC demand
   * figures in archive/gsc-findings.json. A service with headTerm false keeps its
   * hub and its geo pages where the demand gate authorises them, but it does not
   * get front-door billing in the nav, the home grid or the services hub.
   * Defaults to true; only a measured reason sets it false.
   */
  headTerm?: boolean;
  /** The measurement behind headTerm, quoted so the decision is auditable. */
  demandNote?: string;
  /** Cluster this hangs off when it is not a head term. */
  parentCluster?: string;
  /** Surface-library entries this spoke links laterally into. */
  library: string[];
}

export const SERVICES: Service[] = [
  {
    slug: 'window-cleaning', name: 'Window Cleaning', short: 'Windows', geo: true, confirmed: true,
    // NOTE: the legacy site has NO /window-cleaning/ hub. The flagship service's
    // hub duty is being done by a geo page. This is P0 and it is fixed here.
    legacyPaths: ['/window-cleaning-bellingham-wa/', '/window-cleaning-cost-bellingham-wa/'],
    problems: [
      { slug: 'hard-water-spots', title: 'Hard water spots on glass' },
      { slug: 'construction-overspray', title: 'Construction overspray and paint on glass' },
      { slug: 'screen-repair-and-cleaning', title: 'Window screen cleaning and repair' },
      { slug: 'skylight-cleaning', title: 'Skylight cleaning' },
      { slug: 'salt-spray-on-waterfront-glass', title: 'Salt spray on waterfront glass' },
    ],
    library: ['annealed-glass', 'tempered-glass', 'low-e-coated-glass', 'insulated-glass-units', 'hard-water-mineral-scale'],
  },
  {
    slug: 'gutter-cleaning', name: 'Gutter Cleaning', short: 'Gutters', geo: true, confirmed: true,
    legacyPaths: ['/gutter-cleaning/', '/gutter-cleaning-cost-bellingham-wa/'],
    problems: [
      { slug: 'overflowing-gutters', title: 'Gutters overflowing in heavy rain' },
      { slug: 'downspout-blockage', title: 'Blocked downspouts' },
      { slug: 'gutter-brightening', title: 'Tiger striping and gutter brightening' },
    ],
    library: ['aluminium-gutters', 'copper-gutters', 'douglas-fir-pollen'],
  },
  {
    // Live site name: "Roof Cleaning & Debris Removal" — fir needles, leaves and
    // branches cleared, then soft washing applied. The debris half is part of the
    // service, not an add-on, and the hub says so.
    slug: 'roof-cleaning', name: 'Roof Cleaning & Debris Removal', short: 'Roof cleaning', geo: true, confirmed: true,
    legacyPaths: ['/roof-cleaning/', '/roof-cleaning-cost-bellingham-wa/'],
    problems: [
      { slug: 'black-algae-streaks', title: 'Black streaks on a roof' },
      { slug: 'cedar-shake-moss', title: 'Moss on cedar shake' },
      { slug: 'composition-shingle-granule-loss', title: 'Granule loss on composition shingle' },
    ],
    library: ['composition-asphalt-shingle', 'cedar-shake-roof', 'concrete-tile-roof', 'torch-down-flat-roof', 'gloeocapsa-magma-algae'],
  },
  {
    // Its own service on the live site, not a sub-page of roof cleaning — and the
    // deepest page on the legacy domain at 3,154 words, the only one over the M1
    // floor. That page 301s to this spoke.
    slug: 'metal-roof-soft-washing', name: 'Metal Roof Soft Washing', short: 'Metal roofs', geo: false, confirmed: true,
    legacyPaths: ['/metal-roof-cleaning-bellingham-wa/'],
    problems: [],
    library: ['standing-seam-metal-roof', 'salish-sea-salt-spray'],
  },
  {
    // Live site scope: "bulk moss lifted off roofs, walkways and pavers by hand".
    // Not roof-only — the hardscape half is in scope and is a slip-safety job.
    slug: 'moss-removal', name: 'Moss Removal', short: 'Moss removal', geo: true, confirmed: true,
    legacyPaths: ['/moss-removal/', '/moss-removal-cost-bellingham-wa/'],
    problems: [
      { slug: 'moss-under-shingles', title: 'Moss growing under shingles' },
      { slug: 'lichen-vs-moss', title: 'Lichen or moss — telling them apart' },
    ],
    library: ['sheet-moss', 'lichen', 'liverwort'],
  },
  {
    slug: 'pressure-washing', name: 'Pressure Washing', short: 'Pressure washing', geo: true, confirmed: true,
    legacyPaths: ['/pressure-washing/', '/pressure-washing-cost-bellingham-wa/'],
    problems: [
      { slug: 'slippery-driveways-and-walkways', title: 'Slippery driveways and walkways' },
      { slug: 'oxidised-vinyl-siding', title: 'Chalky, oxidised vinyl siding' },
    ],
    library: ['vinyl-siding', 'fiber-cement-siding', 'painted-wood-siding'],
  },
  {
    // DEMOTED FROM HEAD TERM, 2026-09-14, on measurement rather than taste.
    // Sixteen months of Search Console: 71 impressions across 6 queries, against
    // 15,850 for window cleaning and 4,910 for gutters. "Soft wash" and "siding"
    // return almost nothing either. The service is real and sold; it is simply not
    // what people in this market type.
    //
    // So it keeps its hub — a page has to exist for the people who do search it,
    // and for the internal links from the siding library — but it is positioned as
    // a child of the exterior-cleaning cluster rather than as a front-door service.
    // `headTerm: false` is what the home page and the services hub read to decide
    // billing order, and it is the reason house washing does not get equal weight
    // with window cleaning in the nav.
    //
    // NOTE the tension, because it is instructive: house washing still CLEARS the
    // Part 6A gate in five geographies, because two or more competitors build
    // dedicated house-washing city pages there. Competitor coverage is evidence of
    // demand; our own impression data is evidence of how people phrase it. Both are
    // true. The page gets built where the gate says; it just does not lead.
    slug: 'house-washing', name: 'House Washing (Soft Wash)', short: 'House washing',
    geo: true, confirmed: true, headTerm: false,
    demandNote: 'GSC 2025-05 to 2026-09: 71 impressions, 6 queries. Not a head term in this market.',
    parentCluster: 'pressure-washing',
    legacyPaths: ['/house-washing/', '/house-washing-cost-bellingham-wa/'],
    problems: [{ slug: 'north-facing-wall-mildew', title: 'Mildew on north-facing walls' }],
    library: ['vinyl-siding', 'fiber-cement-siding', 'cedar-siding', 'painted-wood-siding'],
  },
  {
    // Method is specific and is a differentiator: deionised water, no abrasives,
    // no detergents. Say it, because it is the correct method and most
    // competitors do not mention theirs.
    slug: 'solar-panel-cleaning', name: 'Solar Panel Cleaning', short: 'Solar panels', geo: true, confirmed: true,
    legacyPaths: ['/solar-panel-cleaning/'],
    problems: [{ slug: 'pollen-and-industrial-fallout-soiling', title: 'Pollen and industrial fallout on solar panels' }],
    library: ['douglas-fir-pollen', 'cherry-point-industrial-fallout', 'salish-sea-salt-spray'],
  },
  {
    slug: 'commercial-window-cleaning', name: 'Commercial Window Cleaning', short: 'Commercial', geo: false, confirmed: true,
    legacyPaths: ['/commercial-window-cleaning/'],
    problems: [],
    library: ['annealed-glass', 'tempered-glass'],
  },

  // ---- NOT SOLD. Documented exclusions, not open questions. -----------------
  // The owner has confirmed the live site is current for services. None of these
  // appear on it, so they are not offered. They stay in this file as a record of
  // what was checked and ruled out, so a future session does not re-litigate it
  // or quietly add a page because a competitor has one.
  //
  // Whatcom Gutter & Roof Cleaning sells the first three. That is their moat, not
  // a gap in ours, and building pages for work King of Kings does not do would be
  // a liability under Part 14 rather than an opportunity.
  { slug: 'gutter-installation', name: 'Gutter Installation', short: 'Gutter install', geo: false, confirmed: false, legacyPaths: [], problems: [], library: [] },
  { slug: 'gutter-guards', name: 'Gutter Guard Installation', short: 'Gutter guards', geo: false, confirmed: false, legacyPaths: [], problems: [], library: [] },
  { slug: 'moss-prevention', name: 'Standalone Moss Prevention', short: 'Moss prevention', geo: false, confirmed: false, legacyPaths: [], problems: [], library: [] },
  { slug: 'christmas-lights', name: 'Holiday Light Installation', short: 'Holiday lights', geo: false, confirmed: false, legacyPaths: [], problems: [], library: [] },
];

export const buildableServices = () => SERVICES.filter((s) => s.confirmed);
export const geoServices = () => SERVICES.filter((s) => s.confirmed && s.geo);
export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);
export const unconfirmedServices = () => SERVICES.filter((s) => !s.confirmed);
