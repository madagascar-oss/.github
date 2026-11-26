#!/usr/bin/env bash
# Create or update the standard label set on a repo (idempotent).
# Usage: scripts/labels.sh <repo-name> [module ...]
# Example: scripts/labels.sh mdg-utils phone ariary words date
set -euo pipefail

ORG=mdgascar
REPO=${1:?usage: labels.sh <repo-name> [module ...]}
shift
MODULES=("$@")

label() { gh label create "$1" --repo "$ORG/$REPO" --color "$2" --description "$3" --force; }

# Type
label bug           d73a4a "Wrong output or crash"
label data          0e8a16 "Data added or corrected (needs a source)"
label feature       a2eeef "New helper or behaviour"
label docs          0075ca "Documentation only"
label chore         cfd3d7 "Tooling, CI, dependencies"

# Area
for area in spec js php python ci; do label "$area" 5319e7 "Area: $area"; done

# Module
for module in "${MODULES[@]}"; do label "$module" fbca04 "Module: $module"; done

# Entry level
label "good first issue" 7057ff "Small, well-scoped, good for newcomers"
label "help wanted"      008672 "Maintainers welcome outside help"
label no-code            c2e0c6 "Data or test-vector work, no programming needed"

# State
label needs-source   e99695 "Blocked until an official source is cited"
label needs-decision fef2c0 "Needs a maintainer decision or ADR"
label blocked        b60205 "Waiting on something external"
label triage         ededed "Not yet triaged"
