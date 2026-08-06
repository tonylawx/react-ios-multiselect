/**
 * Minimal option shape needed for search ranking. Kept free of React so the
 * filter can be unit-tested as a pure module (same pattern as
 * select-interaction / select-layout / select-virtual).
 */
export type SearchableOption = {
  value: string;
  label: string;
  description?: string;
};

/**
 * Match quality for a single option against a (already-normalized) query.
 * Lower number = better match. `null` means no match.
 *
 *   0 exact   — label or value equals the query
 *   1 prefix  — label or value starts with the query
 *   2 contains — label, value, or description includes the query
 */
export type SearchMatchRank = 0 | 1 | 2;

/**
 * Rank one option against a lowercased, trimmed query. Description only
 * contributes to the "contains" tier — an exact/prefix hit on description
 * alone would surprise users who typed a symbol/label.
 */
export function getSearchMatchRank(
  option: SearchableOption,
  normalizedQuery: string
): SearchMatchRank | null {
  if (!normalizedQuery) return null;
  const label = option.label.toLowerCase();
  const value = option.value.toLowerCase();
  if (label === normalizedQuery || value === normalizedQuery) return 0;
  if (label.startsWith(normalizedQuery) || value.startsWith(normalizedQuery)) {
    return 1;
  }
  const description = (option.description ?? "").toLowerCase();
  if (
    label.includes(normalizedQuery) ||
    value.includes(normalizedQuery) ||
    description.includes(normalizedQuery)
  ) {
    return 2;
  }
  return null;
}

/**
 * Filter options by `query` and rank them so the best matches land at the
 * top of the visible list (exact → prefix → contains). Within the same rank,
 * the original options order is preserved (stable).
 *
 * Empty / whitespace-only queries return the input unchanged (same reference)
 * so callers that key off array identity (empty-query restore) keep working.
 */
export function filterAndRankOptions<T extends SearchableOption>(
  options: readonly T[],
  query: string
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return options as T[];

  const ranked: { option: T; rank: SearchMatchRank; index: number }[] = [];
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    const rank = getSearchMatchRank(option, q);
    if (rank === null) continue;
    ranked.push({ option, rank, index: i });
  }
  ranked.sort((a, b) => a.rank - b.rank || a.index - b.index);
  return ranked.map((entry) => entry.option);
}
