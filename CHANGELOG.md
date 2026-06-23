# Changelog

All notable changes to `react-ios-multiselect` are documented here. The format
follows [Keep a Changelog](https://keepachangelog.com/), and this project
adheres to [Semantic Versioning](https://semver.org/).

## [0.1.0] — 2026-06-23

First public release. A mobile-first, zero-dependency React `<Select>` with a
native iOS-feeling bottom sheet.

### Added
- **Single & multi-select in one component.** The `multiple` prop switches the
  `value` / `onValueChange` signature and the commit behavior (immediate vs
  draft-then-confirm).
- **iOS-native sheet** — keyboard-aware (sits above the soft keyboard via
  `visualViewport`), momentum-scrolling, dismissible by backdrop / ESC / header
  button, slides with the iOS spring curve.
- **Keyboard stays open while selecting during search.** A pointerdown-level
  `preventDefault` defeats iOS WebKit's focus-transfer-then-collapse behavior.
- **iOS-native selected state** — a plain accent-blue check glyph (matches iOS).
- **Virtualized rows** — only the visible window + overscan mount; 2,000+
  options scroll smoothly.
- **Leading icon slot** — `option.icon` (`ReactNode` or `(option) => ReactNode`).
- **Zero runtime dependencies** — only `react` / `react-dom` peers. Inline SVG
  icons, a 3-line `cn()`, plain CSS with `--rios-*` theme variables.
- **Agent-friendly surface** — stable `data-rios-*` selectors on every element
  + full ARIA, documented for Playwright / agent drivers.
- **AI contributor workflow** — `AGENTS.md`, `CONTRIBUTING.md`, a PR template
  with a required AI contributor disclosure, an `ai-pr-guard` CI workflow that
  enforces it, an `agent-task` issue template, and a `quality` CI that guards
  the zero-deps invariant.
- **Documentation site** — Docusaurus with live interactive demos + a 简体中文
  mirror, deployed to GitHub Pages.

### Tests
- 36 tests: pure-logic suites (virtualization, layout, interaction gesture) +
  16 component render tests (happy-dom + Testing Library).
