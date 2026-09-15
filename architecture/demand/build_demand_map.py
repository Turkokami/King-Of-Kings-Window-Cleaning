#!/usr/bin/env python3
"""
Keystone v2, Part 6A — Demand Mapping for kingofkingswindowcleaning.com.

WHAT THIS IS. Part 6A is the prevention layer for the thing Part 12.1 calls
"the #1 recurring killer." Its governing principle: "A page is earned by
evidence of demand, not by the existence of a slot in the lattice." Every URL
traces to a cluster; every cluster traces to at least two of five independent
demand signals; a slot with fewer than two is an areaServed mention on the
parent city page, not a page.

WHAT THIS SCRIPT WILL NOT DO. Prime directive 8 — "an LLM does not estimate
search volume or keyword difficulty, does not invent a place name, neighborhood
or subdivision, and does not decide SERP overlap." So three of the five signals
are left explicitly UNMEASURED here rather than guessed. They are inputs, and
the summary names exactly who supplies each one.

  S1  non-zero volume at metro geo ............ UNMEASURED — Google Ads API
                                                (GenerateKeywordHistoricalMetrics,
                                                Basic access) or DataForSEO
  S2  >=10 GSC impressions per quarter ........ MEASURED 2026-09-14 from the
                                                client's own 16-month export
  S3  a conversion in Google Ads Matched
      Locations ............................... UNMEASURED — client Ads account
  S4  dedicated page on >=2 of the top five ... MEASURED, 2026-09-11, by full
                                                sitemap enumeration
  S5  documented job history in the geography.. SATISFIED territory-wide, by owner
                                                attestation (2026-09-12)

S5 was resolved on 2026-09-12: the operator runs hundreds of jobs a year across
every city in the declared territory, small ones included — Acme was named
specifically. That is job history in the Part 6A sense.

KEYSTONE v3.2 RETIRED THE JOB-HISTORY CAP (changelog item 1). Job history is one
of the five signals and was never meant to be a ceiling on city-page count or a
prerequisite for entering a market. The v2 reading of Part 3.4 — which this file
previously implemented — capped the geo layer at the number of cities with
recorded job history and forbade neighborhood pages in cities that did not
already rank. Both are gone. Demand evidence alone earns a page, and a market
with no job history yet can be entered at the neighborhood layer.

One honest qualification, recorded rather than glossed: this is ATTESTED, not
EXPORTED. A per-geography job count from the scheduling system would harden it
and would additionally rank the territory, which attestation cannot do. It is
enough to open the gate; it is not enough to prioritise within it.

With S5 satisfied, a slot clears the two-signal threshold wherever any second
signal is present. Today that means the slots carrying S4.
"""
import csv, json, os, re
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
INV = json.load(open(os.path.join(HERE, 'competitor-geo-inventory.json')))

# --- the King of Kings service tree, geo-eligible only -----------------------
GEO_SERVICES = [
    'window-cleaning', 'gutter-cleaning', 'roof-cleaning', 'moss-removal',
    'pressure-washing', 'house-washing', 'solar-panel-cleaning',
]
NON_GEO_SERVICES = ['metal-roof-soft-washing', 'commercial-window-cleaning']

# --- the declared territory, read from markets.ts so the two cannot drift ----
MARKETS_TS = os.path.join(ROOT, 'site', 'src', 'data', 'markets.ts')
src = open(MARKETS_TS).read()
MARKETS = []
for m in re.finditer(r"slug: '([a-z-]+)', name: '([^']+)', county: '([A-Za-z]+)', tier: (\d)", src):
    MARKETS.append({'slug': m.group(1), 'name': m.group(2), 'county': m.group(3), 'tier': int(m.group(4))})

# --- signal 2, measured from the client's Search Console export -------------
# Part 6A.7 signal two: ">=10 GSC impressions per quarter." Measured from the
# property's own 16-month Performance export (2025-05-13 to 2026-09-12, 488 days
# = 5.35 quarters, so the threshold is 53.5 impressions over the window).
#
# READ THE CAVEAT BEFORE USING THIS. GSC impressions measure THIS SITE'S exposure,
# not market demand. A geography where the site has no page and no visibility
# reports near-zero by construction, which makes a zero partly self-fulfilling.
# That is exactly why Part 6A requires two signals rather than one: S4 catches the
# geographies where demand demonstrably exists but this site is invisible in them.
# Birch Bay, Everson and Sudden Valley are live examples — zero GSC, but two or
# more competitors build for them, so they still clear.
GSC = json.load(open(os.path.join(HERE, 'gsc-signal.json')))
S2_CITIES = set(GSC['cities_meeting_s2'])
S2_TUPLES = set(GSC['tuples_meeting_s2'])
S2_THRESHOLD = GSC['threshold']['impressions_required']

def s2_city(geo):
    return 1 if geo in S2_CITIES else 0

def s2_tuple(service, geo):
    return 1 if f'{service}|{geo}' in S2_TUPLES else 0

def s2_label(n, impressions):
    return (f'MET — {impressions} impressions over 16 months' if n
            else f'{impressions} impressions over 16 months, threshold {S2_THRESHOLD}')

# --- signal 5, resolved by owner attestation --------------------------------
# Part 6A.7 signal five: "documented job history in that geography." Stated by
# the owner on 2026-09-12 — hundreds of services a year across every city in the
# territory, Acme named as an example of the smallest. Recorded as attested, with
# its source, so a later reader can see exactly what kind of evidence this is.
JOB_HISTORY = {
    'satisfied': True,
    'scope': 'territory-wide — every declared market',
    'basis': 'owner attestation, 2026-09-12',
    'hardening': 'a per-geography job count from the scheduling system would both harden this and rank the territory, which attestation cannot do',
}
S5 = 1 if JOB_HISTORY['satisfied'] else 0
S5_LABEL = 'ATTESTED territory-wide (2026-09-12)' if JOB_HISTORY['satisfied'] else 'PENDING'

# --- signal 4, assembled from the measured inventory ------------------------
# A competitor "has a dedicated page" for (service, city) if its own slug for
# that service appears with that city. Alignment comes from the inventory file
# rather than from string similarity, so roof-moss-removal counts for both
# roof-cleaning and moss-removal and nothing counts by accident.
align = INV['service_slug_alignment']
comp = INV['competitors']

def competitor_pages(service, city):
    """Return the list of competitor domains holding a dedicated page for this tuple."""
    hits = []
    for ref in align.get(service, []):
        dom_key, their_slug = ref.split(':')
        dom = dom_key + '.com'
        c = comp.get(dom)
        if not c:
            continue
        svc = c.get('services', {}).get(their_slug)
        if not svc:
            continue
        if city in c['cities'] and city not in svc.get('missing', []):
            hits.append(dom)
    # Pure Shine runs city pages rather than a lattice. A city page is a
    # dedicated page for the geography, not for the tuple — it counts toward a
    # CITY-level signal and never toward a service x city one. Recorded
    # separately below so the distinction survives into the CSV.
    return sorted(set(hits))

def city_level_pages(city):
    hits = []
    for dom, c in comp.items():
        if not c.get('cities'):
            continue
        cities = c['cities']
        if city in cities:
            hits.append(dom)
        elif dom == 'pureshinenw.com' and city in ('blaine', 'birch-bay') and 'blaine-birch-bay' in cities:
            hits.append(dom)
    return sorted(set(hits))

rows = []
for mk in MARKETS:
    city = mk['slug']
    clp = city_level_pages(city)
    # ---- the city page itself ----
    rows.append({
        'url': f"/locations/{city}/",
        'page_type': 'T4 city',
        'cluster': f"{mk['name']} WA exterior cleaning",
        'service': '', 'geo': city,
        's1_volume': 'UNMEASURED',
        's2_gsc': s2_label(s2_city(city), GSC['city_impressions'].get(city, 0)),
        's3_ads': 'UNMEASURED',
        's4_competitors': len(clp), 's4_which': '|'.join(clp),
        's5_job_history': S5_LABEL,
        'signals_met': (1 if len(clp) >= 2 else 0) + S5 + s2_city(city),
        'decision': 'PAGE' if (1 if len(clp) >= 2 else 0) + S5 + s2_city(city) >= 2 else 'MENTION',
        'blocked_by': '',
    })
    for svc in GEO_SERVICES:
        hits = competitor_pages(svc, city)
        n = 1 if len(hits) >= 2 else 0
        rows.append({
            # Canonical taxonomy is /locations/{city}/{service}/ — Part 3.3. The map
            # and the architecture must speak the same URL or the checker is
            # comparing two different things, which is how drift starts.
            'url': f"/locations/{city}/{svc}/",
            'page_type': 'T4 city x service',
            'cluster': f"{svc.replace('-', ' ')} {mk['name']} WA",
            'service': svc, 'geo': city,
            's1_volume': 'UNMEASURED',
            's2_gsc': s2_label(s2_tuple(svc, city), GSC['tuple_impressions'].get(f'{svc}|{city}', 0)),
            's3_ads': 'UNMEASURED',
            's4_competitors': len(hits), 's4_which': '|'.join(hits),
            's5_job_history': S5_LABEL,
            'signals_met': n + S5 + s2_tuple(svc, city),
            'decision': 'PAGE' if n + S5 + s2_tuple(svc, city) >= 2 else 'MENTION',
            'blocked_by': '',
        })

# --- the Bellingham sub-area tier ------------------------------------------
# Part 3.4 item 4: "neighborhood pages are built only inside cities that already
# rank, never as the way into a market." That is a ranking MEASUREMENT, so every
# row below is blocked on GSC regardless of what any other signal says. They are
# enumerated anyway so the committed map is complete and the harness can tell an
# unmapped page from a gated one.
#
# Names come from build_architecture.py, which sources the official 25 from the
# City of Bellingham planning department and keeps non-official real places in a
# separate area-page bucket. Nothing here is invented.
import importlib.util as _ilu
_spec = _ilu.spec_from_file_location('arch', os.path.join(ROOT, 'architecture', 'build_architecture.py'))

# Read the two lists textually rather than executing the module, which writes files.
_arch_src = open(os.path.join(ROOT, 'architecture', 'build_architecture.py')).read()
def _tuples(varname):
    blk = _arch_src.split(varname + ' = [', 1)[1]
    blk = blk.split(']', 1)[0]
    raw = re.findall(r'\("([a-z0-9-]+)"\s*,\s*"([^"]+)"\s*,\s*(True|False)\)', blk)
    # the third capture is the literal text True/False — coerce it, or every row
    # reads as live because a non-empty string is truthy
    return [(a, b, c == 'True') for a, b, c in raw]

OFFICIAL_NBHD = _tuples('BELLINGHAM_NBHD')
AREA_PAGES = _tuples('BELLINGHAM_AREA_PAGES')

# Client-designated priority zones. An owner naming a geography as high-value is
# real commercial intelligence and it is recorded as such — but it is NOT Part 6A
# signal S5, which asks for DOCUMENTED job history. It is carried here so the
# priority survives into the build and so the specific thing still needed is named.
CLIENT_PRIORITY = {
    'chuckanut': 'Owner names Chuckanut as one of the top-value areas in the territory (stated 2026-09-12). Needs the job records behind that assessment to become S5.',
}

# KEYSTONE v3.2: the "only inside cities that already rank" clause is RETIRED
# (changelog item 1). Neighborhood pages are now judged on demand evidence like
# every other geography — no structural prerequisite, and a market with no job
# history can be entered at this layer. What remains is the ordinary Part 6A
# arithmetic, and on the measured data these sub-areas carry S5 only: the whole
# official-25 set returns nothing above noise in the 16-month export, and no
# competitor builds a Bellingham sub-area page either. One signal, not two.
#
# That is a decline on evidence, which Dimension 2 says costs nothing — as opposed
# to a decline for lack of job history, which v3.2 explicitly says is NOT a correct
# decline and earns no exemption.
NBHD_GATE = ('Declined on demand evidence, not on a structural rule: no measured query demand in the '
             '16-month export and no competitor builds a Bellingham sub-area page. S5 only.')

for nslug, nname, nlive in OFFICIAL_NBHD + AREA_PAGES:
    is_area = any(nslug == a[0] for a in AREA_PAGES)
    rows.append({
        'url': f"/locations/bellingham/{nslug}/",
        'page_type': 'T5 Bellingham area page' if is_area else 'T5 Bellingham neighborhood',
        'cluster': f"{nname} Bellingham WA exterior cleaning",
        'service': '', 'geo': nslug,
        's1_volume': 'UNMEASURED', 's2_gsc': 'UNMEASURED', 's3_ads': 'UNMEASURED',
        's4_competitors': 0, 's4_which': '',
        's5_job_history': S5_LABEL,
        'signals_met': S5,
        'decision': 'MENTION',
        'blocked_by': (
            NBHD_GATE + ' '
            + ('Live legacy page, migrating. ' if nlive else '')
            + CLIENT_PRIORITY.get(nslug, '')
        ).strip(),
    })

# ---- apply the gate --------------------------------------------------------
# Two or more signals promotes to a page. With S1-S3 unmeasured and S5 pending,
# the arithmetic ceiling is 1. Nothing is promoted. Each row records WHY, so the
# file is a work order rather than a wall.
for r in rows:
    if r['decision'] == 'MENTION' and not r['blocked_by']:
        if r['s4_competitors'] == 1:
            r['blocked_by'] = 'S5 met. One competitor only, so S4 does not fire. GSC (S2) is the next signal and the client has access.'
        else:
            r['blocked_by'] = 'S5 met, no competitor builds this tuple. Needs GSC impressions or metro volume, or it stays an areaServed mention.'

# ---- Part 3.4 hard cap -----------------------------------------------------
# "City pages may not exceed the count of cities with documented job history."
# That count is a client input. Until it exists the cap is 0 and the geo tier
# cannot be built at any size — which is the point of the cap.
# Resolved 2026-09-12 — see JOB_HISTORY above. Territory-wide, so the cap is the
# full declared market count.
# (The v2 cap variable lived here. Retired by v3.2; deliberately not replaced.)

out_csv = os.path.join(HERE, 'demand-map.csv')
cols = ['url', 'page_type', 'cluster', 'service', 'geo', 's1_volume', 's2_gsc',
        's3_ads', 's4_competitors', 's4_which', 's5_job_history', 'signals_met',
        'decision', 'blocked_by']
with open(out_csv, 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=cols)
    w.writeheader()
    w.writerows(rows)

# ---- summary ---------------------------------------------------------------
by_s4 = defaultdict(int)
for r in rows:
    by_s4[r['s4_competitors']] += 1
ready = [r for r in rows if r['s4_competitors'] >= 2]
solo = [r for r in rows if r['s4_competitors'] == 1]
none_ = [r for r in rows if r['s4_competitors'] == 0]

cities_with_s4 = sorted({r['geo'] for r in ready})
# A city where NO competitor of the five builds anything at all — a genuine
# whitespace, and also a genuine warning: nobody else finding it worth a page
# is itself weak evidence about demand.
best = {}
for r in rows:
    best[r['geo']] = max(best.get(r['geo'], 0), r['s4_competitors'])
cities_zero = sorted([c for c, n in best.items() if n == 0])
cities_one = sorted([c for c, n in best.items() if n == 1])

summary = {
    'generated': '2026-09-11',
    'standard': 'Keystone v2, Part 6A.7 — two or more of five demand signals promotes a geography to a page',
    'markets_declared': len(MARKETS),
    'geo_services': len(GEO_SERVICES),
    'geo_slots_evaluated': len(rows),
    'signals_measured': ['S2 GSC impressions (2026-09-14)', 'S4 competitor coverage (2026-09-11)'],
    'signals_measured_detail': {
        'S2 GSC': {
            'source': GSC['source'],
            'threshold': GSC['threshold'],
            'cities_meeting': GSC['cities_meeting_s2'],
            'tuples_meeting': GSC['tuples_meeting_s2'],
            'caveat': GSC['interpretation_limit'],
        },
    },
    'signals_unmeasured': {
        'S1 volume': 'Google Ads API GenerateKeywordHistoricalMetrics at the Bellingham metro geo target (needs Basic access), or DataForSEO Google Ads Search Volume. Keep the full twelve-month monthly_searches array — that array is the seasonality dataset for Part 6A.3.',
        'S3 Ads matched locations': 'Google Ads search terms plus Insights > When & where ads showed > Matched Locations, ranked by conversions, not impressions. Only exists if the client runs Ads.',
    },
    'signal_satisfied': {
        'S5 documented job history': JOB_HISTORY,
    },
    's4_distribution': {str(k): v for k, v in sorted(by_s4.items())},
    'slots_with_s4_met': len(ready),
    'slots_with_one_competitor': len(solo),
    'slots_with_no_competitor': len(none_),
    'cities_where_s4_is_met_somewhere': cities_with_s4,
    'cities_where_exactly_one_competitor_builds': cities_one,
    'cities_where_no_competitor_builds_anything': cities_zero,
    'slots_promoted_to_page_today': sum(1 for r in rows if r['decision'] == 'PAGE'),
    'retired_gates_v3_2': {
        'job_history_cap': 'RETIRED by Keystone v3.2 changelog item 1. Job history is one of the five demand signals, never a ceiling on city-page count and never a prerequisite. This file no longer computes a cap.',
        'neighborhood_rank_prerequisite': 'RETIRED by the same item. Neighborhood pages are judged on demand evidence alone; a market with no job history can be entered at the neighborhood layer.',
        'verification_as_blocker': 'RETIRED by changelog item 2. Nothing in this pipeline requires independent verification of a client-supplied fact before it ships. The client-attested standard applies: record who supplied it and when, mark it attested, and never invent.',
    },
    'neighborhood_tier': {
        'rule': 'Part 3.4 item 4 — neighborhood pages are built only inside cities that already rank, never as the way into a market.',
        'status': 'BLOCKED. "Already rank" is a GSC/rank-tracker measurement. The 25 Bellingham neighborhood pages and every other neighborhood slot stay unbuilt until that measurement exists.',
    },
    'what_this_prunes': 'The architecture is the superset the evidence selects from. With S5 satisfied territory-wide, the slots carrying S4 clear immediately; the rest wait on GSC, which the client has access to. A slot that never accumulates a second signal becomes an areaServed mention on its parent city page rather than a page, and a geography correctly declined costs nothing on the v2 scorecard.',
}
json.dump(summary, open(os.path.join(HERE, 'demand-map-summary.json'), 'w'), indent=2)
print(json.dumps(summary, indent=2)[:2400])
