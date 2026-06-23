import { describe, expect, test } from "bun:test";

import {
  createOptionGesture,
  getBottomAccessory,
  moveOptionGesture,
  shouldActivateOptionGesture,
  shouldPreserveSearchFocusOnOptionPointerDown,
  shouldDeferViewportLayout
} from "../src/select-interaction";

describe("Select mobile interaction policy", () => {
  test("reserves a standalone safe-area spacer when there is no search bar", () => {
    expect(getBottomAccessory(false)).toBe("safe-area-spacer");
    expect(getBottomAccessory(true)).toBe("search");
  });

  test("defers viewport changes while an option selection gesture is active", () => {
    expect(shouldDeferViewportLayout(true)).toBe(true);
    expect(shouldDeferViewportLayout(false)).toBe(false);
  });

  test("activates a stationary touch on pointerup even when click is consumed", () => {
    const gesture = createOptionGesture({
      pointerId: 7,
      value: "AAPL",
      clientX: 120,
      clientY: 240,
      scrollTop: 64
    });

    expect(
      shouldActivateOptionGesture({
        gesture,
        pointerId: 7,
        scrollTop: 64
      })
    ).toBe(true);
  });

  test("does not activate an option when the touch becomes a scroll gesture", () => {
    const gesture = createOptionGesture({
      pointerId: 8,
      value: "NVDA",
      clientX: 120,
      clientY: 240,
      scrollTop: 64
    });
    const movedGesture = moveOptionGesture({
      gesture,
      pointerId: 8,
      clientX: 120,
      clientY: 260
    });

    expect(
      shouldActivateOptionGesture({
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
