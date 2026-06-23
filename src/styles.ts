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

  // scroll helper
  listScroll: "rios-list-scroll",

  // option rows
  option: "rios-option",
  optionRow: "rios-option-row",
  optionRowSelected: "rios-option-row-selected",
  optionDisabled: "rios-option-disabled",
  optionMain: "rios-option-main",
  optionLabel: "rios-option-label",
  optionDescription: "rios-option-description",

  // iOS-native filled checkmark
  checkWrap: "rios-check-wrap",
  checkCircle: "rios-check-circle",
  checkGlyph: "rios-check-glyph",
  checkSpacer: "rios-check-spacer",

  // empty state
  emptyText: "rios-empty-text",

  // sheet
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

  // virtualized list
  listWrap: "rios-list-wrap",
  list: "rios-list",
  virtualTrack: "rios-virtual-track",
  virtualWindow: "rios-virtual-window",
  listEdgeTop: "rios-list-edge-top",

  // search accessory
  searchAccessory: "rios-search-accessory",
  searchAccessoryBar: "rios-search-accessory-bar",
  searchAccessoryIcon: "rios-search-accessory-icon",
  searchAccessoryInput: "rios-search-accessory-input",
  clearBtn: "rios-clear-btn",
  clearIcon: "rios-clear-icon",
  safeAreaSpacer: "rios-safe-area-spacer",
} as const;

export type SelectStyles = typeof styles;
