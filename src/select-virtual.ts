export const OPTION_ROW_HEIGHT = 64;
export const OPTION_OVERSCAN = 6;

/**
 * Stable signature of the *visible* option list, used as a scroll-reset key.
 * It changes whenever the first value or the total count changes — including
 * the tricky case where an empty search query restores the original options
 * array (same reference) after a filtered view. Returning a fresh string here
 * forces the list back to the top so the user sees the first match.
 */
export function optionListSignature(
  options: readonly { value: string }[] | null | undefined
): string {
  if (!options || options.length === 0) return "0:";
  return `${options.length}:${options[0].value}`;
}

export function computeVirtualOptionRange({
  itemCount,
  scrollTop,
  viewportHeight,
  rowHeight = OPTION_ROW_HEIGHT,
  overscan = OPTION_OVERSCAN
}: {
  itemCount: number;
  scrollTop: number;
  viewportHeight: number;
  rowHeight?: number;
  overscan?: number;
}) {
  const safeCount = Math.max(0, Math.floor(itemCount));
  const safeRowHeight = Math.max(1, rowHeight);
  const safeViewportHeight = Math.max(0, viewportHeight);
  const totalHeight = safeCount * safeRowHeight;
  const maxScrollTop = Math.max(0, totalHeight - safeViewportHeight);
  const safeScrollTop = Math.min(maxScrollTop, Math.max(0, scrollTop));
  const safeOverscan = Math.max(0, Math.floor(overscan));
  const visibleStart = Math.floor(safeScrollTop / safeRowHeight);
  const visibleCount = Math.ceil(safeViewportHeight / safeRowHeight);
  const startIndex = Math.max(0, Math.min(safeCount, visibleStart - safeOverscan));
  const endIndex = Math.max(
    startIndex,
    Math.min(safeCount, visibleStart + visibleCount + safeOverscan)
  );

  return {
    startIndex,
    endIndex,
    offsetTop: startIndex * safeRowHeight,
    totalHeight
  };
}
