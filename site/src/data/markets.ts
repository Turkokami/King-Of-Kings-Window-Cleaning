/**
 * markets.ts — the geo lattice. This file drives routing, the areaServed array,
 * the internal-link wheel and the page count itself.
 *
 * ANTI-SLOP CONTRACT (Keystone 6.3): a market does not generate pages from a
 * template. It generates pages from the FACTS in its row. `differentiators`
 * must be filled with researched, verifiable local material before any page for
 * that market builds — `isBuildable()` enforces it. A market with thin facts
 * drops a tier or becomes an areaServed mention on a neighbouring city page.
 * A thin geo page is worse than no geo page.
 *
 * COORDINATES: every `coords` value must be verified against the USGS GNIS or
 * Census gazetteer before `emitGeo` flips true. Approximate coordinates in
 * LocalBusiness/Place schema are a correctness problem, not a rounding problem.
 */

export type County = 'Whatcom' | 'Skagit' | 'Island';
export type Tier = 1 | 2 | 3;

export interface Source {
  fact: string;
  url: string;
}

export interface Market {
  slug: string;
  name: string;
  county: County;
  tier: Tier;
  /**
   * Keystone v2 prime directive 8 — never generate a measurement. Every figure
   * and place name in `differentiators` traces to one of these. A market with
   * facts and no sources is not researched, it is invented.
   */
  sources?: Source[];
  /** Live on the legacy WordPress site today — carries inbound links and rankings. */
  legacy: boolean;
  /** Approximate drive time from the Bellingham origin, in minutes. PENDING per row. */
  driveMinutes: number | null;
  coords: { lat: number; lng: number } | null;
  emitGeo: boolean;
  /**
   * The research payload. Every field here must be true of THIS place and not of
   * its neighbours, or the page it produces reads as a template.
   */
  differentiators: {
    /** Dominant housing stock and era — drives glass type, siding, roof material. */
    housing: string[];
    /** Environmental soiling pressures specific to this market. */
    pressures: string[];
    /** Named local geography, roads, waterways, districts. Real names only. */
    landmarks: string[];
    /** Water hardness / supply notes where they change the method. */
    water: string | null;
    /** Anything regulatory that applies here and not everywhere. */
    regulatory: string[];
  };
  /** Sibling markets for lateral linking (Keystone M3). */
  neighbours: string[];
}

const empty = () => ({
  housing: [] as string[],
  pressures: [] as string[],
  landmarks: [] as string[],
  water: null,
  regulatory: [] as string[],
});

export const MARKETS: Market[] = [
  // ---------------------------------------------------------------- TIER 1
  {
    slug: 'bellingham', name: 'Bellingham', county: 'Whatcom', tier: 1, legacy: true,
    driveMinutes: 0, coords: null, emitGeo: false,
    differentiators: {
      housing: [
        'Eight National Register historic districts: Broadway Park, Cissna Cottages, Downtown, Eldridge, Fairhaven, Sehome Hill, South Hill and York',
        'Cissna Cottages built 1900-1904; the York neighborhood was substantially built out by the Great Depression',
        'Roughly three-quarters of permits issued over the past decade were multi-family',
      ],
      pressures: [
        '36 inches of rain a year, with about 80% of it falling October through March',
        '40% tree canopy across the city — 7,252 acres — with a 45% target by 2050',
        'Forest species are western redcedar, Douglas-fir, big-leaf maple, vine maple, red alder, black cottonwood and Sitka spruce',
        'Street trees are predominantly maples, cherries and oaks',
        'Prevailing wind is southerly in eleven months of twelve',
      ],
      landmarks: [
        'Lake Whatcom', 'Bellingham Bay', 'Whatcom Creek', 'Squalicum Creek', 'Padden Creek',
        'Chuckanut Bay', 'Lake Padden', 'Sehome Hill', 'Squalicum Harbor',
      ],
      water: 'Lake Whatcom is the drinking water source for the city. No hardness figure is published — do not state one without pulling the current Consumer Confidence Report.',
      regulatory: [
        'Bellingham Municipal Code 15.42 prohibits pressure wash water entering a storm drain — it must go to sanitary sewer or a vegetated area',
        'The City offers free pressure wash water reclaim kits to businesses',
        'Buildings built 1950-1979 may contain PCBs, and that wash water may require licensed hazardous disposal',
        'Lake Whatcom watershed rules apply in Basin One, including a zero-phosphorus rule on fertilisers and soil amendments',
      ],
    },
    sources: [
      { fact: 'rainfall, seasonality', url: 'https://cob.org/wp-content/uploads/2019-09-09-Workingdrafts_Chpt2_CommunitySetting.pdf' },
      { fact: 'tree canopy and species', url: 'https://cob.org/wp-content/uploads/Draft-Urban-Forest-Plan-April-2024.pdf' },
      { fact: 'historic districts', url: 'https://cob.org/services/planning/historic/national-districts' },
      { fact: 'pressure washing rules, BMC 15.42', url: 'https://cob.org/services/environment/stormwater/preventpollution/pressure-washing' },
      { fact: 'Lake Whatcom watershed rules', url: 'https://cob.org/services/environment/lake-whatcom/rules-regs' },
      { fact: 'water source', url: 'https://cob.org/wp-content/uploads/water-quality-faqs.pdf' },
      { fact: 'official neighborhood list', url: 'https://cob.org/services/planning/neighborhoods' },
    ],
    neighbours: ['ferndale', 'sudden-valley', 'marietta', 'geneva', 'lummi-island'],
  },
  {
    slug: 'ferndale', name: 'Ferndale', county: 'Whatcom', tier: 1, legacy: true,
    driveMinutes: null, coords: null, emitGeo: false,
    differentiators: {
      housing: [
        '55% of Ferndale housing was built after 1980',
        'Around 447 mobile and manufactured homes, 421 of them in ten manufactured home parks',
        'Hovander Homestead Park — the 1903 house is clear western red cedar and Douglas fir, with a 1911 barn 60 feet high',
      ],
      pressures: [
        'BP Cherry Point, the largest refinery in the Pacific Northwest, operating since 1971 at around 250,000 barrels a day across roughly 1,000 developed acres',
        'Phillips 66 Ferndale Refinery, about 850 acres, roughly 105,000 barrels a day',
        'Agricultural dust off the Nooksack Valley — Whatcom County holds 87% of Washington State red raspberry acreage',
      ],
      landmarks: ['Nooksack River', 'Cherry Point', 'Hovander Homestead Park', 'Main Street'],
      water: 'Ferndale runs on groundwater, not surface water. The City installed reverse osmosis in October 2014 specifically to address hardness and is moving to 100% RO — so native groundwater here is genuinely hard, which is sourced. A hardness figure is not.',
      regulatory: [
        'Ferndale Municipal Code 13.35.020(B)(4) expressly allows "routine external building wash down that does not use detergents" — materially more permissive than Bellingham',
        'Critical Aquifer Recharge Areas are regulated under FMC 16.08.460-500, which matters because the city drinks its own groundwater',
      ],
    },
    sources: [
      { fact: 'housing stock', url: 'https://www.ezview.wa.gov/Portals/_1976/Documents/ElementExamples/Ferndale%20Housing%20Element.pdf' },
      { fact: 'BP Cherry Point', url: 'https://www.bp.com/en_us/united-states/home/what-we-do/production-and-operations/refineries/cherry-point-refinery.html' },
      { fact: 'Phillips 66 Ferndale', url: 'https://www.phillips66.com/refining/ferndale-refinery/' },
      { fact: 'Intalco closure and 2025 attainment redesignation', url: 'https://nwcleanairwa.gov/projects/intalco-so2/' },
      { fact: 'groundwater, RO for hardness', url: 'https://www.cityofferndale.org/308/From-Well-to-Faucet' },
      { fact: 'FMC 13.35 allowable discharges', url: 'https://www.codepublishing.com/WA/Ferndale/html/Ferndale13/Ferndale1335.html' },
      { fact: 'Hovander Homestead', url: 'https://www.whatcomcounty.us/3541/Hovander-Homestead-Park' },
    ],
    neighbours: ['bellingham', 'custer', 'lynden', 'marietta', 'blaine'],
  },
  {
    slug: 'lynden', name: 'Lynden', county: 'Whatcom', tier: 1, legacy: true,
    driveMinutes: null, coords: null, emitGeo: false,
    differentiators: {
      housing: [
        '65% single-family detached; 68% of units have three or more bedrooms, a notably higher share than the county or state',
        'Front Street\'s Dutch-themed storefronts and windmill are a deliberate 1980s remodel, not surviving Dutch-built architecture',
        'Rental vacancy 0.9% in 2022, far below a healthy 5-6%',
      ],
      pressures: [
        'Whatcom County had 63,387 cattle on 446 farms in 2022, with 108 farms selling milk',
        'Manure "big gun" applicators must stay at least 40 feet back at any time of year because of drift',
        'Washington produces roughly 95% of the nation\'s processed red raspberries',
      ],
      landmarks: ['Nooksack River', 'Fishtrap Creek', 'Pepin Creek', 'Bertrand Creek', 'Berthusen Park', 'Front Street'],
      water: 'Lynden draws surface water from the Nooksack River. Raw turbidity swings between 60 and 1,500 NTU — locally called the chocolate milkshake effect — against a 1 NTU treated standard. No hardness figure published.',
      regulatory: [
        'The Portage Bay Shellfish Protection District, established 1998, is driven by Nooksack River water quality',
      ],
    },
    sources: [
      { fact: 'housing mix', url: 'https://www.census.gov/quickfacts/fact/table/lyndencitywashington/PST045225' },
      { fact: 'Dutch theme is a 1980s remodel', url: 'https://www.historylink.org/File/8393' },
      { fact: 'manure drift setback', url: 'https://www.whatcomcd.org/manure-application-setback' },
      { fact: 'cattle and dairy counts', url: 'https://www.nass.usda.gov/Publications/AgCensus/2022/Full_Report/Volume_1,_Chapter_2_County_Level/Washington/st53_2_011_011.pdf' },
      { fact: 'Nooksack turbidity', url: 'https://www.djc.com/news/search.html?action=get&id=12093392' },
      { fact: 'water source and treatment', url: 'https://doh.wa.gov/sites/default/files/legacy/Documents/Pubs//331-532.pdf' },
    ],
    neighbours: ['ferndale', 'everson', 'nooksack', 'sumas'],
  },
  {
    slug: 'blaine', name: 'Blaine', county: 'Whatcom', tier: 1, legacy: true,
    driveMinutes: null, coords: null, emitGeo: false,
    differentiators: {
      housing: [
        'A bimodal stock: 20.5% built before 1939 and 21.6% built 2000-2010, with another 29.7% from 1980-1999',
        '15% of units vacant, 7.7% of those seasonal or occasional — the City attributes this to the seasonal economy and a high share of Canadian ownership',
        '415 single-family homes and 179 condominium units at Semiahmoo, on 800 acres annexed in 1974',
      ],
      pressures: [
        'Open marine exposure across the Strait of Georgia, with fetch limited by Point Roberts, Birch Point and Point Whitehorn',
        'Documented storm wave crests over 8 feet above mean higher high water in 1982 and 2006',
        'The Birch Bay shoreline sits in drift cell WH-2-7 with net northward sediment transport',
      ],
      landmarks: ['Drayton Harbor', 'Semiahmoo Spit', 'Semiahmoo Bay', 'Strait of Georgia', 'Dakota Creek', 'California Creek', 'Blaine Harbor', 'Peace Arch'],
      water: 'Blaine runs on groundwater from nine deep production wells in a forested watershed, producing about 550 million gallons a year — and it wholesales to the Birch Bay Water and Sewer District, so Blaine, Birch Bay and Semiahmoo share a groundwater source. No hardness figure published.',
      regulatory: [
        'The Drayton Harbor bacteria cleanup plan (TMDL) was approved by EPA in March 2026, addressing fecal coliform and E. coli in the harbour and its tributaries',
        'Three Whatcom County Shellfish Protection Districts: Drayton Harbor (1995), Portage Bay (1998) and Birch Bay (2009)',
        'The Semiahmoo Resort Association manages 27 distinct neighborhoods and runs an Architectural Standards Committee — note its published standards govern construction and remodelling, not routine cleaning',
      ],
    },
    sources: [
      { fact: 'housing age and vacancy', url: 'https://www.ci.blaine.wa.us/DocumentCenter/View/11812/DRAFT-Housing-Element' },
      { fact: 'water system', url: 'https://www.ci.blaine.wa.us/103/Water' },
      { fact: 'Drayton Harbor TMDL', url: 'https://ecology.wa.gov/water-shorelines/water-quality/water-improvement/total-maximum-daily-load-process/directory-of-improvement-projects/drayton-harbor' },
      { fact: 'shellfish protection districts', url: 'https://www.whatcomcounty.us/1101/Shellfish-Protection-Districts' },
      { fact: 'drift cell, wave and fetch', url: 'https://www.whatcomcounty.us/DocumentCenter/View/25441/Critical-Areas-Report' },
      { fact: 'Semiahmoo Resort Association', url: 'https://www.semiahmooresortassociation.com/' },
    ],
    neighbours: ['birch-bay', 'semiahmoo', 'custer', 'point-roberts'],
  },
  {
    slug: 'mount-vernon', name: 'Mount Vernon', county: 'Skagit', tier: 1, legacy: true,
    driveMinutes: null, coords: null, emitGeo: false,
    differentiators: {
      housing: [
        '13,744 housing units, 66.1% single-family',
        'A fire in 1891 destroyed the riverside commercial district and the town rebuilt further back on 1st Street, which is why the surviving downtown fabric dates from the 1890s onward',
        'Downtown has an intact streetscape of historic commercial buildings, false fronts and ornate terra cotta — but note there is NO National Register historic district in Mount Vernon, only three individually listed properties',
      ],
      pressures: [
        '32 to 34 inches of rain a year — meaningfully less than Bellingham but not dramatically so',
        'Prevailing wind from the southwest',
        'The Skagit bulb fields and all four tulip display gardens are in Mount Vernon — roughly 500 acres of tulips and daffodils, about 20 million bulbs lifted each summer',
        'Field disturbance peaks April-May at planting and June-July and late September-October at harvest, which coincides with the driest months',
      ],
      landmarks: ['Skagit River', 'Little Mountain', 'I-5', 'SR 9', 'SR 20', 'SR 536'],
      water: 'Served by Skagit PUD from Judy Reservoir, four creeks in the Cultus Mountain watershed, and the Skagit River. No PUD hardness figure published — but the neighbouring Anacortes system, drawing the same Skagit River water, tests around 30 mg/L, which is soft.',
      regulatory: [
        'Most storm drains in Mount Vernon discharge directly to creeks and then into the Skagit River',
        'NPDES Phase II municipal stormwater permittee since February 2007, with an Illicit Discharge Detection and Elimination programme',
        'Flood stage is 28 feet at the Mount Vernon gauge; the downtown floodwall was completed across three phases from 2010 to 2018',
      ],
    },
    sources: [
      { fact: 'housing units', url: 'https://www.skagitcounty.net/PlanningAndPermit/Documents/020625/SkagitCounty_HousingNeedsAssessment_FINAL0911.pdf' },
      { fact: 'no NRHP district; downtown fabric', url: 'https://preservewa.org/most_endangered/downtown-mount-vernon/' },
      { fact: '1891 fire and rebuild', url: 'https://www.historylink.org/File/9537' },
      { fact: 'tulip acreage and calendar', url: 'https://extension.wsu.edu/skagit/skagit-county-agriculture-statistics-2024/' },
      { fact: 'storm drains discharge to creeks', url: 'https://mountvernonwa.gov/420/Surface-Water' },
      { fact: 'floodwall phases', url: 'https://mountvernonwa.gov/504/Phases-I-II-and-III' },
    ],
    neighbours: ['burlington', 'conway', 'big-lake', 'la-conner'],
  },
  {
    slug: 'burlington', name: 'Burlington', county: 'Skagit', tier: 1, legacy: true,
    driveMinutes: null, coords: null, emitGeo: false,
    differentiators: {
      housing: [
        '4,271 units and only 49.8% single-family — by a wide margin the most multifamily-weighted market in the territory',
        'Founded 1882 as a logging camp, incorporated 1902; grew as the "Hub City" where the Great Northern and Seattle & Northern railways crossed',
        'One National Register listing, the 1916 Burlington Carnegie Library',
      ],
      pressures: [
        'The city sits on a flood plain with the Skagit River forming its southern and southeastern boundaries; major floods in 1909, 1917, 1921, 1990 and 1995',
        'Surrounded by the same working Skagit farmland as Mount Vernon',
      ],
      landmarks: ['Gages Slough', 'Skagit River', 'I-5', 'SR 20', 'Chuckanut Drive'],
      water: 'Served by Skagit PUD. No hardness figure published.',
      regulatory: [
        'Most stormwater in Burlington drains into Gages Slough and is then pumped into the Skagit River — an unusually direct path from a storm drain to surface water',
        'NPDES Phase II permittee; illicit or hazardous discharge to the public storm system is unlawful',
      ],
    },
    sources: [
      { fact: 'housing mix', url: 'https://www.skagitcounty.net/PlanningAndPermit/Documents/020625/SkagitCounty_HousingNeedsAssessment_FINAL0911.pdf' },
      { fact: 'founding, floods, Cascade Mall closure', url: 'https://www.historylink.org/File/20786' },
      { fact: 'Gages Slough stormwater', url: 'https://burlingtonwa.gov/191/Stormwater' },
    ],
    neighbours: ['mount-vernon', 'sedro-woolley', 'bay-view', 'alger'],
  },
  {
    slug: 'sedro-woolley', name: 'Sedro-Woolley', county: 'Skagit', tier: 1, legacy: true,
    driveMinutes: null, coords: null, emitGeo: false,
    differentiators: {
      housing: [
        '5,125 units, 63.4% single-family',
        'Formed by the 1898 merger of two rival towns — Sedro, founded 1884, and Woolley, founded 1890, which suffered fires in 1891 and 1893',
        'Northern State Hospital, a large historic institutional campus on the town edge, listed on the National Register in 2010',
      ],
      pressures: [
        'Sits between the 32-inch lowland rainfall regime and the 70 inches recorded upvalley at Concrete — the wettest of the four Skagit markets, though no station figure exists for the town itself',
        'Skagit River floodplain; flood stage 28 feet at the Concrete gauge upstream, which crested at 38.93 feet in November 2021',
      ],
      landmarks: ['Skagit River', 'SR 20', 'Northern State Hospital'],
      water: 'Served by Skagit PUD. No hardness figure published.',
      regulatory: ['NPDES Phase II permittee; the city maintains a Shoreline Master Program'],
    },
    sources: [
      { fact: 'town merger and history', url: 'https://www.sedro-woolley.gov/community/about_our_city.php' },
      { fact: 'housing mix', url: 'https://www.skagitcounty.net/PlanningAndPermit/Documents/020625/SkagitCounty_HousingNeedsAssessment_FINAL0911.pdf' },
      { fact: 'rainfall gradient', url: 'https://www.govinfo.gov/content/pkg/GOVPUB-A57-PURL-LPS106025/pdf/GOVPUB-A57-PURL-LPS106025.pdf' },
      { fact: 'flood stage and 2021 crest', url: 'https://www.skagitcounty.net/Departments/Flood/Main.htm' },
    ],
    neighbours: ['burlington', 'lyman', 'clear-lake', 'alger'],
  },
  {
    slug: 'anacortes', name: 'Anacortes', county: 'Skagit', tier: 1, legacy: true,
    driveMinutes: null, coords: null, emitGeo: false,
    differentiators: {
      housing: [
        '8,799 units, 78.3% single-family — the highest owner-occupied house share in the territory; median owner-occupied value $696,700',
        'Nine National Register listings and a local Anacortes Register of seven properties, but no National Register historic district',
        'Downtown building stock is brick, wood-frame and concrete in Queen Anne, Italianate, Romanesque Revival and Tudor Revival — the Platt Building of 1890 was the first brick building in town',
        'Two distinct boom eras: the 1890 speculative boom and the 1950s refinery expansion',
      ],
      pressures: [
        'Surrounded by water on three sides with over 27 miles of shoreline, on Fidalgo Island',
        '27.73 inches of rain measured in 2016 — genuinely drier than Bellingham, roughly 20% less',
        'Two refineries at March Point: Marathon Anacortes (120,000 barrels a day, since 1955) and HF Sinclair Puget Sound (up to 160,000 barrels a day, built by Texaco in 1957)',
        'The City\'s own position is that day-to-day air quality is generally good and refinery risk is episodic release events, not chronic deposition — do not overstate this',
        'Anacortes Community Forest Lands cover more than 2,950 acres inside the city limits; species are Douglas fir, western red cedar, western hemlock and white fir',
      ],
      landmarks: ['Fidalgo Island', 'Guemes Channel', 'Padilla Bay', 'Fidalgo Bay', 'March Point', 'Mount Erie', 'Swinomish Channel', 'Deception Pass', 'Rosario Strait'],
      water: 'Skagit River, treated by the City of Anacortes. Hardness tests consistently in the 0-60 mg/L range, typically around 30 mg/L — classified soft. This is the only verified hardness figure in the entire territory.',
      regulatory: [
        'Shoreline jurisdiction extends 200 feet from the ordinary high water mark, with six shoreline environment designations',
        'Anacortes has a partially combined sewer system with two CSO outfalls into Guemes Channel — in the combined-sewer portion of town, storm drains lead to the treatment plant rather than straight to the water, the opposite of Mount Vernon and Burlington',
        'Padilla Bay is a National Estuarine Research Reserve, designated 1980 — but no new regulations came with the designation; the enforceable protection comes from its status as a Shoreline of Statewide Significance',
      ],
    },
    sources: [
      { fact: 'water hardness ~30 mg/L, soft', url: 'https://www.anacorteswa.gov/Archive.aspx?ADID=855' },
      { fact: 'rainfall 27.73in 2016', url: 'https://www.anacorteswa.gov/ArchiveCenter/ViewFile/Item/199' },
      { fact: 'air quality position', url: 'https://www.anacorteswa.gov/2152/Air-Quality' },
      { fact: 'downtown historic building stock', url: 'https://www.anacorteswa.gov/1509/Historic-Building-Walking-Tour' },
      { fact: 'shoreline jurisdiction', url: 'https://www.anacorteswa.gov/267/Shoreline-Planning' },
      { fact: 'combined sewer / CSO outfalls', url: 'https://www.anacorteswa.gov/ArchiveCenter/ViewFile/Item/199' },
      { fact: 'community forest lands', url: 'https://www.anacorteswa.gov/517/Community-Forest-Lands-ACFL' },
      { fact: 'Padilla Bay NERR carries no new regulation', url: 'https://apps.ecology.wa.gov/publications/documents/0906016.pdf' },
    ],
    neighbours: ['la-conner', 'guemes-island', 'bay-view', 'burlington'],
  },

  // ---------------------------------------------------------------- TIER 2
  { slug: 'birch-bay', name: 'Birch Bay', county: 'Whatcom', tier: 2, legacy: true, driveMinutes: null, coords: null, emitGeo: false, differentiators: { housing: [], pressures: ['salt spray'], landmarks: ['Birch Bay'], water: null, regulatory: [] }, neighbours: ['blaine', 'custer', 'semiahmoo'] },
  { slug: 'semiahmoo', name: 'Semiahmoo', county: 'Whatcom', tier: 2, legacy: false, driveMinutes: null, coords: null, emitGeo: false, differentiators: { housing: [], pressures: ['direct marine salt exposure'], landmarks: ['Semiahmoo Spit', 'Drayton Harbor'], water: null, regulatory: [] }, neighbours: ['blaine', 'birch-bay'] },
  { slug: 'custer', name: 'Custer', county: 'Whatcom', tier: 2, legacy: true, driveMinutes: null, coords: null, emitGeo: false, differentiators: { housing: [], pressures: ['Cherry Point industrial corridor'], landmarks: ['Cherry Point'], water: null, regulatory: [] }, neighbours: ['ferndale', 'birch-bay', 'blaine'] },
  { slug: 'everson', name: 'Everson', county: 'Whatcom', tier: 2, legacy: true, driveMinutes: null, coords: null, emitGeo: false, differentiators: empty(), neighbours: ['nooksack', 'lynden', 'deming'] },
  { slug: 'nooksack', name: 'Nooksack', county: 'Whatcom', tier: 2, legacy: true, driveMinutes: null, coords: null, emitGeo: false, differentiators: empty(), neighbours: ['everson', 'sumas', 'lynden'] },
  { slug: 'sumas', name: 'Sumas', county: 'Whatcom', tier: 2, legacy: true, driveMinutes: null, coords: null, emitGeo: false, differentiators: empty(), neighbours: ['nooksack', 'everson', 'kendall'] },
  { slug: 'deming', name: 'Deming', county: 'Whatcom', tier: 2, legacy: true, driveMinutes: null, coords: null, emitGeo: false, differentiators: empty(), neighbours: ['acme', 'van-zandt', 'kendall', 'everson'] },
  { slug: 'acme', name: 'Acme', county: 'Whatcom', tier: 2, legacy: true, driveMinutes: null, coords: null, emitGeo: false, differentiators: empty(), neighbours: ['van-zandt', 'deming', 'wickersham'] },
  { slug: 'maple-falls', name: 'Maple Falls', county: 'Whatcom', tier: 2, legacy: true, driveMinutes: null, coords: null, emitGeo: false, differentiators: { housing: [], pressures: ['heavy conifer shade and needle drop', 'high-elevation moss pressure'], landmarks: [], water: null, regulatory: [] }, neighbours: ['glacier', 'kendall', 'deming'] },
  { slug: 'glacier', name: 'Glacier', county: 'Whatcom', tier: 2, legacy: true, driveMinutes: null, coords: null, emitGeo: false, differentiators: { housing: [], pressures: ['highest rainfall and moss pressure in the territory', 'deep conifer shade'], landmarks: ['Mount Baker Highway', 'Nooksack North Fork'], water: null, regulatory: [] }, neighbours: ['maple-falls', 'kendall'] },
  { slug: 'sudden-valley', name: 'Sudden Valley', county: 'Whatcom', tier: 2, legacy: true, driveMinutes: null, coords: null, emitGeo: false, differentiators: { housing: [], pressures: ['dense second-growth shade', 'lakeside humidity'], landmarks: ['Lake Whatcom'], water: null, regulatory: ['Lake Whatcom watershed runoff restrictions', 'HOA architectural rules'] }, neighbours: ['bellingham', 'geneva'] },
  { slug: 'kendall', name: 'Kendall', county: 'Whatcom', tier: 2, legacy: false, driveMinutes: null, coords: null, emitGeo: false, differentiators: empty(), neighbours: ['maple-falls', 'deming', 'sumas'] },
  { slug: 'van-zandt', name: 'Van Zandt', county: 'Whatcom', tier: 2, legacy: false, driveMinutes: null, coords: null, emitGeo: false, differentiators: empty(), neighbours: ['acme', 'deming', 'wickersham'] },
  { slug: 'la-conner', name: 'La Conner', county: 'Skagit', tier: 2, legacy: true, driveMinutes: null, coords: null, emitGeo: false, differentiators: { housing: [], pressures: ['tidal channel salt exposure'], landmarks: ['Swinomish Channel'], water: null, regulatory: [] }, neighbours: ['mount-vernon', 'anacortes', 'conway'] },
  { slug: 'lyman', name: 'Lyman', county: 'Skagit', tier: 2, legacy: true, driveMinutes: null, coords: null, emitGeo: false, differentiators: empty(), neighbours: ['sedro-woolley', 'hamilton', 'concrete'] },
  { slug: 'edison', name: 'Edison', county: 'Skagit', tier: 2, legacy: true, driveMinutes: null, coords: null, emitGeo: false, differentiators: empty(), neighbours: ['bow', 'bay-view', 'samish-island'] },
  { slug: 'bow', name: 'Bow', county: 'Skagit', tier: 2, legacy: true, driveMinutes: null, coords: null, emitGeo: false, differentiators: empty(), neighbours: ['edison', 'alger', 'samish-island'] },
  { slug: 'alger', name: 'Alger', county: 'Skagit', tier: 2, legacy: true, driveMinutes: null, coords: null, emitGeo: false, differentiators: empty(), neighbours: ['bow', 'sedro-woolley', 'burlington'] },
  { slug: 'clear-lake', name: 'Clear Lake', county: 'Skagit', tier: 2, legacy: true, driveMinutes: null, coords: null, emitGeo: false, differentiators: empty(), neighbours: ['sedro-woolley', 'big-lake', 'mount-vernon'] },
  { slug: 'big-lake', name: 'Big Lake', county: 'Skagit', tier: 2, legacy: false, driveMinutes: null, coords: null, emitGeo: false, differentiators: empty(), neighbours: ['clear-lake', 'mount-vernon', 'conway'] },
  { slug: 'conway', name: 'Conway', county: 'Skagit', tier: 2, legacy: false, driveMinutes: null, coords: null, emitGeo: false, differentiators: empty(), neighbours: ['mount-vernon', 'la-conner', 'big-lake'] },
  { slug: 'concrete', name: 'Concrete', county: 'Skagit', tier: 2, legacy: false, driveMinutes: null, coords: null, emitGeo: false, differentiators: empty(), neighbours: ['hamilton', 'rockport', 'lyman'] },
  { slug: 'hamilton', name: 'Hamilton', county: 'Skagit', tier: 2, legacy: false, driveMinutes: null, coords: null, emitGeo: false, differentiators: empty(), neighbours: ['lyman', 'concrete'] },
  { slug: 'bay-view', name: 'Bay View', county: 'Skagit', tier: 2, legacy: false, driveMinutes: null, coords: null, emitGeo: false, differentiators: { housing: [], pressures: ['Padilla Bay salt exposure'], landmarks: ['Padilla Bay'], water: null, regulatory: [] }, neighbours: ['burlington', 'edison', 'anacortes'] },
  // Island County — outside the chosen Whatcom + Skagit territory but live today
  // with six ranking pages. RETAIN AND MAINTAIN pending an owner decision; do not
  // expand. See open items in the audit, section 14.
  { slug: 'oak-harbor', name: 'Oak Harbor', county: 'Island', tier: 2, legacy: true, driveMinutes: null, coords: null, emitGeo: false, differentiators: { housing: [], pressures: ['marine salt spray'], landmarks: ['Whidbey Island'], water: null, regulatory: [] }, neighbours: ['anacortes'] },

  // ---------------------------------------------------------------- TIER 3
  { slug: 'point-roberts', name: 'Point Roberts', county: 'Whatcom', tier: 3, legacy: false, driveMinutes: null, coords: null, emitGeo: false, differentiators: { housing: [], pressures: ['direct marine exposure on three sides'], landmarks: [], water: null, regulatory: ['Access requires two international border crossings — scheduling and pricing must say so plainly'] }, neighbours: ['blaine'] },
  { slug: 'lummi-island', name: 'Lummi Island', county: 'Whatcom', tier: 3, legacy: false, driveMinutes: null, coords: null, emitGeo: false, differentiators: { housing: [], pressures: ['salt spray', 'heavy conifer shade'], landmarks: ['Hales Pass'], water: null, regulatory: ['Whatcom Chief ferry schedule governs crew scheduling — say so honestly on the page'] }, neighbours: ['bellingham', 'marietta'] },
  { slug: 'marietta', name: 'Marietta', county: 'Whatcom', tier: 3, legacy: false, driveMinutes: null, coords: null, emitGeo: false, differentiators: { housing: [], pressures: ['Nooksack delta humidity'], landmarks: ['Nooksack River delta'], water: null, regulatory: [] }, neighbours: ['bellingham', 'ferndale', 'lummi-island'] },
  { slug: 'geneva', name: 'Geneva', county: 'Whatcom', tier: 3, legacy: false, driveMinutes: null, coords: null, emitGeo: false, differentiators: { housing: [], pressures: [], landmarks: ['Lake Whatcom'], water: null, regulatory: ['Lake Whatcom watershed runoff restrictions'] }, neighbours: ['bellingham', 'sudden-valley'] },
  { slug: 'wickersham', name: 'Wickersham', county: 'Whatcom', tier: 3, legacy: false, driveMinutes: null, coords: null, emitGeo: false, differentiators: empty(), neighbours: ['acme', 'van-zandt', 'alger'] },
  { slug: 'rockport', name: 'Rockport', county: 'Skagit', tier: 3, legacy: false, driveMinutes: null, coords: null, emitGeo: false, differentiators: empty(), neighbours: ['concrete'] },
  { slug: 'samish-island', name: 'Samish Island', county: 'Skagit', tier: 3, legacy: false, driveMinutes: null, coords: null, emitGeo: false, differentiators: { housing: [], pressures: ['direct marine salt exposure'], landmarks: ['Samish Bay', 'Padilla Bay'], water: null, regulatory: [] }, neighbours: ['edison', 'bow', 'bay-view'] },
  { slug: 'guemes-island', name: 'Guemes Island', county: 'Skagit', tier: 3, legacy: false, driveMinutes: null, coords: null, emitGeo: false, differentiators: { housing: [], pressures: ['salt spray on every elevation'], landmarks: ['Guemes Channel'], water: null, regulatory: ['Guemes Island ferry schedule governs crew scheduling — say so honestly on the page'] }, neighbours: ['anacortes'] },
];

/* ---------------------------------------------------------------------------
 * RESEARCHED 2026-09-18 — sourced facts for the nine towns whose location pages
 * were written that day. Merged into MARKETS below rather than edited into each
 * row, so existing facts stay exactly as they were and every added fact keeps
 * its source URL beside it. The raw research, with supporting quotes and the
 * caveats each writer worked to, is in .image-work/research/<slug>.json.
 * Neighbourhood names land in `landmarks` only where an official source named them.
 * ------------------------------------------------------------------------- */
const RESEARCHED: Record<string, { housing: string[]; pressures: string[]; landmarks: string[]; water: string[]; regulatory: string[]; sources: Source[] }> = {
  "ferndale": {
    housing: [
      "The census median year built for Ferndale's housing is 1998 (ACS 2024 5-year).",
      "Ferndale's housing is young: 1,690 of 6,200 units (about 27%) were built in 2010 or later (ACS 2024 5-year).",
      "Ferndale has 3,967 single-family detached homes, 411 mobile homes and 591 units in 20-49-unit buildings out of 6,200 housing units (ACS 2024 5-year).",
      "Interstate 5 was completed in 1970 and attracted new residents to Ferndale.",
    ],
    pressures: [
      "The Nooksack River flooded parts of Ferndale on November 16, 2021, including Main Street near the Pioneer Bridge and the I-5 on-ramp at Main Street (local news source).",
    ],
    landmarks: [
      "The Nooksack River runs through Ferndale.",
      "Pioneer Park holds 13 pioneer cabins moved there from various spots between 1940 and 1989.",
      "The Hovander Homestead house, a two-story home with Scandinavian design elements, was completed by 1903; John and Clara Tennant, namesakes of Tennant Lake, arrived in 1859.",
      "Centennial Riverwalk Park has three Lummi totem poles, including a story pole showing Lummi helping settlers around the Big Jam.",
    ],
    water: [
      "Ferndale's water comes from three groundwater wells: two in the Vashon-Olympia aquifer and one in the deeper Possession-Whidbey aquifer (2025 Water Quality Report).",
      "Ferndale treats its well water at the city plant, where it is softened and chlorinated; the plant has run full reverse osmosis since July 2025.",
      "Before December 2011 Ferndale bought Nooksack River water through Whatcom County PUD No. 1; it added reverse osmosis in October 2014 to cut the higher hardness of its well water.",
      "Ferndale's wells include the Douglas Well off Douglas Avenue and the Shop Well in the Public Works yard off Legoe Avenue.",
    ],
    regulatory: [
      "Whatcom County's 2025 Stormwater Management Program lists the Ferndale Urban Growth Area in its NPDES permit area, so WCC chapter 16.36 illicit-discharge rules apply in unincorporated parts of Ferndale's UGA.",
    ],
    sources: [
      { fact: "The census median year built for Ferndale's housing is 1998 (ACS 2024 5-year).", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25004,B25001,B25024,B25003&geo_ids=16000US5306505,16000US5323620" },
      { fact: "Ferndale's housing is young: 1,690 of 6,200 units (about 27%) were built in 2010 or later ", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25034,B25003&geo_ids=16000US5306505,16000US5323620,16000US5306190" },
      { fact: "Ferndale has 3,967 single-family detached homes, 411 mobile homes and 591 units in 20-49-u", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25004,B25001,B25024,B25003&geo_ids=16000US5306505,16000US5323620" },
      { fact: "Interstate 5 was completed in 1970 and attracted new residents to Ferndale.", url: "https://www.historylink.org/file/10806" },
      { fact: "The Nooksack River flooded parts of Ferndale on November 16, 2021, including Main Street n", url: "https://whatcom-news.com/scenes-around-flooded-ferndale-tuesday-nov-16_172061/" },
      { fact: "Ferndale's water comes from three groundwater wells: two in the Vashon-Olympia aquifer and", url: "https://www.cityofferndale.org/Archive/ViewFile/Item/107" },
      { fact: "Ferndale treats its well water at the city plant, where it is softened and chlorinated; th", url: "https://www.cityofferndale.org/Archive/ViewFile/Item/107" },
      { fact: "Before December 2011 Ferndale bought Nooksack River water through Whatcom County PUD No. 1", url: "https://www.cityofferndale.org/308/From-Well-to-Faucet" },
      { fact: "Ferndale's wells include the Douglas Well off Douglas Avenue and the Shop Well in the Publ", url: "https://www.cityofferndale.org/308/From-Well-to-Faucet" },
      { fact: "Whatcom County's 2025 Stormwater Management Program lists the Ferndale Urban Growth Area i", url: "https://www.whatcomcounty.us/DocumentCenter/View/97053/2025-Stormwater-Management-Program_final" },
      { fact: "The Nooksack River runs through Ferndale.", url: "https://www.historylink.org/file/10806" },
      { fact: "Pioneer Park holds 13 pioneer cabins moved there from various spots between 1940 and 1989.", url: "https://www.historylink.org/file/10806" },
      { fact: "The Hovander Homestead house, a two-story home with Scandinavian design elements, was comp", url: "https://www.historylink.org/file/10806" },
      { fact: "Centennial Riverwalk Park has three Lummi totem poles, including a story pole showing Lumm", url: "https://www.historylink.org/file/10806" },
    ],
  },
  "lynden": {
    housing: [
      "The median year built for Lynden's housing is 1997 (ACS 2020-2024 5-year estimate).",
      "Of Lynden's 6,210 housing units, about 2,773 (roughly 45%) were built in 2000 or later: 325 in 2020 or later, 1,307 in 2010-2019 and 1,141 in 2000-2009.",
      "Lynden still has an older core: 483 housing units date from 1939 or earlier, and another 410 from the 1950s.",
      "Detached single-family homes make up 4,082 of Lynden's 6,210 housing units (about 66%). There are also 347 attached single units and 146 mobile homes.",
      "About two-thirds of occupied homes in Lynden are owner-occupied: 3,984 of 6,018.",
      "HistoryLink reports that Lynden's population grew by nearly 60 percent in the 1990s. That growth matches the large 1990s and 2000s share of the city's housing stock.",
    ],
    pressures: [
      "The WRCC Clearbrook cooperative station (451484) records an average annual precipitation of 46.71 inches (period of record 1903-2016). The wettest months are November (6.17 in) and December (6.22 in), and July is the driest (1.47 in).",
      "The same Clearbrook station averages 16.0 inches of snowfall a year, most of it in December and January.",
      "Lynden's economy moved from logging to agriculture, especially dairy and berry farms, around the turn of the 20th century.",
      "According to the Whatcom Conservation District, Whatcom County grows nearly 85% of the nation's red raspberries, close to 48 million pounds a year.",
    ],
    landmarks: [
      "The city adopted a planning sub-area called Pepin Creek, with its own zoning chapter (LMC Chapter 19.18, Pepin Creek Sub-Area Zones), in Ordinance No. 1574 (2019).",
      "Most water entering Lynden's city storm drains ends up in Fishtrap Creek and then the Nooksack River.",
      "Berthusen Park at 8837 Berthusen Road began as a farm homesteaded in 1883 by Hans Berthusen. The couple's entire 236 acres were left to the city, and the park includes old-growth forest.",
      "Bender Family Recreational Park (Bender Fields) is a 56-acre ball-field complex. Lynden City Park sits on Fishtrap Creek among tall conifers.",
      "Front Street was remodeled with Dutch theming, including a windmill, in the 1980s. The Northwest Washington Fair took its current name in 1923.",
      "Lynden lies about 15 miles north of Bellingham and five miles south of the Canadian border.",
    ],
    water: [
      "Lynden's drinking water comes from the Nooksack River and is treated at the city's water treatment plant. The 2024 Water Quality Report publishes no hardness figure.",
    ],
    regulatory: [
      "Under LMC 13.24.160(A), soaps, detergents and ammonia (item 15) are illicit discharges to the city storm system, along with steam-cleaning wastes (item 14) and collected leaves or branches (item 24).",
      "LMC 13.24.160(C)(4) lists routine external building wash-down as a conditional discharge. It is allowed only when no detergents are used.",
      "The City of Lynden's stormwater page tells residents to clean up debris before and after pressure washing.",
    ],
    sources: [
      { fact: "The median year built for Lynden's housing is 1997 (ACS 2020-2024 5-year estimate).", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5340805,16000US5322745,16000US5368200" },
      { fact: "Of Lynden's 6,210 housing units, about 2,773 (roughly 45%) were built in 2000 or later: 32", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5340805,16000US5322745,16000US5368200" },
      { fact: "Lynden still has an older core: 483 housing units date from 1939 or earlier, and another 4", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5340805,16000US5322745,16000US5368200" },
      { fact: "Detached single-family homes make up 4,082 of Lynden's 6,210 housing units (about 66%). Th", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5340805,16000US5322745,16000US5368200" },
      { fact: "About two-thirds of occupied homes in Lynden are owner-occupied: 3,984 of 6,018.", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5340805,16000US5322745,16000US5368200" },
      { fact: "HistoryLink reports that Lynden's population grew by nearly 60 percent in the 1990s. That ", url: "https://www.historylink.org/File/8393" },
      { fact: "The city adopted a planning sub-area called Pepin Creek, with its own zoning chapter (LMC ", url: "https://mccmeetingspublic.blob.core.usgovcloudapi.net/lynden-meet-cce2bc3515874e578b892ac4cd6b4c37/ITEM-Attachment-001-f5b625347644400482c752901e9bbdd8.pdf" },
      { fact: "The WRCC Clearbrook cooperative station (451484) records an average annual precipitation o", url: "https://wrcc-archive.dri.edu/cgi-bin/cliRECtM.pl?wa1484" },
      { fact: "The same Clearbrook station averages 16.0 inches of snowfall a year, most of it in Decembe", url: "https://wrcc-archive.dri.edu/cgi-bin/cliRECtM.pl?wa1484" },
      { fact: "Lynden's economy moved from logging to agriculture, especially dairy and berry farms, arou", url: "https://www.historylink.org/File/8393" },
      { fact: "According to the Whatcom Conservation District, Whatcom County grows nearly 85% of the nat", url: "https://www.whatcomcd.org/berry-farm" },
      { fact: "Most water entering Lynden's city storm drains ends up in Fishtrap Creek and then the Nook", url: "https://lyndenwa.org/248/Stormwater-Management" },
      { fact: "Berthusen Park at 8837 Berthusen Road began as a farm homesteaded in 1883 by Hans Berthuse", url: "https://www.lyndenwa.org/Facilities/Facility/Details/Berthusen-Park-4" },
      { fact: "Bender Family Recreational Park (Bender Fields) is a 56-acre ball-field complex. Lynden Ci", url: "https://www.lyndenwa.org/393/Lyndens-Parks" },
      { fact: "Front Street was remodeled with Dutch theming, including a windmill, in the 1980s. The Nor", url: "https://www.historylink.org/File/8393" },
      { fact: "Lynden lies about 15 miles north of Bellingham and five miles south of the Canadian border", url: "https://www.historylink.org/File/8393" },
      { fact: "Lynden's drinking water comes from the Nooksack River and is treated at the city's water t", url: "https://www.lyndenwa.org/ArchiveCenter/ViewFile/Item/133" },
      { fact: "Under LMC 13.24.160(A), soaps, detergents and ammonia (item 15) are illicit discharges to ", url: "https://library.municode.com/wa/lynden/codes/code_of_ordinances?nodeId=TIT13PUUT_CH13.24STMASY" },
      { fact: "LMC 13.24.160(C)(4) lists routine external building wash-down as a conditional discharge. ", url: "https://library.municode.com/wa/lynden/codes/code_of_ordinances?nodeId=TIT13PUUT_CH13.24STMASY" },
      { fact: "The City of Lynden's stormwater page tells residents to clean up debris before and after p", url: "https://lyndenwa.org/248/Stormwater-Management" },
    ],
  },
  "blaine": {
    housing: [
      "The census median year built for Blaine's housing stock is 1994 (ACS 2024 5-year).",
      "About one in seven Blaine homes predates 1940: 387 of 2,793 housing units were built in 1939 or earlier (ACS 2024 5-year).",
      "Single-family detached houses make up 1,997 of Blaine's 2,793 housing units (ACS 2024 5-year).",
      "Central Blaine, the original town site, has a number of older homes and businesses built around the turn of the 20th century (City comprehensive plan draft, 2015).",
    ],
    pressures: [
      "Blaine's long-term (1893-2016) weather station averages 40.60 inches of precipitation a year.",
      "November, December and January are Blaine's wettest months, each averaging about 5.6 to 5.85 inches of precipitation, while July averages 1.15 inches.",
      "Blaine's average annual maximum temperature is 57.7°F and average minimum is 40.9°F, a cool, damp climate.",
      "Drayton Harbor was downgraded for shellfish harvest because of fecal bacteria pollution, leading to a Shellfish Protection District in 1995; the downgrade expanded to the whole harbor in 1999.",
    ],
    landmarks: [
      "The Peace Arch, a 67-foot concrete and steel structure, was dedicated by Sam Hill on September 6, 1921.",
      "Drayton Harbor was named by Charles Wilkes for expedition artist Joseph Drayton.",
      "Semiahmoo Spit held the Alaska Packers Association cannery; after it closed in 1981 the land became Semiahmoo Resort, which opened in 1987.",
      "Blaine Harbor (Port of Bellingham, 235 Marine Drive) has 629 boat slips protected by a heavy rock breakwater.",
      "Peace Portal Drive (formerly Washington Avenue) and Marine Drive are among Blaine's historic streets; early settlers also clustered around California and Dakota creeks.",
      "The City of Blaine's comprehensive plan divides the city into three planning areas: Central Blaine, West Blaine (Semiahmoo), and East Blaine (draft Land Use Element, January 2015).",
      "East Blaine is a 1,182-acre area annexed in February 1996, characterised by low-density single-family homes; the Resort Semiahmoo site in West Blaine was annexed in 1974.",
    ],
    water: [
      "Blaine's drinking water comes from several deep wells in the City of Blaine's well field and is treated with a small amount of chlorine.",
      "The City of Blaine reports its water hardness is typically 50-95 mg/L (moderately hard) and may peak as high as 120 mg/L seasonally (2020 Consumer Confidence Report).",
      "Blaine's water pH averages about 8.0 (range 7.8-8.2), and the city notes iron and manganese can show up as reddish, rusty deposits or surface film.",
    ],
    regulatory: [
      "Blaine Municipal Code 13.01.040 (Illicit discharges) prohibits any discharge to the public drainage system not in compliance with city public works standards.",
      "BMC 13.01.020 states the storm water chapter exists partly to preserve the suitability of local waters for contact recreation and shellfish and fish habitat.",
      "Blaine's storm water utility bills by impervious surface (roofs, driveways, patios), with one equivalent unit equal to a single-family residence or 4,200 sq ft of impervious area (BMC 13.01.015).",
    ],
    sources: [
      { fact: "The census median year built for Blaine's housing stock is 1994 (ACS 2024 5-year).", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25004,B25001,B25024,B25003&geo_ids=16000US5306505,16000US5323620" },
      { fact: "About one in seven Blaine homes predates 1940: 387 of 2,793 housing units were built in 19", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25034,B25003&geo_ids=16000US5306505,16000US5323620,16000US5306190" },
      { fact: "Single-family detached houses make up 1,997 of Blaine's 2,793 housing units (ACS 2024 5-ye", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25004,B25001,B25024,B25003&geo_ids=16000US5306505,16000US5323620" },
      { fact: "Central Blaine, the original town site, has a number of older homes and businesses built a", url: "https://ci.blaine.wa.us/DocumentCenter/View/11813/DRAFT-Land-Use-Element" },
      { fact: "Blaine's long-term (1893-2016) weather station averages 40.60 inches of precipitation a ye", url: "https://wrcc-archive.dri.edu/cgi-bin/cliRECtM.pl?wa0729" },
      { fact: "November, December and January are Blaine's wettest months, each averaging about 5.6 to 5.", url: "https://wrcc-archive.dri.edu/cgi-bin/cliRECtM.pl?wa0729" },
      { fact: "Blaine's average annual maximum temperature is 57.7°F and average minimum is 40.9°F, a coo", url: "https://wrcc-archive.dri.edu/cgi-bin/cliRECtM.pl?wa0729" },
      { fact: "Drayton Harbor was downgraded for shellfish harvest because of fecal bacteria pollution, l", url: "https://www.whatcomcounty.us/1101/Shellfish-Protection-Districts" },
      { fact: "Blaine's drinking water comes from several deep wells in the City of Blaine's well field a", url: "https://ci.blaine.wa.us/DocumentCenter/View/7597/City-of-Blaine-Water-Quality-Report-2020" },
      { fact: "The City of Blaine reports its water hardness is typically 50-95 mg/L (moderately hard) an", url: "https://ci.blaine.wa.us/DocumentCenter/View/7597/City-of-Blaine-Water-Quality-Report-2020" },
      { fact: "Blaine's water pH averages about 8.0 (range 7.8-8.2), and the city notes iron and manganes", url: "https://ci.blaine.wa.us/DocumentCenter/View/7597/City-of-Blaine-Water-Quality-Report-2020" },
      { fact: "Blaine Municipal Code 13.01.040 (Illicit discharges) prohibits any discharge to the public", url: "https://ecode360.com/46226189" },
      { fact: "BMC 13.01.020 states the storm water chapter exists partly to preserve the suitability of ", url: "https://ecode360.com/46226189" },
      { fact: "Blaine's storm water utility bills by impervious surface (roofs, driveways, patios), with ", url: "https://ecode360.com/46226189" },
      { fact: "The Peace Arch, a 67-foot concrete and steel structure, was dedicated by Sam Hill on Septe", url: "https://www.historylink.org/File/9148" },
      { fact: "Drayton Harbor was named by Charles Wilkes for expedition artist Joseph Drayton.", url: "https://www.historylink.org/File/9148" },
      { fact: "Semiahmoo Spit held the Alaska Packers Association cannery; after it closed in 1981 the la", url: "https://www.historylink.org/File/9148" },
      { fact: "Blaine Harbor (Port of Bellingham, 235 Marine Drive) has 629 boat slips protected by a hea", url: "https://portofbellingham.com/197/About-Blaine-Harbor" },
      { fact: "Peace Portal Drive (formerly Washington Avenue) and Marine Drive are among Blaine's histor", url: "https://www.historylink.org/File/9148" },
      { fact: "The City of Blaine's comprehensive plan divides the city into three planning areas: Centra", url: "https://ci.blaine.wa.us/DocumentCenter/View/11813/DRAFT-Land-Use-Element" },
      { fact: "East Blaine is a 1,182-acre area annexed in February 1996, characterised by low-density si", url: "https://ci.blaine.wa.us/DocumentCenter/View/11813/DRAFT-Land-Use-Element" },
    ],
  },
  "birch-bay": {
    housing: [
      "The census median year built for Birch Bay CDP housing is 1990 (ACS 2024 5-year).",
      "1,136 of Birch Bay's 5,974 housing units are vacant because they are held for seasonal, recreational or occasional use, roughly one in five homes (ACS 2024 5-year).",
      "Birch Bay has 875 mobile homes alongside 4,363 single-family detached units out of 5,974 total housing units (ACS 2024 5-year).",
      "During the 1970s and 1980s most of Birch Bay's seasonal property owners were Canadian.",
      "Birch Bay Village, a planned community, broke ground in 1966; in the 1920s Birch Bay Resort consisted of 12 small cabins.",
      "Birch Bay's population more than tripled from 2,656 in 1990 to 8,413 in the 2010 census.",
    ],
    pressures: [
      "On January 13, 2021 a storm combining high wind and high tide drove seawater and large driftwood logs at Birch Bay Drive; areas near Birch Bay State Park without the berm had water on the roadway.",
      "Whatcom County built a 1.58-mile berm along Birch Bay Drive, from Cedar Avenue to the mouth of Terrell Creek, to protect the road from storm damage and beach erosion (completed August 2021).",
      "Birch Bay has more than a mile and a half of saltwater shoreline.",
    ],
    landmarks: [
      "Birch Bay State Park opened in 1954 with 194 acres; Terrell Creek runs through it, and Terrell Creek Marsh lies at its south end.",
      "Birch Bay is about 16 miles northwest of Bellingham.",
      "The area around the mouth of Terrell Creek was closed to shellfish harvesting because of high fecal coliform levels, and Birch Bay went on Washington's threatened shellfish areas list in 2003.",
      "Birch Bay Village is a named planned community in Birch Bay (ground broken 1966).",
    ],
    water: [
      "Birch Bay Water & Sewer District serves about 7,700 customer connections, and its water comes from City of Blaine groundwater under a long-term supply agreement.",
      "BBWSD stores and distributes the water through three reservoirs, booster pump stations and roughly 70 miles of water mains.",
    ],
    regulatory: [
      "Whatcom County Code chapter 16.36 (Illicit Discharge Detection and Elimination) applies to unincorporated areas inside Ecology's Phase II municipal stormwater permit area (WCC 16.36.030), and the county's permit area includes the Birch Bay Urban Growth Area.",
      "WCC 16.36.050(C) prohibits discharging any pollutant to the county's storm sewer system (MS4) or to surface and ground waters.",
      "WCC 16.36.050(D)(4) lists routine external building wash down that does not use detergents as a conditional discharge that is not illegal, unless the public works director finds it is causing pollution.",
      "The Birch Bay Watershed and Aquatic Resources Management (BBWARM) District was set up on March 27, 2007 as a subzone of the Whatcom County Flood Control Zone District to manage stormwater in the Birch Bay watershed.",
      "Whatcom County's 2025 Stormwater Management Program lists the Birch Bay Urban Growth Area in its NPDES permit area.",
    ],
    sources: [
      { fact: "The census median year built for Birch Bay CDP housing is 1990 (ACS 2024 5-year).", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25004,B25001,B25024&geo_ids=16000US5306190" },
      { fact: "1,136 of Birch Bay's 5,974 housing units are vacant because they are held for seasonal, re", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25004,B25001,B25024&geo_ids=16000US5306190" },
      { fact: "Birch Bay has 875 mobile homes alongside 4,363 single-family detached units out of 5,974 t", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25004,B25001,B25024&geo_ids=16000US5306190" },
      { fact: "During the 1970s and 1980s most of Birch Bay's seasonal property owners were Canadian.", url: "https://www.historylink.org/File/10995" },
      { fact: "Birch Bay Village, a planned community, broke ground in 1966; in the 1920s Birch Bay Resor", url: "https://www.historylink.org/File/10995" },
      { fact: "Birch Bay's population more than tripled from 2,656 in 1990 to 8,413 in the 2010 census.", url: "https://www.historylink.org/File/10995" },
      { fact: "On January 13, 2021 a storm combining high wind and high tide drove seawater and large dri", url: "https://www.whatcomcounty.us/CivicAlerts.aspx?AID=2371" },
      { fact: "Whatcom County built a 1.58-mile berm along Birch Bay Drive, from Cedar Avenue to the mout", url: "https://www.whatcomcounty.us/2560/Birch-Bay-Dr-Project-Summary" },
      { fact: "Birch Bay has more than a mile and a half of saltwater shoreline.", url: "https://www.historylink.org/File/10995" },
      { fact: "Birch Bay Water & Sewer District serves about 7,700 customer connections, and its water co", url: "https://bbwsd.com/water/" },
      { fact: "BBWSD stores and distributes the water through three reservoirs, booster pump stations and", url: "https://bbwsd.com/water/" },
      { fact: "Whatcom County Code chapter 16.36 (Illicit Discharge Detection and Elimination) applies to", url: "https://ecode360.com/47933030" },
      { fact: "WCC 16.36.050(C) prohibits discharging any pollutant to the county's storm sewer system (M", url: "https://ecode360.com/47933030" },
      { fact: "WCC 16.36.050(D)(4) lists routine external building wash down that does not use detergents", url: "https://ecode360.com/47933030" },
      { fact: "The Birch Bay Watershed and Aquatic Resources Management (BBWARM) District was set up on M", url: "https://www.bbwarm.whatcomcounty.org/about/history" },
      { fact: "Whatcom County's 2025 Stormwater Management Program lists the Birch Bay Urban Growth Area ", url: "https://www.whatcomcounty.us/DocumentCenter/View/97053/2025-Stormwater-Management-Program_final" },
      { fact: "Birch Bay State Park opened in 1954 with 194 acres; Terrell Creek runs through it, and Ter", url: "https://www.historylink.org/File/10995" },
      { fact: "Birch Bay is about 16 miles northwest of Bellingham.", url: "https://www.historylink.org/File/10995" },
      { fact: "The area around the mouth of Terrell Creek was closed to shellfish harvesting because of h", url: "https://www.bbwarm.whatcomcounty.org/programs/water-quality-2/water-quality-frequently-asked-questions" },
      { fact: "Birch Bay Village is a named planned community in Birch Bay (ground broken 1966).", url: "https://www.historylink.org/File/10995" },
    ],
  },
  "burlington": {
    housing: [
      "Median year built for Burlington's housing stock is 1993 (ACS 2020-2024 5-year, table B25035).",
      "Only about half of Burlington's 4,246 housing units are single-family detached homes (2,137 units, about 50%), per ACS 2020-2024 table B25024.",
      "Renters outnumber owners in Burlington: 2,178 of 3,925 occupied homes (about 55%) are renter-occupied (ACS 2020-2024 table B25003).",
      "About 36% of Burlington's housing units (1,517 of 4,246) were built in 2000 or later (ACS 2020-2024 table B25034).",
      "Extensive commercial development along Burlington Boulevard followed the opening of the 450,000-square-foot Cascade Mall on 80 acres in November 1989.",
    ],
    pressures: [
      "The Skagit River forms Burlington's southern and southeastern boundaries, and the city saw severe floods in 1909, 1917, 1921, 1990 and 1995.",
      "Skagit County farmers work approximately 90,000 acres and grow over 90 different crops.",
      "The Skagit River turns to the southwest at Burlington as it crosses a floodplain of about 90,000 acres, roughly 11 miles wide and 19 miles long.",
      "The nearest long-term WRCC station, Mt Vernon 3 WNW, averaged 32.58 inches of precipitation a year over its period of record (1956-2005); November was wettest at 4.48 inches and July driest at 1.16 inches.",
    ],
    landmarks: [
      "Burlington Hill is a 450-foot hill in the northern part of the city topped by a cross mounted by the local fire department.",
      "Skagit River Park at 1100 South Skagit Street has 80 acres of playfields, eight baseball diamonds, and riverbank fishing access on the Skagit River.",
      "The Tammi Wilson Memorial Trail (formerly the Gages Slough Trail) runs beside Gages Slough, with entrances at Burlington Boulevard and Cascade Mall Drive and on South Goldenrod Road west of I-5.",
      "Burlington was nicknamed 'the Hub City' because the Great Northern and Seattle & Northern railroad lines crossed there in 1890.",
    ],
    water: [
      "Burlington is served by Skagit PUD's Judy Reservoir system; in 1939 the PUD bought the water systems serving Burlington, Mount Vernon and Sedro-Woolley from the Peoples' Water and Gas Company.",
      "Judy Reservoir is fed by four Cultus Mountain streams (Gilligan, Salmon, Turner and Mundt creeks), with a diversion pump station on the Skagit River as a supplemental source.",
      "Judy Reservoir's dams were raised in 1999 to a spill elevation of 465 feet above sea level and a capacity of 1,450 million gallons.",
      "Burlington's sewer billing is based on water usage figures provided to the city by Skagit PUD.",
    ],
    regulatory: [
      "Burlington Municipal Code 14.05.070(C) lists 'Soaps, detergents or ammonia' and 'Steam cleaning wastes' among illicit discharges to the public drainage system.",
      "BMC 14.05.070(E)(4) conditionally allows routine external building wash-down only if it does not use detergents.",
      "BMC 14.05.070(B) prohibits discharging into the MS4 any pollutants or waters containing pollutants other than storm water.",
      "Most of Burlington's stormwater runoff flows into Gages Slough and is eventually pumped into the Skagit River; cleaning up Gages Slough is rated a very high priority in the city's plans.",
    ],
    sources: [
      { fact: "Median year built for Burlington's housing stock is 1993 (ACS 2020-2024 5-year, table B250", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5308920,16000US5301990,16000US5347560" },
      { fact: "Only about half of Burlington's 4,246 housing units are single-family detached homes (2,13", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5308920,16000US5301990,16000US5347560" },
      { fact: "Renters outnumber owners in Burlington: 2,178 of 3,925 occupied homes (about 55%) are rent", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5308920,16000US5301990,16000US5347560" },
      { fact: "About 36% of Burlington's housing units (1,517 of 4,246) were built in 2000 or later (ACS ", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5308920,16000US5301990,16000US5347560" },
      { fact: "Extensive commercial development along Burlington Boulevard followed the opening of the 45", url: "https://www.historylink.org/File/20786" },
      { fact: "The Skagit River forms Burlington's southern and southeastern boundaries, and the city saw", url: "https://www.historylink.org/File/20786" },
      { fact: "Skagit County farmers work approximately 90,000 acres and grow over 90 different crops.", url: "https://extension.wsu.edu/skagit/agriculture/" },
      { fact: "The Skagit River turns to the southwest at Burlington as it crosses a floodplain of about ", url: "https://www.historylink.org/File/21283" },
      { fact: "The nearest long-term WRCC station, Mt Vernon 3 WNW, averaged 32.58 inches of precipitatio", url: "https://wrcc-archive.dri.edu/cgi-bin/cliMONtpre.pl?wa5678" },
      { fact: "Burlington Hill is a 450-foot hill in the northern part of the city topped by a cross moun", url: "https://www.historylink.org/File/20786" },
      { fact: "Skagit River Park at 1100 South Skagit Street has 80 acres of playfields, eight baseball d", url: "https://burlingtonwa.gov/facilities/facility/details/skagit-river-park-9" },
      { fact: "The Tammi Wilson Memorial Trail (formerly the Gages Slough Trail) runs beside Gages Slough", url: "https://burlingtonwa.gov/facilities/facility/details/Tammi-Wilson-Memorial-Trail-Gages-Slough-26" },
      { fact: "Burlington was nicknamed 'the Hub City' because the Great Northern and Seattle & Northern ", url: "https://www.historylink.org/File/20786" },
      { fact: "Burlington is served by Skagit PUD's Judy Reservoir system; in 1939 the PUD bought the wat", url: "https://www.skagitpud.org/about-us/water-system" },
      { fact: "Judy Reservoir is fed by four Cultus Mountain streams (Gilligan, Salmon, Turner and Mundt ", url: "https://www.skagitpud.org/about-us/water-system/watershed" },
      { fact: "Judy Reservoir's dams were raised in 1999 to a spill elevation of 465 feet above sea level", url: "https://www.skagitpud.org/about-us/water-system/watershed" },
      { fact: "Burlington's sewer billing is based on water usage figures provided to the city by Skagit ", url: "https://burlingtonwa.gov/179/Utility-Billing" },
      { fact: "Burlington Municipal Code 14.05.070(C) lists 'Soaps, detergents or ammonia' and 'Steam cle", url: "https://burlingtonwa.gov/DocumentCenter/View/5447/3_Title14_Final_Adopted_5-15-2023_Clean" },
      { fact: "BMC 14.05.070(E)(4) conditionally allows routine external building wash-down only if it do", url: "https://burlingtonwa.gov/DocumentCenter/View/5447/3_Title14_Final_Adopted_5-15-2023_Clean" },
      { fact: "BMC 14.05.070(B) prohibits discharging into the MS4 any pollutants or waters containing po", url: "https://burlingtonwa.gov/DocumentCenter/View/5447/3_Title14_Final_Adopted_5-15-2023_Clean" },
      { fact: "Most of Burlington's stormwater runoff flows into Gages Slough and is eventually pumped in", url: "https://burlingtonwa.gov/DocumentCenter/View/6045/2024-Stormwater-Management-Program-PDF" },
    ],
  },
  "mount-vernon": {
    housing: [
      "Median year built for Mount Vernon's housing stock is 1989 (ACS 2020-2024 5-year, table B25035).",
      "About 61% of Mount Vernon's 13,623 housing units are single-family detached (8,260 units), per ACS 2020-2024 table B25024.",
      "Mount Vernon has 833 mobile homes (about 6% of housing units), per ACS 2020-2024 table B25024.",
      "1,309 of Mount Vernon's housing units (about 10%) were built in 1939 or earlier (ACS 2020-2024 table B25034).",
      "About 60% of Mount Vernon's occupied homes are owner-occupied (8,052 of 13,363), per ACS 2020-2024 table B25003.",
    ],
    pressures: [
      "The Mt Vernon 3 WNW weather station (WRCC) averaged 32.58 inches of precipitation a year over its period of record (1956-2005); November was wettest at 4.48 inches and July driest at 1.16 inches.",
      "Downtown Mount Vernon lies within the Skagit River delta, and the Skagit has flooded numerous times since 1897.",
      "In December 2025 an atmospheric river sent the Skagit River to a record crest of 37.73 feet in Mount Vernon.",
      "The Skagit River makes a sharp bend called the Avon Turn at Mount Vernon, and about 1,000 acres of tulips and daffodils are grown in the valley each year.",
      "The city's parks plan lists sizable flood-prone areas covering most of downtown and the west side, including the Skagit River, Kulshan Creek and Carpenter Creek corridors and Britt Slough.",
    ],
    landmarks: [
      "Mount Vernon's downtown floodwall was built in phases: 2010 (Division Street Bridge north to Lions Park), 2016 (1,650 feet of floodwall and a 24-ft riverwalk), and 2018 (1.4 miles of floodwall and earthen levee).",
      "Little Mountain Park at 3000 Little Mountain Road is 522 acres, with a 1.5-mile paved road to the summit and views of the Skagit Valley, San Juan Islands, Olympics and Mount Baker.",
      "Hillcrest Park at 1717 South 13th Street is a 30.8-acre community park that includes 10.1 acres of woodland conservancy.",
      "The Lincoln Theatre opened in 1926 as a vaudeville and silent movie house. Mount Vernon was named in 1877 after George Washington's Virginia home and became the Skagit County seat in 1884.",
      "Local waterways in Mount Vernon's urban growth area include Kulshan Creek, Maddox Creek, Carpenter Creek, Nookachamps Creek and Britt Slough.",
      "City documents name the historic downtown district and the Eaglemont community development (which contains Beaver Pond).",
    ],
    water: [
      "Mount Vernon is served by Skagit PUD's Judy Reservoir system; in 1939 the PUD bought the water systems serving Burlington, Mount Vernon and Sedro-Woolley from the Peoples' Water and Gas Company.",
      "Judy Reservoir is fed by four Cultus Mountain streams (Gilligan, Salmon, Turner and Mundt creeks), with a diversion pump station on the Skagit River as a supplemental source.",
      "Judy Reservoir's dams were raised in 1999 to a spill elevation of 465 feet above sea level and a capacity of 1,450 million gallons.",
      "The City of Anacortes' regional water treatment plant sits on the east bank of the Skagit River near Mount Vernon, at 14489 River Bend Road.",
    ],
    regulatory: [
      "Mount Vernon Municipal Code 13.33.080 prohibits all illicit discharges to the public drainage system, including soap, detergent, commercial and household cleaning materials and steam-cleaning waste.",
      "MVMC 13.33.080(E) exempts street and sidewalk wash water and routine external building wash-down that does not use detergents.",
      "MVMC 13.33.150 makes it a violation to let soaps, detergents or washing wastes enter any private drainage system or the public drainage system.",
    ],
    sources: [
      { fact: "Median year built for Mount Vernon's housing stock is 1989 (ACS 2020-2024 5-year, table B2", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5308920,16000US5301990,16000US5347560" },
      { fact: "About 61% of Mount Vernon's 13,623 housing units are single-family detached (8,260 units),", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5308920,16000US5301990,16000US5347560" },
      { fact: "Mount Vernon has 833 mobile homes (about 6% of housing units), per ACS 2020-2024 table B25", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5308920,16000US5301990,16000US5347560" },
      { fact: "1,309 of Mount Vernon's housing units (about 10%) were built in 1939 or earlier (ACS 2020-", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5308920,16000US5301990,16000US5347560" },
      { fact: "About 60% of Mount Vernon's occupied homes are owner-occupied (8,052 of 13,363), per ACS 2", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5308920,16000US5301990,16000US5347560" },
      { fact: "The Mt Vernon 3 WNW weather station (WRCC) averaged 32.58 inches of precipitation a year o", url: "https://wrcc-archive.dri.edu/cgi-bin/cliMONtpre.pl?wa5678" },
      { fact: "Downtown Mount Vernon lies within the Skagit River delta, and the Skagit has flooded numer", url: "https://mountvernonwa.gov/DocumentCenter/View/10522/Mount_Vernon_Floodwall_Infographic_Margins" },
      { fact: "In December 2025 an atmospheric river sent the Skagit River to a record crest of 37.73 fee", url: "https://www.anacorteswa.gov/Archive.aspx?ADID=855" },
      { fact: "The Skagit River makes a sharp bend called the Avon Turn at Mount Vernon, and about 1,000 ", url: "https://www.historylink.org/File/21283" },
      { fact: "The city's parks plan lists sizable flood-prone areas covering most of downtown and the we", url: "https://www.mountvernonwa.gov/DocumentCenter/View/16005/PROS-Plan-Appendices" },
      { fact: "Mount Vernon's downtown floodwall was built in phases: 2010 (Division Street Bridge north ", url: "https://mountvernonwa.gov/DocumentCenter/View/10522/Mount_Vernon_Floodwall_Infographic_Margins" },
      { fact: "Little Mountain Park at 3000 Little Mountain Road is 522 acres, with a 1.5-mile paved road", url: "https://mountvernonwa.gov/facilities/facility/details/Little-Mountain-Park-15" },
      { fact: "Hillcrest Park at 1717 South 13th Street is a 30.8-acre community park that includes 10.1 ", url: "https://www.mountvernonwa.gov/DocumentCenter/View/16005/PROS-Plan-Appendices" },
      { fact: "The Lincoln Theatre opened in 1926 as a vaudeville and silent movie house. Mount Vernon wa", url: "https://www.historylink.org/file/9537" },
      { fact: "Local waterways in Mount Vernon's urban growth area include Kulshan Creek, Maddox Creek, C", url: "https://www.mountvernonwa.gov/DocumentCenter/View/16005/PROS-Plan-Appendices" },
      { fact: "Mount Vernon is served by Skagit PUD's Judy Reservoir system; in 1939 the PUD bought the w", url: "https://www.skagitpud.org/about-us/water-system" },
      { fact: "Judy Reservoir is fed by four Cultus Mountain streams (Gilligan, Salmon, Turner and Mundt ", url: "https://www.skagitpud.org/about-us/water-system/watershed" },
      { fact: "Judy Reservoir's dams were raised in 1999 to a spill elevation of 465 feet above sea level", url: "https://www.skagitpud.org/about-us/water-system/watershed" },
      { fact: "The City of Anacortes' regional water treatment plant sits on the east bank of the Skagit ", url: "https://www.anacorteswa.gov/494/Water-Treatment-System" },
      { fact: "Mount Vernon Municipal Code 13.33.080 prohibits all illicit discharges to the public drain", url: "https://ecode360.com/50290907" },
      { fact: "MVMC 13.33.080(E) exempts street and sidewalk wash water and routine external building was", url: "https://ecode360.com/50290907" },
      { fact: "MVMC 13.33.150 makes it a violation to let soaps, detergents or washing wastes enter any p", url: "https://ecode360.com/50290907" },
      { fact: "City documents name the historic downtown district and the Eaglemont community development", url: "https://www.mountvernonwa.gov/DocumentCenter/View/16005/PROS-Plan-Appendices" },
    ],
  },
  "anacortes": {
    housing: [
      "Median year built for Anacortes' housing stock is 1989 (ACS 2020-2024 5-year, table B25035).",
      "About 77% of Anacortes' 8,801 housing units are single-family detached (6,768 units), per ACS 2020-2024 table B25024.",
      "1,155 of Anacortes' housing units (about 13%) were built in 1939 or earlier (ACS 2020-2024 table B25034).",
      "About 70% of Anacortes' occupied homes are owner-occupied (5,667 of 8,109), per ACS 2020-2024 table B25003.",
      "The Anacortes Register of Historic Places includes the Wilson Hotel (804 Commercial Avenue), the Wasserman-Lowman House (1502 8th Street), the Judd House (1719 9th Street), the Great Northern Depot and Causland Park.",
    ],
    pressures: [
      "Anacortes is surrounded by water on three sides (Burrows Bay to the west, Guemes Channel to the north and Fidalgo Bay to the east) and has over 27 miles of shoreline.",
      "The WRCC Anacortes station averaged 26.70 inches of precipitation a year over its period of record (1892-2013), noticeably less than the 32.58 inches at the Mt Vernon 3 WNW station; November (3.84 in) and December (3.80 in) were the wettest months.",
      "The Anacortes Community Forest Lands cover more than 2,950 acres inside the city and have over 50 miles of trails.",
      "The Shell (1953) and Texaco (1957) oil refineries were built on March Point.",
    ],
    landmarks: [
      "Anacortes sits on the northern end of Fidalgo Island and is separated from the mainland by the Swinomish Channel.",
      "Anacortes is named with a stylized form of Anne Curtis, the maiden name of town promoter Amos Bowman's wife. The town incorporated in 1891.",
      "The city's drainage flows to five water bodies: Guemes Channel, Burrows Bay, Fidalgo Bay, Padilla Bay and Similk Bay.",
      "The city's environment background document names Skyline as an area (much of Skyline's shoreline is classified 'Modified'), along with Skyline Marina, Ship Harbor, Cap Sante Marina and March Point.",
    ],
    water: [
      "Anacortes draws its drinking water from the Skagit River and treats it at a city-owned plant on the east bank of the river near Mount Vernon. The plant has a capacity of 43 million gallons per day and serves an estimated 56,000 customers.",
      "Anacortes' water tests in the 0-60 mg/L hardness range (typically around 30 mg/L), which the 2025 Water Quality Report classifies as soft.",
      "Treated water travels 14 miles by transmission line to the Blue Heron Reservoir and booster station in Anacortes. The regional system also supplies Oak Harbor (NAS Whidbey Island), La Conner, the Swinomish Tribal Community, Skagit PUD, and the Marathon and HF Sinclair refineries.",
      "Anacortes bought its water system from the Washington Power, Light and Water Company on April 23, 1919.",
    ],
    regulatory: [
      "Anacortes Municipal Code 18.30.050 states no person may discharge into the stormwater system any materials other than stormwater. Listed illicit discharges include soap, detergent, commercial and household cleaning materials and steam-cleaning waste.",
      "AMC 18.30.050 conditionally allows street and sidewalk wash water and routine external building wash-down that does not use detergents.",
      "Chapter 18.30 AMC was amended by Ordinance 4023 (2022) to put in place a Source Control Program under the city's Phase II municipal stormwater permit.",
    ],
    sources: [
      { fact: "Median year built for Anacortes' housing stock is 1989 (ACS 2020-2024 5-year, table B25035", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5308920,16000US5301990,16000US5347560" },
      { fact: "About 77% of Anacortes' 8,801 housing units are single-family detached (6,768 units), per ", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5308920,16000US5301990,16000US5347560" },
      { fact: "1,155 of Anacortes' housing units (about 13%) were built in 1939 or earlier (ACS 2020-2024", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5308920,16000US5301990,16000US5347560" },
      { fact: "About 70% of Anacortes' occupied homes are owner-occupied (5,667 of 8,109), per ACS 2020-2", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5308920,16000US5301990,16000US5347560" },
      { fact: "The Anacortes Register of Historic Places includes the Wilson Hotel (804 Commercial Avenue", url: "https://www.anacorteswa.gov/1125/Anacortes-Register-of-Historic-Places" },
      { fact: "Anacortes is surrounded by water on three sides (Burrows Bay to the west, Guemes Channel t", url: "https://www.anacorteswa.gov/DocumentCenter/View/719/Environment-Background-PDF" },
      { fact: "The WRCC Anacortes station averaged 26.70 inches of precipitation a year over its period o", url: "https://wrcc-archive.dri.edu/cgi-bin/cliMONtpre.pl?wa0176" },
      { fact: "The Anacortes Community Forest Lands cover more than 2,950 acres inside the city and have ", url: "https://www.anacorteswa.gov/517/Community-Forest-Lands-ACFL" },
      { fact: "The Shell (1953) and Texaco (1957) oil refineries were built on March Point.", url: "https://www.historylink.org/file/9870" },
      { fact: "Anacortes sits on the northern end of Fidalgo Island and is separated from the mainland by", url: "https://www.historylink.org/file/9870" },
      { fact: "Anacortes is named with a stylized form of Anne Curtis, the maiden name of town promoter A", url: "https://www.historylink.org/file/9870" },
      { fact: "The city's drainage flows to five water bodies: Guemes Channel, Burrows Bay, Fidalgo Bay, ", url: "https://www.anacorteswa.gov/DocumentCenter/View/719/Environment-Background-PDF" },
      { fact: "Anacortes draws its drinking water from the Skagit River and treats it at a city-owned pla", url: "https://www.anacorteswa.gov/Archive.aspx?ADID=855" },
      { fact: "Anacortes' water tests in the 0-60 mg/L hardness range (typically around 30 mg/L), which t", url: "https://www.anacorteswa.gov/Archive.aspx?ADID=855" },
      { fact: "Treated water travels 14 miles by transmission line to the Blue Heron Reservoir and booste", url: "https://www.anacorteswa.gov/Archive.aspx?ADID=855" },
      { fact: "Anacortes bought its water system from the Washington Power, Light and Water Company on Ap", url: "https://www.anacorteswa.gov/494/Water-Treatment-System" },
      { fact: "Anacortes Municipal Code 18.30.050 states no person may discharge into the stormwater syst", url: "https://anacortes.municipal.codes/AMC/18.30.050" },
      { fact: "AMC 18.30.050 conditionally allows street and sidewalk wash water and routine external bui", url: "https://anacortes.municipal.codes/AMC/18.30.050" },
      { fact: "Chapter 18.30 AMC was amended by Ordinance 4023 (2022) to put in place a Source Control Pr", url: "https://www.anacorteswa.gov/DocumentCenter/View/22368/updated-ordinance-4023" },
      { fact: "The city's environment background document names Skyline as an area (much of Skyline's sho", url: "https://www.anacorteswa.gov/DocumentCenter/View/719/Environment-Background-PDF" },
    ],
  },
  "everson": {
    housing: [
      "The median year built for Everson's housing is 1987 (ACS 2020-2024 5-year estimate).",
      "The 1970s and 1980s were Everson's biggest building decades, with 237 units built in 1970-1979 and 219 in 1980-1989, out of 1,074 total.",
      "Everson has 105 housing units built in 1939 or earlier, about 10% of its stock.",
      "Building picked up again recently: 173 units date from 2010-2019 and 77 from 2020 or later.",
      "Detached single-family homes make up 750 of Everson's 1,074 housing units (about 70%). There are also 110 units in 3-4-unit buildings and 75 mobile homes.",
      "619 of Everson's 988 occupied homes are owner-occupied (about 63%).",
    ],
    pressures: [
      "The National Weather Service tracks a dedicated 'Nooksack River Overflow At SR544 Everson' gauge. Its flood-impact statement says overflow floods Main Street/SR 544 and can reach north toward Sumas.",
      "HistoryLink records major Nooksack Valley floods around 1885 and a massive flood in 1990.",
      "The WRCC Clearbrook cooperative station (451484) averages 46.71 inches of precipitation a year. November and December are the wettest months, at more than 6 inches each.",
      "The area around Everson and Nooksack is farm country, growing berries, dairy cattle, carrots, potatoes and specialty produce.",
    ],
    landmarks: [
      "Everson is in the Nooksack River valley about 15 miles northeast of Bellingham. It was named for Norwegian-born homesteader Ever Everson, who settled the site in 1871.",
      "Everson began as a Fraser River Gold Rush crossing called The Crossing, less than a mile west of the present town. The settlement moved east when the Bellingham Bay and British Columbia Railroad arrived in 1891.",
      "Riverside Park sits on the Nooksack River and has two baseball fields. Everson and Nooksack are on State Highways 544 and 9.",
    ],
    water: [
      "Everson's drinking water comes from the Strandell Well Field, about 3/4 mile southwest of downtown. Deep Well #6 draws from a 156-ft aquifer and is the primary source. Wells #4 and #5 tap a shallow, unconfined glacial sand-and-gravel aquifer and serve as emergency backup. The report publishes no hardness figure.",
      "Everson's water system also supplies the Everson Water Association and the Hampton Water Association, and reaches as far south as the Hoekema farm on Emerson Road.",
      "The City of Everson runs a wastewater treatment plant that serves both Everson and the City of Nooksack.",
    ],
    regulatory: [
    ],
    sources: [
      { fact: "The median year built for Everson's housing is 1987 (ACS 2020-2024 5-year estimate).", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5340805,16000US5322745,16000US5368200" },
      { fact: "The 1970s and 1980s were Everson's biggest building decades, with 237 units built in 1970-", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5340805,16000US5322745,16000US5368200" },
      { fact: "Everson has 105 housing units built in 1939 or earlier, about 10% of its stock.", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5340805,16000US5322745,16000US5368200" },
      { fact: "Building picked up again recently: 173 units date from 2010-2019 and 77 from 2020 or later", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5340805,16000US5322745,16000US5368200" },
      { fact: "Detached single-family homes make up 750 of Everson's 1,074 housing units (about 70%). The", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5340805,16000US5322745,16000US5368200" },
      { fact: "619 of Everson's 988 occupied homes are owner-occupied (about 63%).", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5340805,16000US5322745,16000US5368200" },
      { fact: "The National Weather Service tracks a dedicated 'Nooksack River Overflow At SR544 Everson'", url: "https://api.water.noaa.gov/nwps/v1/gauges/noew1" },
      { fact: "HistoryLink records major Nooksack Valley floods around 1885 and a massive flood in 1990.", url: "https://www.historylink.org/file/10775" },
      { fact: "The WRCC Clearbrook cooperative station (451484) averages 46.71 inches of precipitation a ", url: "https://wrcc-archive.dri.edu/cgi-bin/cliRECtM.pl?wa1484" },
      { fact: "The area around Everson and Nooksack is farm country, growing berries, dairy cattle, carro", url: "https://www.bellingham.org/everson-nooksack" },
      { fact: "Everson is in the Nooksack River valley about 15 miles northeast of Bellingham. It was nam", url: "https://www.historylink.org/file/10775" },
      { fact: "Everson began as a Fraser River Gold Rush crossing called The Crossing, less than a mile w", url: "https://www.historylink.org/file/10775" },
      { fact: "Riverside Park sits on the Nooksack River and has two baseball fields. Everson and Nooksac", url: "https://www.bellingham.org/everson-nooksack" },
      { fact: "Everson's drinking water comes from the Strandell Well Field, about 3/4 mile southwest of ", url: "https://cms8.revize.com/revize/eversonwa/COE%20CCR%20_2025%20FINAL.pdf" },
      { fact: "Everson's water system also supplies the Everson Water Association and the Hampton Water A", url: "https://cms8.revize.com/revize/eversonwa/COE%20CCR%20_2025%20FINAL.pdf" },
      { fact: "The City of Everson runs a wastewater treatment plant that serves both Everson and the Cit", url: "https://www.ci.everson.wa.us/departments/public_works_departments/utilities.php" },
    ],
  },
  "sudden-valley": {
    housing: [
      "The median year built for Sudden Valley's housing is 1991 (ACS 2020-2024 5-year estimate).",
      "Sudden Valley had two major building waves. 993 of its 2,985 housing units date from 1970-1979 and 844 from 2000-2009, while only 105 were built in 2010 or later.",
      "Sudden Valley is overwhelmingly detached single-family homes, 2,671 of 2,985 units (about 89%), with no mobile homes recorded.",
      "About 93% of occupied homes in Sudden Valley are owner-occupied: 2,565 of 2,764.",
      "Development started in the late 1960s after Ken Sanwick of Sudden Valley Inc. bought 1,200 acres in 1968. The community association took control in December 1976. (Wikipedia; basic history only.)",
    ],
    pressures: [
    ],
    landmarks: [
      "The Sudden Valley CDP covers 8.1 square miles, including 1.9 square miles of water, at an elevation of 748 feet. Rufus Creek flows through it as a tributary of Beaver Creek. (Wikipedia; basic geography only.)",
      "Community amenities include an 18-hole golf course designed by Ted Robinson and a marina. (Wikipedia.)",
    ],
    water: [
      "The Lake Whatcom Water and Sewer District draws water from Basin 3 of Lake Whatcom to serve Sudden Valley, Geneva and parts of North Shore and South Bay. No hardness figure was verified.",
      "Lake Whatcom is the drinking water source for more than 120,000 people, about half of Whatcom County's residents.",
    ],
    regulatory: [
      "Whatcom County calls the Sudden Valley Community Association the largest development in the Lake Whatcom watershed. The county is building stormwater projects there to cut phosphorus reaching the lake.",
      "Sudden Valley is one of the named areas inside Whatcom County's NPDES Phase II municipal stormwater permit area.",
      "Whatcom County's pressure-washing guidance cites WCC 16.36.050. Wash water must be collected and kept out of storm drains and waterways.",
      "In the Lake Whatcom watershed, commercial lawn fertilizer with more than zero percent phosphorus may not be used on residential lawns (WCC 16.32.050).",
      "Ground-disturbing work in the Lake Whatcom watershed is limited to June 1 through September 30. Removing any tree on a watershed lot needs a Whatcom County Tree Removal Permit unless it is part of an approved development.",
      "Lake Whatcom was placed on Washington's 303(d) list of polluted waters in 1998 for failing the dissolved-oxygen standard, and it is under a phosphorus and bacteria TMDL.",
    ],
    sources: [
      { fact: "The median year built for Sudden Valley's housing is 1991 (ACS 2020-2024 5-year estimate).", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5340805,16000US5322745,16000US5368200" },
      { fact: "Sudden Valley had two major building waves. 993 of its 2,985 housing units date from 1970-", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5340805,16000US5322745,16000US5368200" },
      { fact: "Sudden Valley is overwhelmingly detached single-family homes, 2,671 of 2,985 units (about ", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5340805,16000US5322745,16000US5368200" },
      { fact: "About 93% of occupied homes in Sudden Valley are owner-occupied: 2,565 of 2,764.", url: "https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25035,B25024,B25003,B25034&geo_ids=16000US5340805,16000US5322745,16000US5368200" },
      { fact: "Development started in the late 1960s after Ken Sanwick of Sudden Valley Inc. bought 1,200", url: "https://en.wikipedia.org/wiki/Sudden_Valley,_Washington" },
      { fact: "Whatcom County calls the Sudden Valley Community Association the largest development in th", url: "https://www.whatcomcounty.us/3696/Sudden-Valley-Stormwater-Improvements" },
      { fact: "Sudden Valley is one of the named areas inside Whatcom County's NPDES Phase II municipal s", url: "https://www.whatcomcounty.us/DocumentCenter/View/97053/2025-Stormwater-Management-Program_final" },
      { fact: "Whatcom County's pressure-washing guidance cites WCC 16.36.050. Wash water must be collect", url: "https://www.whatcomcounty.us/4175/Car-and-Pressure-Washing" },
      { fact: "In the Lake Whatcom watershed, commercial lawn fertilizer with more than zero percent phos", url: "https://www.lakewhatcom.whatcomcounty.org/about-the-lake/watershed-regulations" },
      { fact: "Ground-disturbing work in the Lake Whatcom watershed is limited to June 1 through Septembe", url: "https://www.lakewhatcom.whatcomcounty.org/about-the-lake/watershed-regulations" },
      { fact: "Lake Whatcom was placed on Washington's 303(d) list of polluted waters in 1998 for failing", url: "https://www.lakewhatcom.whatcomcounty.org/about-the-lake/water-quality" },
      { fact: "The Lake Whatcom Water and Sewer District draws water from Basin 3 of Lake Whatcom to serv", url: "https://www.lakewhatcom.whatcomcounty.org/about-the-lake/water-supply" },
      { fact: "Lake Whatcom is the drinking water source for more than 120,000 people, about half of What", url: "https://www.lakewhatcom.whatcomcounty.org/about-the-lake/water-supply" },
      { fact: "The Sudden Valley CDP covers 8.1 square miles, including 1.9 square miles of water, at an ", url: "https://en.wikipedia.org/wiki/Sudden_Valley,_Washington" },
      { fact: "Community amenities include an 18-hole golf course designed by Ted Robinson and a marina. ", url: "https://en.wikipedia.org/wiki/Sudden_Valley,_Washington" },
    ],
  },
};

for (const m of MARKETS) {
  const r = RESEARCHED[m.slug];
  if (!r) continue;
  const add = (have: string[], more: string[]) => [...have, ...more.filter((x) => !have.includes(x))];
  m.differentiators = {
    housing: add(m.differentiators.housing, r.housing),
    pressures: add(m.differentiators.pressures, r.pressures),
    landmarks: add(m.differentiators.landmarks, r.landmarks),
    water: m.differentiators.water ?? (r.water.length ? r.water.join(' ') : null),
    regulatory: add(m.differentiators.regulatory, r.regulatory),
  };
  m.sources = [...(m.sources ?? []), ...r.sources];
}

/** Services each tier carries. Tier is capacity, not ambition. */
export const TIER_SERVICES: Record<Tier, string[]> = {
  1: ['window-cleaning', 'gutter-cleaning', 'roof-cleaning', 'moss-removal', 'pressure-washing', 'house-washing', 'solar-panel-cleaning'],
  2: ['window-cleaning', 'gutter-cleaning', 'roof-cleaning', 'moss-removal', 'pressure-washing', 'solar-panel-cleaning'],
  3: ['window-cleaning', 'gutter-cleaning', 'moss-removal'],
};

/**
 * THE ANTI-SLOP GATE. A market builds only when it carries enough researched
 * material to write 3,000 unique words per page without repeating a neighbour.
 * Legacy markets are exempt from the block (their pages already rank and must
 * migrate) but are flagged so the research backlog is visible, not invisible.
 */
export function isBuildable(m: Market): { ok: boolean; reason?: string } {
  const d = m.differentiators;
  const facts = d.housing.length + d.pressures.length + d.landmarks.length + d.regulatory.length + (d.water ? 1 : 0);
  const floor = m.tier === 1 ? 8 : m.tier === 2 ? 5 : 3;
  if (facts < floor) {
    return { ok: false, reason: `${m.name}: ${facts} researched facts, tier ${m.tier} needs ${floor}. Research before build, or drop a tier.` };
  }
  return { ok: true };
}

export const marketsByCounty = (c: County) => MARKETS.filter((m) => m.county === c);
export const marketBySlug = (s: string) => MARKETS.find((m) => m.slug === s);
export const legacyMarkets = () => MARKETS.filter((m) => m.legacy);
export const researchBacklog = () => MARKETS.map((m) => ({ m, ...isBuildable(m) })).filter((r) => !r.ok);

/** areaServed for the LocalBusiness node — every market, both counties. */
export const areaServed = () =>
  MARKETS.map((m) => ({ '@type': 'City' as const, name: m.name, containedInPlace: { '@type': 'AdministrativeArea' as const, name: `${m.county} County, WA` } }));
