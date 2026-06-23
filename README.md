# react-ios-multiselect

An iOS-native-feeling, responsive React `<select>` with a **keyboard-aware mobile bottom sheet**, **virtualized rows** (renders 2,000+ options smoothly), **multi-select with draft/commit**, and a desktop **Radix Popover** fallback — all in a single drop-in component.

On mobile it behaves like iOS's native picker: tap a row to toggle it, and **the keyboard stays open while you search and select** (a notoriously fiddly iOS WebKit behavior that this handles correctly).

```tsx
import { AAPLSelect } from "react-ios-multiselect";
import "react-ios-multiselect/style.css";

<AAPLSelect
  multiple
  value={symbols}
  onValueChange={setSymbols}
  options={options}
  placeholder="Select symbols"
/>;
```

## Why

Most React select components are either (a) desktop-only popovers that feel broken on mobile, or (b) wrappers around the native `<select multiple>`, which has no styling control and a poor multi-select UX on touch. This component gives you:

- **Native-feeling mobile sheet** — slides up from the bottom, sits above the keyboard, momentum-scrolls, dismissible by backdrop / ESC / header button.
- **Keyboard-aware** — when the search field is focused, tapping rows toggles them **without dismissing the keyboard**, so users can search → select → keep typing. This is implemented at the pointerdown level to defeat iOS WebKit's focus-transfer-then-collapse behavior.
- **Virtualized** — only the visible window + overscan of rows is mounted, so 2,000 options scroll as smoothly as 20.
- **Draft-then-commit multi-select** — on mobile, toggles mutate a local draft; the blue ✓ button commits, ✕ discards. Desktop commits immediately.
- **Single component, responsive** — auto-detects mobile (≤ 640px by default) and renders the sheet; desktop gets a Radix Popover. No prop switching.
- **Zero Tailwind dependency** — plain CSS with CSS custom properties for theming. Works in any bundler.

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
const [strategy, setStrategy] = useState("put");

<AAPLSelect
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

<AAPLSelect
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

All colors and shadows are CSS custom properties with defaults declared on `:root`. Override only what you want to change:

```css
:root {
  --rios-color-text: #111827;          /* trigger + sheet text */
  --rios-color-muted: #6b7280;         /* placeholders, descriptions */
  --rios-color-line: #e5e7eb;          /* borders */
  --rios-color-accent: #0a84ff;        /* mobile checkmark + confirm button (iOS blue) */
  --rios-color-selected: #0f8f6d;      /* desktop checkmark */
  --rios-color-trigger-bg: #fcfbf8;    /* trigger background */
  --rios-color-sheet-bg: #f7f7f9;      /* mobile sheet background */
  --rios-shadow: 0 24px 60px rgba(0,0,0,.12);       /* desktop popover shadow */
  --rios-shadow-sheet: 0 18px 70px rgba(0,0,0,.28); /* mobile sheet shadow */
  --rios-radius-trigger: 18px;
  --rios-radius-popover: 16px;
  --rios-radius-sheet: 32px;
}
```

All shipped classes are prefixed `rioselect-` (e.g. `rioselect-trigger`, `rioselect-sheet`) to avoid collisions. You can target them directly for advanced overrides.

## How the iOS keyboard behavior works

iOS WebKit transfers focus on the compatibility `mousedown` that follows `pointerdown`. If a tap lands on an option row while the search field is focused, focus moves to the row → the search input blurs → the keyboard begins its collapse animation → a later programmatic `.focus()` (outside a user gesture) cannot reopen it.

This component calls `preventDefault()` in the `pointerdown` **capture** phase when the touch lands on an option while the search is focused, so the subsequent `mousedown` never moves focus off the input. The keyboard never starts to collapse — matching native iOS. A tap-vs-scroll gesture (10px slop) and compatibility-click suppression (anti-double-toggle) are layered on top. See `src/aapl-select-interaction.ts`.

## Development

```bash
bun install
bun test          # 22 unit tests (pure logic: virtualization, layout, interaction)
bun run typecheck
bun run build     # → dist/ (ESM + CJS + d.ts + aapl-select.css)
```

The pure logic (virtualization range, mobile sheet layout, tap gesture, mount policy) is fully unit-tested and framework-agnostic — exported for advanced consumers who want to build a custom UI on the same primitives.

## License

MIT
