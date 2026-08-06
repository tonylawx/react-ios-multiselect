import { describe, expect, test } from "bun:test";

import {
  filterAndRankOptions,
  getSearchMatchRank,
  type SearchableOption,
} from "../src/select-search";

const OPTIONS: SearchableOption[] = [
  { value: "smh", label: "SMH", description: "tracks NVDA basket" },
  { value: "nvda-long", label: "NVDA Long Call" },
  { value: "aapl", label: "AAPL", description: "Apple Inc." },
  { value: "nvda", label: "NVDA" },
  { value: "meta", label: "Meta", description: "has nvda mention" },
  { value: "qqq", label: "QQQ" },
];

describe("getSearchMatchRank", () => {
  test("returns exact for case-insensitive label or value equality", () => {
    expect(getSearchMatchRank({ value: "nvda", label: "NVDA" }, "nvda")).toBe(0);
    expect(getSearchMatchRank({ value: "NVDA", label: "Nvidia" }, "nvda")).toBe(0);
  });

  test("returns prefix when label/value starts with the query", () => {
    expect(
      getSearchMatchRank({ value: "nvda-long", label: "NVDA Long Call" }, "nvda")
    ).toBe(1);
  });

  test("returns contains for mid-string or description hits", () => {
    expect(
      getSearchMatchRank({ value: "x", label: "Long NVDA Call" }, "nvda")
    ).toBe(2);
    expect(
      getSearchMatchRank(
        { value: "smh", label: "SMH", description: "tracks NVDA basket" },
        "nvda"
      )
    ).toBe(2);
  });

  test("does not treat description-only equality as exact", () => {
    expect(
      getSearchMatchRank(
        { value: "x", label: "Other", description: "nvda" },
        "nvda"
      )
    ).toBe(2);
  });

  test("returns null when nothing matches", () => {
    expect(getSearchMatchRank({ value: "qqq", label: "QQQ" }, "nvda")).toBeNull();
  });
});

describe("filterAndRankOptions", () => {
  test("returns the same reference for empty / whitespace queries", () => {
    expect(filterAndRankOptions(OPTIONS, "")).toBe(OPTIONS);
    expect(filterAndRankOptions(OPTIONS, "   ")).toBe(OPTIONS);
  });

  test("puts exact matches first, then prefix, then contains", () => {
    const result = filterAndRankOptions(OPTIONS, "nvda");
    expect(result.map((o) => o.value)).toEqual([
      "nvda", // exact
      "nvda-long", // prefix on label/value
      "smh", // description contains (original order among contains)
      "meta", // description contains
    ]);
  });

  test("preserves original order within the same rank", () => {
    const many: SearchableOption[] = [
      { value: "a1", label: "Alpha One" },
      { value: "a2", label: "Alpha Two" },
      { value: "a3", label: "Alpha Three" },
    ];
    expect(filterAndRankOptions(many, "alpha").map((o) => o.value)).toEqual([
      "a1",
      "a2",
      "a3",
    ]);
  });

  test("filters out non-matching options", () => {
    const result = filterAndRankOptions(OPTIONS, "aapl");
    expect(result.map((o) => o.value)).toEqual(["aapl"]);
  });

  test("exact match surfaces even when it sits late in the source list", () => {
    const lateExact: SearchableOption[] = [
      { value: "t1", label: "TEST0001", description: "mentions TEST0007 somewhere" },
      { value: "t2", label: "TEST0002" },
      { value: "t3", label: "TEST0003" },
      { value: "t7", label: "TEST0007" },
    ];
    expect(filterAndRankOptions(lateExact, "TEST0007").map((o) => o.value)).toEqual([
      "t7", // exact label
      "t1", // description contains
    ]);
  });
});
