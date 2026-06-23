export type AAPLSelectMountPolicy = {
  renderDesktopBody: boolean;
  renderMobileSheet: boolean;
  keepMobileBodyMounted: boolean;
};

/**
 * Mobile and desktop list bodies must never be constructed in the same render.
 * The mobile body stays mounted offscreen because it is already virtualized;
 * warming that small row window avoids list mount and measurement work in the
 * user's click frame.
 */
export function getAAPLSelectMountPolicy(isMobile: boolean): AAPLSelectMountPolicy {
  return {
    renderDesktopBody: !isMobile,
    renderMobileSheet: isMobile,
    keepMobileBodyMounted: isMobile
  };
}
