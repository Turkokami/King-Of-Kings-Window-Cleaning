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
