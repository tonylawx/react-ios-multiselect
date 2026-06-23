---
sidebar_position: 4
---

# Theming

All visual tokens are CSS custom properties declared on `:root` with sensible
defaults. Override only the ones you want to change — no theme object, no build
step.

## Override the variables

```css
:root {
  --rios-color-text: #1d2038;
  --rios-color-accent: #0a84ff;       /* iOS blue: confirm btn + checkmark */
  --rios-color-selected: #0a84ff;     /* selected row text */
  --rios-color-hairline: rgba(60, 60, 67, 0.29);
  --rios-font-size-body: 17px;
  --rios-row-height: 58px;
  --rios-easing-spring: cubic-bezier(0.32, 0.72, 0, 1);
}
```

You can scope overrides to a subtree too — e.g. wrap one select to give it a
purple accent without touching the rest of the app:

```tsx
<div style={{ "--rios-color-accent": "#7c3aed", "--rios-color-selected": "#7c3aed" }}>
  <Select multiple value={v} onValueChange={setV} options={options} />
</div>
```

## Full variable reference

| Variable | Default | Purpose |
| --- | --- | --- |
| `--rios-color-text` | `#1d2038` | Trigger + sheet text |
| `--rios-color-muted` | `#7b8190` | Placeholders, descriptions |
| `--rios-color-line` | `rgba(26,34,56,.1)` | Borders |
| `--rios-color-accent` | `#0a84ff` | iOS blue: confirm button, checkmark fill |
| `--rios-color-selected` | `#0a84ff` | Selected row text |
| `--rios-color-trigger-bg` | `#fcfbf8` | Trigger background |
| `--rios-color-sheet-bg` | `#f7f7f9` | Sheet background |
| `--rios-color-row-active` | `rgba(0,0,0,.035)` | Mobile row press feedback |
| `--rios-color-hairline` | `rgba(60,60,67,.29)` | iOS list separator |
| `--rios-shadow-sheet` | `0 18px 70px rgba(15,23,42,.28)` | Sheet shadow |
| `--rios-radius-sheet` | `32px` | Sheet corner radius |
| `--rios-radius-trigger` | `18px` | Trigger corner radius |
| `--rios-font-size-body` | `17px` | Option label size |
| `--rios-font-size-description` | `13px` | Description size |
| `--rios-row-height` | `58px` | Option row height (~44pt) |
| `--rios-hairline-inset` | `16px` | Separator left inset |
| `--rios-easing-spring` | `cubic-bezier(.32,.72,0,1)` | iOS spring curve |
| `--rios-check-size` | `22px` | Filled checkmark diameter |

## Class names

Every shipped class is prefixed `rios-` (e.g. `rios-trigger`, `rios-sheet`,
`rios-option-row`). For advanced overrides you can target them directly in your
own CSS. Pass an extra class to the trigger via the `className` prop.

:::caution
The `data-rios-*` attributes and the `rios-*` class names are a **public API**
— renaming or removing one is a breaking change that needs a major version bump.
See [data attributes](./data-attributes).
:::
