---
sidebar_position: 1
---

# Introduction

`react-ios-multiselect` is a mobile-first React `<Select>` with a native
iOS-feeling bottom sheet. It handles single-select and multi-select in one
component, keeps the keyboard open while you search and select (a notoriously
fiddly iOS WebKit behavior), virtualizes 2,000+ options smoothly, and ships
with **zero runtime dependencies** beyond `react` / `react-dom`.

## Why this exists

Most React select components are either desktop-only popovers that feel broken
on mobile, or wrappers around the native `<select multiple>`, which has no
styling control and a poor touch UX. This component gives you a sheet that
behaves like the native iOS picker, with the styling and behavior control you
expect from a component library — and nothing else in your dependency tree.

## Highlights

- **iOS-native sheet** — slides up, sits above the keyboard, momentum-scrolls,
  dismissible by backdrop / ESC / header button.
- **iOS-native selected state** — selected rows turn iOS-blue with a filled
  circle checkmark (white check on blue), not a generic outline glyph.
- **Keyboard-aware** — tapping a row while the search field is focused toggles
  the row **without dismissing the keyboard**.
- **Virtualized** — only the visible window + overscan of rows mount.
- **Single + multi in one component** — the `multiple` prop switches modes.
- **Draft-then-commit multi-select** — toggles mutate a local draft; the blue ✓
  commits, ✕ discards.
- **Agent-friendly** — stable `data-rios-*` selectors + full ARIA + an AI
  contributor workflow with enforced disclosure.
- **Zero deps** — plain CSS with `--rios-*` custom properties for theming.

## Next

- [Getting started](./getting-started) — install and render your first select.
- [Usage](./usage) — single, multi, icons, search.
- [Try the playground](/playground) — live interactive demos.
