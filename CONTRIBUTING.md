# Contributing to react-ios-multiselect

This project welcomes contributions from **both humans and AI agents**. To keep
the project healthy and auditable, every contributor — human or agent — follows
the same rules. AI agents have an additional disclosure requirement.

## TL;DR

1. Open an issue first for anything beyond a typo/small fix.
2. Branch from `main`, name it `feat/...`, `fix/...`, `docs/...`, or `chore/...`.
3. Keep the change focused; one concern per PR.
4. **All tests must pass:** `bun install && bun test && bun run typecheck && bun run build`.
5. Write a clear PR description using the PR template.
6. **AI agents: fill in the `AI contributor disclosure` section** (see below).

## Local setup

```bash
bun install
bun test            # 36 tests: pure logic + component render (happy-dom + RTL)
bun run typecheck   # tsc --noEmit
bun run build       # tsup → dist/
cd demo && bun dev  # Vite playground, open on a phone/simulator
```

No code leaves this repo without green tests + clean typecheck + a successful
build. The CI enforces all three.

## Code conventions

- **Zero runtime dependencies** beyond the `react`/`react-dom` peers. Do not add
  a runtime dependency without explicit maintainer approval. If you reach for a
  library, ask in an issue first.
- **Plain CSS + `--rios-*` variables.** No Tailwind, no CSS-in-JS. New visual
  tokens go in `:root` in `src/select.css` with a sensible default.
- **`data-rios-*` selectors are a public API** for agents/Playwright. Do not
  rename or remove one without bumping the major version.
- **Component tests live in `tests/select.test.tsx`** (DOM/happy-dom); pure
  logic tests live next to the concern (`tests/select-*.test.ts`). Add a test
  for every new behavior.

## Commit & PR style

- Commits follow Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`,
  `test:`, `chore:`). Keep the subject ≤ 72 chars.
- One concern per PR. A PR that mixes a feature, a refactor, and a dependency
  bump will be asked to split.
- Squash-merge into `main`. The squash title becomes the commit subject.

## AI contributor disclosure (required for agents)

**Any pull request authored or substantially authored by an AI agent must
declare it.** This is enforced by CI (`.github/workflows/ai-pr-guard.yml`):
a PR with the `ai-authored` label whose description is missing the disclosure
block will fail the check.

The disclosure lives in the PR body (see `PULL_REQUEST_TEMPLATE.md`) and
contains:

- **Agent name + version** (e.g. `Cursor 0.42`, `Claude Code`, `ZCode`, `GitHub Copilot Workspace`, `Codex CLI`).
- **Model** (e.g. `gpt-5`, `claude-opus-4.5`, `GLM-5.2`, `gemini-2.5-pro`).
- **Autonomy level** — one of:
  - `human-directed` — a human wrote the prompt and reviewed every change.
  - `human-supervised` — the agent produced code with human oversight/approval.
  - `autonomous` — the agent opened the PR without human review of the diff.
- **Prompt summary** — 1-3 sentences describing the task given to the agent.
- **Verification** — which of `bun test` / `typecheck` / `build` the agent ran
  locally and their results.

Why: it lets reviewers calibrate scrutiny, lets users know what they're running,
and builds a track record of which agents/models produce reliable contributions
to this codebase.

Register recurring agents in [`.github/ai-contributors.yml`](./.github/ai-contributors.yml)
so disclosures can be validated against a known list.

## Reporting problems

Open an issue with the `bug` or `enhancement` label. For agent-facing tasks,
maintainers open issues labeled `agent-task` with a clear acceptance criteria
section (see `.github/ISSUE_TEMPLATE/agent-task.md`) — these are designed to be
grabbed by agents that follow this guide.
