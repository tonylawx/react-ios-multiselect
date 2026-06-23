/**
 * Semantic → real className map.
 *
 * The component code references `styles.<semanticName>` (e.g. `styles.trigger`),
 * and this maps each to a real, prefixed, global class shipped in `select.css`.
 * Keeping it as a plain object (not a CSS Module import) means the published
 * CSS and the runtime classNames always match — no build-time hashing — so a
 * consumer only needs `import "react-ios-multiselect/style.css"`.
 */
export const styles = {
  // trigger
  trigger: "rios-trigger",
  triggerLabel: "rios-trigger-label",
  triggerLabelPlaceholder: "rios-trigger-label-placeholder",
  chevron: "rios-chevron",
  chevronOpen: "rios-chevron-open",

  // scroll helpers
  scroll: "rios-scroll",
  sheetScroll: "rios-sheet-scroll",

  // desktop body
  desktopBody: "rios-desktop-body",
  desktopSearchBar: "rios-desktop-search-bar",
  searchIcon: "rios-search-icon",
  searchInput: "rios-search-input",
  desktopScrollWrap: "rios-desktop-scroll-wrap",
  desktopScroll: "rios-desktop-scroll",
  edgeTop: "rios-edge-top",
  edgeBottom: "rios-edge-bottom",
  emptyText: "rios-empty-text",

  // option rows
  option: "rios-option",
  optionDesktop: "rios-option-desktop",
  optionDesktopSelected: "rios-option-desktop-selected",
  optionMobile: "rios-option-mobile",
  optionMobileSelected: "rios-option-mobile-selected",
  optionDisabled: "rios-option-disabled",
  optionMain: "rios-option-main",
  optionLabel: "rios-option-label",
  optionDescription: "rios-option-description",

  // iOS-native filled checkmark
  checkWrap: "rios-check-wrap",
  checkCircle: "rios-check-circle",
  checkCircleDesktop: "rios-check-circle-desktop",
  checkCircleMobile: "rios-check-circle-mobile",
  checkGlyph: "rios-check-glyph",
  checkSpacer: "rios-check-spacer",

  // mobile sheet
  overlay: "rios-overlay",
  overlayVisible: "rios-overlay-visible",
  overlayHidden: "rios-overlay-hidden",
  overlayOpen: "rios-overlay-open",
  overlayClosed: "rios-overlay-closed",
  backdrop: "rios-backdrop",
  sheet: "rios-sheet",
  sheetOpen: "rios-sheet-open",
  sheetClosed: "rios-sheet-closed",
  sheetHeader: "rios-sheet-header",
  sheetTitle: "rios-sheet-title",
  iconBtnRound: "rios-icon-btn-round",
  closeBtn: "rios-close-btn",
  closeIcon: "rios-close-icon",
  confirmBtn: "rios-confirm-btn",
  confirmIcon: "rios-confirm-icon",
  confirmSpacer: "rios-confirm-spacer",
  sheetBody: "rios-sheet-body",

  // mobile list
  mobileListWrap: "rios-mobile-list-wrap",
  mobileList: "rios-mobile-list",
  virtualTrack: "rios-virtual-track",
  virtualWindow: "rios-virtual-window",
  mobileEdgeTop: "rios-mobile-edge-top",
  mobileEmptyText: "rios-mobile-empty-text",

  // mobile search accessory
  searchAccessory: "rios-search-accessory",
  searchAccessoryBar: "rios-search-accessory-bar",
  searchAccessoryIcon: "rios-search-accessory-icon",
  searchAccessoryInput: "rios-search-accessory-input",
  clearBtn: "rios-clear-btn",
  clearIcon: "rios-clear-icon",
  safeAreaSpacer: "rios-safe-area-spacer",

  // popover
  popoverContent: "rios-popover-content",
} as const;

export type SelectStyles = typeof styles;
