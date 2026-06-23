<!--
  AI agents: complete the "AI contributor disclosure" section below and add the
  `ai-authored` label. CI fails PRs with that label but no disclosure. See
  AGENTS.md and CONTRIBUTING.md.
-->

## Summary

<!-- 1-3 sentences: what & why. Reference the issue if any ("Closes #123"). -->

## Changes

<!-- Bullet list of the notable changes. -->

-

## Verification

Run locally before pushing (CI runs the same):

- [ ] `bun test`
- [ ] `bun run typecheck`
- [ ] `bun run build`

<!-- Note any test you could NOT run headless (e.g. iOS keyboard behavior) and
     why, so the reviewer knows what needs manual verification. -->

## Breaking changes

- [ ] None
- [ ] Yes — describe and justify (a `data-rios-*` rename/removal, a prop
      signature change, or a `--rios-*` variable rename counts as breaking).

---

## AI contributor disclosure

> Required if this PR was authored or substantially authored by an AI agent.
> Add the `ai-authored` label and fill this in. CI enforces it.

- **Agent:** <!-- e.g. ZCode, Cursor 0.42, Claude Code, Codex CLI, GitHub Copilot Workspace -->
- **Model:** <!-- e.g. GLM-5.2, gpt-5, claude-opus-4.5, gemini-2.5-pro -->
- **Autonomy:** <!-- human-directed | human-supervised | autonomous -->
- **Prompt summary:** <!-- 1-3 sentences of the task given to the agent -->
- **Local verification:** <!-- which of test/typecheck/build passed locally -->
