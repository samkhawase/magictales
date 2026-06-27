# Architecture

**Analysis Date:** 2026-06-27

## Pattern Overview

**Overall:** Minimal LiveKit Cloud voice agent with a single RTC session entrypoint.

**Key Characteristics:**
- Single application entrypoint in `src/agent.py`.
- One `Assistant` class defines the conversational LLM and instructions.
- One `AgentSession` wires STT, LLM, TTS, turn detection, and audio input options.
- State is delegated to LiveKit Agents session/runtime abstractions; there is no application database.
- Tests are behavioral evaluations against text-only `AgentSession` turns.

## Layers

**Agent Definition Layer:**
- Purpose: Define assistant identity, LLM, and system instructions.
- Contains: `Assistant(Agent)` in `src/agent.py`.
- Depends on: `livekit.agents.Agent`, `livekit.agents.inference.LLM`, and Python `textwrap`.
- Used by: `my_agent` session startup and tests in `tests/test_agent.py`.

**Session Orchestration Layer:**
- Purpose: Configure the realtime voice pipeline and connect it to a LiveKit room.
- Contains: `my_agent(ctx: JobContext)` in `src/agent.py`.
- Depends on: `AgentSession`, `TurnHandlingOptions`, `inference.STT`, `inference.TTS`, `inference.TurnDetector`, `room_io.RoomOptions`, and `ai_coustics`.
- Used by: `AgentServer` when LiveKit dispatches an RTC session job.

**Server/CLI Layer:**
- Purpose: Register the LiveKit worker and expose CLI modes.
- Contains: `server = AgentServer()`, `@server.rtc_session(agent_name="magictales")`, and `cli.run_app(server)` in `src/agent.py`.
- Depends on: `livekit.agents.AgentServer` and `livekit.agents.cli`.
- Used by: local commands (`console`, `dev`) and production command (`start`).

**Evaluation Layer:**
- Purpose: Verify assistant behavior without creating a LiveKit room.
- Contains: `tests/test_agent.py`.
- Depends on: pytest, pytest-asyncio, `AgentSession`, `inference.LLM`, and `llm.LLM`.
- Used by: local `uv run pytest` and `.github/workflows/tests.yml`.

**Deployment Layer:**
- Purpose: Package and run the agent in production.
- Contains: `Dockerfile`, `.dockerignore`, `livekit.toml`, and README deployment commands.
- Depends on: uv, Docker, LiveKit Cloud, and environment credentials.

## Data Flow

**Production RTC Session:**

1. `uv run src/agent.py start` invokes `cli.run_app(server)` in `src/agent.py`.
2. LiveKit dispatches an RTC session for agent name `magictales`.
3. `my_agent(ctx)` receives a `JobContext`.
4. `my_agent` adds `room` to `ctx.log_context_fields`.
5. `AgentSession` is constructed with STT, TTS, turn detector, and preemptive generation.
6. `session.start(agent=Assistant(), room=ctx.room, room_options=...)` initializes the assistant and audio pipeline.
7. `ctx.connect()` joins the room and connects to the user.
8. LiveKit Agents handles realtime speech input, model calls, response synthesis, and media transport.

**Console/Development Session:**

1. `uv run python src/agent.py console` or `uv run python src/agent.py dev` calls the same `cli.run_app(server)` entrypoint.
2. The LiveKit Agents CLI selects the requested runtime mode.
3. The same registered server/session code is used.

**Test Evaluation Turn:**

1. A test creates a judge LLM with `_judge_llm()` in `tests/test_agent.py`.
2. A text-only `AgentSession()` starts `Assistant()`.
3. `session.run(user_input=...)` simulates a user turn.
4. `result.expect.next_event().is_message(role="assistant").judge(...)` evaluates the response against an intent.
5. `result.expect.no_more_events()` asserts the turn produced no extra events or tool calls.

**State Management:**
- No persistent application state is present.
- Conversation/session state is managed by LiveKit Agents runtime objects.
- Environment state comes from `.env.local` and deployment/CI environment variables.

## Key Abstractions

**Assistant:**
- Purpose: The conversational agent definition.
- Location: `src/agent.py`.
- Pattern: Subclass of `livekit.agents.Agent` with model and instructions passed to `super().__init__`.

**AgentServer:**
- Purpose: Register LiveKit worker session handlers.
- Location: `src/agent.py`.
- Pattern: Module-level singleton `server` with decorator-based RTC session registration.

**AgentSession:**
- Purpose: Runtime session that combines models, turn handling, audio processing, and agent lifecycle.
- Locations: `src/agent.py` for production voice pipeline; `tests/test_agent.py` for text-only evals.
- Pattern: Construct per job or per test.

**LiveKit Inference model wrappers:**
- Purpose: Access LLM, STT, TTS, and turn detection models through LiveKit Cloud.
- Location: `src/agent.py` and `tests/test_agent.py`.
- Pattern: `inference.LLM`, `inference.STT`, `inference.TTS`, and `inference.TurnDetector`.

## Entry Points

**Agent CLI entrypoint:**
- Location: `src/agent.py`.
- Triggers: `python src/agent.py console`, `python src/agent.py dev`, or `python src/agent.py start`.
- Responsibilities: Load dotenv, define agent/server/session, and hand off to LiveKit CLI.

**LiveKit RTC session handler:**
- Location: `src/agent.py` function `my_agent`.
- Triggers: LiveKit Cloud agent job for `agent_name="magictales"`.
- Responsibilities: Configure models, audio, logging context, session startup, and room connection.

**Tests:**
- Location: `tests/test_agent.py`.
- Triggers: `uv run pytest`.
- Responsibilities: Validate friendly greeting, grounding/refusal for unknown personal information, and refusal of harmful requests.

## Error Handling

**Strategy:** Current application code relies on LiveKit Agents defaults and Python exceptions; there is no custom error boundary.

**Patterns:**
- Tests assert behavioral refusals for unsafe or unknowable prompts rather than exception behavior.
- `load_dotenv(".env.local")` does not fail if the file is missing; missing credentials surface later when LiveKit or inference calls run.
- No tool functions are active, so there are no tool-specific error paths yet.

## Cross-Cutting Concerns

**Logging:**
- Use the module logger `logging.getLogger("agent")` for future application logs.
- Add durable context via `ctx.log_context_fields` rather than repeated ad hoc fields.

**Validation:**
- No request schemas or custom input validators exist.
- Prompt-level guardrails in `Assistant` instructions cover safe, lawful, privacy-preserving behavior.
- Behavioral tests verify important safety and grounding properties.

**Authentication:**
- LiveKit Cloud credentials are the only active auth mechanism.
- Keep credentials in `.env.local`, CI secrets, or deployment env vars; never in code or docs.

**Latency:**
- The agent uses a pipeline architecture with preemptive generation enabled in `src/agent.py`.
- Keep future assistant instructions and tools concise because this is a voice interface.
- For complex workflows, prefer LiveKit handoffs/tasks over a single large prompt or broad toolset.

---

*Architecture analysis: 2026-06-27*
*Update when major session, workflow, tool, handoff, or deployment patterns change*
