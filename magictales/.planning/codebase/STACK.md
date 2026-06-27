# Technology Stack

**Analysis Date:** 2026-06-27

## Languages

**Primary:**
- Python 3.10 through 3.14 - All application and test code in `src/` and `tests/`.

**Secondary:**
- TOML - Project, LiveKit, and uv configuration in `pyproject.toml` and `livekit.toml`.
- YAML - GitHub Actions workflows in `.github/workflows/`.
- Dockerfile syntax - Production image definition in `Dockerfile`.

## Runtime

**Environment:**
- Python 3.14.5 is the active uv-managed runtime in this checkout.
- `pyproject.toml` allows `>=3.10, <3.15`.
- The production image defaults to Python 3.14 via `ARG PYTHON_VERSION=3.14` in `Dockerfile`.

**Package Manager:**
- uv 0.11.18 - Required package manager for installs, running the agent, and tests.
- Lockfile: `uv.lock` present and should remain checked in for reproducible installs.
- Local sandbox note: uv commands may need `UV_CACHE_DIR=.uv-cache` when the default home cache is not writable.

## Frameworks

**Core:**
- `livekit-agents` 1.6.4 resolved in `uv.lock` - Python SDK for the voice agent, sessions, server, CLI, inference models, and eval helpers.
- LiveKit AgentServer - `src/agent.py` defines `server = AgentServer()` and registers `@server.rtc_session(agent_name="magictales")`.
- LiveKit Inference - `src/agent.py` uses `inference.LLM`, `inference.STT`, `inference.TTS`, and `inference.TurnDetector`.
- `livekit-plugins-ai-coustics` 0.3.0 resolved in `uv.lock` - Background voice enhancement/noise cancellation.

**Testing:**
- pytest 9.1.1 - Async behavioral evals in `tests/test_agent.py`.
- pytest-asyncio 1.4.0 - Async test support configured in `pyproject.toml`.
- LiveKit Agents test/eval helpers - `AgentSession.run`, result expectations, and LLM `judge` calls in `tests/test_agent.py`.

**Build/Dev:**
- ruff 0.15.20 - Formatting and linting configured in `pyproject.toml`.
- setuptools build backend - Package discovery from `src/` configured in `pyproject.toml`.
- Docker multi-stage build - `Dockerfile` uses `ghcr.io/astral-sh/uv:python${PYTHON_VERSION}-bookworm-slim`.

## Key Dependencies

**Critical:**
- `livekit-agents>=1.6.1` - Agent base class, sessions, LiveKit server integration, model inference, CLI, and evaluation API.
- `livekit-plugins-ai-coustics~=0.2` - Audio enhancement used by `room_io.AudioInputOptions` in `src/agent.py`.
- `python-dotenv` - Loads `.env.local` at module import time in `src/agent.py`.

**Resolved transitive dependencies:**
- `openai` 2.44.0 - Brought in by `livekit-agents` for inference/provider integrations.
- `livekit` 1.1.12, `livekit-api` 1.1.1, `livekit-protocol` 1.1.17 - LiveKit Python SDK pieces resolved by uv.
- `opentelemetry-*` 1.39.1 and `prometheus-client` 0.25.0 - Observability-related transitive dependencies from LiveKit Agents.

## Configuration

**Environment:**
- `.env.example` lists required LiveKit Cloud variables: `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`.
- `.env.local` is intentionally gitignored and loaded by `load_dotenv(".env.local")` in `src/agent.py`; never read or commit it.
- Tests in `.github/workflows/tests.yml` expect LiveKit credentials from GitHub Actions secrets.

**Build:**
- `pyproject.toml` defines dependencies, dev dependencies, pytest async settings, ruff rules, and setuptools package discovery.
- `uv.lock` pins resolved package versions.
- `Dockerfile` runs `uv sync --locked`, `uv run --module livekit.agents download-files`, then starts `uv run src/agent.py start`.
- `.dockerignore` excludes tests, docs, local env files, agent metadata, caches, and VCS/editor files from the production build context.

## Platform Requirements

**Development:**
- Use `uv sync` to install dependencies.
- Run console mode with `uv run python src/agent.py console`.
- Run LiveKit dev worker mode with `uv run python src/agent.py dev`.
- Run tests with `uv run pytest`; tests require LiveKit credentials because they use LiveKit Inference judges and agent models.
- Use `uv run ruff format` and `uv run ruff check` before committing code changes.

**Production:**
- LiveKit Cloud project is configured by `livekit.toml` with project subdomain `magictales-hbl49wjz` and agent id `CA_kR4trorHrrjn`.
- Agent process entrypoint is `src/agent.py start`; keep `src/agent.py` as the deployed entrypoint unless `Dockerfile` is updated.
- Docker image runs as non-root `appuser`.
- LiveKit credentials must be provided as environment variables in the deployment environment.

---

*Stack analysis: 2026-06-27*
*Update after major dependency, runtime, deployment, or LiveKit SDK changes*
