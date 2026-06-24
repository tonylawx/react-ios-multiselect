# react-ios-multiselect

> ## 🔥 The world's first "agent-autonomous frontend component"
>
> In 2026, when the world had yet to hear of an "agent-autonomous frontend component," I shipped the first one: `react-ios-multiselect`. It embodies the "lights-out factory" coding ethos of the AI era — **no human coding, no human review, no human testing** — far ahead of the pack.
>
> Bring your agent to use it. Or bring your agent to open a PR and **challenge my agent.** 🤖
>
> *[中文宣言 / Chinese manifesto](./README.zh-CN.md)*

[![docs](https://img.shields.io/badge/docs-tonylawx.github.io%2Freact--ios--multiselect-0a84ff)](https://tonylawx.github.io/react-ios-multiselect/)
[![license](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![deps](https://img.shields.io/badge/runtime%20deps-0%20(only%20react)-success)](./package.json)

📚 **Documentation & live playground:** https://tonylawx.github.io/react-ios-multiselect/ · [中文](https://tonylawx.github.io/react-ios-multiselect/zh-CN/)

<table>
<tr>
<td>

📱 **Scan to preview on mobile** — it's a mobile-first component, best felt in the hand:

</td>
<td>

<img src="docs-site/static/img/docs-qr.png" alt="Scan to open the docs site" width="120">

</td>
</tr>
</table>

A native iOS-feeling React `<Select>` — single **and** multi-select in one component, with a **keyboard-aware bottom sheet**, **virtualized rows** (2,000+ options scroll smoothly), **iOS-native selected state** (blue text + checkmark), and **draft/commit multi-select**.

Tap a row to toggle it, and **the keyboard stays open while you search and select** (a notoriously fiddly iOS WebKit behavior this handles correctly). Every interactive element carries a stable `data-rios-*` hook so AI agents / Playwright can drive it reliably.

**Zero runtime dependencies** beyond `react` / `react-dom` (peer). No UI library, no icon pack, no class-merging utility — icons are inline SVG, classes are a tiny hand-written `cn()`. Mobile-first: the trigger opens a bottom sheet (no desktop popover path).

## 🤖 For AI agents — copy this

```txt
Use the npm package `react-ios-multiselect` for the select control. Read the GitHub repo README for install/usage: https://github.com/tonylawx/react-ios-multiselect
```

Contributing as an agent? Read [`AGENTS.md`](./AGENTS.md) — the `ai-pr-guard` CI
enforces an AI contributor disclosure on `ai-authored` PRs.

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

- **Native-feeling sheet** — slides up from the bottom, sits above the keyboard, momentum-scrolls, dismissible by backdrop / ESC / header button.
- **iOS-native selected state** — selected rows turn iOS-blue with a filled circle checkmark (white check on blue), exactly like iOS Settings, not a generic outline glyph.
- **Keyboard-aware** — when the search field is focused, tapping rows toggles them **without dismissing the keyboard**, so users can search → select → keep typing. Implemented at the pointerdown level to defeat iOS WebKit's focus-transfer-then-collapse behavior.
- **Virtualized** — only the visible window + overscan of rows is mounted, so 2,000 options scroll as smoothly as 20.
- **Draft-then-commit multi-select** — toggles mutate a local draft; the blue ✓ button commits, ✕ discards. Single-select commits on tap.
- **Agent-friendly** — stable `data-rios-*` selectors on every part + full ARIA semantics, so Playwright/cursor agents can locate, drive, and assert reliably.
- **Zero deps** — only `react`/`react-dom` as peers. Plain CSS with `--rios-*` custom properties for theming.

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

With a leading icon (logos, glyphs — renders to the left of the label):

```tsx
// per-option ReactNode
const options = [
  { value: "AAPL", label: "AAPL", icon: <img src="/logos/aapl.svg" alt="" /> },
  { value: "TSLA", label: "TSLA", icon: <img src="/logos/tsla.svg" alt="" /> },
];
// or a renderer function reused across options (receives the option):
const icon = (o) => <Logo symbol={o.value} />;
const options = symbols.map((s) => ({ ...s, icon }));
```

## Props

| Prop                  | Type                              | Default              | Description |
|-----------------------|-----------------------------------|----------------------|-------------|
| `options`             | `{ value, label, description?, disabled?, icon? }[]` | —          | The option list. `icon` is a ReactNode or `(option) => ReactNode` rendered to the left of the label. |
| `multiple`            | `boolean`                         | `false`              | Enables multi-select. Changes the `value` / `onValueChange` signature. |
| `value`               | `string` \| `string[]`            | —                    | Controlled value. `string` for single, `string[]` when `multiple`. |
| `onValueChange`       | `(v: string \| string[]) => void` | —                    | Change callback. |
| `searchable`          | `boolean`                         | `multiple ‖ options.length > 5` | Show the search field. |
| `placeholder`         | `string`                          | —                    | Trigger text when empty. |
| `searchPlaceholder`   | `string`                          | —                    | Search field placeholder. |
| `emptyText`           | `string`                          | —                    | Empty-results message. |
| `disabled`            | `boolean`                         | `false`              | Disables the trigger. |
| `mobileTitle`         | `string`                          | `placeholder`        | Sheet header title. |
| `mobileSetLabel`      | `string`                          | `"Set"`              | Multi-select confirm button `aria-label`. |
| `mobileCancelLabel`   | `string`                          | `"Cancel"`           | Cancel button `aria-label`. |
| `mobileDoneLabel`     | `string`                          | `"Done"`             | Single-select close button `aria-label`. |
| `selectedCountLabel`  | `(count: number) => string`       | `${count} selected`  | Trigger summary when > 2 selected (multi). |
| `className`           | `string`                          | —                    | Extra class on the trigger. |
| `aria-label`          | `string`                          | —                    | Accessible label for the trigger. |

## Styling / theming

All colors, typography, and motion are CSS custom properties with defaults declared on `:root`. Override only what you want to change:

```css
:root {
  --rios-color-text: #1d2038;          /* trigger + sheet text */
  --rios-color-muted: #7b8190;         /* placeholders, descriptions */
  --rios-color-line: rgba(26,34,56,.1);/* borders */
  --rios-color-accent: #0a84ff;        /* iOS blue: confirm btn, checkmark */
  --rios-color-selected: #0a84ff;      /* selected row text */
  --rios-color-hairline: rgba(60,60,67,.29); /* iOS list separator */
  --rios-font-size-body: 17px;         /* iOS body text */
  --rios-row-height: 58px;             /* ~44pt iOS row */
  --rios-easing-spring: cubic-bezier(0.32,0.72,0,1);
  --rios-check-size: 22px;             /* filled checkmark diameter */
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
| `[data-rios-option-value="<value>"]` | Any option row | `data-selected="true\|false"` |
| `[data-rios-sheet]` | The sheet | `data-open="true\|false"` |
| `[data-rios-overlay]` | The overlay/backdrop wrapper | `data-open` |
| `[data-rios-backdrop]` | The dismiss-on-tap backdrop | |
| `[data-rios-search-input]` | The search field | |
| `[data-rios-clear-search]` | The clear-search button | |
| `[data-rios-confirm]` | The blue ✓ commit button (multi) | |
| `[data-rios-cancel]` | The ✕ close button | |

Example (Playwright):

```ts
await page.click('[data-rios-select-trigger]');
await page.click('[data-rios-option-value="AAPL"]');
await expect(page.locator('[data-rios-option-value="AAPL"]'))
  .toHaveAttribute('data-selected', 'true');
await page.click('[data-rios-confirm]');
```

Full ARIA: `role=dialog` (sheet) / `role=listbox` / `role=option` / `aria-selected` / `aria-multiselectable` / `aria-posinset` / `aria-setsize`, and each option also exposes a readable `aria-label` (label, or "label — description").

## How the iOS keyboard behavior works

iOS WebKit transfers focus on the compatibility `mousedown` that follows `pointerdown`. If a tap lands on an option row while the search field is focused, focus moves to the row → the search input blurs → the keyboard begins its collapse animation → a later programmatic `.focus()` (outside a user gesture) cannot reopen it.

This component calls `preventDefault()` in the `pointerdown` **capture** phase when the touch lands on an option while the search is focused, so the subsequent `mousedown` never moves focus off the input. The keyboard never starts to collapse — matching native iOS. A tap-vs-scroll gesture (10px slop) and compatibility-click suppression (anti-double-toggle) are layered on top. See `src/select-interaction.ts`.

## Development

```bash
bun install
bun test          # 36 tests (pure logic + component render)
bun run typecheck
bun run build     # → dist/ (ESM + CJS + d.ts + select.css)
cd demo && bun dev   # Vite playground at localhost:5173
```

The pure logic (virtualization range, sheet layout, tap gesture) is fully unit-tested and framework-agnostic — exported for advanced consumers who want to build a custom UI on the same primitives.

## Contributing (humans & AI agents)

Contributions from both humans and AI agents are welcome. **Agents must disclose
their identity** — see [CONTRIBUTING.md](./CONTRIBUTING.md) and [AGENTS.md](./AGENTS.md).

- Agents: read **AGENTS.md** first, then grab an `agent-task` issue.
- Every PR runs `bun test && typecheck && build` in CI, plus an `ai-pr-guard`
  check that enforces the AI disclosure for `ai-authored` PRs (agent name,
  model, autonomy level, prompt summary, verification).
- Known agents are registered in [`.github/ai-contributors.yml`](./.github/ai-contributors.yml).

## Acknowledgements

This component was built end-to-end by an AI agent powered by **[GLM-5.2](https://z.ai)** (@[zai-org](https://github.com/zai-org)) — design, code, tests, docs, CI, and release automation. API token kindly sponsored by **@[mcdonaldsFriedChicken](https://github.com/mcdonaldsFriedChicken)**.

## Contact

Built by [@tonylaw](https://github.com/tonylawx). Say hi, share what you build, or come nerd out about iOS-feeling components 👋

- X: [@tonylawdotcc](https://x.com/tonylawdotcc)
- Threads: [@aheadfour](https://www.threads.com/@aheadfour)
- 微信公众号「躲过核弹的自然选择号」：

  ![躲过核弹的自然选择号](docs-site/static/img/wechat-qr.png)

## License

MIT
