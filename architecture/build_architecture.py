#!/usr/bin/env python3
"""King of Kings — Keystone 7A architecture generator.
Emits the full page list, the geo lattice, and the 301 redirect map."""
import csv, json, os

OUT = "/home/claude/kok/architecture"
os.makedirs(OUT, exist_ok=True)

# ---------------------------------------------------------------- services
SERVICES = [
    # The nine confirmed services, per the live /services/ page which the owner
    # confirmed is current. Metal roof soft washing is its own service here, not
    # a sub-page of roof cleaning.
    ("window-cleaning",           "Window Cleaning",              True),
    ("gutter-cleaning",           "Gutter Cleaning",              True),
    ("roof-cleaning",             "Roof Cleaning & Debris Removal", True),
    ("metal-roof-soft-washing",   "Metal Roof Soft Washing",      True),
    ("moss-removal",              "Moss Removal",                 True),
    ("pressure-washing",          "Pressure Washing",             True),
    ("house-washing",             "House Washing (Soft Wash)",    True),
    ("solar-panel-cleaning",      "Solar Panel Cleaning",         True),
    ("commercial-window-cleaning","Commercial Window Cleaning",   True),
]
GEO_SERVICES_T1 = ["window-cleaning","gutter-cleaning","roof-cleaning","moss-removal",
                   "pressure-washing","house-washing","solar-panel-cleaning"]
GEO_SERVICES_T2 = ["window-cleaning","gutter-cleaning","roof-cleaning","moss-removal",
                   "pressure-washing","solar-panel-cleaning"]
GEO_SERVICES_T3 = ["window-cleaning","gutter-cleaning","moss-removal"]

# ---------------------------------------------------------------- markets
# tier 1 = city page + 7 services + neighborhood run
# tier 2 = city page + 6 services
# tier 3 = city page + 3 core services
MARKETS = [
    # slug, display, county, tier, live_today
    ("bellingham",     "Bellingham",      "Whatcom", 1, True),
    ("ferndale",       "Ferndale",        "Whatcom", 1, True),
    ("lynden",         "Lynden",          "Whatcom", 1, True),
    ("blaine",         "Blaine",          "Whatcom", 1, True),
    ("mount-vernon",   "Mount Vernon",    "Skagit",  1, True),
    ("burlington",     "Burlington",      "Skagit",  1, True),
    ("sedro-woolley",  "Sedro-Woolley",   "Skagit",  1, True),
    ("anacortes",      "Anacortes",       "Skagit",  1, True),

    ("birch-bay",      "Birch Bay",       "Whatcom", 2, True),
    ("semiahmoo",      "Semiahmoo",       "Whatcom", 2, False),
    ("custer",         "Custer",          "Whatcom", 2, True),
    ("everson",        "Everson",         "Whatcom", 2, True),
    ("nooksack",       "Nooksack",        "Whatcom", 2, True),
    ("sumas",          "Sumas",           "Whatcom", 2, True),
    ("deming",         "Deming",          "Whatcom", 2, True),
    ("acme",           "Acme",            "Whatcom", 2, True),
    ("maple-falls",    "Maple Falls",     "Whatcom", 2, True),
    ("glacier",        "Glacier",         "Whatcom", 2, True),
    ("sudden-valley",  "Sudden Valley",   "Whatcom", 2, True),
    ("kendall",        "Kendall",         "Whatcom", 2, False),
    ("van-zandt",      "Van Zandt",       "Whatcom", 2, False),
    ("la-conner",      "La Conner",       "Skagit",  2, True),
    ("lyman",          "Lyman",           "Skagit",  2, True),
    ("edison",         "Edison",          "Skagit",  2, True),
    ("bow",            "Bow",             "Skagit",  2, True),
    ("alger",          "Alger",           "Skagit",  2, True),
    ("clear-lake",     "Clear Lake",      "Skagit",  2, True),
    ("big-lake",       "Big Lake",        "Skagit",  2, False),
    ("conway",         "Conway",          "Skagit",  2, False),
    ("concrete",       "Concrete",        "Skagit",  2, False),
    ("hamilton",       "Hamilton",        "Skagit",  2, False),
    ("bay-view",       "Bay View",        "Skagit",  2, False),
    ("oak-harbor",     "Oak Harbor",      "Island",  2, True),

    ("point-roberts",  "Point Roberts",   "Whatcom", 3, False),
    ("lummi-island",   "Lummi Island",    "Whatcom", 3, False),
    ("marietta",       "Marietta",        "Whatcom", 3, False),
    ("geneva",         "Geneva",          "Whatcom", 3, False),
    ("wickersham",     "Wickersham",      "Whatcom", 3, False),
    ("rockport",       "Rockport",        "Skagit",  3, False),
    ("samish-island",  "Samish Island",   "Skagit",  3, False),
    ("guemes-island",  "Guemes Island",   "Skagit",  3, False),
]

# ------------------------------------------------- Bellingham neighborhoods
# THE OFFICIAL 25, from the City of Bellingham Planning department:
#   https://cob.org/services/planning/neighborhoods
#
# Keystone v2 prime directive 8 — an agent "does not invent a place name,
# neighborhood or subdivision." An earlier draft of this file did exactly that:
# it listed Downtown, Mount Baker, Guide Meridian and Van Wyck as Bellingham
# neighborhoods. None of them are on the City's list. "Downtown" is City Center;
# Cornwall Park, Irongate, Puget, Roosevelt, Samish, Sehome, South and Western
# Washington University are real and were missing. Corrected against the source.
#
# Squalicum is handled separately below: it is NOT an official neighborhood, but
# a live legacy page uses the name, so it migrates as an AREA page rather than
# being silently promoted or silently dropped.
BELLINGHAM_NBHD = [
    ("alabama-hill","Alabama Hill",True),("barkley","Barkley",True),
    ("birchwood","Birchwood",True),("city-center","City Center",False),
    ("columbia","Columbia",True),("cordata","Cordata",True),
    ("cornwall-park","Cornwall Park",False),("edgemoor","Edgemoor",True),
    ("fairhaven","Fairhaven",True),("happy-valley","Happy Valley",True),
    ("irongate","Irongate",False),("king-mountain","King Mountain",False),
    ("lettered-streets","Lettered Streets",False),("meridian","Meridian",False),
    ("puget","Puget",False),("roosevelt","Roosevelt",False),
    ("samish","Samish",False),("sehome","Sehome",False),
    ("silver-beach","Silver Beach",True),("south","South",False),
    ("south-hill","South Hill",True),("sunnyland","Sunnyland",True),
    ("western-washington-university","Western Washington University",False),
    ("whatcom-falls","Whatcom Falls",False),("york","York",False),
]
# AREA PAGES — named places that are real and verifiable but are NOT on the City
# of Bellingham's official neighborhood list. Prime directive 8 forbids inventing
# a place name; it does not forbid using a real one that the City's planning
# taxonomy happens not to cover. These are kept in their own bucket so the
# official-25 count stays honest and nothing here is ever reported as a
# "Bellingham neighborhood."
#
#   squalicum  — live legacy page, migrated not invented.
#   chuckanut  — CLIENT-DESIGNATED PRIORITY ZONE. The owner names Chuckanut as
#                one of the top-value areas in the territory. It is a real named
#                place with multiple independent sources (Chuckanut Drive / SR 11,
#                and the USGS GNIS features Chuckanut Bay, Chuckanut Mountain and
#                Chuckanut Village), and it spans south Bellingham into
#                unincorporated Whatcom County, which is exactly why the City's
#                neighborhood list does not carry it. No page exists on the legacy
#                site and no competitor of the five builds one — see
#                demand/competitor-geo-inventory.json. Status is new, not migrate.
BELLINGHAM_AREA_PAGES = [("squalicum","Squalicum",True), ("chuckanut","Chuckanut",False)]
# Neighborhood counts for the other Tier-1 markets. Names are NOT invented here —
# they are sourced in Phase 3 from Whatcom/Skagit assessor plat names, USPS
# delivery areas and the owner's own route knowledge (Keystone 6.3 anti-slop).
OTHER_T1_NBHD_TARGET = 5

# ---------------------------------------------------------------- page list
pages = []
def add(url, ptype, template, phase, note="", status="new"):
    pages.append({"url": url, "type": ptype, "template": template,
                  "phase": phase, "status": status, "note": note})

# Phase 2 — money pages
add("/", "home", "T1", 2, "Brand promise, service entry grid, trust strip, 107+ internal links")
add("/services/", "services-hub", "T1", 2, "Single services hub — never two")
for slug, name, _ in SERVICES:
    add(f"/services/{slug}/", "service-spoke", "T2", 2, name)
add("/our-guarantee/", "trust", "T8", 2, "Defined-term guarantee. Every 'risk-free' string links here.")
add("/financing/", "financing", "T2", 2, "BNPL per service, live calculator")
add("/about/", "trust", "T1", 2, "", "migrate")
add("/reviews/", "trust", "T1", 2, "", "migrate")
add("/contact/", "trust", "T1", 2, "", "migrate")
add("/prepare-for-your-upcoming-service/", "trust", "T8", 2, "", "migrate")
add("/referral-program/", "trust", "T2", 2, "", "migrate")
add("/awards/", "trust", "T1", 2, "", "migrate")
add("/careers/", "trust", "T1", 2, "", "migrate")
add("/gallery/", "proof", "T1", 2, "", "migrate")

# Phase 1 — entity
add("/team/{expert-slug}/", "person-entity", "T2", 1, "Named credentialed operator, hasCredential = WA registration")

# Phase 3 — geo, GATED BY THE DEMAND MAP
# ---------------------------------------------------------------------------
# Keystone v2 Part 6A: "A page is earned by evidence of demand, not by the
# existence of a slot in the lattice." Before 2026-09-14 this block generated the
# cross-product of MARKETS x services — which is exactly the v1 behaviour that
# produced 150 live geo pages returning 388 impressions and one click in sixteen
# months. It now reads the committed demand map and emits only what cleared the
# two-signal gate. Everything declined becomes an areaServed mention on its parent,
# which is what Part 6A says a sub-threshold geography is.
import csv as _csv
_MAP = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'demand', 'demand-map.csv')
_rows = list(_csv.DictReader(open(_MAP)))
AUTHORISED = {r['url'] for r in _rows if r['decision'] == 'PAGE'}

add("/locations/", "geo-hub", "T4", 3, "Real geo hub. /service-area/ 301s here.")
live_map = {}
mentions = []
for slug, name, county, tier, live in MARKETS:
    city_url = f"/locations/{slug}/"
    # The tier lists below are retained only for the redirect map, which has to
    # cover what the legacy site actually built. Which services get a PAGE in this
    # city is decided by the demand map, not by a tier — a hand-kept tier list is
    # the same "slot in the lattice" reasoning Part 6A replaced.
    legacy_svcs = GEO_SERVICES_T1 if tier == 1 else (GEO_SERVICES_T2 if tier == 2 else GEO_SERVICES_T3)
    svcs = sorted(set(legacy_svcs) | {
        u.rstrip('/').rsplit('/', 1)[1] for u in AUTHORISED
        if u.startswith(city_url) and u.rstrip('/').count('/') == 3
    })
    if city_url in AUTHORISED:
        add(city_url, "city", "T4", 3, f"{name}, {county} County — Tier {tier}",
            "migrate" if live else "new")
    else:
        mentions.append({"geo": slug, "name": name, "county": county, "service": "",
                         "mention_on": "/locations/", "reason": "city page declined by Part 6A"})
    for sv in svcs:
        tuple_url = f"/locations/{slug}/{sv}/"
        if tuple_url in AUTHORISED:
            add(tuple_url, "city-service", "T4", 3, f"{name} x {sv}",
                "migrate" if live and sv in GEO_SERVICES_T2 else "new")
        else:
            mentions.append({"geo": slug, "name": name, "service": sv,
                             "mention_on": city_url if city_url in AUTHORISED else "/locations/",
                             "reason": "tuple declined by Part 6A"})
        # The redirect exists whether or not the target is a page: a live legacy
        # URL cannot 404 because the evidence went the other way.
        if live and sv in GEO_SERVICES_T2:
            live_map[f"/{sv}-{slug}-wa/"] = tuple_url if tuple_url in AUTHORISED else (
                city_url if city_url in AUTHORISED else f"/services/{sv}/")

# Phase 4 — neighborhoods, GATED ON DEMAND EVIDENCE ONLY
# Keystone v3.2 retired the "only inside cities that already rank" prerequisite
# along with the job-history cap (changelog item 1). Neighborhood pages are now
# judged like any other geography: two of five demand signals. On the measured
# data the Bellingham sub-areas carry S5 alone — no query demand above noise in
# the 16-month export, and no competitor builds one either — so the map declines
# them on evidence rather than on a structural rule. Worth noting the outcome did
# not change when the rule was retired, which is the evidence doing the work
# rather than the rule.
for nslug, nname, nlive in BELLINGHAM_NBHD + BELLINGHAM_AREA_PAGES:
    nurl = f"/locations/bellingham/{nslug}/"
    if nurl in AUTHORISED:
        add(nurl, "neighborhood", "T5", 4, f"{nname}, Bellingham", "migrate" if nlive else "new")
    else:
        mentions.append({"geo": nslug, "name": nname, "service": "",
                         "mention_on": "/locations/bellingham/",
                         "reason": "no measured query demand — Part 6A"})
    if nlive:
        live_map[f"/window-cleaning-{nslug}-bellingham/"] = (
            nurl if nurl in AUTHORISED else "/locations/bellingham/window-cleaning/")

# Phase 4 — case studies
CASE_STUDIES_LIVE = ["gutter-cleaning-bellingham-wa","house-washing-lynden-wa",
                     "moss-removal-sedro-woolley-wa","pressure-washing-mount-vernon-wa",
                     "window-cleaning-bow-wa"]
for cs in CASE_STUDIES_LIVE:
    add(f"/case-studies/{cs}/", "case-study", "T9", 4, "", "migrate")
for i in range(15):
    add(f"/case-studies/{{case-{i+1}}}/", "case-study", "T9", 4,
        "New — wired into its service spoke, city page and hub")

# Phase 5 — problem micro pages
PROBLEMS = [
    ("window-cleaning","hard-water-spots"),("window-cleaning","construction-overspray"),
    ("window-cleaning","screen-repair-and-cleaning"),("window-cleaning","skylight-cleaning"),
    ("window-cleaning","salt-spray-on-waterfront-glass"),
    ("roof-cleaning","black-algae-streaks"),("roof-cleaning","cedar-shake-moss"),
    ("roof-cleaning","metal-roof-soft-washing"),("roof-cleaning","composition-shingle-granule-loss"),
    ("moss-removal","moss-under-shingles"),("moss-removal","lichen-vs-moss"),
    ("gutter-cleaning","overflowing-gutters"),("gutter-cleaning","downspout-blockage"),
    ("gutter-cleaning","gutter-brightening"),
    ("pressure-washing","slippery-driveways-and-walkways"),
    ("pressure-washing","oxidised-vinyl-siding"),
    ("house-washing","north-facing-wall-mildew"),
    ("solar-panel-cleaning","pollen-and-industrial-fallout-soiling"),
]
for svc, prob in PROBLEMS:
    add(f"/services/{svc}/{prob}/", "problem-micro", "T3", 5, "")

# Phase 5 — surface library (the Pest Library equivalent)
LIBRARY = ["annealed-glass","tempered-glass","low-e-coated-glass","insulated-glass-units",
           "vinyl-siding","fiber-cement-siding","cedar-siding","painted-wood-siding",
           "composition-asphalt-shingle","standing-seam-metal-roof","cedar-shake-roof",
           "concrete-tile-roof","torch-down-flat-roof","aluminium-gutters","copper-gutters",
           "sheet-moss","lichen","gloeocapsa-magma-algae","liverwort","hard-water-mineral-scale",
           "cherry-point-industrial-fallout","salish-sea-salt-spray","douglas-fir-pollen",
           "agricultural-dust-nooksack-valley"]
add("/surface-library/", "library-hub", "T6", 5, "Topical-authority backbone")
for item in LIBRARY:
    add(f"/surface-library/{item}/", "library-profile", "T6", 5, "")

# Phase 5 — compliance & code
COMPLIANCE = [
    ("wa-contractor-registration","WA L&I contractor registration and how to verify a UBI"),
    ("lake-whatcom-watershed-rules","Lake Whatcom watershed phosphorus and runoff rules"),
    ("bellingham-stormwater-wash-water","Bellingham stormwater rules for exterior wash water"),
    ("skagit-county-wash-water","Skagit County wash-water discharge rules"),
    ("hoa-window-cleaning-requirements","HOA and condo exterior-cleaning obligations"),
    ("landlord-tenant-exterior-cleaning","Landlord and tenant exterior-cleaning obligations in WA"),
    ("ladder-and-fall-protection","Fall protection and why a licensed crew matters"),
    ("roof-warranty-and-soft-washing","Roof warranties and why pressure washing voids them"),
]
for slug, title in COMPLIANCE:
    add(f"/compliance/{slug}/", "compliance", "T8", 5, title)

# Phase 6 — blog clusters
add("/blog/", "blog-hub", "T1", 6, "", "migrate")
for i in range(40):
    add(f"/blog/{{cluster-post-{i+1}}}/", "blog", "T6", 6,
        "Consolidated from 73 live posts; each feeds exactly one service spoke")

# ---------------------------------------------------------------- redirects
redirects = dict(live_map)
redirects["/service-area/"] = "/locations/"
redirects["/window-cleaning-bellingham-wa/"] = "/services/window-cleaning/"
redirects["/roof-cleaning/"] = "/services/roof-cleaning/"
redirects["/pressure-washing/"] = "/services/pressure-washing/"
redirects["/gutter-cleaning/"] = "/services/gutter-cleaning/"
redirects["/solar-panel-cleaning/"] = "/services/solar-panel-cleaning/"
redirects["/moss-removal/"] = "/services/moss-removal/"
redirects["/house-washing/"] = "/services/house-washing/"
redirects["/commercial-window-cleaning/"] = "/services/commercial-window-cleaning/"
redirects["/metal-roof-cleaning-bellingham-wa/"] = "/services/roof-cleaning/metal-roof-soft-washing/"
# cannibalisation consolidations
CONSOLIDATE = {
    "/window-cleaning-cost-bellingham-wa/": "/services/window-cleaning/",
    "/what-affects-the-cost-of-professional-window-cleaning-in-bellingham-and-surrounding-areas/": "/services/window-cleaning/",
    "/professional-window-cleaning-services-in-bellingham-surrounding-areas/": "/services/window-cleaning/",
    "/the-complete-guide-to-professional-window-cleaning-in-bellingham-wa/": "/services/window-cleaning/",
    "/best-window-cleaning-in-bellingham-wa-why-more-homeowners-are-choosing-professional-window-washing-services/": "/locations/bellingham/window-cleaning/",
    "/window-cleaning-bellingham-why-professional-window-cleaning-makes-a-bigger-difference-than-you-think/": "/locations/bellingham/window-cleaning/",
    "/why-professional-window-cleaning-in-bellingham-wa-is-worth-the-investment/": "/locations/bellingham/window-cleaning/",
    "/the-hidden-costs-of-dirty-windows-the-crystal-clear-benefits-of-professional-window-cleaning-in-bellingham-wa/": "/locations/bellingham/window-cleaning/",
    "/gutter-cleaning-cost-bellingham-wa/": "/services/gutter-cleaning/",
    "/professional-gutter-cleaning-services-in-bellingham-surrounding-areas/": "/services/gutter-cleaning/",
    "/roof-cleaning-cost-bellingham-wa/": "/services/roof-cleaning/",
    "/moss-removal-cost-bellingham-wa/": "/services/moss-removal/",
    "/professional-moss-removal-and-roof-treatment-in-bellingham-surrounding-areas/": "/services/moss-removal/",
    "/pressure-washing-cost-bellingham-wa/": "/services/pressure-washing/",
    "/professional-pressure-washing-services-in-bellingham-surrounding-areas/": "/services/pressure-washing/",
    "/pressure-washing-bellingham-restore-your-homes-exterior-with-professional-pressure-washing/": "/locations/bellingham/pressure-washing/",
    "/house-washing-cost-bellingham-wa/": "/services/house-washing/",
    "/moss-removal-bellingham-protect-your-roof-with-professional-moss-removal-and-roof-cleaning/": "/locations/bellingham/moss-removal/",
    "/solar-panel-cleaning-bellingham-why-clean-solar-panels-produce-better-results-in-the-pacific-northwest/": "/locations/bellingham/solar-panel-cleaning/",
    "/roof-cleaning-and-moss-removal-in-bellingham-wa-why-soft-washing-is-the-safest-choice-for-composite-roofs/": "/services/roof-cleaning/composition-shingle-granule-loss/",
    "/category/window-cleaning/": "/services/window-cleaning/",
    "/category/gutter-cleaning/": "/services/gutter-cleaning/",
    "/category/roof-cleaning/": "/services/roof-cleaning/",
    "/category/pressure-washing/": "/services/pressure-washing/",
    "/category/house-washing/": "/services/house-washing/",
    "/category/solar-panel-cleaning/": "/services/solar-panel-cleaning/",
}
redirects.update(CONSOLIDATE)

# ---------------------------------------------------------------- write out
with open(f"{OUT}/page-list.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=["url","type","template","phase","status","note"])
    w.writeheader(); w.writerows(pages)

with open(f"{OUT}/redirect-map.csv", "w", newline="") as f:
    w = csv.writer(f); w.writerow(["old_path","new_path","code"])
    for k in sorted(redirects): w.writerow([k, redirects[k], 301])

by_type, by_phase, by_status = {}, {}, {}
for p in pages:
    by_type[p["type"]] = by_type.get(p["type"], 0) + 1
    by_phase[p["phase"]] = by_phase.get(p["phase"], 0) + 1
    by_status[p["status"]] = by_status.get(p["status"], 0) + 1

t1 = [m for m in MARKETS if m[3]==1]; t2=[m for m in MARKETS if m[3]==2]; t3=[m for m in MARKETS if m[3]==3]
summary = {
    "total_indexable_pages": len(pages),
    "by_phase": dict(sorted(by_phase.items())),
    "by_type": dict(sorted(by_type.items(), key=lambda x: -x[1])),
    "by_status": by_status,
    "markets_total": len(MARKETS),
    "markets_tier1": len(t1), "markets_tier2": len(t2), "markets_tier3": len(t3),
    "markets_live_today": sum(1 for m in MARKETS if m[4]),
    "markets_net_new": sum(1 for m in MARKETS if not m[4]),
    "whatcom_markets": sum(1 for m in MARKETS if m[2]=="Whatcom"),
    "skagit_markets": sum(1 for m in MARKETS if m[2]=="Skagit"),
    "island_markets": sum(1 for m in MARKETS if m[2]=="Island"),
    "bellingham_neighborhoods_official": len(BELLINGHAM_NBHD),
    "bellingham_area_pages": len(BELLINGHAM_AREA_PAGES),
    "bellingham_neighborhoods_live": sum(1 for n in BELLINGHAM_NBHD + BELLINGHAM_AREA_PAGES if n[2]),
    "bellingham_neighborhoods_new": sum(1 for n in BELLINGHAM_NBHD if not n[2]),
    "word_band_standard": "Keystone v2 per-page-type bands; no floor",
    "other_t1_neighborhoods": 0,   # Part 6A: none authorised — see demand/demand-map.csv
    "redirects": len(redirects),
    "words_at_3500_avg": len(pages)*3500,
}
json.dump({"_doc": "Geographies Part 6A declined. Each is an areaServed mention on its parent page, not a URL. This file is the input to the areaServed arrays in the schema graph and to the coverage copy on /locations/ and the city pages — so a declined geography is still SAID, it is just not a page.", "count": len(mentions), "mentions": mentions}, open(f"{OUT}/area-served-mentions.json","w"), indent=1)
summary["demand_gate"] = {
    "standard": "Keystone v2 Part 6A — a page is earned by evidence of demand, not by the existence of a slot in the lattice.",
    "status": "MEASURED AND APPLIED. This page list is GENERATED FROM demand/demand-map.csv, not from a cross-product of markets and services. The list is the evidence.",
    "measured_2026_09_14": f"{len(AUTHORISED)} geo slots clear the two-signal gate — S2 (GSC impressions, measured from the client's 16-month export), S4 (competitor coverage, measured by sitemap enumeration), S5 (job history, owner-attested).",
    "declined": f"{len(mentions)} geographies and tuples declined. They are recorded in area-served-mentions.json and appear as areaServed coverage rather than as URLs — a declined geography is still said, it is just not a page.",
    "prune": "468 candidate pages before the gate; this file after it.",
    "part_3_4_hard_cap": "Resolved — job history is territory-wide, so the cap is the full market count and no longer binds. The demand gate binds instead.",
    "neighborhood_tier": "Bellingham satisfies the structural clause (21,409 impressions, head term at position 9.4), but no Bellingham sub-area carries measured query demand, so all are declined on evidence and stay as candidates for the quarterly refresh.",
    "what_the_old_lattice_did": "150 live geo pages produced 388 impressions and 1 click in sixteen months, median position 41, with 88 never shown at all.",
}
json.dump(summary, open(f"{OUT}/architecture-summary.json","w"), indent=2)
print(json.dumps(summary, indent=2))
