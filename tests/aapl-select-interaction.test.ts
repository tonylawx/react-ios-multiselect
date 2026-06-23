import { describe, expect, test } from "bun:test";

import {
  createAAPLSelectOptionGesture,
  getAAPLSelectBottomAccessory,
  moveAAPLSelectOptionGesture,
  shouldActivateAAPLSelectOptionGesture,
  shouldPreserveSearchFocusOnOptionPointerDown,
  shouldDeferAAPLSelectViewportLayout
} from "../src/aapl-select-interaction";

describe("AAPLSelect mobile interaction policy", () => {
  test("reserves a standalone safe-area spacer when there is no search bar", () => {
    expect(getAAPLSelectBottomAccessory(false)).toBe("safe-area-spacer");
    expect(getAAPLSelectBottomAccessory(true)).toBe("search");
  });

  test("defers viewport changes while an option selection gesture is active", () => {
    expect(shouldDeferAAPLSelectViewportLayout(true)).toBe(true);
    expect(shouldDeferAAPLSelectViewportLayout(false)).toBe(false);
  });

  test("activates a stationary touch on pointerup even when click is consumed", () => {
    const gesture = createAAPLSelectOptionGesture({
      pointerId: 7,
      value: "AAPL",
      clientX: 120,
      clientY: 240,
      scrollTop: 64
    });

    expect(
      shouldActivateAAPLSelectOptionGesture({
        gesture,
        pointerId: 7,
        scrollTop: 64
      })
    ).toBe(true);
  });

  test("does not activate an option when the touch becomes a scroll gesture", () => {
    const gesture = createAAPLSelectOptionGesture({
      pointerId: 8,
      value: "NVDA",
      clientX: 120,
      clientY: 240,
      scrollTop: 64
    });
    const movedGesture = moveAAPLSelectOptionGesture({
      gesture,
      pointerId: 8,
      clientX: 120,
      clientY: 260
    });

    expect(
      shouldActivateAAPLSelectOptionGesture({
        gesture: movedGesture,
        pointerId: 8,
        scrollTop: 84
      })
    ).toBe(false);
  });

  test("preserves search focus when tapping an option while the search field is focused", () => {
    expect(
      shouldPreserveSearchFocusOnOptionPointerDown({
        optionValue: "SPX",
        searchFocused: true
      })
    ).toBe(true);
  });

  test("does not preserve search focus when the search field is not focused", () => {
    expect(
      shouldPreserveSearchFocusOnOptionPointerDown({
        optionValue: "SPX",
        searchFocused: false
      })
    ).toBe(false);
  });

  test("does not preserve search focus when the touch did not land on an option", () => {
    expect(
      shouldPreserveSearchFocusOnOptionPointerDown({
        optionValue: null,
        searchFocused: true
      })
    ).toBe(false);
  });
});
