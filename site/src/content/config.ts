/**
 * content/config.ts — collection schemas.
 *
 * Keystone 6.2: "Writers output directly into the content collection; integration
 * is the next build. Bad data fails fast against the collection schema."
 *
 * The word-count floor is not enforced here (Zod cannot count a markdown body
 * cheaply) — scripts/word-count.mjs enforces M1 across the whole set before push.
 */
import { defineCollection, z } from 'astro:content';

const faq = z.array(z.object({ q: z.string().min(8), a: z.string().min(40) })).min(6).max(8);

/**
 * Keystone v3.2, Part 4.3 — the snippet-shape contract.
 *
 * Every page declares ONE extraction shape it is built to win, and the declared
 * shape has to be present in real semantic markup: a list shape needs an actual
 * <ol>/<ul>, a table shape needs an actual <table> with a <th> header row. A
 * styled stack of divs is not a list and a flex grid is not a table — that is
 * named in the standard as the single most common way a page-builder site loses
 * a shape it otherwise deserves.
 *
 * The paragraph target is always the Quick Answer (M2) and is never a second
 * block competing with it, so 'paragraph' is implied by every value here rather
 * than being one option among equals.
 *
 * Honest framing, carried from the standard: this buys extraction-READINESS, not
 * snippet placement. No audit claims a snippet as a deliverable.
 */
const snippetShape = z.enum(['paragraph', 'paragraph+list', 'paragraph+table', 'paragraph+table+list']);

/**
 * Keystone v3.2, Part 6.5 — citability. Four checkable signals for whether a page
 * is worth quoting, kept in frontmatter so they are auditable rather than hoped
 * for. Distinct from the M1 substance gate: that asks whether the page is unique,
 * this asks whether any sentence in it is liftable.
 */
/**
 * NOTE ON ENFORCEMENT. Dimension 13 scores "the SHARE of indexable pages carrying
 * all four Part 6.5 signals" — a proportion, not a per-page publish condition. So
 * these are optional in the schema and measured by scripts/citability.mjs, which
 * reports the share and names the gaps. Making them hard-required would brick a
 * build over a signal the standard itself scores as a percentage, and v3.2 spent
 * its whole changelog retiring gates that blocked shipping without catching
 * anything.
 */
const citability = {
  /**
   * Signal 1 — one quantified, sourced fact that is NOT about the business. A
   * number, a named source and a date, about the world the page describes.
   * Engines carry this far more readily than a fact about us.
   */
  quantifiedFact: z.object({
    claim: z.string().min(20),
    source: z.string().min(3),
    date: z.string().min(4),
  }).optional(),
  /**
   * Signal 2 — one outbound citation to a primary authority, named in the VISIBLE
   * sentence rather than buried in an href or swept into a footer sources block.
   */
  primaryAuthority: z.object({ name: z.string().min(3), url: z.string().url() }).optional(),
  /**
   * Signal 3 — one stated position: a sentence of judgement the current top five
   * do not make. This is the part an LLM cannot generate from the SERP, because
   * it is not in the SERP.
   */
  statedPosition: z.string().min(30).optional(),
  /**
   * Signal 4 — first-party data where it exists. Aggregate, non-identifying, and
   * genuinely ours. Null where it does not exist yet: prime directive 8 forbids
   * estimating one, and the standard says to say so and move on.
   */
  firstPartyData: z.string().nullable().default(null),
};

const base = {
  title: z.string().max(60, 'M5: title over 60 chars'),
  /** The AEO Quick Answer. Reused as meta description and first FAQ answer. */
  answer: z.string().min(180).max(420),
  metaDescription: z.string().min(110).max(165)
    .refine((s) => /[.!?]$/.test(s.trim()), 'M5: description must end on punctuation'),
  heroImage: z.string(),
  heroAlt: z.string().max(125, 'M6: alt over 125 chars'),
  faqs: faq,
  /**
   * Keystone v3.2, Part 6.6 — content decay. This renders as a VISIBLE
   * last-updated date and is tied to a substantive edit. Bumping it without the
   * content moving is fabrication, and a date that moves without the content is
   * worse than no date at all.
   */
  updated: z.coerce.date(),
  /** Part 4.3 — required, and checked against real markup by the harness. */
  snippetShape,
  ...citability,
};

/**
 * The four-item substance gate (Keystone v2, mandate M1). This replaced the
 * 3,000-word floor. Encoded in frontmatter so it is auditable rather than
 * asserted, and checked again across the whole set by scripts/word-count.mjs.
 * Item four — zero sentences shared with a sibling — is enforced by dedup.mjs.
 */
const substanceGate = {
  /** Item 1 — three verifiable local specifics. Sourced, not remembered. */
  localFacts: z.array(z.string()).min(3,
    'Substance gate item 1: three verifiable local specifics'),
  /** Item 2 — first-party proof from THIS geography: a real job, photo or review. */
  firstPartyProof: z.string().min(20,
    'Substance gate item 2: first-party proof from this geography'),
  /** Item 3 — one fact the top five competitors do not carry. */
  uniqueFact: z.string().min(20,
    'Substance gate item 3: a fact the top five do not carry'),
};

/**
 * T4 city page. Separate from cityService because it answers a different
 * question — "do you work here, and what is different about here" rather than
 * "here is this one service in this one place." Both carry the substance gate;
 * only this one carries the areaServed list for the geographies Part 6A declined,
 * which is how a declined geography still gets said.
 */
const city = defineCollection({
  type: 'content',
  schema: z.object({
    ...base,
    ...substanceGate,
    market: z.string(),
    /** Slugs of nearby geographies that did NOT earn their own page. */
    areaServed: z.array(z.string()).default([]),
    priceBand: z.string().nullable().default(null),
  }),
});

const cityService = defineCollection({
  type: 'content',
  schema: z.object({
    ...base,
    ...substanceGate,
    market: z.string(),
    service: z.string(),
    priceBand: z.string().nullable().default(null),
    caseStudy: z.string().nullable().default(null),
  }),
});

const neighborhood = defineCollection({
  type: 'content',
  schema: z.object({
    ...base,
    ...substanceGate,
    market: z.string(),
    /**
     * Prime directive 8 (v2): never invent a place name. A neighborhood slug
     * must come from the City's own published list, county plat records, or
     * Census/Overture place data — never from an agent's assumption.
     */
    neighborhood: z.string(),
    neighborhoodSource: z.string().url(
      'Prime directive 8: a neighborhood name needs a source URL'),
  }),
});

const service = defineCollection({
  type: 'content',
  schema: z.object({ ...base, service: z.string(), problems: z.array(z.string()).default([]) }),
});

const problem = defineCollection({
  type: 'content',
  schema: z.object({ ...base, parentService: z.string() }),
});

const library = defineCollection({
  type: 'content',
  schema: z.object({
    ...base,
    category: z.enum(['glass', 'siding', 'roofing', 'gutters', 'growth', 'soiling']),
    linkedServices: z.array(z.string()).min(1),
  }),
});

const compliance = defineCollection({
  type: 'content',
  schema: z.object({
    ...base,
    /** Doctrine: factual/legal claims carry a source and a review date. */
    sources: z.array(z.object({ label: z.string(), url: z.string().url() })).min(1),
    reviewed: z.coerce.date(),
  }),
});

const caseStudy = defineCollection({
  type: 'content',
  schema: z.object({
    ...base,
    market: z.string(),
    service: z.string(),
    neighborhood: z.string().nullable().default(null),
    propertyType: z.string(),
    outcome: z.string(),
    // Keystone Part 18-H: honest case-study JSON-LD. No fabricated ratings,
    // dates or stats — only what actually happened on a real job.
    photos: z.array(z.object({ src: z.string(), alt: z.string().max(125) })).min(2),
  }),
});

/** Home, guarantee, about — one-off pages whose bodies are still 3,000+ words. */
const sitePage = defineCollection({
  type: 'content',
  schema: z.object({ ...base, kind: z.enum(['home', 'trust', 'financing']) }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    ...base,
    /** Every post feeds exactly ONE service spoke. Never a chronological dump. */
    cluster: z.string(),
    published: z.coerce.date(),
    /** Legacy URLs consolidated into this post — drives the redirect map. */
    consolidates: z.array(z.string()).default([]),
  }),
});

export const collections = { city, cityService, neighborhood, service, problem, library, compliance, caseStudy, blog, sitePage };
