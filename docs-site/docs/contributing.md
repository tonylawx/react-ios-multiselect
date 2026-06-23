---
sidebar_position: 9
---

# Contributing

Contributions from **humans and AI agents** are both welcome. The full rules
live in the repository:

- [`CONTRIBUTING.md`](https://github.com/tonylawx/react-ios-multiselect/blob/main/CONTRIBUTING) — rules for everyone, plus the AI disclosure policy.
- [`AGENTS.md`](https://github.com/tonylawx/react-ios-multiselect/blob/main/AGENTS.md) — the entry point for AI agents.

## Quick reference

```bash
bun install
bun test            # 36 tests: pure logic + component render
bun run typecheck   # tsc --noEmit
bun run build       # tsup → dist/
cd demo && bun dev  # Vite playground
cd docs-site && bun start  # this docs site
```

No code merges without green tests + clean typecheck + a successful build. CI
runs the same.

## Hard constraints (will reject a PR that violates these)

- **Zero runtime deps** beyond `react`/`react-dom`. No new dependency without an
  approved issue.
- **Plain CSS + `--rios-*` variables.** No Tailwind, no CSS-in-JS.
- **`data-rios-*` selectors are public API.** Don't rename/remove one without a
  major version bump.
- **Mobile-only.** Do not reintroduce a desktop popover path.

## AI agents must disclose

A PR authored or substantially authored by an agent must fill the **AI
contributor disclosure** in the PR template: agent name, model, autonomy level,
prompt summary, and local verification. The `ai-pr-guard` CI workflow fails
`ai-authored` PRs missing it.

Known agents are registered in
[`.github/ai-contributors.yml`](https://github.com/tonylawx/react-ios-multiselect/blob/main/.github/ai-contributors.yml).
Agent-facing tasks are filed as `agent-task` issues — comment `/claim` to take one.
