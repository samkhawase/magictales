# Coding Conventions

**Analysis Date:** 2026-06-27

## Naming Patterns

**Files:**
- Use lowercase Python module names, as in `src/agent.py`.
- Use `test_*.py` for pytest modules, as in `tests/test_agent.py`.
- Keep root operational docs uppercase where established: `AGENTS.md`, `README.md`, `CLAUDE.md`, `GEMINI.md`.

**Functions:**
- Use snake_case for Python functions: `my_agent`, `_judge_llm`, `test_offers_assistance`.
- Async tests are `async def` and decorated with `@pytest.mark.asyncio`.
- The LiveKit RTC handler is async and receives `ctx: JobContext`.

**Variables:**
- Use snake_case for local variables: `judge_llm`, `session`, `result`.
- Use descriptive runtime variables for LiveKit concepts: `ctx`, `server`, `logger`.
- Environment variable names are uppercase: `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`.

**Types and classes:**
- Use PascalCase for classes: `Assistant`.
- Type annotations are expected on function signatures and return values: `def __init__(self) -> None`, `def _judge_llm() -> llm.LLM`.
- Subclass LiveKit classes directly for agent definitions: `class Assistant(Agent)`.

## Code Style

**Formatting:**
- Use ruff formatter configured in `pyproject.toml`.
- Line length is 88 characters.
- Use double quotes for strings.
- Use spaces for indentation.
- Run `uv run ruff format` before committing.

**Linting:**
- Use ruff configured in `pyproject.toml`.
- Enabled rule families: `E`, `F`, `W`, `I`, `N`, `B`, `A`, `C4`, `UP`, `SIM`, `RUF`.
- `E501` is ignored because line wrapping is handled by the formatter.
- Run `uv run ruff check`.

## Import Organization

**Order:**
1. Standard library imports, for example `logging` and `textwrap`.
2. Third-party imports, for example `dotenv`, `pytest`, and `livekit.agents`.
3. Local imports, for example `from agent import Assistant` in tests.

**Grouping:**
- Keep a blank line between import groups.
- Use parenthesized multi-line imports for larger imports from `livekit.agents`.
- Let ruff organize import ordering.

**Path Aliases:**
- No Python path aliases are configured.
- Tests import `Assistant` from `agent`; pytest/uv resolves `src/` through the package layout.

## Error Handling

**Patterns:**
- Let LiveKit runtime exceptions surface at startup/job time unless a specific recoverable path exists.
- For user-facing failures in the assistant, encode safe fallback behavior in instructions and tests.
- For new tools, catch expected external-service errors at the tool boundary and return a concise, voice-safe outcome.

**Error Types:**
- No custom exception classes exist.
- Tests assert refusal and grounding behavior for risky prompts rather than exception classes.

## Logging

**Framework:**
- Use Python `logging`.
- Existing logger: `logger = logging.getLogger("agent")` in `src/agent.py`.

**Patterns:**
- Add persistent context to LiveKit job logs with `ctx.log_context_fields`.
- Prefer structured/contextual logging around tools, external calls, and workflow transitions.
- Avoid printing secrets, model responses with sensitive data, or raw tool payloads.

## Comments

**When to Comment:**
- Existing comments in `src/agent.py` explain LiveKit model roles and optional customization paths.
- Keep comments useful for LiveKit setup and voice-pipeline decisions.
- Avoid comments that restate obvious Python mechanics.

**JSDoc/TSDoc:**
- Not applicable.

**Docstrings:**
- Existing tests use short docstrings to describe eval intent.
- Add docstrings to tests when they explain the behavior being evaluated.
- Add function docstrings for new tools because LiveKit uses tool descriptions and argument documentation to guide tool calls.

**TODO Comments:**
- No active `TODO`, `FIXME`, `HACK`, or `XXX` comments detected.
- Prefer adding tracked planning items over loose TODO comments for behavior changes.

## Function Design

**Size:**
- Keep the agent entrypoint readable; `src/agent.py` is already the central integration point.
- Extract helper modules under `src/` if tools, workflows, or instructions grow beyond a simple starter shape.

**Parameters:**
- Use explicit type annotations.
- For LiveKit tools, define clear argument names and docstring `Args:` entries so the model can call them reliably.

**Return Values:**
- Use explicit `-> None` on setup methods and async handlers when no value is returned.
- For tools, return simple serializable values that can be summarized naturally by voice.

## Module Design

**Exports:**
- `src/agent.py` currently exports `Assistant`, `server`, and `my_agent` by module presence.
- Keep `src/agent.py` importable by tests.
- Avoid side effects beyond dotenv loading and LiveKit server registration at import time.

**Barrel Files:**
- No barrel or package export pattern is currently used.
- `src/__init__.py` exists but contains no public API contract.

## Voice Agent Conventions

**Responses:**
- Keep assistant responses brief, plain text, and voice-friendly as instructed in `Assistant`.
- Avoid markdown, tables, code blocks, JSON, raw IDs, and complex formatting in spoken responses.
- Ask one question at a time.

**Behavior changes:**
- Use test-driven development for instruction, tool, task, workflow, or handoff changes.
- Verify current LiveKit APIs against documentation before implementation because the SDK changes quickly.
- For complex conversations, use LiveKit workflows/handoffs/tasks instead of expanding one monolithic prompt.

---

*Convention analysis: 2026-06-27*
*Update when style, testing, or LiveKit agent patterns change*
