# Search Console baseline — taken before the cutover

Exported 2026-10-02, covering 2025-05-30 to 2026-09-29 (the last 16 months), while the LEGACY
WordPress site was still the one serving. This is the "before" the rebuild gets
measured against, and it is recorded here because the comparison is impossible
to reconstruct afterwards: the 16-month window slides, so these numbers change
every week whether or not anything else does.

The property is verified by a meta tag, which this build now serves (see
`BUSINESS.googleSiteVerification`). Same domain, same URLs: no Change of
Address, and the history below carries across the swap.

## Totals

| | 16 months | Last 90 days |
|---|---|---|
| Clicks | 925 | 240 |
| Impressions | 40887 | 9321 |

## By device

| Device | Clicks | Impressions | CTR | Avg position |
|---|---|---|---|---|
| Mobile | 666 | 13312 | 5% | 23.05 |
| Desktop | 244 | 27363 | 0.89% | 27.79 |
| Tablet | 15 | 212 | 7.08% | 8.29 |

Mobile is 72% of the clicks on 33% of the impressions. Desktop impressions are
mostly deep-position listings nobody clicks — which is what the position column
says, and why the mobile layout mattered more than it looked like it did.

## The queries that matter, with where they stood

Anything under position 20 is on page one or two; the 50s and 60s are pages
that exist on the legacy site and barely rank, which is exactly where the
rebuilt town-and-service pages are aimed.

| Query | Clicks | Impressions | Position |
|---|---|---|---|
| window cleaning bellingham | 27 | 2155 | 9.73 |
| bellingham window cleaning | 3 | 1723 | 14.25 |
| gutter cleaning bellingham | 1 | 1145 | 45.29 |
| window cleaning | 2 | 889 | 7.6 |
| window washing bellingham | 6 | 804 | 21.48 |
| roof cleaning bellingham | 2 | 778 | 36.75 |
| bellingham gutter cleaning | 0 | 720 | 52.46 |
| window cleaning bellingham wa | 5 | 652 | 11.16 |
| king of kings window cleaning | 249 | 640 | 1.22 |
| pressure washing bellingham | 1 | 580 | 51.06 |
| solar panel cleaning bellingham | 1 | 524 | 14.58 |
| bellingham solar panel cleaning | 0 | 499 | 16.28 |
| window cleaning near me | 3 | 429 | 4.05 |
| high rise window cleaning bellingham | 0 | 419 | 24 |
| bellingham window washing | 0 | 410 | 28.47 |
| roof moss removal bellingham | 0 | 393 | 57.84 |
| window washers bellingham wa | 0 | 378 | 13.62 |
| window cleaning reading | 0 | 363 | 4.11 |
| bellingham roof moss removal | 0 | 347 | 54.71 |
| windows bellingham | 0 | 340 | 73.59 |

## The pages that carry the traffic

| Page | Clicks | Impressions | Position |
|---|---|---|---|
| / | 870 | 27142 | 16.12 |
| /reviews/ | 24 | 2489 | 6.02 |
| /contact/ | 11 | 2188 | 9.45 |
| /solar-panel-cleaning/ | 10 | 1626 | 21.26 |
| /roof-cleaning/ | 4 | 4534 | 53.76 |
| /residential-window-cleaning/ | 4 | 4369 | 38.28 |
| /services/pressure-washing/ | 2 | 1420 | 32.24 |
| /faq/ | 2 | 254 | 19 |
| /awards/ | 2 | 112 | 12.3 |
| /about/ | 1 | 2411 | 16.35 |
| /service-area/ | 1 | 1443 | 12.79 |
| /pricing/ | 1 | 99 | 9.7 |

The home page is 94% of all clicks. Ten pages were still being served at the
same path by the new build at the time of this export; everything else in the
list redirects. That is checked by `.image-work/gsc_coverage.py`, which reads
this same export and reports any URL Google knows about that would 404.

