import { describe, expect, test } from "bun:test";

import { getMountPolicy } from "../src/select-performance";

describe("Select mount policy", () => {
  test("mobile keeps only the virtualized mobile body warm", () => {
    expect(getMountPolicy(true)).toEqual({
      renderDesktopBody: false,
      renderMobileSheet: true,
      keepMobileBodyMounted: true
    });
  });

  test("desktop does not construct the hidden mobile list", () => {
    expect(getMountPolicy(false)).toEqual({
      renderDesktopBody: true,
      renderMobileSheet: false,
      keepMobileBodyMounted: false
    });
  });
});
