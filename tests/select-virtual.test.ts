import { describe, expect, test } from "bun:test";

import { computeVirtualOptionRange, optionListSignature } from "../src/select-virtual";

describe("computeVirtualOptionRange", () => {
  test("renders only a small window for a large mobile option list", () => {
    const range = computeVirtualOptionRange({
      itemCount: 2_000,
      scrollTop: 0,
      viewportHeight: 640
    });

    expect(range.startIndex).toBe(0);
    expect(range.endIndex - range.startIndex).toBeLessThanOrEqual(22);
    expect(range.totalHeight).toBe(128_000);
  });

  test("keeps overscan around the visible rows while scrolling", () => {
    const range = computeVirtualOptionRange({
      itemCount: 2_000,
      scrollTop: 32_000,
      viewportHeight: 640
    });

    expect(range.startIndex).toBe(494);
    expect(range.endIndex).toBe(516);
    expect(range.offsetTop).toBe(31_616);
  });

  test("clamps an almost-empty list safely", () => {
    expect(computeVirtualOptionRange({
      itemCount: 3,
      scrollTop: 10_000,
      viewportHeight: 640
    })).toEqual({
      startIndex: 0,
      endIndex: 3,
      offsetTop: 0,
      totalHeight: 192
    });
  });
});

describe("optionListSignature", () => {
  test("encodes the count and the first value", () => {
    const all = [
      { value: "AAPL", label: "AAPL" },
      { value: "NVDA", label: "NVDA" },
      { value: "SMH", label: "SMH" }
    ];
    expect(optionListSignature(all)).toBe("3:AAPL");
  });

  test("changes when a search filter narrows the list", () => {
    const all = [
      { value: "AAPL", label: "AAPL" },
      { value: "NVDA", label: "NVDA" },
      { value: "SMH", label: "SMH" }
    ];
    const filtered = [{ value: "NVDA", label: "NVDA" }];
    expect(optionListSignature(all)).not.toBe(optionListSignature(filtered));
  });

  test("changes again when the query is cleared back to the full list", () => {
    // Regression guard: an empty query restores the original `options` array
    // (same reference), but the signature must still differ from the filtered
    // view so the list scrolls back to the top.
    const fullList = [
      { value: "AAPL", label: "AAPL" },
      { value: "NVDA", label: "NVDA" },
      { value: "SMH", label: "SMH" }
    ];
    const filtered = [{ value: "NVDA", label: "NVDA" }];

    const sigFiltered = optionListSignature(filtered);
    const sigCleared = optionListSignature(fullList);

    expect(sigFiltered).not.toBe(sigCleared);
    // And it's stable for the same content (idempotent across calls).
    expect(sigCleared).toBe(optionListSignature(fullList));
  });

  test("handles empty or missing lists without throwing", () => {
    expect(optionListSignature([])).toBe("0:");
    expect(optionListSignature(null)).toBe("0:");
    expect(optionListSignature(undefined)).toBe("0:");
  });
});
