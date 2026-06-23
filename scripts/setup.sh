#!/usr/bin/env bash
#
# One-time repository setup for react-ios-multiselect.
# Idempotent — safe to re-run.
#
# Creates the `ai-authored` label (required by the ai-pr-guard CI workflow)
# and enables GitHub Pages with the "GitHub Actions" source (required by the
# docs deploy workflow). Run this once after creating the repo.
#
# Requires: gh (authenticated) and jq.

set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "error: gh CLI is required (https://cli.github.com)" >&2
  exit 1
fi

REPO="${1:-tonylawx/react-ios-multiselect}"
echo "Setting up $REPO …"

# --- 1. Create the ai-authored label (idempotent) ---
# The ai-pr-guard workflow only activates on PRs with this label. Without it the
# guard silently skips (no enforcement).
LABEL="ai-authored"
if gh label list --repo "$REPO" --json name -q ".[].name" 2>/dev/null | grep -qx "$LABEL"; then
  echo "  ✓ label '$LABEL' already exists"
else
  gh label create "$LABEL" \
    --repo "$REPO" \
    --description "Authored or substantially authored by an AI agent — requires the AI contributor disclosure" \
    --color "0A84FF" \
    >/dev/null
  echo "  ✓ created label '$LABEL'"
fi

# --- 2. Enable GitHub Pages with Actions source (idempotent) ---
# The docs workflow deploys via actions/deploy-pages, which needs Pages enabled
# with build_type=workflow. If it's already enabled, this is a no-op error we
# swallow.
PAGES_RESP=$(gh api "repos/$REPO/pages" 2>&1 || true)
if echo "$PAGES_RESP" | grep -q '"build_type"'; then
  echo "  ✓ GitHub Pages already enabled ($REPO)"
else
  if gh api -X POST "repos/$REPO/pages" -f build_type=workflow >/dev/null 2>&1; then
    echo "  ✓ enabled GitHub Pages (source: GitHub Actions)"
  else
    echo "  ! could not enable Pages automatically — enable it in Settings → Pages → Source: GitHub Actions"
  fi
fi

echo
echo "Done. The repo is ready for:"
echo "  • AI-authored PRs (add the 'ai-authored' label; the disclosure is enforced)"
echo "  • Docs deploys (push to main → https://tonylawx.github.io/react-ios-multiselect/)"
