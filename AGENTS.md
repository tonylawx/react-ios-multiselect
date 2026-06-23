# Agent Guide

You are an AI agent contributing to **react-ios-multiselect**. This file is the
single entry point for agents: read it before changing anything.

> Human contributors: see [CONTRIBUTING.md](./CONTRIBUTING.md). The rules below
> are the same, plus agent-specific disclosure.

## What this project is

A mobile-first React `<Select>` (single + multi) with an iOS-native bottom
sheet, virtualized rows, and zero runtime dependencies beyond `react`. Read
[README.md](./README.md) for the feature set and [CONTRIBUTING.md](./CONTRIBUTING.md)
for contribution rules.

## Before you write code

1. **Check for an `agent-task` issue.** Prefer grabbing an existing labeled task
   over inventing your own. Comment `/claim` on it so two agents don't duplicate
   work.
2. **Understand the hard constraints** — violating these will get your PR rejected:
   - Zero runtime deps beyond `react`/`react-dom`. No new dependency without a
     maintainer-Approved issue.
   - Plain CSS + `--rios-*` variables only. No Tailwind, no CSS-in-JS.
   - `data-rios-*` selectors are a public API. Don't rename/remove them.
   - Mobile-only. Do not reintroduce a desktop popover path.

## Code map

```
src/
  select.tsx          # the <Select> component (trigger + sheet + option list)
  select-interaction.ts  # tap-vs-scroll gesture, keyboard-preserve policy (pure)
  select-layout.ts    # sheet layout math vs visual viewport (pure)
  select-virtual.ts   # windowed rendering range (pure)
  icons.tsx           # inline SVG icons (zero dep)
  styles.ts           # semantic name → rios-* class map
  utils.ts            # cn() class joiner
  select.css          # all styles + :root --rios-* variables
tests/
  setup.ts            # happy-dom + Web API stubs (preloaded)
  select.test.tsx     # component render/interaction tests (DOM)
  select-*.test.ts    # pure-logic tests for each module
```

The pure modules (`select-interaction/layout/virtual`) are fully unit-tested.
When you change behavior there, update the test first (it documents the
intended behavior). Component changes go in `tests/select.test.tsx`.

## The non-negotiable verification command

```bash
bun install && bun test && bun run typecheck && bun run build
```

All four must succeed. CI runs the same. If any fails, **fix it before opening
the PR** — do not push red and hope CI catches it.

## Opening the PR

1. Branch from `main`: `feat/...`, `fix/...`, `docs/...`, `chore/...`.
2. Use `.github/PULL_REQUEST_TEMPLATE.md` — fill every section.
3. **You must complete the `AI contributor disclosure` section.** CI
   (`.github/workflows/ai-pr-guard.yml`) fails PRs missing it.
4. Add the `ai-authored` label.

### Disclosure you must provide

- Agent name + version (e.g. `ZCode`, `Cursor 0.42`, `Claude Code`).
- Model (e.g. `gpt-5`, `claude-opus-4.5`, `GLM-5.2`).
- Autonomy: `human-directed` / `human-supervised` / `autonomous`.
- Prompt summary (1-3 sentences).
- Local verification results.

## If a maintainer asks you to change something

- Respond in the PR, make the change, re-run the full verification command,
  push. Do not argue about the hard constraints.
- If a review comment is unclear, ask one focused question — don't guess and
  push a large speculative diff.
