---
sidebar_position: 6
---

# Testing

The repo runs two layers of tests — pure-logic unit tests and component render
tests. Both must stay green; CI enforces it.

## Run the tests

```bash
bun test            # all tests
bun test tests/select.test.tsx     # component render tests only
bun test tests/select-virtual.test.ts  # one pure-logic suite
```

## What's covered

### Pure-logic unit tests (`tests/select-*.test.ts`)

The framework-agnostic modules are unit-tested in isolation:

- `select-virtual.test.ts` — windowed range math, overscan, list signature.
- `select-layout.test.ts` — sheet layout vs visual viewport, keyboard handling.
- `select-interaction.test.ts` — tap-vs-scroll gesture, keyboard-preserve policy.

These don't touch the DOM and run in milliseconds. When you change behavior in
a pure module, update its test first — it documents the intended behavior.

### Component render tests (`tests/select.test.tsx`)

Uses **happy-dom** + **@testing-library/react** (devDependencies only — the
published package keeps `dependencies: {}`). Covers:

- Trigger label / placeholder / multi summary.
- Open state via `data-state`, and the `data-rios-*` hooks existing on every
  interactive element.
- Single-select commits on tap; multi-select defers to the confirm button
  (draft semantics).
- Search filtering.
- Disabled trigger and disabled option.
- The leading icon slot (ReactNode and render-function forms).
- ARIA: `aria-label`, `aria-selected`, `aria-posinset`.

## Test setup

DOM globals are registered in `tests/setup.ts`, preloaded via `bunfig.toml`. It
stubs the Web APIs happy-dom doesn't implement: `matchMedia`,
`ResizeObserver`, `visualViewport`. If you add a component feature that touches
another missing Web API, extend that setup file.

## Adding a test

- **New component behavior** → a test in `tests/select.test.tsx`.
- **New pure-logic helper** → a test next to the module, e.g.
  `tests/select-virtual.test.ts`.

Prefer asserting on `data-rios-*` attributes and `aria-*` over implementation
details like class names or DOM structure, so tests survive refactors and
double as documentation of the public surface.
