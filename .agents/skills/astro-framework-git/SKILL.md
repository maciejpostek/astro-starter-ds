---
name: astro-framework-git
description: Safely choose, explain, name, and create a Git commit or branch for the current Astro project. Use when the user invokes Astro Framework Git, asks how to record current project changes, wants to begin isolated work, requests a commit or branch, or wants a recommendation between committing a completed checkpoint and creating a branch for upcoming multi-step work.
---

# Astro Framework Git

Help the user choose the correct Git operation, then execute it only after the user explicitly approves both the operation and its proposed name.

## 1. Inspect without changing state

Locate the active repository with `git rev-parse --show-toplevel`. Stop with a clear explanation if the current project is not a Git repository.

Read repository instructions such as `AGENTS.md` and Git-related project rules when present. Then inspect:

- current branch;
- `git status --short`;
- staged and unstaged diff summaries;
- the latest commit;
- relevant file diffs when needed to understand the requested task.

Keep this phase read-only. Do not stage, commit, switch branches, stash, discard, restore, delete, or rewrite anything.

Treat existing changes as user-owned. Account for work from parallel tasks and never assume every dirty file belongs to the requested operation.

## 2. Recommend commit or branch

Explain the distinction briefly in the user's language:

- **Commit** records a named snapshot of selected changes on the current branch. Recommend it when a coherent change, cleanup, fix, or checkpoint is already present and should be saved in history.
- **Branch** creates a separate line of work from the current commit. Recommend it before risky, experimental, long-running, or multi-step work. Creating a branch does not save uncommitted changes.

If both are appropriate, explain the normal sequence: create a branch first, do or carry the work there, then create one or more commits. Do not silently turn the user's choice into two operations.

Base the recommendation on the actual repository state and the user's intended next task. Propose:

- one operation: `commit` or `branch`;
- one concise reason;
- one proposed name;
- the exact scope that would be affected.

Use conventional, imperative commit subjects when the repository has no stronger convention, for example:

```text
refactor(design-system): remove obsolete components
```

Use lowercase kebab-case branch names. Follow the repository or host naming policy; otherwise use the required local default prefix, if one exists.

Ask the user to approve or change the operation and name. Do not perform any write operation before receiving explicit approval. Approval must unambiguously identify the chosen operation and accepted name.

## 3. Create an approved branch

Before creation, refresh the repository status and verify that the proposed branch does not already exist locally. Do not contact a remote unless the task requires it.

If the working tree is dirty, state that the existing uncommitted changes will remain in the working tree after switching and are still not saved. If switching would be unsafe or ambiguous, stop and ask for direction; never stash or discard changes automatically.

Create only the approved branch with a non-destructive command such as:

```text
git switch -c <approved-name>
```

After success, report the branch name, base commit, working-tree status, and whether changes remain uncommitted.

## 4. Create an approved commit

Refresh the status and diff before staging. Confirm that the approved commit scope still matches the current working tree.

Stage selectively:

- include only files belonging to the approved task;
- inspect untracked files before including them;
- exclude unrelated changes, secrets, caches, build artifacts, and work from parallel tasks;
- do not use `git add .` or `git add -A` when the tree contains mixed-scope changes;
- ask for clarification if ownership or scope cannot be determined safely.

Run `git diff --check` and the smallest relevant validators required by repository instructions. Do not run a broad build unless the affected scope or repository rules require it. Fix only failures caused by the approved task; otherwise report the blocker and do not commit.

Review `git diff --cached --stat` and the staged diff before committing. Create a new commit using the exact approved message. Never amend, squash, reset, rebase, push, or force-push unless the user separately and explicitly requests that operation.

After success, report:

- commit hash and subject;
- branch name;
- committed scope;
- validation results;
- changes left unstaged or untracked.

## Safety rules

- Never claim a branch saved changes.
- Never commit all dirty files merely because they exist.
- Never discard or overwrite user changes.
- Never create a commit or branch before the user approves its exact name.
- Never push as part of this workflow without a separate explicit request.
- Prefer stopping for one precise clarification over guessing about mixed or destructive Git scope.
- Follow any stricter repository, host, or system instructions.
