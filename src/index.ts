export { Select, default } from "./select";
export type {
  SelectOption,
  SelectBaseProps,
  SelectProps,
  SingleProps,
  MultiProps,
} from "./select";
export { cn } from "./utils";

// Re-export the pure logic helpers so consumers / advanced users can build
// their own UI on top of the same primitives (virtualization, layout, etc.).
export { computeMobileSheetLayout } from "./select-layout";
export {
  OPTION_ROW_HEIGHT,
  OPTION_OVERSCAN,
  computeVirtualOptionRange,
  optionListSignature,
} from "./select-virtual";
