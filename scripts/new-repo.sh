#!/usr/bin/env bash
# Create a new org repo from repo-template and apply org-standard settings.
# Free plan has no org-level rulesets, so protection is applied per repo.
# Usage: scripts/new-repo.sh <name> "<description>" [--private]
set -euo pipefail

ORG=madagascar-oss
NAME=${1:?usage: new-repo.sh <name> "<description>" [--private]}
DESC=${2:-}
VIS=${3:---public}
DIR=$(cd "$(dirname "$0")" && pwd)

gh repo create "$ORG/$NAME" "$VIS" --template "$ORG/repo-template" --description "$DESC" --disable-wiki
sleep 5 # let the template copy finish

gh api -X PATCH "repos/$ORG/$NAME" \
  -F allow_squash_merge=true -F allow_merge_commit=false -F allow_rebase_merge=false \
  -F delete_branch_on_merge=true -F allow_auto_merge=true -F allow_update_branch=true \
  -f squash_merge_commit_title=PR_TITLE -f squash_merge_commit_message=PR_BODY \
  -F has_wiki=false -F has_projects=false >/dev/null

gh api -X PUT "orgs/$ORG/teams/maintainers/repos/$ORG/$NAME" -f permission=maintain
gh api -X PUT "orgs/$ORG/teams/contributors/repos/$ORG/$NAME" -f permission=triage
gh api -X PUT "repos/$ORG/$NAME/vulnerability-alerts"
gh api -X PUT "repos/$ORG/$NAME/automated-security-fixes"
gh api -X PUT "repos/$ORG/$NAME/private-vulnerability-reporting" || true
gh api -X PATCH "repos/$ORG/$NAME/code-scanning/default-setup" -f state=configured >/dev/null || true

# Rulesets/branch protection on private repos require a paid plan.
if [ "$VIS" = "--public" ]; then
  gh api "repos/$ORG/$NAME/rulesets" --input "$DIR/ruleset-main.json" --jq '"ruleset \(.name) \(.enforcement)"'
else
  echo "Private repo: rulesets unavailable on Free plan, skipped."
fi

echo "Done: https://github.com/$ORG/$NAME"
