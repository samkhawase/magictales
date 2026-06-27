# External Integrations

**Analysis Date:** 2026-06-27

## APIs & External Services

**LiveKit Cloud:**
- LiveKit Cloud is the primary runtime service for room connections, agent dispatch, credentials, and model inference.
  - SDK/Client: `livekit-agents` and transitive LiveKit Python packages from `pyproject.toml` and `uv.lock`.
  - Auth: `LIVEKIT_URL`, `LIVEKIT_API_KEY`, and `LIVEKIT_API_SECRET` loaded from `.env.local` or the deployment environment.
  - Project config: `livekit.toml` contains project subdomain `magictales-hbl49wjz` and agent id `CA_kR4trorHrrjn`.

**LiveKit Inference models:**
- OpenAI LLM via LiveKit Inference - `src/agent.py` configures `inference.LLM(model="openai/gpt-5.2-chat-latest")` for the assistant.
- Deepgram STT via LiveKit Inference - `src/agent.py` configures `inference.STT(model="deepgram/nova-3", language="multi")`.
- Cartesia TTS via LiveKit Inference - `src/agent.py` configures `inference.TTS(model="cartesia/sonic-3", voice="9626c31c-bec5-4cca-baa8-f8ba9e84c8bc")`.
- LiveKit Turn Detector via LiveKit Inference - `src/agent.py` configures `inference.TurnDetector()` inside `TurnHandlingOptions`.
- Test judge LLM via LiveKit Inference - `tests/test_agent.py` creates `inference.LLM(model="openai/gpt-4.1-mini")`.

**Audio processing:**
- LiveKit AI Acoustics - `src/agent.py` uses `ai_coustics.audio_enhancement(model=ai_coustics.EnhancerModel.QUAIL_VF_S)` for audio input noise cancellation.

**Optional provider integrations:**
- OpenAI Realtime API path is commented as an example in `src/agent.py`; it is not active.
- No direct OpenAI, Deepgram, or Cartesia provider API keys are required by the active code path because models are accessed through LiveKit Inference.

## Data Storage

**Databases:**
- Not detected. No database client, schema, ORM, or migration directory exists.

**File Storage:**
- Not detected. No object storage SDK or upload path exists.

**Caching:**
- Not detected in application code.
- Docker build sets `HF_HOME=/app/.cache/huggingface` and `TORCH_HOME=/app/.cache/torch` to share downloaded model/cache files across image stages.

## Authentication & Identity

**Auth Provider:**
- LiveKit API key authentication for the agent worker and test inference calls.
  - Credentials: `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`.
  - Local source: `.env.local` loaded by `load_dotenv(".env.local")`.
  - Example source: `.env.example` lists empty placeholders only.

**OAuth Integrations:**
- Not detected.

## Monitoring & Observability

**Error Tracking:**
- No Sentry, Bugsnag, or equivalent error tracking service detected.

**Analytics:**
- No product analytics integration detected.

**Logs:**
- Python logger named `agent` is created in `src/agent.py`.
- `my_agent` sets `ctx.log_context_fields = {"room": ctx.room.name}` so LiveKit job logs include the room name.
- Docker keeps stdout/stderr unbuffered with `PYTHONUNBUFFERED=1`.

## CI/CD & Deployment

**Hosting:**
- Intended hosting is LiveKit Cloud agent deployment.
- `Dockerfile` builds a production container and starts `uv run src/agent.py start`.
- `.dockerignore` excludes `.github/`, tests, docs, local env files, and coding-agent metadata from the container context.

**CI Pipeline:**
- GitHub Actions lint/format workflow: `.github/workflows/ruff.yml`.
- GitHub Actions test workflow: `.github/workflows/tests.yml`.
- Template-only tracking guard: `.github/workflows/template-check.yml` checks that `uv.lock` and `livekit.toml` are not tracked in the upstream template context, but this cloned project currently tracks both.
- Version tagging workflow: `.github/workflows/tag-version.yml` only tags exact `livekit-agents==...` pins; the current `pyproject.toml` uses `livekit-agents>=1.6.1`, so that workflow will normally skip.

## Environment Configuration

**Development:**
- Required env vars: `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`.
- Secrets location: `.env.local`, which is ignored by `.gitignore`.
- Setup path: copy `.env.example` to `.env.local` or use the LiveKit CLI to write env values.
- Local agent modes: `console`, `dev`, and `start` are passed to `src/agent.py`.

**CI:**
- `.github/workflows/tests.yml` reads `LIVEKIT_URL`, `LIVEKIT_API_KEY`, and `LIVEKIT_API_SECRET` from repository secrets.
- Tests do not connect to a LiveKit room, but LiveKit Inference still needs credentials for the judge and agent models.

**Production:**
- Configure LiveKit credentials in the LiveKit Cloud deployment environment.
- `livekit.toml` identifies the target project and agent.

## Webhooks & Callbacks

**Incoming:**
- Not detected. The agent listens for RTC session jobs through LiveKit rather than exposing HTTP webhook routes.

**Outgoing:**
- Not detected. No explicit external HTTP client calls, webhooks, or task queues exist in application code.

---

*Integration audit: 2026-06-27*
*Update when adding/removing external services, model providers, webhooks, or deployment targets*
