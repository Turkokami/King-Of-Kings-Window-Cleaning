/* --------------------------------------------------------------------------
 * JOB PHOTOGRAPHS, BY THE PAGE THEY ILLUSTRATE.
 *
 * WHERE THESE CAME FROM. The company's own WordPress media library — 1,160
 * images the rebuild had been ignoring, while 25 content files pointed
 * `heroImage` at /photos/… paths that did not exist. Pulled 16–17 Sep 2026,
 * de-duplicated perceptually, filtered, then picked by eye off contact sheets.
 * 81 photographs published.
 *
 * WHAT WAS DELIBERATELY LEFT OUT. Award badges, review cards, promotional
 * posters with copy burned in, AI blog headers, and stock suburbia that is not
 * this county (tiled roofs). A photograph on a service page is a claim that the
 * work in it is ours; a stock house is that claim made falsely. Also dropped: a
 * before/after composite with the logo baked into it (a graphic, not a
 * photograph), and a frame showing a child holding a pole on a commercial job.
 *
 * DO NOT TRUST A TOWN IN A FILENAME. The originals were named for search, and a
 * keyword is not a record of where the shutter was pressed. Towns below come
 * from the alt text written when each job was documented — which reads like a
 * record ("Asphalt roof in Sedro-Woolley buried under thick moss") — and the
 * file naming agrees. Where neither corroborates a town, the caption says the
 * county and stops.
 *
 * ALT IS NOT THE CAPTION. Alt describes the photograph for somebody who cannot
 * see it, short enough to clear M6 (125 characters). The caption adds what the
 * photograph cannot say on its own: the place, the stage of the job, why the
 * surface looks like that.
 *
 * NOBODY IS NAMED IN A CAPTION. Several photographs show a technician at work.
 * Which of them is Randy is not recorded anywhere we can check, so none of them
 * says so. The one portrait that IS him was supplied by the owner and is the
 * only photograph of a named person here.
 * ------------------------------------------------------------------------ */

export interface Photo {
  file: string;
  /** For a reader who cannot see it. Describes the photograph, not the offer. Max 125 chars (M6). */
  alt: string;
  /** Rendered under the image. Adds the place and the meaning. */
  caption: string;
  width: number;
  height: number;
}

/** Shorthand for a photograph in the work library. */
const w = (slug: string, width: number, height: number, alt: string, caption: string): Photo =>
  ({ file: `/photos/work/${slug}.webp`, width, height, alt, caption });

/* ---------------------------------------------------------------- windows */

const bowWindows: Photo[] = [
  w('waterfront-home-before-window-cleaning-bow', 1050, 1400,
    'Two-storey waterfront home with large windows along a covered porch',
    'The property in Bow, Skagit County. Glass facing salt water is a different job from glass ten miles inland.'),
  w('window-frames-webs-before-cleaning-bow', 1050, 1400,
    'Green-framed glass door and sidelight before cleaning, webs and dirt along the frames',
    'Before. Webs and debris collect in the frame channels, not only on the glass, which is why frames and tracks are part of the job.'),
  w('waterfront-windows-salt-haze-before', 1050, 1400,
    'Bank of green-framed waterfront windows before cleaning, hazy with salt spray',
    'Before. Salt haze does not rinse off in the rain — it has to be washed off, or it keeps dulling the view.'),
  w('waterfront-window-streaked-before', 1050, 1400,
    'Large waterfront window before cleaning, heavy streaking and salt residue clouding the view',
    'Before. The streaking is mineral residue left behind as salt spray dries on the pane.'),
  w('water-fed-pole-upper-gable-windows', 1050, 1400,
    'Water-fed pole reaching upper gable windows to scrub and rinse them from the ground',
    'Upper gable glass reached from the ground. Purified water means nothing is left on the pane as it dries.'),
  w('waterfront-window-clear-after', 1050, 1400,
    'The same waterfront window after cleaning, clear glass and an unobstructed view to the water',
    'After, same pane.'),
  w('waterfront-windows-clear-after', 1050, 1400,
    'Bank of green-framed windows after cleaning, glass and frames clear',
    'After, same bank of windows.'),
  w('glass-door-and-frames-clear-after', 1050, 1400,
    'Green-framed glass door after cleaning, free of webs and debris',
    'After, same door. Frames and sill cleared as well as the glass.'),
];

const windowWork: Photo[] = [
  w('pole-brush-multi-pane-windows', 1152, 738,
    'Long pole brush cleaning large multi-pane windows on a house with green trim',
    'Multi-pane glass takes longer than the pane count suggests — every bar is an edge to work around.'),
  w('pole-reaching-upper-windows-two-storey', 1152, 738,
    'Technician using a long pole to reach upper windows of a two-storey house',
    'Second-storey glass without putting a ladder on soft ground or decking.'),
  w('ladder-work-arched-second-storey-window', 1200, 1600,
    'Technician on a ladder cleaning an arched second-storey window on a gray-sided house',
    'Where a pole cannot do it properly, the ladder comes out and gets footed correctly.'),
  w('pole-cleaning-triangular-windows', 1200, 1600,
    'Technician using a long pole to clean large triangular windows of a house with green trim',
    'Gable triangles are the panes most often skipped by a cheaper quote.'),
  w('rinsing-second-floor-windows', 1200, 1600,
    'Technician rinsing second-floor windows of a two-storey home from the ground',
    'Rinsing down from the top so nothing dries on the glass below.'),
  w('interior-squeegee-window-seaside-view', 736, 1600,
    'Technician using a squeegee to clean a soapy window from inside, water view beyond',
    'Interiors are half the job on a view property, and the half people notice from the sofa.'),
  w('pole-squeegee-triangular-window-ferndale', 1152, 738,
    'Long pole with a squeegee reaching a high triangular window framed by timber beams',
    'A Ferndale home. Vaulted rooms put the dirtiest glass where nobody can reach it.'),
];

/* ---------------------------------------------------------------- gutters */

const bellinghamGutters: Photo[] = [
  w('gutter-debris-removed-by-hand-bellingham', 1050, 1400,
    'Gloved hand holding a large clump of wet organic debris pulled from a gutter',
    'A Bellingham home. Gutters here fill with fir needles rather than leaves, and needles pack into a mat water cannot pass.'),
  w('wet-leaves-and-needles-from-gutter', 1050, 1400,
    'Handful of wet leaves and fir needles lifted out of a gutter above a deck',
    'Cleared by hand and bagged rather than flushed down the downpipe — which is how a clear gutter ends up with a blocked drain.'),
  w('roof-valley-cleared-of-debris', 1050, 1400,
    'Roof valley and gutter line after accumulated needles and debris were removed',
    'The valley matters as much as the gutter: debris held there keeps the shingles underneath permanently damp.'),
  w('cleared-gutter-channel-bellingham', 1050, 1400,
    'Cleared gutter channel running along a roofline with an open path for water',
    'After. Bellingham.'),
  w('gutter-run-clear-to-downspout', 1050, 1400,
    'Gutter run clear of needles and debris with an open path toward the downspout',
    'The test is not that it looks clean — it is that water has an unbroken path to the downpipe.'),
];

const gutterWork: Photo[] = [
  w('gutter-full-of-autumn-leaves', 1152, 738,
    'Gutter and roof edge filled with fallen autumn leaves',
    'What a gutter looks like when it is already past overflowing.'),
  w('gloved-hand-clearing-clogged-gutter-ferndale', 1152, 738,
    'Gloved hand removing packed debris from a clogged gutter',
    'Ferndale. Leaves, moss and grit compact into a plug that water runs straight over.'),
  w('roof-and-gutter-close-up-sedro-woolley', 1152, 738,
    'Close-up of a gray asphalt shingle roof meeting the gutter line',
    'Sedro-Woolley. The roof edge and the gutter are one system, and they silt up together.'),
  w('gutter-packed-with-fir-needles-before', 1167, 833,
    'Gutter packed with fir needles and roof debris before the roof was cleared',
    'Before. Under forest cover the roof and the gutter fill together, so they are one job rather than two.'),
  w('roof-and-gutter-covered-in-debris-before', 1161, 829,
    'Asphalt roof and gutter line covered in needles, leaves and organic debris',
    'Before. A gutter in this state does not drip — it overflows at the back edge, behind the fascia.'),
  w('roof-edge-and-gutter-cleared-after', 1320, 942,
    'Roof edge and gutter cleared of debris, with the shingle surface exposed',
    'After, same roof edge.'),
];

/* ------------------------------------------------------------ roof & moss */

const sedroWoolleyMoss: Photo[] = [
  w('roof-buried-in-moss-before-sedro-woolley', 1073, 1400,
    'Asphalt roof buried under thick moss, needles and forest debris before treatment',
    'Before, Sedro-Woolley. This is what a shaded roof does under forest cover here.'),
  w('skylights-buried-in-debris-before', 1053, 1400,
    'Two skylights almost buried under leaves, needles and moss before the roof was cleared',
    'Before. Both skylights are under there.'),
  w('moss-clump-lifted-off-roof', 1063, 1400,
    'Gloved hand holding a thick clump of moss and organic debris lifted off a roof',
    'Moss comes off by hand and at low pressure. A pressure washer takes the shingle granules with it.'),
  w('roof-partly-cleared-of-moss', 1059, 1400,
    'Roof partway through moss removal, cleared shingles on one side and growth remaining on the other',
    'Halfway across, which is the clearest look at what was actually on the roof.'),
  w('roof-ridge-after-moss-removal', 1069, 1400,
    'Roof ridge after the bulk moss and debris were removed, with the shingles visible again',
    'After. Same roof as the first photograph in this run.'),
  w('skylights-clear-after-moss-removal', 1062, 1400,
    'The same skylights after debris removal, fully exposed on a cleared roof',
    'After, same skylights.'),
  w('roof-safe-treatment-after-moss-removal', 1055, 1400,
    'Applying a roof-safe treatment across cleared shingles after the bulk moss was removed',
    'Clearing the moss is half of it. The treatment is what slows it coming back.'),
  w('powder-moss-treatment-along-ridge', 1061, 1400,
    'Asphalt roof after a roof-safe powder moss treatment was applied along the ridge',
    'Powder along the ridge; rain carries it down the slope over the following weeks.'),
  w('moss-exposed-after-debris-removal', 1082, 772,
    'Asphalt shingles after debris removal, with previously hidden moss growth now visible',
    'The debris came off and the moss underneath was still there — which is the problem with clearing without treating.'),
];

const roofWork: Photo[] = [
  w('rinsing-steep-shingle-roof', 1152, 738,
    'Steep gray shingled roof being rinsed with a low-pressure stream of water',
    'Rinsing down a steep pitch from the ridge, worked from a ladder rather than from the shingles.'),
  w('rinsing-shingled-roof-low-pressure', 1200, 1600,
    'Shingled roof being sprayed with a low-pressure stream from a hose',
    'The only pressure a composition roof should ever see.'),
  w('shingle-roof-ridge-after-treatment', 1152, 738,
    'High-angle view along a shingle roof ridge with a vent pipe, water beyond',
    'Composition shingle with the growth taken off it. The granules are the wearing surface and they do not grow back.'),
  w('pole-spraying-moss-from-shingle-roof', 1152, 738,
    'Long pole spraying water to remove moss from an asphalt shingle roof',
    'Worked from the ground where the pitch allows it.'),
  w('thick-moss-on-asphalt-shingles', 1152, 738,
    'Thick moss growth covering asphalt roof shingles',
    'Moss this established has already lifted the shingle edges it is growing under.'),
  w('roof-view-work-truck-in-driveway', 1152, 738,
    'View from a roof over the shingles to a work truck in the driveway below',
    'The view from the job. Ladders, hoses and tanks travel with the crew.'),
];

const metalRoof: Photo[] = [
  w('metal-roof-dulled-before-cleaning', 1320, 980,
    'Green standing-seam metal roof on a stone home before cleaning, dulled by organic growth',
    'Before, Whatcom County. The green finish is still under there; what you see is growth sitting on the coating.'),
  w('standing-seam-metal-roof-assessed', 1200, 1600,
    'Standing-seam metal roof inspected and assessed before a low-pressure soft wash',
    'Assessed before anything is applied — coating condition decides what the roof can take.'),
  w('ladder-access-for-metal-roof', 1320, 942,
    'Ladder set up beside a stone home for access to the metal roof',
    'Access set up off the roof itself. Walking a wet standing-seam panel is how people fall and how panels dent.'),
  w('protecting-siding-and-planting-before-soft-wash', 1200, 1600,
    'Technician protecting siding, windows and planting before soft washing a roof',
    'What goes on before the first drop: everything below the work gets covered or rinsed.'),
  w('soft-wash-solution-on-metal-roof', 1200, 1600,
    'Soft wash solution applied at low pressure to a corrugated metal roof',
    'Low pressure and the right chemistry. Pressure strips coatings off metal, which is a repaint rather than a clean.'),
  w('metal-roof-clean-after-soft-wash', 1320, 942,
    'Standing-seam metal roof after a low-pressure soft wash, clean and reflective',
    'After. Nothing was recoated — that is the original finish with the growth taken off it.'),
  w('metal-roof-green-finish-restored', 1320, 942,
    "The stone home's metal roof after cleaning, with the green finish restored",
    'After, from the same position as the first photograph in this run.'),
];

/* ----------------------------------------------------------- house washing */

const lyndenHouseWash: Photo[] = [
  w('lap-siding-green-growth-before-lynden', 1050, 1400,
    'White lap siding before washing, with green organic growth across the lower courses',
    'Before, a Lynden home. Growth starts low and on the shaded side, where the wall stays damp longest.'),
  w('long-wall-before-house-washing-lynden', 1152, 1104,
    'Long exterior wall of a home before washing, dulled by organic buildup',
    'Before. From here it reads as "the paint has aged", which is usually growth rather than age.'),
  w('algae-staining-embedded-in-siding-before', 1152, 1201,
    'Close-up of heavy green and dark organic staining embedded on white siding',
    'Close up, it is clearly biological — and it is in the surface, not on it.'),
  w('technician-soft-washing-upper-wall-lynden', 1152, 971,
    'Technician applying a siding-safe soft wash solution to an upper wall',
    'Applied from the ground. Water driven behind a lap board has to come out somewhere.'),
  w('soft-washing-exterior-wall-from-lawn', 1152, 971,
    'Technician soft washing the exterior wall of a home from the lawn at low pressure',
    'Siding gets washed, not blasted.'),
  w('side-wall-before-house-washing-lynden', 1152, 1152,
    'Side wall of a home before washing, with organic discoloration along the siding',
    'Before, the shaded side wall.'),
  w('side-wall-after-house-washing-lynden', 1152, 1152,
    'The same side wall after soft washing, the white siding clean and uniform',
    'After, same wall, same day.'),
  w('lap-siding-close-up-before-soft-wash', 1152, 1152,
    'Close-up of lap siding before treatment, showing green organic growth across several boards',
    'Before, close enough to count the courses.'),
  w('lap-siding-close-up-after-soft-wash', 1152, 1152,
    'Close-up of lap siding after soft washing, clean and free of organic growth',
    'After, same boards.'),
  w('long-wall-after-house-washing-lynden', 1152, 1104,
    'The same long exterior wall after washing, with bright, clean siding',
    'After. Same wall as the second photograph in this run.'),
  w('rinsing-board-and-batten-siding', 1200, 1600,
    'Rinsing red board-and-batten siding on a two-storey home',
    'Board-and-batten on another Whatcom County property. The battens hold debris along every vertical seam.'),
  w('clean-lap-siding-at-corner-board', 1200, 1600,
    'Close-up of clean cream lap siding at a corner board after a house washing',
    'Corner boards and trim are where a rushed house wash shows.'),
];

/* ------------------------------------------------------- concrete & fleet */

const mountVernonConcrete: Photo[] = [
  w('concrete-blackened-before-cleaning-mount-vernon', 1074, 1400,
    'Large concrete area in front of a home, darkened almost black by organic growth',
    'Before, Mount Vernon. Concrete goes black here from organic growth, not dirt — which is why sweeping never touches it.'),
  w('concrete-before-cleaning-mount-vernon', 1320, 1320,
    'Concrete before cleaning, showing the extent of dark organic contamination',
    'Before, the front entry. Black concrete is biological, and biological is what makes it slick underfoot.'),
  w('technician-surface-cleaner-beside-company-truck', 1600, 1200,
    'Technician running a surface cleaner across a driveway beside the branded company truck',
    'The truck carries its own water, tanks and power, so a job does not depend on the tap at the property.'),
  w('surface-cleaner-on-concrete-beside-truck', 1320, 1112,
    'Technician running a professional surface cleaner across concrete beside the company truck',
    'A surface cleaner rather than a wand, so there are no stripes left across the slab.'),
  w('walkway-half-cleaned-contrast', 1171, 1123,
    'Concrete walkway showing the contrast between a cleaned section and darker untreated concrete',
    'Mid-job on the walkway. The line is the honest measure of what was on the surface.'),
  w('walkway-after-pressure-washing', 1161, 1113,
    'The concrete walkway after cleaning, organic growth and dark staining removed',
    'After. A walkway that goes black also goes slippery, which is the part that matters in a wet winter.'),
  w('front-entry-concrete-after-cleaning', 1320, 1320,
    'Front entry and concrete after pressure washing, visibly brighter and more uniform',
    'After, the front entry.'),
  w('garage-driveway-after-pressure-washing', 1320, 1320,
    'Garage driveway after pressure washing, with an even, clean concrete surface',
    'After, the driveway.'),
  w('work-truck-loaded-with-equipment', 1200, 1600,
    'Black work truck loaded with ladders, hose reels and cleaning equipment',
    'Parked up on a job. Everything needed for a day of work travels on the truck.'),
];

/* ------------------------------------------------------------------ solar */

const commercialSolar: Photo[] = [
  w('commercial-solar-array-128-panels', 1073, 1400,
    'Wide view of a 128-panel commercial solar array on a flat rooftop',
    'A 128-panel commercial array. Output is measurable, so on a roof this size so is the cost of leaving it dirty.'),
  w('solar-panels-dirty-before-cleaning', 1055, 1400,
    'Rows of solar panels coated in dirt, dust and water spotting before cleaning',
    'Before. Panels do not need to look filthy to be down on output.'),
  w('solar-panel-contamination-close-up', 1088, 1400,
    'Close-up of a solar panel showing heavy dirt, pollen and bird droppings on the glass',
    'Pollen, dust and droppings. Any of it shades cells, and shaded cells cost output.'),
  w('technician-water-fed-pole-on-solar-array', 1058, 1400,
    'Technician cleaning solar panels with a water-fed pole on a commercial rooftop',
    'Purified water and a panel-safe brush — no detergent left on the glass to attract the next layer.'),
  w('solar-panels-clear-after-cleaning', 1061, 1400,
    'Solar panels after cleaning, with clear glass and no soap film or mineral residue',
    'After, same rows. Dried without spotting.'),
  w('commercial-solar-array-after-cleaning', 1055, 1400,
    'Wide view of the full 128-panel array after a pure-water cleaning',
    'After, the whole array.'),
  w('technician-cleaning-rooftop-solar-array', 1600, 978,
    'Technician standing on a rooftop cleaning solar panels with a long-handled brush',
    'Residential arrays get the same water and the same brush as the commercial ones.'),
  w('brush-cleaning-wet-solar-panels', 1600, 978,
    'Brush on a long pole cleaning wet solar panels, water streaking across the glass',
    'The brush agitates; the purified water carries it off and dries clear.'),
  w('water-fed-pole-on-rooftop-solar-array', 1200, 1600,
    'Technician cleaning a rooftop solar array with a water-fed pole beside a single-storey home',
    'Worked from the ground where the roof allows it — safer, and no foot traffic on the panels.'),
];

/* ------------------------------------------------------------- commercial */

const commercialGlass: Photo[] = [
  w('storefront-windows-blue-awnings', 1050, 1400,
    'Cleaned storefront windows under blue awnings at a business',
    'Storefront glass at a Whatcom County business. Commercial glass is judged from the pavement, in daylight.'),
  w('restaurant-storefront-glass-clean', 1050, 1400,
    'Cleaned restaurant storefront windows and glass at a commercial location',
    'A restaurant frontage on the same round.'),
];

/* ------------------------------------------------------------ the gallery */

export const WORK_RUNS: Array<{ title: string; photos: Photo[] }> = [
  { title: 'Window cleaning — waterfront home, Bow', photos: bowWindows },
  { title: 'Window cleaning — houses across the two counties', photos: windowWork },
  { title: 'Gutter clearing — Bellingham', photos: bellinghamGutters },
  { title: 'Gutters — what they look like when they are late', photos: gutterWork },
  { title: 'Roof moss removal — Sedro-Woolley', photos: sedroWoolleyMoss },
  { title: 'Roof cleaning — shingle roofs', photos: roofWork },
  { title: 'Metal roof soft wash — stone home, Whatcom County', photos: metalRoof },
  { title: 'House washing — Lynden', photos: lyndenHouseWash },
  { title: 'Concrete, driveways and the truck — Mount Vernon', photos: mountVernonConcrete },
  { title: 'Solar panel cleaning — commercial array and homes', photos: commercialSolar },
  { title: 'Commercial glass', photos: commercialGlass },
];

export const ALL_WORK: Photo[] = WORK_RUNS.flatMap((r) => r.photos);

/* --------------------------------------------------------- before / after
 * The pair is the evidence. A wall of "after" shots proves nothing, and a
 * slider would need client JavaScript this build does not ship — so they sit
 * side by side, labelled, at every width.
 */
export interface BeforeAfter { before: Photo; after: Photo; label: string }

const byFile = (list: Photo[], slug: string): Photo => {
  const found = list.find((p) => p.file.endsWith(`/${slug}.webp`));
  if (!found) throw new Error(`before/after: no photo ${slug}`);   // fails the build, not production
  return found;
};

export const BEFORE_AFTER: BeforeAfter[] = [
  { label: 'Waterfront window, Bow', before: byFile(bowWindows, 'waterfront-window-streaked-before'), after: byFile(bowWindows, 'waterfront-window-clear-after') },
  { label: 'Window bank, Bow', before: byFile(bowWindows, 'waterfront-windows-salt-haze-before'), after: byFile(bowWindows, 'waterfront-windows-clear-after') },
  { label: 'Glass door and frames, Bow', before: byFile(bowWindows, 'window-frames-webs-before-cleaning-bow'), after: byFile(bowWindows, 'glass-door-and-frames-clear-after') },
  { label: 'Roof moss, Sedro-Woolley', before: byFile(sedroWoolleyMoss, 'roof-buried-in-moss-before-sedro-woolley'), after: byFile(sedroWoolleyMoss, 'roof-ridge-after-moss-removal') },
  { label: 'Buried skylights, Sedro-Woolley', before: byFile(sedroWoolleyMoss, 'skylights-buried-in-debris-before'), after: byFile(sedroWoolleyMoss, 'skylights-clear-after-moss-removal') },
  { label: 'Metal roof, Whatcom County', before: byFile(metalRoof, 'metal-roof-dulled-before-cleaning'), after: byFile(metalRoof, 'metal-roof-green-finish-restored') },
  { label: 'Side wall, Lynden', before: byFile(lyndenHouseWash, 'side-wall-before-house-washing-lynden'), after: byFile(lyndenHouseWash, 'side-wall-after-house-washing-lynden') },
  { label: 'Siding close-up, Lynden', before: byFile(lyndenHouseWash, 'lap-siding-close-up-before-soft-wash'), after: byFile(lyndenHouseWash, 'lap-siding-close-up-after-soft-wash') },
  { label: 'Long wall, Lynden', before: byFile(lyndenHouseWash, 'long-wall-before-house-washing-lynden'), after: byFile(lyndenHouseWash, 'long-wall-after-house-washing-lynden') },
  { label: 'Front entry concrete, Mount Vernon', before: byFile(mountVernonConcrete, 'concrete-before-cleaning-mount-vernon'), after: byFile(mountVernonConcrete, 'front-entry-concrete-after-cleaning') },
  { label: 'Commercial solar array', before: byFile(commercialSolar, 'solar-panels-dirty-before-cleaning'), after: byFile(commercialSolar, 'solar-panels-clear-after-cleaning') },
];

/* ------------------------------------------------------------ page heroes */

const hero = (file: string, width: number, height: number, alt: string, caption: string): Photo =>
  ({ file, width, height, alt, caption });

export const HOME_HERO: Photo = hero('/photos/home/truck-and-technician-hero.webp', 1600, 1200,
  'Technician running a surface cleaner across a driveway beside the branded King of Kings truck',
  'On a driveway in Whatcom County. The truck carries its own water and power.');

export const RANDY: Photo = hero('/photos/team/randy-fee.webp', 512, 512,
  'Randy Fee, owner of King of Kings Window Cleaning',
  'Randy Fee, owner.');

export const SERVICE_HERO: Record<string, Photo> = {
  'window-cleaning': hero('/photos/service/window-cleaning-hero.webp', 1050, 1400,
    'Water-fed pole reaching upper gable windows to scrub and rinse them from the ground',
    'Upper glass reached from the ground with a water-fed pole rather than a ladder.'),
  'gutter-cleaning': hero('/photos/service/gutter-cleaning-hero.webp', 1320, 942,
    'Roof edge and gutter cleared of debris, with the shingle surface exposed',
    'A cleared roof edge and gutter line in Whatcom County.'),
  'roof-cleaning': hero('/photos/service/roof-cleaning-hero.webp', 1152, 738,
    'Steep gray shingled roof being rinsed with a low-pressure stream of water',
    'Rinsing a shingle roof at low pressure — the only pressure a composition roof should see.'),
  'moss-removal': hero('/photos/service/moss-removal-hero.webp', 1073, 1400,
    'Asphalt roof buried under thick moss, needles and forest debris before treatment',
    'Sedro-Woolley, before treatment. This is what a shaded roof does under forest cover here.'),
  'metal-roof-soft-washing': hero('/photos/service/metal-roof-hero.webp', 1320, 942,
    'Standing-seam metal roof after a low-pressure soft wash, clean and reflective',
    'The same roof after a soft wash, with the original finish intact.'),
  'house-washing': hero('/photos/service/house-washing-hero.webp', 1152, 971,
    'Technician soft washing the exterior wall of a home from the lawn at low pressure',
    'Soft washing siding from the ground in Lynden.'),
  'pressure-washing': hero('/photos/service/pressure-washing-hero.webp', 1320, 1112,
    'Technician running a professional surface cleaner across concrete beside the company truck',
    'A surface cleaner on concrete, which is where real pressure belongs.'),
  'solar-panel-cleaning': hero('/photos/service/solar-panel-cleaning-hero.webp', 1600, 978,
    'Technician standing on a rooftop cleaning solar panels with a long-handled brush',
    'Panels cleaned with purified water and a panel-safe brush.'),
  'commercial-window-cleaning': hero('/photos/service/commercial-window-cleaning-hero.webp', 1050, 1400,
    'Cleaned storefront windows under blue awnings at a business',
    'Storefront glass at a Whatcom County business.'),
};

export const PROBLEM_HERO: Record<string, Photo> = {
  'moss-under-shingles': hero('/photos/problem/moss-under-shingles.webp', 1082, 772,
    'Asphalt shingles after debris removal, with previously hidden moss growth now visible',
    'The debris came off and the moss underneath was still there.'),
  'overflowing-gutters': hero('/photos/problem/gutter-overflow.webp', 1152, 738,
    'Gutter and roof edge filled with fallen autumn leaves',
    'A gutter in this state does not drip — it overflows at the back edge, behind the fascia.'),
  'north-facing-wall-mildew': hero('/photos/problem/north-wall-mildew.webp', 1152, 1201,
    'Close-up of heavy green and dark organic staining embedded on white siding',
    'Growth embedded in the surface rather than sitting on it, on the wall that never dries.'),
  'slippery-driveways-and-walkways': hero('/photos/problem/slippery-walkway.webp', 1320, 1320,
    'Concrete before cleaning, showing the extent of dark organic contamination',
    'Mount Vernon. Black concrete is biological, and biological is what makes it slick.'),
  'solar-output-dropped': hero('/photos/problem/solar-edge-band.webp', 1088, 1400,
    'Close-up of a solar panel showing heavy dirt, pollen and bird droppings on the glass',
    'Any of this shades cells, and shaded cells cost output.'),
};

export const LIBRARY_HERO: Record<string, Photo> = {
  'composition-asphalt-shingle': hero('/photos/library/composition-shingle.webp', 1152, 738,
    'High-angle view along a shingle roof ridge with a vent pipe, water beyond',
    'Composition shingle with the growth taken off it. The granules are the wearing surface.'),
  'standing-seam-metal-roof': hero('/photos/library/standing-seam.webp', 1200, 1600,
    'Standing-seam metal roof inspected and assessed before a low-pressure soft wash',
    'Assessed before anything is applied — coating condition decides what the roof can take.'),
  'vinyl-siding': hero('/photos/library/vinyl-siding.webp', 1152, 1152,
    'Close-up of lap siding before treatment, showing green organic growth across several boards',
    'Organic growth across lap boards, before a soft wash.'),
};

export const CITY_HERO: Record<string, Photo> = {
  bellingham: hero('/photos/bellingham/city-hero.webp', 1152, 738,
    'Close-up of a gray asphalt shingle roof meeting the gutter line',
    'Roof and gutter work on a Bellingham round.'),
};

/** Keyed `market/service`. */
export const CITY_SERVICE_HERO: Record<string, Photo> = {
  'bellingham/window-cleaning': hero('/photos/bellingham/window-cleaning-hero.webp', 1152, 738,
    'Technician using a long pole to reach upper windows of a two-storey house',
    'Second-storey glass reached from the ground.'),
  'ferndale/window-cleaning': hero('/photos/ferndale/window-cleaning-hero.webp', 1152, 738,
    'Long pole with a squeegee reaching a high triangular window framed by timber beams',
    'A Ferndale home. Vaulted rooms put the dirtiest glass where nobody can reach it.'),
};

export const COMPLIANCE_HERO: Record<string, Photo> = {
  'wash-water-and-storm-drains': hero('/photos/compliance/storm-drain-protection.webp', 1200, 1600,
    'Technician protecting siding, windows and planting before soft washing a roof',
    'Protecting what is below the work is the same discipline as controlling where the water goes.'),
};

/* ------------------------------------------------- photographs, by page
 * The run of photographs each page shows below its body. Keyed by the slugs the
 * routes already own, so a page with no photographed work renders no gallery
 * rather than borrowing another job's pictures.
 */

export const SERVICE_PHOTOS: Record<string, Photo[]> = {
  'window-cleaning': [...bowWindows, ...windowWork],
  'gutter-cleaning': [...bellinghamGutters, ...gutterWork],
  'roof-cleaning': [...roofWork, ...sedroWoolleyMoss.slice(0, 4)],
  'moss-removal': sedroWoolleyMoss,
  'metal-roof-soft-washing': metalRoof,
  'house-washing': lyndenHouseWash,
  'pressure-washing': mountVernonConcrete,
  'solar-panel-cleaning': commercialSolar,
  'commercial-window-cleaning': commercialGlass,
};

export const PROBLEM_PHOTOS: Record<string, Photo[]> = {
  'moss-under-shingles': sedroWoolleyMoss.slice(0, 5),
  'overflowing-gutters': gutterWork,
  'north-facing-wall-mildew': lyndenHouseWash.slice(0, 6),
  'slippery-driveways-and-walkways': mountVernonConcrete.slice(0, 6),
  'solar-output-dropped': commercialSolar.slice(0, 6),
};

/** City pages show the work actually done in that town. */
export const CITY_PHOTOS: Record<string, Photo[]> = {
  bellingham: bellinghamGutters,
  lynden: lyndenHouseWash,
  'mount-vernon': mountVernonConcrete,
};

export const CITY_SERVICE_PHOTOS: Record<string, Photo[]> = {
  'bellingham/gutter-cleaning': bellinghamGutters,
  'bellingham/window-cleaning': windowWork,
  'ferndale/window-cleaning': windowWork,
  'lynden/house-washing': lyndenHouseWash,
  'mount-vernon/pressure-washing': mountVernonConcrete,
};

/** A short strip for the home page — one photograph from several different jobs. */
export const HOME_STRIP: Photo[] = [
  sedroWoolleyMoss[3],
  bowWindows[5],
  lyndenHouseWash[4],
  mountVernonConcrete[4],
  commercialSolar[3],
  metalRoof[5],
];

/** The home page's about section — a technician mid-job, not a posed shot. */
export const ABOUT_PHOTO: Photo = lyndenHouseWash[3];
