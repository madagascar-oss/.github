# Contributing

Thanks for your interest in contributing to Madagascar OSS! This guide applies to
every repository in the organization unless a repository provides its own.

## Ground rules

- Follow the [Code of Conduct](CODE_OF_CONDUCT.md).
- For anything bigger than a small fix, open an issue first to discuss the change.
- Never report security issues in public issues — see [SECURITY.md](SECURITY.md).

## Workflow

1. Fork the repository (or create a branch if you are a member).
2. Create a branch from `main`: `git switch -c feat/short-description`.
3. Make focused commits using [Conventional Commits](https://www.conventionalcommits.org/):
   `feat: ...`, `fix: ...`, `docs: ...`, `chore: ...`, `refactor: ...`, `test: ...`.
4. Make sure CI passes locally where possible.
5. Open a pull request against `main` and fill in the template.
6. A maintainer review is required. Pull requests are squash-merged.

## Branch protection

`main` is protected in every repository:

- changes land only through pull requests;
- at least one approving review (code owners) is required;
- status checks must pass and the branch must be up to date;
- force pushes and branch deletion are blocked.

## Reviews

- Keep pull requests small and focused.
- Respond to review comments, or explain why you disagree.
- New commits after approval dismiss stale approvals.
