# Poke Radar — Codex/OpenClaw + BMAD

## Project scope

- Treat this repository as the active Poke Radar project.
- BMAD is installed in `_bmad/`; generated project artifacts live in `_bmad-output/`.
- Codex-facing BMAD skills live in `.agents/skills/`.
- Resolve BMAD configuration with:
  `uv run --python 3.11 _bmad/scripts/resolve_config.py --project-root .`

## BMAD routing

When a request names BMAD, a BMAD menu code, or a skill under `.agents/skills/`, read that skill's `SKILL.md` completely and follow it. Prefer the current project state and `_bmad-output/implementation-artifacts/sprint-status.yaml` over assumptions.

Useful Telegram phrases and their routes:

- `BMAD aide` or `BMAD prochaine étape` -> `.agents/skills/bmad-help/SKILL.md`
- `BMAD statut` -> inspect resolved config, sprint status, current branch, and working tree; report only
- `BMAD crée la prochaine story` -> `.agents/skills/bmad-create-story/SKILL.md`
- `BMAD développe la story <id>` -> `.agents/skills/bmad-dev-story/SKILL.md`
- `BMAD code review de la story <id> avec sous-agents` -> `.agents/skills/bmad-code-review/SKILL.md`; delegation is explicitly authorized for that review run
- `BMAD corrige les constats de review` -> route back through the dev-story skill for the active story
- `BMAD clôture la story` -> mark `done` only after acceptance criteria, required tests, and review are clean

## Telegram operating rules

- Natural-language Telegram messages are the control surface; slash commands are not required.
- Before changing code, state the interpreted project, story, and workflow in one concise sentence.
- Use a fresh delegated reviewer for BMAD code review when the user explicitly asks for sub-agents.
- Report checkpoints and blockers concisely in French.
- Do not commit, push, create/merge a pull request, or alter remote state unless the user explicitly asks.
- Preserve user changes and pre-existing untracked build artifacts.

## Quality gates

For UI/Rust story work, run the relevant subset of:

- `npm test -- --run` from `ui/`
- `npm run build` from `ui/`
- `cargo test --manifest-path src-tauri/Cargo.toml`
- `cargo build --manifest-path src-tauri/Cargo.toml`

Do not move a story to `done` when a required gate fails. `review` means implementation is ready for an independent review, not complete.
