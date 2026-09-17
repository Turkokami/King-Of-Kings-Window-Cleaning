/* --------------------------------------------------------------------------
 * JOB PHOTOGRAPHS, BY THE PAGE THEY ILLUSTRATE.
 *
 * WHERE THESE CAME FROM. The company's own WordPress media library, which holds
 * 1,160 images and which this rebuild had been ignoring entirely — the site
 * shipped 80 pages with two brand files and no photographs, and 25 content files
 * pointed `heroImage` at /photos/… paths that did not exist, so every one of
 * those pages had a dead share image. Pulled 16 Sep 2026, de-duplicated
 * perceptually, filtered to the ones large enough to print at page width, and
 * then picked by eye off contact sheets.
 *
 * WHAT WAS DELIBERATELY LEFT OUT. The library also holds award badges, review
 * cards, promotional posters with copy burned into them, AI-illustrated blog
 * headers and stock photographs of suburban streets that are not in this county
 * (tiled roofs, for one). None of those are here. A photograph on a service page
 * is a claim that the work in it is ours; a stock house is that claim made
 * falsely. Anything whose own alt text described a poster, a headline, a chart or
 * a logo was dropped by rule before the picking started.
 *
 * DO NOT TRUST A TOWN IN A FILENAME. The originals were named for search
 * ("...-bellinghamwa.jpg"), and a search keyword is not a fact about where the
 * photograph was taken. The towns named in the captions below come from the alt
 * text written when each job was documented, which reads like a record rather
 * than a keyword ("Asphalt roof in Sedro-Woolley buried under thick moss"),
 * and the file naming agrees with it. Where neither corroborates a town, the
 * caption says the county and stops there.
 *
 * ALT IS NOT THE CAPTION. The alt describes the photograph for somebody who
 * cannot see it and is written short enough to clear M6 (125 characters). The
 * caption adds what the photograph cannot say on its own — the place, the stage
 * of the job, why the surface looks like that. Writing one and copying it into
 * the other wastes the caption and makes the alt read like marketing.
 *
 * RESOLUTION, HONESTLY. These are 768px-wide renditions, not the originals. The
 * host's firewall started serving bot-challenge pages part way through the pull,
 * so the full-size files could not be fetched. They are sharp enough for the
 * grid and for a hero at phone and tablet width, and slightly soft in a
 * full-width desktop hero. Re-run the pull from `.image-work/` once the IP is
 * cleared and overwrite in place; the paths and this file do not change.
 * ------------------------------------------------------------------------ */

export interface Photo {
  /** Path under /public. */
  file: string;
  /** For a reader who cannot see it. Describes the photograph, not the offer. Max 125 chars (M6). */
  alt: string;
  /** Rendered under the image. Adds the place and the meaning. */
  caption: string;
  width: number;
  height: number;
}

/* -------------------------------------------------------------------------
 * The work gallery, in job order. Each run of photographs is one property on
 * one day, which is why the before and after sit next to each other: the pair
 * is the evidence, and splitting them into a "before" wall and an "after" wall
 * is how a gallery stops being proof of anything.
 * ---------------------------------------------------------------------- */

/** Waterfront home, Bow — window cleaning, August 2026. */
const bowWindows: Photo[] = [
  {
    file: '/photos/work/waterfront-home-exterior-window-cleaning-bow-wa.webp',
    alt: 'Two-storey waterfront home with large windows along a covered porch',
    caption: 'The property in Bow, Skagit County. Glass facing salt water is a different job from glass ten miles inland.',
    width: 768, height: 1024,
  },
  {
    file: '/photos/work/window-frames-spider-webs-before-cleaning-bow-wa.webp',
    alt: 'Green-framed glass door and sidelight before cleaning, webs and dirt along the frames',
    caption: 'Before. Webs and debris collect in the frame channels, not just on the glass, which is why frames and tracks are part of the job.',
    width: 768, height: 1024,
  },
  {
    file: '/photos/work/salt-spray-buildup-waterfront-windows-before.webp',
    alt: 'Bank of green-framed waterfront windows before cleaning, hazy with salt spray',
    caption: 'Before. Salt haze does not rinse off in the rain — it needs to be washed off, or it keeps dulling the view.',
    width: 768, height: 1024,
  },
  {
    file: '/photos/work/dirty-waterfront-window-glass-before-cleaning.webp',
    alt: 'Large waterfront window before cleaning, heavy streaking and salt residue clouding the view',
    caption: 'Before. The streaking is mineral residue left as salt spray dries on the pane.',
    width: 768, height: 1024,
  },
  {
    file: '/photos/work/clean-waterfront-window-after-pure-water-rinse.webp',
    alt: 'The same waterfront window after cleaning, clear glass and an unobstructed view to the water',
    caption: 'After, same pane. Rinsed with purified water so nothing is left behind as it dries.',
    width: 768, height: 1024,
  },
  {
    file: '/photos/work/clean-glass-door-and-frames-after-cleaning-bow-wa.webp',
    alt: 'Green-framed glass door after cleaning, free of webs and debris',
    caption: 'After, same door. Frames and sill cleared as well as the glass.',
    width: 768, height: 1024,
  },
];

/** Bellingham home — gutter clearing, August 2026. */
const bellinghamGutters: Photo[] = [
  {
    file: '/photos/work/gutter-debris-removed-by-hand-bellingham-wa.webp',
    alt: 'Gloved hand holding a large clump of wet organic debris pulled from a gutter',
    caption: 'A Bellingham home. Gutters here fill with fir needles rather than leaves, and needles pack down into a mat that water cannot pass.',
    width: 768, height: 1024,
  },
  {
    file: '/photos/work/wet-leaves-and-needles-removed-from-gutter.webp',
    alt: 'Handful of wet leaves and fir needles lifted out of a gutter above a deck',
    caption: 'Cleared by hand and bagged rather than flushed down the downpipe, which is how a clear gutter ends up with a blocked drain.',
    width: 768, height: 1024,
  },
  {
    file: '/photos/work/roof-valley-cleared-during-gutter-cleaning.webp',
    alt: 'Roof valley and gutter line after accumulated needles and debris were removed',
    caption: 'The valley matters as much as the gutter: debris held in a valley keeps the shingles underneath permanently damp.',
    width: 768, height: 1024,
  },
  {
    file: '/photos/work/gutter-drainage-path-clear-after-flushing.webp',
    alt: 'Gutter run clear of needles and debris with an open path toward the downspout',
    caption: 'After. The test is not that it looks clean — it is that water has an unbroken path to the downpipe.',
    width: 768, height: 1024,
  },
];

/** Sedro-Woolley home — roof moss removal, August 2026. */
const sedroWoolleyMoss: Photo[] = [
  {
    file: '/photos/work/gutter-packed-with-needles-before-roof-cleaning.webp',
    alt: 'Gutter packed with fir needles and roof debris before the roof was cleared',
    caption: 'Before, Sedro-Woolley. Under forest cover the roof and the gutter fill together, so they are one job rather than two.',
    width: 768, height: 548,
  },
  {
    file: '/photos/work/skylights-buried-in-roof-debris-before.webp',
    alt: 'Two skylights almost buried under leaves, needles and moss before the roof was cleared',
    caption: 'Before. Both skylights are under there, which is what a season of needle fall does on a shaded slope.',
    width: 768, height: 1021,
  },
  {
    file: '/photos/work/thick-moss-clump-removed-by-hand.webp',
    alt: 'Gloved hand holding a thick clump of moss and organic debris lifted off a roof',
    caption: 'Moss comes off by hand and with low pressure. A pressure washer would take the shingle granules with it.',
    width: 768, height: 1011,
  },
  {
    file: '/photos/work/roof-partly-cleared-during-moss-removal.webp',
    alt: 'Roof partway through moss removal, cleared shingles on one side and growth remaining on the other',
    caption: 'Halfway across, which is the clearest look at what was actually on the roof.',
    width: 768, height: 1015,
  },
  {
    file: '/photos/work/skylights-clear-after-moss-removal.webp',
    alt: 'The same skylights after debris removal, fully exposed on a cleared roof',
    caption: 'After, same skylights. Worth comparing with the second photograph in this run.',
    width: 768, height: 1012,
  },
  {
    file: '/photos/work/treating-roof-after-moss-removal.webp',
    alt: 'Applying a roof-safe treatment across cleared shingles after the bulk moss was removed',
    caption: 'Clearing the moss is half of it. The treatment is what slows it coming back.',
    width: 768, height: 1019,
  },
  {
    file: '/photos/work/powder-moss-treatment-on-asphalt-roof.webp',
    alt: 'Asphalt roof after a roof-safe powder moss treatment was applied along the ridge and slopes',
    caption: 'Powder treatment along the ridge. Rain carries it down the slope over the following weeks.',
    width: 768, height: 1013,
  },
];

/** Stone home, Whatcom County — metal roof soft wash. */
const metalRoofStoneHome: Photo[] = [
  {
    file: '/photos/work/metal-roof-before-cleaning-stone-home.webp',
    alt: 'Green standing-seam metal roof on a stone home before cleaning, dulled by organic growth',
    caption: 'Before, Whatcom County. The green finish is still under there; what you can see is growth sitting on the coating.',
    width: 768, height: 570,
  },
  {
    file: '/photos/work/ladder-access-for-metal-roof-cleaning.webp',
    alt: 'Ladder set up beside a stone home for access to the metal roof',
    caption: 'Access set up off the roof itself. Walking a wet standing-seam panel is how people fall and how panels get dented.',
    width: 768, height: 548,
  },
  {
    file: '/photos/work/metal-roof-soft-wash-solution-application-low-pressure.webp',
    alt: 'Soft wash solution applied at low pressure to a corrugated metal roof',
    caption: 'Low pressure and the right chemistry. Pressure strips coatings off metal, which is a repaint rather than a clean.',
    width: 768, height: 1024,
  },
  {
    file: '/photos/work/metal-roof-after-cleaning-stone-home.webp',
    alt: 'The same metal roof after cleaning, with the green finish restored',
    caption: 'After, same roof. Nothing was recoated — that is the original finish with the growth taken off it.',
    width: 768, height: 548,
  },
];

/** Lynden home — house washing, August 2026. */
const lyndenHouseWash: Photo[] = [
  {
    file: '/photos/work/house-washing-lynden-wa-siding-before.webp',
    alt: 'White lap siding before washing, with green organic growth across the lower courses',
    caption: 'Before, a Lynden home. Growth starts low and on the shaded side, where the wall stays damp longest.',
    width: 768, height: 1024,
  },
  {
    file: '/photos/work/long-siding-wall-before-washing-lynden.webp',
    alt: 'Long exterior wall of a home before washing, dulled by organic buildup',
    caption: 'Before. From this angle it reads as "the paint has aged", which is usually growth rather than age.',
    width: 768, height: 736,
  },
  {
    file: '/photos/work/soft-wash-house-washing-lynden-technician.webp',
    alt: 'Technician applying a siding-safe soft wash solution to an upper wall from the lawn',
    caption: 'Applied from the ground at low pressure. Siding gets washed, not blasted — water driven behind a lap board has to come out somewhere.',
    width: 768, height: 647,
  },
  {
    file: '/photos/work/house-washing-water-fed-pole-board-and-batten-siding.webp',
    alt: 'Rinsing red board-and-batten siding on a two-storey home',
    caption: 'Board-and-batten on a different Whatcom County property. The battens hold debris along every vertical seam.',
    width: 768, height: 1024,
  },
  {
    file: '/photos/work/siding-before-house-washing-lynden.webp',
    alt: 'Side wall of a home before washing, with organic discoloration along the siding',
    caption: 'Before, the shaded side wall.',
    width: 768, height: 768,
  },
  {
    file: '/photos/work/siding-after-house-washing-lynden.webp',
    alt: 'The same side wall after soft washing, the white siding clean and uniform',
    caption: 'After, same wall, same day.',
    width: 768, height: 768,
  },
  {
    file: '/photos/work/siding-close-up-after-soft-wash.webp',
    alt: 'Close-up of lap siding after soft washing, clean and free of organic growth',
    caption: 'Close enough to see that the surface is clean rather than just wet.',
    width: 768, height: 768,
  },
  {
    file: '/photos/work/long-siding-wall-after-washing-lynden.webp',
    alt: 'The same long exterior wall after washing, with bright, clean siding',
    caption: 'After. Same wall as the second photograph in this run.',
    width: 768, height: 736,
  },
  {
    file: '/photos/work/house-washing-clean-lap-siding-after-soft-wash.webp',
    alt: 'Close-up of clean cream lap siding at a corner board after a house washing',
    caption: 'Corner boards and trim are where a rushed house wash shows.',
    width: 768, height: 1024,
  },
];

/** Mount Vernon home — concrete, August 2026. */
const mountVernonConcrete: Photo[] = [
  {
    file: '/photos/work/blackened-concrete-before-pressure-washing-mount-vernon.webp',
    alt: 'Large concrete area in front of a home, darkened almost black by organic growth',
    caption: 'Before, Mount Vernon. Concrete goes black here from organic growth, not from dirt — which is why sweeping never touches it.',
    width: 768, height: 1001,
  },
  {
    file: '/photos/work/walkway-before-and-during-cleaning.webp',
    alt: 'Concrete walkway showing the contrast between a cleaned section and darker untreated concrete',
    caption: 'Mid-job on the walkway. The line is the honest measure of what was on the surface.',
    width: 768, height: 737,
  },
  {
    file: '/photos/work/walkway-after-pressure-washing-mount-vernon.webp',
    alt: 'The concrete walkway after cleaning, organic growth and dark staining removed',
    caption: 'After. A walkway that goes black also goes slippery, which is the part that matters in a wet winter.',
    width: 768, height: 736,
  },
  {
    file: '/photos/work/driveway-after-pressure-washing-mount-vernon.webp',
    alt: 'Garage driveway after pressure washing, with an even, clean concrete surface',
    caption: 'After, the driveway. Surface cleaner rather than a wand, so there are no wand stripes left across the slab.',
    width: 768, height: 768,
  },
  {
    file: '/photos/work/concrete-after-pressure-washing-front-entry.webp',
    alt: 'Front entry and concrete after pressure washing, visibly brighter and more uniform',
    caption: 'After, the front entry of the same property.',
    width: 768, height: 768,
  },
];

/** Commercial rooftop — 128-panel solar array, August 2026. */
const commercialSolar: Photo[] = [
  {
    file: '/photos/work/commercial-solar-array-128-panels-rooftop.webp',
    alt: 'Wide view of a 128-panel commercial solar array on a flat rooftop',
    caption: 'A 128-panel commercial array. Output is measurable, so on a roof this size so is the cost of leaving it dirty.',
    width: 768, height: 1002,
  },
  {
    file: '/photos/work/dirty-solar-panels-before-cleaning.webp',
    alt: 'Rows of solar panels coated in dirt, dust and water spotting before cleaning',
    caption: 'Before. Even film like this shades the cells; panels do not need to look filthy to be down on output.',
    width: 768, height: 1019,
  },
  {
    file: '/photos/work/technician-water-fed-pole-solar-cleaning.webp',
    alt: 'Technician cleaning solar panels with a water-fed pole on a commercial rooftop',
    caption: 'Purified water and a panel-safe brush. No detergent is left on the glass to attract the next layer.',
    width: 768, height: 1016,
  },
  {
    file: '/photos/work/clean-solar-panels-after-pure-water-rinse.webp',
    alt: 'Solar panels after cleaning, with clear glass and no soap film or mineral residue',
    caption: 'After. Dried without spotting, because the rinse water has nothing dissolved in it to leave behind.',
    width: 768, height: 1013,
  },
];

/** Every job run, in the order the gallery shows them. */
export const WORK_RUNS: Array<{ title: string; photos: Photo[] }> = [
  { title: 'Window cleaning — waterfront home, Bow', photos: bowWindows },
  { title: 'Gutter clearing — Bellingham', photos: bellinghamGutters },
  { title: 'Roof moss removal — Sedro-Woolley', photos: sedroWoolleyMoss },
  { title: 'Metal roof soft wash — Whatcom County', photos: metalRoofStoneHome },
  { title: 'House washing — Lynden', photos: lyndenHouseWash },
  { title: 'Concrete and driveway — Mount Vernon', photos: mountVernonConcrete },
  { title: 'Commercial solar array — 128 panels', photos: commercialSolar },
];

export const ALL_WORK: Photo[] = WORK_RUNS.flatMap((r) => r.photos);

/* -------------------------------------------------------------------------
 * Page heroes, keyed by the slugs the routes already own. A missing key is a
 * page with no photograph, which is the correct state for a surface nobody has
 * photographed yet — cedar shake, a failed insulated glass unit and the Cherry
 * Point haze are all absent, and a stand-in would be a lie about the surface
 * the page is describing.
 * ---------------------------------------------------------------------- */

export const SERVICE_HERO: Record<string, Photo> = {
  'window-cleaning': {
    file: '/photos/service/window-cleaning-hero.webp',
    alt: 'Water-fed pole reaching upper gable windows to scrub and rinse them from the ground',
    caption: 'Upper glass reached from the ground with a water-fed pole rather than a ladder.',
    width: 768, height: 1024,
  },
  'gutter-cleaning': {
    file: '/photos/service/gutter-cleaning-hero.webp',
    alt: 'Roof edge and gutter cleared of debris, with the shingle surface exposed',
    caption: 'A cleared roof edge and gutter line in Whatcom County.',
    width: 768, height: 548,
  },
  'roof-cleaning': {
    file: '/photos/service/roof-cleaning-hero.webp',
    alt: 'Shingled roof being rinsed with a low-pressure stream from a hose',
    caption: 'Rinsing a shingle roof at low pressure — the only pressure a composition roof should ever see.',
    width: 768, height: 1024,
  },
  'moss-removal': {
    file: '/photos/service/moss-removal-hero.webp',
    alt: 'Asphalt roof buried under thick moss, needles and forest debris before treatment',
    caption: 'Sedro-Woolley, before treatment. This is what a shaded roof does under forest cover here.',
    width: 768, height: 1002,
  },
  'metal-roof-soft-washing': {
    file: '/photos/service/metal-roof-hero.webp',
    alt: 'Standing-seam metal roof after a low-pressure soft wash, clean and reflective',
    caption: 'The same roof after a soft wash, with the original finish intact.',
    width: 768, height: 548,
  },
  'house-washing': {
    file: '/photos/service/house-washing-hero.webp',
    alt: 'Technician soft washing the exterior wall of a home from the lawn at low pressure',
    caption: 'Soft washing siding from the ground in Lynden.',
    width: 768, height: 647,
  },
  'pressure-washing': {
    file: '/photos/service/pressure-washing-hero.webp',
    alt: 'Technician running a professional surface cleaner across concrete beside the company truck',
    caption: 'A surface cleaner on concrete, which is where real pressure belongs.',
    width: 768, height: 647,
  },
  'solar-panel-cleaning': {
    file: '/photos/service/solar-panel-cleaning-hero.webp',
    alt: 'Wide view of a 128-panel solar array after a pure-water cleaning',
    caption: 'A commercial array after cleaning, dried without spotting.',
    width: 768, height: 1019,
  },
  'commercial-window-cleaning': {
    file: '/photos/service/commercial-window-cleaning-hero.webp',
    alt: 'Cleaned restaurant storefront windows and glass at a commercial location',
    caption: 'Storefront glass at a Whatcom County business.',
    width: 768, height: 1024,
  },
};

export const PROBLEM_HERO: Record<string, Photo> = {
  'moss-under-shingles': {
    file: '/photos/problem/moss-under-shingles.webp',
    alt: 'Asphalt shingles after debris removal, with previously hidden moss growth now visible',
    caption: 'The debris came off and the moss underneath was still there — which is the whole problem with clearing without treating.',
    width: 768, height: 548,
  },
  'overflowing-gutters': {
    file: '/photos/problem/gutter-overflow.webp',
    alt: 'Asphalt roof and gutter line covered in needles, leaves and organic debris',
    caption: 'A gutter in this state does not drip — it overflows at the back edge, behind the fascia.',
    width: 768, height: 548,
  },
  'north-facing-wall-mildew': {
    file: '/photos/problem/north-wall-mildew.webp',
    alt: 'Close-up of heavy green and dark organic staining embedded on white siding',
    caption: 'Growth embedded in the surface rather than sitting on it, on the wall that never dries.',
    width: 768, height: 801,
  },
  'slippery-driveways-and-walkways': {
    file: '/photos/problem/slippery-walkway.webp',
    alt: 'Concrete area before cleaning, showing the extent of dark organic contamination',
    caption: 'Mount Vernon. Black concrete is biological, and biological is what makes it slick underfoot.',
    width: 768, height: 768,
  },
  'solar-output-dropped': {
    file: '/photos/problem/solar-edge-band.webp',
    alt: 'Close-up of a solar panel showing heavy dirt, pollen and bird droppings on the glass',
    caption: 'Pollen, dust and droppings on panel glass. Any of it shades cells, and shaded cells cost output.',
    width: 768, height: 988,
  },
};

export const LIBRARY_HERO: Record<string, Photo> = {
  'composition-asphalt-shingle': {
    file: '/photos/library/composition-shingle.webp',
    alt: 'Roof ridge after bulk moss and debris were removed, with the shingles visible again',
    caption: 'Composition shingle with the growth taken off it. The granules are the wearing surface, and they do not grow back.',
    width: 768, height: 1006,
  },
  'standing-seam-metal-roof': {
    file: '/photos/library/standing-seam.webp',
    alt: 'Standing-seam metal roof inspected and assessed before a low-pressure soft wash',
    caption: 'Assessed before anything is applied — coating condition decides what the roof can take.',
    width: 768, height: 1024,
  },
  'vinyl-siding': {
    file: '/photos/library/vinyl-siding.webp',
    alt: 'Close-up of lap siding before treatment, showing green organic growth across several boards',
    caption: 'Organic growth across lap boards, before a soft wash.',
    width: 768, height: 768,
  },
};

export const CITY_HERO: Record<string, Photo> = {
  bellingham: {
    file: '/photos/bellingham/city-hero.webp',
    alt: 'Cleared gutter channel running along a roofline with an open path for water',
    caption: 'Gutter work on a Bellingham home.',
    width: 768, height: 1024,
  },
};

/** Keyed `market/service`. */
export const CITY_SERVICE_HERO: Record<string, Photo> = {
  'bellingham/window-cleaning': {
    file: '/photos/bellingham/window-cleaning-hero.webp',
    alt: 'Bank of green-framed windows after cleaning, glass and frames clear',
    caption: 'Glass and frames after a full exterior and interior clean.',
    width: 768, height: 1024,
  },
  'ferndale/window-cleaning': {
    file: '/photos/ferndale/window-cleaning-hero.webp',
    alt: 'Water-fed pole reaching upper gable windows to scrub and rinse them from the ground',
    caption: 'Upper glass reached from the ground rather than off a ladder.',
    width: 768, height: 1024,
  },
};

export const COMPLIANCE_HERO: Record<string, Photo> = {
  'wash-water-and-storm-drains': {
    file: '/photos/compliance/storm-drain-protection.webp',
    alt: 'Technician protecting siding, windows and landscaping before soft washing a roof',
    caption: 'Protecting what is below the work is the same discipline as controlling where the water goes.',
    width: 768, height: 1024,
  },
};

/** A short strip for the home page — one photograph from several different jobs. */
export const HOME_STRIP: Photo[] = [
  sedroWoolleyMoss[3],      // roof half cleared — the clearest single "what we do"
  bowWindows[4],            // waterfront glass, after
  lyndenHouseWash[2],       // technician soft washing siding
  mountVernonConcrete[1],   // the cleaned/uncleaned line on the walkway
  commercialSolar[2],       // technician on the commercial array
  metalRoofStoneHome[3],    // metal roof after
];
