# Git and file access for Cowork and cloud agent sessions

Status: the one place this guidance lives. The Claude skills for lesson production and lesson revision are pointers that tell the agent to read this file; do not copy it into a skill.

This applies to a Claude Cowork or cloud session linked to Carlin's computer. An agent running directly in a local checkout (Codex, Claude Code) just uses git there and can skip this file.

## Reading the process docs

- Read the runbooks, queue and skills from `origin/main` in `$CHRONOS_WORK`, not from the mounted `C:\dev\chronos-learning` folder. Carlin's checkout can be on an old branch with uncommitted edits, so its copy of a runbook may be many commits stale. Use `git fetch origin` then `git show origin/main:<path>`.
- Read from a branch instead only when the user says a branch is changing the process.

## Git

- Push, open PRs and merge from the device shell (`device_bash`). Begin every `device_bash` call that uses git with `source "$HOME/mnt/chronos-learning/.agent-git.local/setup.sh"`. It logs `gh` in with Carlin's stored login and gives you `$CHRONOS_WORK`, a clone outside the mounted folder. Work there: `git push -u origin <branch>`, `gh pr create`, `gh pr checks`, `gh pr merge --squash`. Source it without piping its output into another command, or `$CHRONOS_WORK` is lost.
- Never run git write commands (commit, checkout, fetch, worktree, branch) inside the mounted `C:\dev\chronos-learning` folder. The device shell cannot delete files there, so git leaves stale lock files that break Carlin's repo. Never delete lock files or other files in `.git`. Carlin's own checkout may be dirty on another branch; leave it alone and preserve unrelated changes.
- The cloud `Bash` shell cannot push (this repo is not a session source). It is fine for editing, validation and tests; move finished commits to `$CHRONOS_WORK` with a small `git bundle` passed through `device_bash` as base64, then push from there.
- The Vercel branch preview link is in the PR's Vercel comment: `gh api repos/dev-vibe/chronos-learning/issues/<n>/comments`.
- If `setup.sh` prints `NOT LOGGED IN`, follow `.agent-git.local/README.md` to run the device-code login inside a single `device_bash` call and ask Carlin to approve the code at https://github.com/login/device. Only if that fails, give Carlin copy-paste commands to push and open the PR.
