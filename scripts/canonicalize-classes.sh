#!/usr/bin/env bash
# Renames deprecated or verbose Tailwind class forms to their canonical equivalents
# across all Vue templates. Safe to run repeatedly (idempotent).
#
# Add new entries here as the Tailwind IntelliSense extension suggests them.

set -euo pipefail

FILES=$(find app -name "*.vue")

sed -i '' \
  \
  `# ── v3 → v4 utility renames ────────────────────────────────────────────` \
  -e 's/flex-shrink-0/shrink-0/g' \
  -e 's/flex-shrink\b/shrink/g' \
  -e 's/flex-grow-0/grow-0/g' \
  -e 's/flex-grow\b/grow/g' \
  -e 's/overflow-ellipsis/text-ellipsis/g' \
  -e 's/decoration-clone/box-decoration-clone/g' \
  -e 's/decoration-slice/box-decoration-slice/g' \
  \
  `# ── duration-[Nms] → duration-N (covers all ms values in one rule) ─────` \
  -e 's/duration-\[\([0-9]*\)ms\]/duration-\1/g' \
  \
  `# ── Spacing arbitrary values with clean scale equivalents ───────────────` \
  -e 's/\[0\.375rem\]/1.5/g' \
  -e 's/px-\[0\.5rem\]/px-2/g' \
  \
  `# ── Letter-spacing aliases ───────────────────────────────────────────────` \
  -e 's/tracking-\[0\.1em\]/tracking-widest/g' \
  \
  $FILES
