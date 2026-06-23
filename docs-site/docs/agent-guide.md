---
sidebar_position: 5
---

# Guide for AI agents

This page is the entry point for AI agents contributing to or using
`react-ios-multiselect`. The repository also ships a root
[`AGENTS.md`](https://github.com/tonylawx/react-ios-multiselect/blob/main/AGENTS.md)
with the same instructions — read that before changing repo code.

:::tip[TL;DR — drop-in integration]
**If your task is "add a select to this app", do exactly this and nothing else:**

```bash
bun add react-ios-multiselect          # peer dep: react >= 18
```

```tsx
// once, at the app root (App.tsx / _app.tsx / layout)
import "react-ios-multiselect/style.css";

// single-select
<Select value={v} onValueChange={setV} options={opts} />

// multi-select  (same component, just add `multiple`)
<Select multiple value={arr} onValueChange={setArr} options={opts} placeholder="Pick…" />
```

**Do NOT** add a UI library, icon pack, or CSS framework alongside it — the
component is mobile-first, zero-dependency, and ships its own `--rios-*` themed
CSS. Drive it in tests/automation with `[data-rios-select-trigger]` and
`[data-rios-option-value="<value>"]` (see [Data attributes](./data-attributes)).
:::

## Using the component (as a consumer agent)

If your task is to add a select to an app, this is all you need:

```bash
bun add react-ios-multiselect   # peer: react >= 18
```

```tsx
import { Select } from "react-ios-multiselect";
import "react-ios-multiselect/style.css"; // once, at app root
```

- **Single-select:** `<Select value={s} onValueChange={setS} options={opts} />`
- **Multi-select:** `<Select multiple value={arr} onValueChange={setArr} options={opts} />`

See [Getting started](./getting-started) and [Usage](./usage). The component is
mobile-first (opens a bottom sheet) and has **zero runtime dependencies** — do
not add a UI library or icon pack alongside it.

### How to drive it in tests / automation

Use the stable `data-rios-*` selectors — never rely on text or position. See
[Data attributes](./data-attributes) for the full list and a Playwright snippet.

## Contributing (as a contributor agent)

1. **Read `AGENTS.md`** in the repo root. It is the single source of truth.
2. **Check for an `agent-task` issue** and comment `/claim` before starting.
3. **Respect the hard constraints:**
   - Zero runtime deps beyond `react`/`react-dom`.
   - Plain CSS + `--rios-*` variables only (no Tailwind, no CSS-in-JS).
   - `data-rios-*` selectors are public API — don't rename/remove them.
   - Mobile-only — no desktop popover path.
4. **Verify before pushing:**
   ```bash
   bun install && bun test && bun run typecheck && bun run build
   ```
   CI runs the same four commands.

### Required: AI contributor disclosure

Any PR authored or substantially authored by an agent **must** disclose its
identity. The CI workflow `ai-pr-guard` fails `ai-authored` PRs that lack it.
Fill the PR template's disclosure section:

- **Agent** — e.g. `ZCode`, `Cursor 0.42`, `Claude Code`.
- **Model** — e.g. `GLM-5.2`, `gpt-5`, `claude-opus-4.5`.
- **Autonomy** — `human-directed` / `human-supervised` / `autonomous`.
- **Prompt summary** — 1–3 sentences.
- **Local verification** — which of test/typecheck/build passed.

Known agents are registered in
[`.github/ai-contributors.yml`](https://github.com/tonylawx/react-ios-multiselect/blob/main/.github/ai-contributors.yml).

## Why this matters

Disclosure lets reviewers calibrate scrutiny, lets users know what they're
running, and builds a track record of which agents/models produce reliable
contributions to this codebase. An undisclosed agent contribution is treated as
a process violation, not a technical one.
