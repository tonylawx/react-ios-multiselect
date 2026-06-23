# react-ios-multiselect

A native iOS-feeling, responsive React `<Select>` — single **and** multi-select in one component, with a **keyboard-aware mobile bottom sheet**, **virtualized rows** (2,000+ options scroll smoothly), **iOS-native selected state** (blue text + filled checkmark), **draft/commit multi-select**, and a desktop **Radix Popover** fallback.

On mobile it behaves like iOS's native picker: tap a row to toggle it, and **the keyboard stays open while you search and select** (a notoriously fiddly iOS WebKit behavior this handles correctly). Every interactive element carries a stable `data-rios-*` hook so AI agents / Playwright can drive it reliably.

> **For AI agents:** read [`docs/components.md`](./docs/components.md) (and `llms.txt`) for the full machine-readable spec — props, selectors, behaviors, and copy-paste snippets.

```tsx
import { Select } from "react-ios-multiselect";
import "react-ios-multiselect/style.css";

// Multi-select
<Select
  multiple
  value={symbols}
  onValueChange={setSymbols}
  options={options}
  placeholder="Select symbols"
/>

// Single-select (same component, omit `multiple`)
<Select value={strategy} onValueChange={setStrategy} options={strategies} />
```

## Why

Most React select components are either (a) desktop-only popovers that feel broken on mobile, or (b) wrappers around the native `<select multiple>`, which has no styling control and a poor multi-select UX on touch. This component gives you:

- **Native-feeling mobile sheet** — slides up from the bottom, sits above the keyboard, momentum-scrolls, dismissible by backdrop / ESC / header button.
- **iOS-native selected state** — selected rows turn iOS-blue with a filled circle checkmark (white check on blue), exactly like iOS Settings, not a generic outline glyph.
- **Keyboard-aware** — when the search field is focused, tapping rows toggles them **without dismissing the keyboard**, so users can search → select → keep typing. Implemented at the pointerdown level to defeat iOS WebKit's focus-transfer-then-collapse behavior.
- **Virtualized** — only the visible window + overscan of rows is mounted, so 2,000 options scroll as smoothly as 20.
- **Draft-then-commit multi-select** — on mobile, toggles mutate a local draft; the blue ✓ button commits, ✕ discards. Desktop commits immediately. Single-select commits on tap.
- **Single component, responsive** — auto-detects mobile (≤ 640px by default) and renders the sheet; desktop gets a Radix Popover. No prop switching.
- **Agent-friendly** — stable `data-rios-*` selectors on every part + full ARIA semantics, so Playwright/cursor agents can locate, drive, and assert reliably.
- **Zero Tailwind dependency** — plain CSS with `--rios-*` custom properties for theming.

## Install

```bash
bun add react-ios-multiselect
# or
npm install react-ios-multiselect
```

Peer deps: `react` ≥ 18, `react-dom` ≥ 18.

Then import the stylesheet **once** at your app root:

```ts
import "react-ios-multiselect/style.css";
```

## Usage

### Single-select

```tsx
import { Select } from "react-ios-multiselect";

const [strategy, setStrategy] = useState("put");

<Select
  value={strategy}
  onValueChange={setStrategy}
  options={[
    { value: "put", label: "Sell Put" },
    { value: "call", label: "Sell Call" },
    { value: "long_leaps", label: "Long LEAPS" },
  ]}
  searchable={false}
/>;
```

### Multi-select

```tsx
const [symbols, setSymbols] = useState<string[]>(["AAPL", "NVDA"]);

<Select
  multiple
  value={symbols}
  onValueChange={setSymbols}
  options={options}
  placeholder="Select symbols"
  searchPlaceholder="Search symbols"
  emptyText="No matching symbols"
  mobileTitle="Select symbols"
  mobileSetLabel="Set"
  mobileCancelLabel="Cancel"
  selectedCountLabel={(count) => `${count} selected`}
/>;
```

With descriptions:

```tsx
const options = [
  { value: "AAPL", label: "AAPL", description: "Apple Inc. · NASDAQ" },
  { value: "TSLA", label: "TSLA", description: "Tesla Inc. · NASDAQ" },
];
```

## Props

| Prop                  | Type                              | Default              | Description |
|-----------------------|-----------------------------------|----------------------|-------------|
| `options`             | `{ value, label, description?, disabled? }[]` | —          | The option list. |
| `multiple`            | `boolean`                         | `false`              | Enables multi-select. Changes the `value` / `onValueChange` signature. |
| `value`               | `string` \| `string[]`            | —                    | Controlled value. `string` for single, `string[]` when `multiple`. |
| `onValueChange`       | `(v: string \| string[]) => void` | —                    | Change callback. |
| `searchable`          | `boolean`                         | `multiple ‖ options.length > 5` | Show the search field. |
| `placeholder`         | `string`                          | —                    | Trigger text when empty. |
| `searchPlaceholder`   | `string`                          | —                    | Search field placeholder. |
| `emptyText`           | `string`                          | —                    | Empty-results message. |
| `disabled`            | `boolean`                         | `false`              | Disables the trigger. |
| `mobileBreakpoint`    | `number`                          | `640`                | Max viewport width (px) treated as mobile. |
| `mobileTitle`         | `string`                          | `placeholder`        | Mobile sheet header title. |
| `mobileSetLabel`      | `string`                          | `"Set"`              | Multi-select confirm button `aria-label`. |
| `mobileCancelLabel`   | `string`                          | `"Cancel"`           | Cancel button `aria-label`. |
| `mobileDoneLabel`     | `string`                          | `"Done"`             | Single-select close button `aria-label`. |
| `selectedCountLabel`  | `(count: number) => string`       | `${count} selected`  | Trigger summary when > 2 selected (multi). |
| `className`           | `string`                          | —                    | Extra class on the trigger. |
| `contentClassName`    | `string`                          | —                    | Extra class on the desktop popover content. |
| `aria-label`          | `string`                          | —                    | Accessible label for the trigger. |

## Styling / theming

All colors, typography, and motion are CSS custom properties with defaults declared on `:root`. Override only what you want to change:

```css
:root {
  --rios-color-text: #1d2038;          /* trigger + sheet text */
  --rios-color-muted: #7b8190;         /* placeholders, descriptions */
  --rios-color-line: rgba(26,34,56,.1);/* borders */
  --rios-color-accent: #0a84ff;        /* iOS blue: confirm btn, mobile checkmark */
  --rios-color-selected: #0a84ff;      /* selected row text + desktop checkmark */
  --rios-color-hairline: rgba(60,60,67,.29); /* iOS list separator */
  --rios-font-size-body: 17px;         /* iOS body text */
  --rios-row-height-mobile: 58px;      /* ~44pt iOS row */
  --rios-easing-spring: cubic-bezier(0.32,0.72,0,1);
  --rios-check-size: 22px;             /* filled checkmark diameter */
  --rios-shadow: 0 24px 60px rgba(0,0,0,.12);
  --rios-shadow-sheet: 0 18px 70px rgba(0,0,0,.28);
  --rios-radius-sheet: 32px;
}
```

All shipped classes are prefixed `rios-` to avoid collisions. You can target them directly for advanced overrides.

## AI agent / testing hooks

Every interactive element carries a stable `data-rios-*` attribute so Playwright, cursor agents, or any DOM driver can locate and drive the component without relying on brittle text or positional selectors:

| Selector | What | Notes |
|---|---|---|
| `[data-rios-select-trigger]` | The trigger button | `data-state="open\|closed"` reflects open state |
| `[data-rios-option-value="<value>"]` | Any option row | `data-selected="true\|false"`; present on both desktop + mobile |
| `[data-rios-sheet]` | The mobile sheet | `data-open="true\|false"` |
| `[data-rios-overlay]` | The mobile overlay/backdrop wrapper | `data-open` |
| `[data-rios-backdrop]` | The dismiss-on-tap backdrop | |
| `[data-rios-search-input]` | The search field (desktop or mobile) | |
| `[data-rios-clear-search]` | The clear-search button | |
| `[data-rios-confirm]` | The blue ✓ commit button (multi, mobile) | |
| `[data-rios-cancel]` | The ✕ close button (mobile) | |

Example (Playwright):

```ts
await page.click('[data-rios-select-trigger]');
await page.click('[data-rios-option-value="AAPL"]');
await expect(page.locator('[data-rios-option-value="AAPL"]'))
  .toHaveAttribute('data-selected', 'true');
await page.click('[data-rios-confirm]');
```

Full ARIA: `role=listbox` / `role=option` / `aria-selected` / `aria-multiselectable` / `aria-posinset` / `aria-setsize`, and each option also exposes a readable `aria-label` (label, or "label — description").

## How the iOS keyboard behavior works

iOS WebKit transfers focus on the compatibility `mousedown` that follows `pointerdown`. If a tap lands on an option row while the search field is focused, focus moves to the row → the search input blurs → the keyboard begins its collapse animation → a later programmatic `.focus()` (outside a user gesture) cannot reopen it.

This component calls `preventDefault()` in the `pointerdown` **capture** phase when the touch lands on an option while the search is focused, so the subsequent `mousedown` never moves focus off the input. The keyboard never starts to collapse — matching native iOS. A tap-vs-scroll gesture (10px slop) and compatibility-click suppression (anti-double-toggle) are layered on top. See `src/select-interaction.ts`.

## Development

```bash
bun install
bun test          # 22 unit tests (pure logic: virtualization, layout, interaction)
bun run typecheck
bun run build     # → dist/ (ESM + CJS + d.ts + select.css)
cd demo && bun dev   # Vite playground at localhost:5173
```

The pure logic (virtualization range, mobile sheet layout, tap gesture, mount policy) is fully unit-tested and framework-agnostic — exported for advanced consumers who want to build a custom UI on the same primitives.

## License

MIT
