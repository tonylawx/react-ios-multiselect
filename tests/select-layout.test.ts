import { describe, expect, test } from "bun:test";

import {
  MOBILE_BREAKPOINT,
  computeMobileSheetLayout
} from "../src/select-layout";

describe("Select mobile layout", () => {
  test("uses the same breakpoint as the Tailwind sm layout", () => {
    expect(MOBILE_BREAKPOINT).toBe(640);
  });

  test("uses at most 85% of the layout viewport when the keyboard is closed", () => {
    expect(computeMobileSheetLayout({
      layoutHeight: 844,
      visualHeight: 844,
      visualOffsetTop: 0
    })).toEqual({
      top: null,
      bottom: 0,
      maxHeight: 717.4,
      height: null
    });
  });

  test("does not mistake Safari browser chrome for the software keyboard", () => {
    // visualHeight shrinks but no input is focused → treat as browser chrome,
    // keep the sheet bottom-anchored, not pinned to the visual viewport top.
    expect(computeMobileSheetLayout({
      layoutHeight: 844,
      visualHeight: 560,
      visualOffsetTop: 0
    })).toEqual({
      top: null,
      bottom: 0,
      maxHeight: 560,
      height: null
    });
  });

  test("pins the sheet to the visual viewport edges when the keyboard is up", () => {
    // Keyboard ~333px: sheet top at the visual viewport top (0), bottom at the
    // keyboard top (333). No computed height — top + bottom define the box so
    // it fills the whole visible area with no gap.
    expect(computeMobileSheetLayout({
      layoutHeight: 844,
      visualHeight: 511,
      visualOffsetTop: 0,
      keyboardActive: true
    })).toEqual({
      top: 0,
      bottom: 333,
      maxHeight: null,
      height: null
    });
  });

  test("accounts for a panned visual viewport when the keyboard is up", () => {
    // User scrolled the visual viewport down a bit: top follows offsetTop.
    expect(computeMobileSheetLayout({
      layoutHeight: 844,
      visualHeight: 500,
      visualOffsetTop: 40,
      keyboardActive: true
    })).toEqual({
      top: 40,
      bottom: 304,
      maxHeight: null,
      height: null
    });
  });

  test("clamps a negative bottom to zero", () => {
    expect(computeMobileSheetLayout({
      layoutHeight: 844,
      visualHeight: 860,
      visualOffsetTop: 0,
      keyboardActive: true
    })).toEqual({
      top: 0,
      bottom: 0,
      maxHeight: null,
      height: null
    });
  });
});
