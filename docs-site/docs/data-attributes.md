---
sidebar_position: 7
---

# Data attributes (agent & test hooks)

Every interactive element carries a stable `data-rios-*` attribute. This is the
**supported way** for Playwright, cursor agents, and any DOM driver to locate
and drive the component — do not rely on text content or DOM position, which
can change.

## Selector reference

| Selector | Element | Extra state |
| --- | --- | --- |
| `[data-rios-select-trigger]` | The trigger button | `data-state="open\|closed"` |
| `[data-rios-option-value="<value>"]` | Any option row | `data-selected="true\|false"` |
| `[data-rios-sheet]` | The sheet | `data-open="true\|false"` |
| `[data-rios-overlay]` | Overlay/backdrop wrapper | `data-open` |
| `[data-rios-backdrop]` | Tap-to-dismiss backdrop | — |
| `[data-rios-search-input]` | The search field | — |
| `[data-rios-clear-search]` | Clear-search button | — |
| `[data-rios-confirm]` | Blue ✓ commit button (multi) | — |
| `[data-rios-cancel]` | ✕ close button | — |

:::note
`data-rios-option-value` is present on **every** option row (the value comes
from `option.value`). `data-selected` mirrors the current selected state, so
you can assert on it without computing selection yourself.
:::

## Playwright example

```ts
import { test, expect } from "@playwright/test";

test("multi-select commits the draft on confirm", async ({ page }) => {
  await page.goto("/your-page");

  // open
  await page.click('[data-rios-select-trigger]');
  await expect(page.locator('[data-rios-select-trigger]')).toHaveAttribute(
    "data-state", "open"
  );

  // toggle two rows in the draft
  await page.click('[data-rios-option-value="AAPL"]');
  await page.click('[data-rios-option-value="NVDA"]');
  await expect(page.locator('[data-rios-option-value="AAPL"]')).toHaveAttribute(
    "data-selected", "true"
  );

  // confirm commits the draft and closes the sheet
  await page.click('[data-rios-confirm]');
  await expect(page.locator('[data-rios-select-trigger]')).toHaveAttribute(
    "data-state", "closed"
  );
});

test("search filters the list", async ({ page }) => {
  await page.click('[data-rios-select-trigger]');
  await page.fill('[data-rios-search-input]', "ban");
  await expect(page.locator('[data-rios-option-value="banana"]')).toBeVisible();
  await expect(page.locator('[data-rios-option-value="apple"]')).toHaveCount(0);
});
```

## ARIA semantics

Beyond the `data-rios-*` hooks, the component exposes standard ARIA so
accessibility tooling and screen readers work out of the box:

- The trigger: `aria-haspopup="dialog"`, `aria-expanded`.
- The sheet: `role="dialog"`, `aria-modal="true"`.
- The option list: `role="listbox"`, `aria-multiselectable` (multi only).
- Each option row: `role="option"`, `aria-selected`, `aria-posinset`,
  `aria-setsize`, and an `aria-label` of `"label"` or `"label — description"`.

## Testing the iOS keyboard behavior

The keyboard-stays-open behavior is iOS-touch-specific and cannot be exercised
in a headless browser (no soft keyboard). It is covered by unit tests of the
pure gesture policy in `select-interaction.ts` (`tests/select-interaction.test.ts`).
For end-to-end verification of that specific behavior, test on a real iPhone
Safari.
