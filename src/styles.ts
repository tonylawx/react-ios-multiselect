/**
 * Semantic → real className map.
 *
 * The component code references `styles.<semanticName>` (e.g. `styles.trigger`),
 * and this maps each to a real, prefixed, global class shipped in
 * `aapl-select.css`. Keeping it as a plain object (not a CSS Module import)
 * means the published CSS and the runtime classNames always match — no build-
 * time hashing — so a consumer only needs `import "react-ios-multiselect/style.css"`.
 */
export const styles = {
  // trigger
  trigger: "rioselect-trigger",
  triggerLabel: "rioselect-trigger-label",
  triggerLabelPlaceholder: "rioselect-trigger-label-placeholder",
  chevron: "rioselect-chevron",

  // scroll helpers
  scroll: "rioselect-scroll",
  sheetScroll: "rioselect-sheet-scroll",

  // desktop body
  desktopBody: "rioselect-desktop-body",
  desktopSearchBar: "rioselect-desktop-search-bar",
  searchIcon: "rioselect-search-icon",
  searchInput: "rioselect-search-input",
  desktopScrollWrap: "rioselect-desktop-scroll-wrap",
  desktopScroll: "rioselect-desktop-scroll",
  edgeTop: "rioselect-edge-top",
  edgeBottom: "rioselect-edge-bottom",
  emptyText: "rioselect-empty-text",

  // option rows
  option: "rioselect-option",
  optionDesktop: "rioselect-option-desktop",
  optionDesktopSelected: "rioselect-option-desktop-selected",
  optionMobile: "rioselect-option-mobile",
  optionDisabled: "rioselect-option-disabled",
  optionMain: "rioselect-option-main",
  optionLabel: "rioselect-option-label",
  optionDescription: "rioselect-option-description",
  check: "rioselect-check",
  checkDesktop: "rioselect-check-desktop",
  checkMobile: "rioselect-check-mobile",
  checkSpacer: "rioselect-check-spacer",

  // mobile sheet
  overlay: "rioselect-overlay",
  overlayVisible: "rioselect-overlay-visible",
  overlayHidden: "rioselect-overlay-hidden",
  overlayOpen: "rioselect-overlay-open",
  overlayClosed: "rioselect-overlay-closed",
  backdrop: "rioselect-backdrop",
  sheet: "rioselect-sheet",
  sheetOpen: "rioselect-sheet-open",
  sheetClosed: "rioselect-sheet-closed",
  sheetHeader: "rioselect-sheet-header",
  sheetTitle: "rioselect-sheet-title",
  iconBtnRound: "rioselect-icon-btn-round",
  closeBtn: "rioselect-close-btn",
  confirmBtn: "rioselect-confirm-btn",
  confirmSpacer: "rioselect-confirm-spacer",
  sheetBody: "rioselect-sheet-body",

  // mobile list
  mobileListWrap: "rioselect-mobile-list-wrap",
  mobileList: "rioselect-mobile-list",
  virtualTrack: "rioselect-virtual-track",
  virtualWindow: "rioselect-virtual-window",
  mobileEdgeTop: "rioselect-mobile-edge-top",
  mobileEmptyText: "rioselect-mobile-empty-text",

  // mobile search accessory
  searchAccessory: "rioselect-search-accessory",
  searchAccessoryBar: "rioselect-search-accessory-bar",
  searchAccessoryIcon: "rioselect-search-accessory-icon",
  searchAccessoryInput: "rioselect-search-accessory-input",
  clearBtn: "rioselect-clear-btn",
  clearIcon: "rioselect-clear-icon",
  safeAreaSpacer: "rioselect-safe-area-spacer",

  // popover
  popoverContent: "rioselect-popover-content",
} as const;

export type AAPLSelectStyles = typeof styles;
