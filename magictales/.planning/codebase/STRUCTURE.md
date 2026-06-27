# Codebase Structure

**Analysis Date:** 2026-06-27

## Directory Layout

```text
magictales/
├── .agents/             # Project-local skills for coding agents
├── .claude/             # Claude-facing skill mirror
├── .codex/              # Codex/GSD runtime, skills, agents, and workflow assets
├── .github/             # GitHub assets and CI workflows
├── .planning/           # GSD planning artifacts
├── src/                 # Python application package and LiveKit agent entrypoint
├── tests/               # LiveKit agent behavior/evaluation tests
├── .dockerignore        # Production Docker build context exclusions
├── .env.example         # Empty LiveKit credential template
├── .gitignore           # Local secrets, caches, build artifacts, and tool state exclusions
├── AGENTS.md            # Primary coding-agent instructions
├── CLAUDE.md            # Redirect to AGENTS.md
├── Dockerfile           # Production container build and start command
├── GEMINI.md            # Redirect to AGENTS.md
├── README.md            # Starter project setup, run, frontend, test, and deployment docs
├── livekit.toml         # LiveKit Cloud project and agent identifiers
├── pyproject.toml       # Python package, dependency, pytest, and ruff configuration
└── uv.lock              # Reproducible uv dependency lockfile
```

## Directory Purposes

**`src/`:**
- Purpose: All app-level Python code.
- Contains: `src/agent.py` and `src/__init__.py`.
- Key files: `src/agent.py` is the required LiveKit agent entrypoint used by `Dockerfile`.
- Generated files: `src/__pycache__/` and `src/agent_starter_python.egg-info/` are ignored artifacts.

**`tests/`:**
- Purpose: Agent behavior tests/evals.
- Contains: `tests/test_agent.py`.
- Key files: `tests/test_agent.py` tests greeting, grounding, and harmful-request refusal.
- Generated files: `tests/__pycache__/` is ignored.

**`.github/workflows/`:**
- Purpose: CI automation.
- Contains: `ruff.yml`, `tests.yml`, `template-check.yml`, and `tag-version.yml`.
- Key files: `ruff.yml` runs lint/format checks; `tests.yml` runs pytest with LiveKit secrets.

**`.planning/`:**
- Purpose: GSD planning and project-memory artifacts.
- Contains: `codebase/` after this mapping pass.
- Key files: `.planning/codebase/*.md` provide planning context for future GSD phases.

**`.codex/`, `.agents/`, `.claude/`:**
- Purpose: Coding-agent and GSD runtime assets.
- Contains: skills, agent definitions, workflow templates, and configuration.
- Key files: `.agents/skills/livekit-agents/SKILL.md` provides LiveKit-specific project guidance.
- Do not place application code here.

## Key File Locations

**Entry Points:**
- `src/agent.py` - LiveKit AgentServer, `Assistant`, RTC session handler, and CLI start.
- `Dockerfile` - Production container starts `uv run src/agent.py start`.

**Configuration:**
- `pyproject.toml` - Python package metadata, dependencies, uv settings, pytest settings, ruff settings.
- `uv.lock` - Locked dependency graph.
- `livekit.toml` - LiveKit Cloud project/agent identifiers.
- `.env.example` - Required env var names without secret values.
- `.gitignore` - Keeps `.env.local`, caches, virtualenvs, pycache, and local tool files out of git.
- `.dockerignore` - Keeps tests, docs, local secrets, VCS, and coding-agent files out of Docker context.

**Core Logic:**
- `src/agent.py` - All current assistant instructions and session configuration.

**Testing:**
- `tests/test_agent.py` - Behavioral tests using LiveKit Agents testing helpers.
- `.github/workflows/tests.yml` - CI test command and required secrets.
- `.github/workflows/ruff.yml` - CI lint and format checks.

**Documentation:**
- `README.md` - Setup, run, frontend, testing, and deployment instructions.
- `AGENTS.md` - Operational instructions for coding agents.
- `CLAUDE.md` and `GEMINI.md` - Redirect readers to `AGENTS.md`.

## Naming Conventions

**Files:**
- Lowercase module names for Python files: `src/agent.py`, `tests/test_agent.py`.
- Test files use `test_*.py`.
- Root instruction files use uppercase names: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `README.md`.
- GSD codebase docs use uppercase names under `.planning/codebase/`.

**Directories:**
- Standard Python package layout with source in `src/` and tests in `tests/`.
- Hidden tool/config directories use dot-prefixed names: `.github/`, `.codex/`, `.agents/`, `.planning/`.

**Special Patterns:**
- Keep `src/agent.py` as the app entrypoint unless deployment config is updated.
- Use `.env.local` for local secrets; never add real credentials to tracked examples or docs.

## Where to Add New Code

**New agent behavior:**
- Primary code: `src/agent.py` for simple changes.
- Tests: Add or update behavior tests in `tests/test_agent.py`.
- For substantial behavior, consider splitting helper modules under `src/` while preserving `src/agent.py` as the entrypoint.

**New LiveKit tools:**
- Implementation: Add `@function_tool` methods to `Assistant` or move tool logic to a small module under `src/`.
- Tests: Write tests first in `tests/test_agent.py` that assert tool calls and user-facing outcomes.
- Documentation: Update `README.md` if new env vars or setup steps are required.

**New workflows/handoffs/tasks:**
- Implementation: Add focused agent/task classes under `src/` and wire from `src/agent.py`.
- Tests: Add transition and behavior tests in `tests/`.
- Planning note: Verify current LiveKit APIs against docs before implementation.

**New deployment configuration:**
- Docker changes: `Dockerfile` and `.dockerignore`.
- LiveKit Cloud changes: `livekit.toml`.
- CI changes: `.github/workflows/`.

**Utilities:**
- Shared helpers: Add small modules under `src/`.
- Tests: Use matching test functions or new `tests/test_<module>.py` files.

## Special Directories

**`.venv/`:**
- Purpose: uv-managed local virtual environment.
- Source: Created by `uv sync`/`uv run`.
- Committed: No, ignored by `.gitignore`.

**`.uv-cache/`:**
- Purpose: Workspace-local uv cache when needed under sandboxed execution.
- Source: Created by uv when `UV_CACHE_DIR=.uv-cache`.
- Committed: No, ignored by `.gitignore`.

**`src/agent_starter_python.egg-info/`:**
- Purpose: Generated package metadata.
- Source: setuptools/uv install.
- Committed: No, ignored by `.gitignore`.

**`.pytest_cache/`, `.ruff_cache/`, `__pycache__/`:**
- Purpose: Tool/runtime caches.
- Source: pytest, ruff, and Python.
- Committed: No, ignored by `.gitignore`.

---

*Structure analysis: 2026-06-27*
*Update when directory structure or deployment entrypoints change*
