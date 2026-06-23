import { describe, expect, test } from "bun:test";

import { getAAPLSelectMountPolicy } from "../src/aapl-select-performance";

describe("AAPLSelect mount policy", () => {
  test("mobile keeps only the virtualized mobile body warm", () => {
    expect(getAAPLSelectMountPolicy(true)).toEqual({
      renderDesktopBody: false,
      renderMobileSheet: true,
      keepMobileBodyMounted: true
    });
  });

  test("desktop does not construct the hidden mobile list", () => {
    expect(getAAPLSelectMountPolicy(false)).toEqual({
      renderDesktopBody: true,
      renderMobileSheet: false,
      keepMobileBodyMounted: false
    });
  });
});
