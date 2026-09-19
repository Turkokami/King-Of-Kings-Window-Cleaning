/**
 * awards.ts — real, third-party, dated recognitions.
 *
 * WHY THIS FILE EXISTS. The audit flagged P0-5: "Try Bellingham's Best Window
 * Washing Risk-Free" runs as an <h2> on 74 pages — an unsubstantiated
 * superiority claim, which doctrine #6 forbids.
 *
 * The fix was sitting on the client's own /awards/ page the whole time. They do
 * not need to claim they are the best. The Bellingham Herald's readers voted
 * them Gold for Best Cleaning Service in two consecutive years. That is a
 * substantiated claim, it is attributable, it is dated, and it is far stronger
 * than the puffery it replaces.
 *
 * These feed:
 *   · the `award` property on the LocalBusiness node
 *   · the trust strip on every page
 *   · the substantiated headline that replaces "Bellingham's Best"
 *
 * VERIFY: each of these was read off the client's own /awards/ page on
 * 2026-09-10. Confirm the exact award wording with the awarding bodies before
 * publishing — an award named slightly wrong is worse than one not named.
 */

export interface Award {
  year: number;
  name: string;
  level: 'Gold' | 'Silver' | 'Platinum' | 'Finalist' | 'Winner';
  category: string;
  awardedBy: string;
  /** Safe to lead with? Gold/Platinum wins in the core category only. */
  headline: boolean;
  /**
   * The awarding body's own badge, mirrored into /public/awards from the
   * client's awards page. Optional: an award with no badge renders as a plain
   * card rather than borrowing another award's artwork.
   */
  badge?: string;
  /** The short line under the badge, in the wording the client's own page uses. */
  shortLabel: string;
}

export const AWARDS: Award[] = [
  { year: 2026, name: 'Cascades Best', level: 'Gold', category: 'Best Cleaning Service', awardedBy: 'The Bellingham Herald', headline: true, badge: '/awards/cascades-2026-cleaning-service.webp', shortLabel: 'Voted Best Cleaning Service' },
  { year: 2026, name: 'Cascades Best', level: 'Silver', category: 'Best Customer Service', awardedBy: 'The Bellingham Herald', headline: false, badge: '/awards/cascades-2026-customer-service.webp', shortLabel: 'Voted Best Customer Service' },
  { year: 2025, name: 'Cascades Best', level: 'Gold', category: 'Best Cleaning Service', awardedBy: 'The Bellingham Herald', headline: true, badge: '/awards/cascades-2025-cleaning-service.webp', shortLabel: 'Voted Best Cleaning Service' },
  // 2026 CommunityVotes Bellingham — supplied by the client 2026-09-18 with the
  // "Bellingham 2026 Winners" badge, and the badge artwork itself on 2026-09-19.
  // Client-attested: recorded and dated, not independently verified against the
  // CommunityVotes listing.
  //
  // BOTH 2026 ROWS CARRY THE SAME BADGE ON PURPOSE. CommunityVotes issues one
  // winners badge per town per year, not one per category, so this is each
  // award's own artwork rather than one award borrowing another's. The badge is
  // not on the client's live awards page — the file dated 2026 there is the 2025
  // badge re-uploaded — so this copy came from the client directly.
  { year: 2026, name: 'CommunityVotes Bellingham', level: 'Gold', category: 'Best Cleaning Service', awardedBy: 'CommunityVotes Bellingham', headline: true, badge: '/awards/communityvotes-2026-winners.webp', shortLabel: 'Voted Gold, Best Cleaning Service' },
  { year: 2026, name: 'CommunityVotes Bellingham', level: 'Platinum', category: 'Best Window Cleaning', awardedBy: 'CommunityVotes Bellingham', headline: true, badge: '/awards/communityvotes-2026-winners.webp', shortLabel: 'Voted Platinum, Window Cleaning' },
  { year: 2025, name: 'CommunityVotes Bellingham', level: 'Platinum', category: 'Best Window Cleaning', awardedBy: 'CommunityVotes Bellingham', headline: true, badge: '/awards/communityvotes-2025-platinum-window-cleaning.webp', shortLabel: 'Voted Best in Window Cleaning' },
  { year: 2025, name: 'Neighborhood Fave', level: 'Winner', category: 'Neighborhood Favorite', awardedBy: 'Nextdoor', headline: false, badge: '/awards/nextdoor-neighborhood-fave-2025.webp', shortLabel: 'Neighborhood Fave 2025' },
  { year: 2024, name: 'Neighborhood Fave', level: 'Winner', category: 'Neighborhood Favorite', awardedBy: 'Nextdoor', headline: false, badge: '/awards/nextdoor-neighborhood-fave-2024.webp', shortLabel: 'Neighborhood Fave 2024' },
  { year: 2024, name: 'Whatcom Business Alliance Awards', level: 'Finalist', category: 'Start-Up Business of the Year', awardedBy: 'Whatcom Business Alliance', headline: false, badge: '/awards/whatcom-business-awards-2024-finalist.webp', shortLabel: 'Start-Up Business finalist' },
  // Published on the client's own /awards/ page with its badge; added here
  // 2026-09-19 so the grid matches that page. Client-attested, not verified
  // against BusinessRate directly.
  { year: 2024, name: 'Best of BusinessRate', level: 'Winner', category: 'Window Cleaning Service', awardedBy: 'BusinessRate', headline: false, badge: '/awards/businessrate-2024-best-reviews.webp', shortLabel: 'Voted Best Reviews' },
];

/** schema.org `award` — one plain string per recognition.
 *
 * `level` is already the whole word for Nextdoor's "Winner" and the WBA's
 * "Finalist", so appending " Winner," to everything that is not a Finalist
 * emitted "Winner Winner, Neighborhood Favorite" into the schema graph. Only the
 * placing levels take the noun.
 */
export const awardStrings = (): string[] =>
  AWARDS.map((a) => `${a.year} ${a.name} — ${a.level}${['Gold', 'Silver', 'Platinum'].includes(a.level) ? ' Winner,' : ','} ${a.category} (${a.awardedBy})`);

export const latestHeadlineAward = (): Award | null =>
  AWARDS.filter((a) => a.headline).sort((a, b) => b.year - a.year)[0] ?? null;

/**
 * The substantiated replacement for "Bellingham's Best".
 * Says something true and attributable instead of something loud.
 */
export const substantiatedClaim = (): string => {
  const a = latestHeadlineAward();
  if (!a) return 'Licensed and L&I insured, working Whatcom and Skagit County.';
  return `Voted ${a.level} — ${a.category}, ${a.year} ${a.name}, ${a.awardedBy}.`;
};

/** Consecutive-year Gold in the same category is the strongest honest line available. */
export const streakClaim = (): string | null => {
  const golds = AWARDS.filter((a) => a.name === 'Cascades Best' && a.level === 'Gold' && a.category === 'Best Cleaning Service').map((a) => a.year).sort();
  if (golds.length < 2) return null;
  const consecutive = golds.every((y, i) => i === 0 || y === golds[i - 1] + 1);
  if (!consecutive) return null;
  return `Cascades Best Gold, Best Cleaning Service, ${golds[0]} and ${golds[golds.length - 1]} — The Bellingham Herald.`;
};
