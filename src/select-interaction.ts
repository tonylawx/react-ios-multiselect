export type BottomAccessory = "search" | "safe-area-spacer";

const OPTION_TAP_SLOP_PX = 10;

export type OptionGesture = {
  pointerId: number;
  value: string;
  startX: number;
  startY: number;
  startScrollTop: number;
  moved: boolean;
};

export function getBottomAccessory(searchable: boolean): BottomAccessory {
  return searchable ? "search" : "safe-area-spacer";
}

export function shouldDeferViewportLayout(
  optionGestureActive: boolean
): boolean {
  return optionGestureActive;
}

export function createOptionGesture({
  pointerId,
  value,
  clientX,
  clientY,
  scrollTop
}: {
  pointerId: number;
  value: string;
  clientX: number;
  clientY: number;
  scrollTop: number;
}): OptionGesture {
  return {
    pointerId,
    value,
    startX: clientX,
    startY: clientY,
    startScrollTop: scrollTop,
    moved: false
  };
}

export function moveOptionGesture({
  gesture,
  pointerId,
  clientX,
  clientY
}: {
  gesture: OptionGesture;
  pointerId: number;
  clientX: number;
  clientY: number;
}): OptionGesture {
  if (gesture.pointerId !== pointerId || gesture.moved) return gesture;

  const deltaX = clientX - gesture.startX;
  const deltaY = clientY - gesture.startY;
  if (
    deltaX * deltaX + deltaY * deltaY
    <= OPTION_TAP_SLOP_PX * OPTION_TAP_SLOP_PX
  ) {
    return gesture;
  }

  return { ...gesture, moved: true };
}

export function shouldActivateOptionGesture({
  gesture,
  pointerId,
  scrollTop
}: {
  gesture: OptionGesture;
  pointerId: number;
  scrollTop: number;
}): boolean {
  return (
    gesture.pointerId === pointerId
    && !gesture.moved
    && Math.abs(scrollTop - gesture.startScrollTop) < 1
  );
}

/**
 * Native iOS behaviour: when the search field is focused and the user taps a
 * row, the row toggles but the keyboard stays open. Focus transfer happens on
 * the compatibility mousedown that follows pointerdown, so we preventDefault
 * on pointerdown itself — the focus never leaves the input and the keyboard
 * never starts to collapse. This is far more reliable on iOS WebKit than the
 * "blur then re-focus" approach, which loses the keyboard once the dismiss
 * animation begins (programmatic focus outside a user gesture won't reopen it).
 */
export function shouldPreserveSearchFocusOnOptionPointerDown({
  optionValue,
  searchFocused
}: {
  /** The tapped option's data-value, or null if the touch did not land on an option row. */
  optionValue: string | null;
  /** Whether the search input is currently document.activeElement. */
  searchFocused: boolean;
}): boolean {
  return Boolean(optionValue) && searchFocused;
}
