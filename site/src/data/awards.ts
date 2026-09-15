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
}

export const AWARDS: Award[] = [
  { year: 2026, name: 'Cascades Best', level: 'Gold', category: 'Best Cleaning Service', awardedBy: 'The Bellingham Herald', headline: true },
  { year: 2026, name: 'Cascades Best', level: 'Silver', category: 'Best Customer Service', awardedBy: 'The Bellingham Herald', headline: false },
  { year: 2025, name: 'Cascades Best', level: 'Gold', category: 'Best Cleaning Service', awardedBy: 'The Bellingham Herald', headline: true },
  { year: 2025, name: 'CommunityVotes Bellingham', level: 'Platinum', category: 'Best Window Cleaning', awardedBy: 'CommunityVotes Bellingham', headline: true },
  { year: 2025, name: 'Neighborhood Fave', level: 'Winner', category: 'Neighborhood Favorite', awardedBy: 'Nextdoor', headline: false },
  { year: 2024, name: 'Neighborhood Fave', level: 'Winner', category: 'Neighborhood Favorite', awardedBy: 'Nextdoor', headline: false },
  { year: 2024, name: 'Whatcom Business Alliance Awards', level: 'Finalist', category: 'Start-Up Business of the Year', awardedBy: 'Whatcom Business Alliance', headline: false },
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
  const golds = AWARDS.filter((a) => a.level === 'Gold' && a.category === 'Best Cleaning Service').map((a) => a.year).sort();
  if (golds.length < 2) return null;
  const consecutive = golds.every((y, i) => i === 0 || y === golds[i - 1] + 1);
  if (!consecutive) return null;
  return `Cascades Best Gold, Best Cleaning Service, ${golds[0]} and ${golds[golds.length - 1]} — The Bellingham Herald.`;
};
