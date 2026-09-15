/**
 * schema.ts — the hand-built 7-node JSON-LD graph (Keystone Part 5).
 *
 * This is the file the whole audit turns on. The legacy site emits four nodes per
 * page — WebPage, BreadcrumbList and two ListItems — and zero LocalBusiness,
 * Organization or Service across all 287 URLs.
 *
 * RULES ENFORCED HERE
 *  · One emitter. Nothing else on this site writes JSON-LD. Ever.
 *  · The root #localbusiness entity is declared ONCE per domain and imported by
 *    @id everywhere else. No node is redeclared on a child page.
 *  · aggregateRating emits only from a verified GBP pull (READY.aggregateRating).
 *  · Review / AggregateRating markup for our OWN business on our OWN pages is
 *    ineligible for rich results and is never emitted from page content.
 *  · Exactly one FAQPage per URL, built from the SAME array the visible block
 *    renders from — never a second, divergent copy.
 *  · No SpeakableSpecification — M4 retired in v2 (it never applied to local business).
 *  · Every node is validated by scripts/validate-schema.mjs before push.
 */

import { BUSINESS, READY, sameAsList } from '../data/business';
import { areaServed } from '../data/markets';
import { awardStrings } from '../data/awards';

const S = BUSINESS.siteUrl;

export const ID = {
  website: `${S}/#website`,
  business: `${S}/#localbusiness`,
  logo: `${S}/#logo`,
  expert: `${S}/#named-expert`,
  page: (path: string) => `${S}${path}#webpage`,
  primaryImage: (path: string) => `${S}${path}#primaryimage`,
  service: (path: string) => `${S}${path}#service`,
  faq: (path: string) => `${S}${path}#faq`,
  breadcrumb: (path: string) => `${S}${path}#breadcrumb`,
} as const;

export interface Crumb { name: string; path: string }
export interface Faq { q: string; a: string }

export interface PageSchemaInput {
  path: string;                    // always leading and trailing slash
  title: string;
  description: string;             // the AEO Quick Answer, reused (M2/M5)
  image: string;                   // absolute or root-relative
  imageAlt: string;
  crumbs: Crumb[];
  faqs: Faq[];
  /** Present on service and city×service pages only. */
  service?: { name: string; serviceType: string; areaName?: string };
  /** Present on library and blog pages. */
  article?: { headline: string; datePublished: string; dateModified: string };
  pageType?: 'WebPage' | 'CollectionPage' | 'ContactPage' | 'AboutPage' | 'ItemPage';
}

const abs = (u: string) => (u.startsWith('http') ? u : `${S}${u}`);

/* ------------------------------------------------------------------ node 4 */
/** The shared root entity. Declared once per domain; every page imports it by @id. */
function localBusinessNode() {
  const node: Record<string, unknown> = {
    '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
    '@id': ID.business,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: `${S}/`,
    telephone: BUSINESS.phoneE164,
    email: BUSINESS.email,
    image: { '@id': ID.logo },
    logo: { '@id': ID.logo },
    priceRange: '$$',
    areaServed: areaServed(),
  };

  // Address — locality/region always; street/postal only if the owner published them.
  const address: Record<string, string> = {
    '@type': 'PostalAddress',
    addressLocality: BUSINESS.address.addressLocality,
    addressRegion: BUSINESS.address.addressRegion,
    addressCountry: BUSINESS.address.addressCountry,
  };
  if (BUSINESS.address.streetAddress) address.streetAddress = BUSINESS.address.streetAddress;
  if (BUSINESS.address.postalCode) address.postalCode = BUSINESS.address.postalCode;
  node.address = address;

  if (READY.geo()) {
    node.geo = { '@type': 'GeoCoordinates', latitude: BUSINESS.geo.latitude, longitude: BUSINESS.geo.longitude };
  }
  if (READY.sameAs()) node.sameAs = sameAsList();
  if (BUSINESS.openingHours) {
    node.openingHoursSpecification = BUSINESS.openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days, opens: h.opens, closes: h.closes,
    }));
  }
  // Only from a verified platform pull. Never hand-entered. Never from page content.
  if (READY.aggregateRating()) {
    node.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: BUSINESS.reviews.ratingValue,
      reviewCount: BUSINESS.reviews.reviewCount,
    };
  }
  if (READY.expert()) node.founder = { '@id': ID.expert };
  if (BUSINESS.founded) node.foundingDate = BUSINESS.founded;

  // Seven dated, third-party recognitions — including two consecutive years of
  // Cascades Best Gold for Best Cleaning Service. This is what replaces the
  // "Bellingham's Best" claim: verifiable, attributed, and stronger.
  const awards = awardStrings();
  if (awards.length) node.award = awards;

  return node;
}

/* ----------------------------------------------------- the named-expert Person */
function expertNode() {
  if (!READY.expert()) return null;
  const e = BUSINESS.expert;
  const node: Record<string, unknown> = {
    '@type': 'Person',
    '@id': ID.expert,
    name: e.name,
    jobTitle: e.jobTitle,
    worksFor: { '@id': ID.business },
    // Randy is the registered agent and Individual Governor on the WA filing,
    // which is what makes founder/owner a factual statement rather than a title.
    founder: { '@id': ID.business },
  };

  // hasCredential emits ONLY with a real registration number behind it. A
  // credential node naming a licence we have not seen is a fabricated trust
  // signal, and doctrine #4 does not bend for convenience.
  if (READY.expertCredential()) {
    node.hasCredential = {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'license',
      name: e.credentialName,
      identifier: e.credential,
      recognizedBy: { '@type': 'GovernmentOrganization', name: 'Washington State Department of Labor & Industries' },
    };
  }
  if (e.photo) node.image = abs(e.photo);
  if (e.bio) node.description = e.bio;
  return node;
}

/* -------------------------------------------------------------- the full graph */
export function buildGraph(input: PageSchemaInput): string {
  const {
    path, title, description, image, imageAlt, crumbs, faqs,
    service, article, pageType = 'WebPage',
  } = input;

  const graph: Record<string, unknown>[] = [];

  // 1 · WebSite
  graph.push({
    '@type': 'WebSite',
    '@id': ID.website,
    url: `${S}/`,
    name: BUSINESS.name,
    publisher: { '@id': ID.business },
    inLanguage: 'en-US',
  });

  // 2 · WebPage — this URL
  const webpage: Record<string, unknown> = {
    '@type': pageType,
    '@id': ID.page(path),
    url: `${S}${path}`,
    name: title,
    description,
    isPartOf: { '@id': ID.website },
    about: { '@id': ID.business },
    primaryImageOfPage: { '@id': ID.primaryImage(path) },
    breadcrumb: { '@id': ID.breadcrumb(path) },
    inLanguage: 'en-US',
    // NOTE: SpeakableSpecification is deliberately absent. Keystone v2 retires
    // mandate M4 — Speakable never covered local-business pages, only news. The
    // Quick Answer requirement it carried now lives in M2, where it is an AEO
    // element rather than a markup one. Do not re-add this.
  };
  if (article) {
    webpage.datePublished = article.datePublished;
    webpage.dateModified = article.dateModified;
  }
  graph.push(webpage);

  // 3 · ImageObject
  graph.push({
    '@type': 'ImageObject',
    '@id': ID.primaryImage(path),
    url: abs(image),
    contentUrl: abs(image),
    caption: imageAlt,
  });
  // The logo, referenced by the business node — declared once, here.
  graph.push({
    '@type': 'ImageObject',
    '@id': ID.logo,
    url: abs(BUSINESS.logo),
    caption: BUSINESS.name,
  });

  // 4 · LocalBusiness — the shared root
  graph.push(localBusinessNode());

  // Person, when the expert exists
  const person = expertNode();
  if (person) graph.push(person);

  // 5 · Service or Article
  if (service) {
    const svc: Record<string, unknown> = {
      '@type': 'Service',
      '@id': ID.service(path),
      name: service.name,
      serviceType: service.serviceType,
      provider: { '@id': ID.business },
      areaServed: service.areaName
        ? { '@type': 'City', name: service.areaName }
        : areaServed(),
      mainEntityOfPage: { '@id': ID.page(path) },
    };
    if (person) svc.author = { '@id': ID.expert };
    graph.push(svc);
  } else if (article) {
    const art: Record<string, unknown> = {
      '@type': 'Article',
      '@id': `${S}${path}#article`,
      headline: article.headline,
      datePublished: article.datePublished,
      dateModified: article.dateModified,
      image: { '@id': ID.primaryImage(path) },
      publisher: { '@id': ID.business },
      mainEntityOfPage: { '@id': ID.page(path) },
      inLanguage: 'en-US',
    };
    if (person) { art.author = { '@id': ID.expert }; art.reviewedBy = { '@id': ID.expert }; }
    else art.author = { '@id': ID.business };
    graph.push(art);
  }

  // 6 · FAQPage — exactly one per URL, from the same array the page renders.
  if (faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': ID.faq(path),
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  // 7 · BreadcrumbList — mirrors the URL taxonomy exactly.
  graph.push({
    '@type': 'BreadcrumbList',
    '@id': ID.breadcrumb(path),
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${S}${c.path}`,
    })),
  });

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

/**
 * Keystone 5.3, the JSON-LD injection trap: this string must land inside a REAL
 * <script type="application/ld+json"> via set:html on that script element — never
 * through a framework pseudo-element, which double-escapes the whole graph and
 * renders it as visible text. BaseLayout.astro does this correctly; do not
 * "simplify" it.
 */
