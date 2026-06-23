export const AAPL_SELECT_MOBILE_BREAKPOINT = 640;

export function computeMobileSheetLayout({
  layoutHeight,
  visualHeight,
  visualOffsetTop,
  keyboardActive = false
}: {
  layoutHeight: number;
  visualHeight: number;
  visualOffsetTop: number;
  keyboardActive?: boolean;
}) {
  const safeLayoutHeight = Math.max(0, layoutHeight);
  const safeVisualHeight = Math.max(0, visualHeight);
  const safeOffsetTop = Math.max(0, visualOffsetTop);

  // With the keyboard up, pin the sheet to the *visual* viewport edges: its
  // top sits at the visual viewport top and its bottom at the visual viewport
  // bottom (= keyboard top). Using both anchors (top + bottom) instead of a
  // computed height makes the layout robust to visualViewport update timing
  // — the sheet fills the visible area as soon as the numbers arrive, with no
  // gap above (backdrop) or between the search field and the keyboard.
  if (keyboardActive) {
    const top = safeOffsetTop;
    const bottom = Math.max(0, safeLayoutHeight - safeOffsetTop - safeVisualHeight);
    return {
      top,
      bottom,
      // height=null: let top + bottom define the box. This avoids the
      // maxHeight/height conflict and any stale visualViewport reading
      // leaving a half-height sheet.
      maxHeight: null,
      height: null
    };
  }

  return {
    top: null,
    bottom: 0,
    maxHeight: Math.min(safeVisualHeight, safeLayoutHeight * 0.85),
    height: null
  };
}
