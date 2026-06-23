export { AAPLSelect, default } from "./aapl-select";
export type {
  AAPLSelectOption,
  AAPLSelectBaseProps,
  AAPLSelectProps,
  SingleProps,
  MultiProps,
} from "./aapl-select";
export { cn } from "./utils";

// Re-export the pure logic helpers so consumers / advanced users can build
// their own UI on top of the same primitives (virtualization, layout, etc.).
export {
  AAPL_SELECT_MOBILE_BREAKPOINT,
  computeMobileSheetLayout,
} from "./aapl-select-layout";
export {
  AAPL_SELECT_OPTION_ROW_HEIGHT,
  AAPL_SELECT_OPTION_OVERSCAN,
  computeVirtualOptionRange,
  optionListSignature,
} from "./aapl-select-virtual";
export { getAAPLSelectMountPolicy } from "./aapl-select-performance";
