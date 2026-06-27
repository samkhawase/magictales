# Phase 1: Story Contract and Tests - Research

**Researched:** 2026-06-27  
**Domain:** LiveKit Agents Python behavioral testing and story-contract design  
**Confidence:** MEDIUM

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
## Implementation Decisions

### Story Source
- **D-01:** `.planning/basic_story.md` is the canonical first hardcoded adventure for v1.
- **D-02:** The first adventure is the village roller-cart story with Milo as the sidekick, a silver whistle, the forest gate, the fox, and the return to grandmother's house.
- **D-03:** The story premise and beats from `basic_story.md` should be preserved, but implementation may restructure the text into code constants or a story contract that is easier to test.

### Level Objective
- **D-04:** The level objective is to open the forest gate and return to grandmother's house.
- **D-05:** The learning question about the whistle is part of that objective, not the top-level objective itself.
- **D-06:** Objective completion requires the player to explicitly answer, in free speech, that a whistle is used to make a loud sound, call someone, get attention, signal danger, or ask for help.

### Player Input
- **D-07:** The implemented experience should accept free speech rather than forcing A/B/C choice selection.
- **D-08:** Tests should use representative spoken/freeform inputs, including a correct answer phrased differently from the draft option text.

### Hint and Retry Flow
- **D-09:** If the player answers incorrectly or does not answer, the helper flow should escalate from broad hint to clearer hint to final helper answer.
- **D-10:** The final helper answer completes the learning explanation but should not auto-advance the level.
- **D-11:** After the final helper answer, the player must repeat or provide the correct answer in their own words before the gate opens.

### Sidekick Behavior
- **D-12:** Milo is the sidekick for v1.
- **D-13:** Milo should give playful, age-appropriate cues that help the player reason without immediately solving the objective.
- **D-14:** Milo's hints may become more direct after repeated wrong answers, matching the draft's Helper AI Flow.

### Voice Style and Safety
- **D-15:** Use standard age-appropriate safeguards for kids ages 10-14.
- **D-16:** There are no special extra content boundaries beyond usual kid-safe guardrails and staying within the predefined adventure.
- **D-17:** The agent should sound friendly, playful, concise, and natural for TTS.

### Test Contract
- **D-18:** Phase 1 tests should lock the story contract before implementation: story opening, objective definition, correct freeform answer, wrong answer hint, final helper answer plus retry requirement, sidekick cue behavior, and safety redirect.
- **D-19:** Existing LiveKit Agents text-session eval patterns in `tests/test_agent.py` should be reused for behavior tests.

### the agent's Discretion
The planner may choose exact Python module boundaries for the story contract and test helpers as long as `src/agent.py` remains the deployment entrypoint and tests stay aligned with existing project conventions.

### Deferred Ideas (OUT OF SCOPE)
## Deferred Ideas

None — discussion stayed within Phase 1 scope.
</user_constraints>

## Summary

Phase 1 should produce a structured, importable v1 story contract and failing behavioral tests that describe the MagicTales game behavior Phase 2 must implement. [VERIFIED: .planning/phases/01-story-contract-and-tests/01-CONTEXT.md] The planner should not schedule full turn-by-turn gameplay, frontend work, room audio, or sound-cue execution in this phase. [VERIFIED: .planning/ROADMAP.md]

Use the existing LiveKit Agents Python text-session evaluation pattern: async pytest tests, fresh `AgentSession` and `Assistant` per test, `session.run(user_input=...)`, `RunResult.expect`, LLM `judge(...)`, and `no_more_events()`. [CITED: docs.livekit.io/agents/start/testing.md] Multi-turn tests should call `session.run(...)` repeatedly on the same session so history builds naturally across turns. [CITED: docs.livekit.io/agents/start/testing/test-framework.md]

**Primary recommendation:** Create `src/story_contract.py` as a small typed contract plus focused tests in `tests/test_agent.py` or `tests/test_magictales_story.py` that are expected to fail until Phase 2 replaces the generic assistant behavior. [VERIFIED: .planning/codebase/STRUCTURE.md]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Story contract data | API / Backend | — | The Python agent owns the authoritative hardcoded v1 story and objective contract. [VERIFIED: .planning/codebase/STRUCTURE.md] |
| Behavioral eval tests | API / Backend | External LLM service | Tests exercise the Python `Assistant` through LiveKit `AgentSession` and use LiveKit Inference for judge calls. [CITED: docs.livekit.io/agents/start/testing.md] |
| Voice style constraints | API / Backend | TTS runtime | The agent prompt controls spoken brevity and plain-text output before TTS renders it. [CITED: docs.livekit.io/agents/start/prompting.md] |
| Kid-safe story boundary | API / Backend | — | The agent must refuse unsafe or out-of-adventure requests and redirect to the predefined story. [VERIFIED: .planning/REQUIREMENTS.md] |
| Full game loop | — | — | Out of scope for Phase 1; Phase 2 owns runtime gameplay state and objective evaluation. [VERIFIED: .planning/ROADMAP.md] |

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| OBJ-01 | Story defines one clear level objective for the hardcoded v1 level. | Story contract must expose title, objective, success condition, and accepted freeform answer meanings. [VERIFIED: .planning/REQUIREMENTS.md] |
| SIDE-01 | Story includes a sidekick character that gives age-appropriate cues toward the objective. | Contract should name Milo and include cue/hint expectations without solving immediately. [VERIFIED: .planning/basic_story.md] |
| AUDIO-01 | Agent responses are concise and natural for text-to-speech. | LiveKit prompting guidance recommends plain text, brief replies, and one question at a time for voice agents. [CITED: docs.livekit.io/agents/start/prompting.md] |
| SAFE-01 | Agent keeps content appropriate for kids ages 10-14. | Tests should include a kid-safety redirect and contract should state age range and story boundary. [VERIFIED: .planning/REQUIREMENTS.md] |
| TEST-01 | Behavioral tests cover successful objective completion, incomplete attempts, sidekick cues, story boundaries, and safety refusals. | Test plan should include happy path, wrong answer hint, final helper retry, sidekick cue, and unsafe/out-of-story prompts. [VERIFIED: .planning/phases/01-story-contract-and-tests/01-CONTEXT.md] |
| TEST-02 | Tests use LiveKit Agents text-session evaluation for core agent behavior. | LiveKit docs support pytest text-only behavioral testing with `AgentSession.run` and LLM judges. [CITED: docs.livekit.io/agents/start/testing.md] |
</phase_requirements>

## Project Constraints (from AGENTS.md)

- Use `uv` for dependency installation, running the agent, and running tests. [VERIFIED: AGENTS.md]
- Keep all app-level code in `src/` and retain `src/agent.py` as the deployed LiveKit entrypoint. [VERIFIED: AGENTS.md]
- Use `uv run ruff format` and `uv run ruff check` for formatting and linting as needed. [VERIFIED: AGENTS.md]
- Always refer to current LiveKit documentation when working with LiveKit Agents because the SDK changes quickly. [VERIFIED: AGENTS.md]
- Prefer LiveKit Docs MCP or `lk docs` for documentation access; CLI version must be at least `2.15.0` for `lk docs`. [VERIFIED: AGENTS.md]
- When modifying core agent behavior, use TDD and begin by writing tests for the desired behavior. [VERIFIED: AGENTS.md]
- For complex agents, prefer LiveKit handoffs and tasks over long monolithic prompts, but Phase 1 should only define contracts and tests. [VERIFIED: AGENTS.md]

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `livekit-agents` | Installed/current: `1.6.4`; PyPI upload `2026-06-24`. [VERIFIED: PyPI JSON + local importlib.metadata] | Agent runtime and test harness. | Official LiveKit testing docs use `AgentSession`, `inference.LLM`, `RunResult.expect`, and judge assertions. [CITED: docs.livekit.io/agents/start/testing.md] |
| `pytest` | Installed/current: `9.1.1`; PyPI upload `2026-06-19`. [VERIFIED: PyPI JSON + local importlib.metadata] | Test runner. | LiveKit Python testing docs show pytest as the standard example framework. [CITED: docs.livekit.io/agents/start/testing/test-framework.md] |
| `pytest-asyncio` | Installed/current: `1.4.0`; PyPI upload `2026-05-26`. [VERIFIED: PyPI JSON + local importlib.metadata] | Async test support. | LiveKit docs state pytest and pytest-asyncio are required for Python agent tests. [CITED: docs.livekit.io/agents/start/testing/test-framework.md] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `ruff` | Installed/current: `0.15.20`; PyPI upload `2026-06-25`. [VERIFIED: PyPI JSON + local importlib.metadata] | Formatting and linting. | Use before committing Python changes. [VERIFIED: AGENTS.md] |
| `livekit-plugins-ai-coustics` | Existing dependency `~=0.2`. [VERIFIED: pyproject.toml] | Audio enhancement in the deployed RTC session. | Do not modify in Phase 1 because tests are text-only and do not exercise the room audio pipeline. [CITED: docs.livekit.io/agents/start/testing.md] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| LiveKit text-session evals | Exact string snapshots | Snapshots are brittle for LLM voice output; intent judges match the existing project pattern. [VERIFIED: .planning/codebase/TESTING.md] |
| One large `src/agent.py` edit | Small `src/story_contract.py` plus later agent wiring | A contract module keeps Phase 1 scoped and preserves `src/agent.py` as the deployment entrypoint. [VERIFIED: .planning/codebase/STRUCTURE.md] |
| Audio end-to-end tests | Text-only tests | LiveKit docs position text-only tests as the built-in, cost-effective way to test behavior; audio pipeline tests are separate third-party or later-phase work. [CITED: docs.livekit.io/agents/start/testing.md] |

**Installation:**
```bash
# No new package install is recommended for Phase 1.
```

**Version verification:** Current installed versions were verified with `UV_CACHE_DIR=.uv-cache uv run python -c 'import importlib.metadata ...'`, and registry versions/upload dates were checked against PyPI JSON endpoints on 2026-06-27. [VERIFIED: local command + PyPI JSON]

## Package Legitimacy Audit

Phase 1 does not need to install new external packages. [VERIFIED: pyproject.toml] The GSD package-legitimacy seam returned `SUS` for existing packages because registry age/download/source signals were unavailable in that seam, not because a specific malicious signal was found. [VERIFIED: package-legitimacy command output]

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| `livekit-agents` | PyPI | Latest upload `2026-06-24`. [VERIFIED: PyPI JSON] | Unknown from PyPI JSON. [VERIFIED: PyPI JSON] | `github.com/livekit/agents`. [VERIFIED: PyPI JSON] | Existing dependency; seam `SUS` due missing signals. [VERIFIED: package-legitimacy command output] | Approved as already-present project dependency; do not add a new install task. |
| `pytest` | PyPI | Latest upload `2026-06-19`. [VERIFIED: PyPI JSON] | Unknown from PyPI JSON. [VERIFIED: PyPI JSON] | `github.com/pytest-dev/pytest`. [VERIFIED: PyPI JSON] | Existing dev dependency; seam `SUS` due missing signals. [VERIFIED: package-legitimacy command output] | Approved as already-present project dependency; do not add a new install task. |
| `pytest-asyncio` | PyPI | Latest upload `2026-05-26`. [VERIFIED: PyPI JSON] | Unknown from PyPI JSON. [VERIFIED: PyPI JSON] | `github.com/pytest-dev/pytest-asyncio`. [VERIFIED: PyPI JSON] | Existing dev dependency; seam `SUS` due missing signals. [VERIFIED: package-legitimacy command output] | Approved as already-present project dependency; do not add a new install task. |
| `ruff` | PyPI | Latest upload `2026-06-25`. [VERIFIED: PyPI JSON] | Unknown from PyPI JSON. [VERIFIED: PyPI JSON] | `docs.astral.sh/ruff`. [VERIFIED: PyPI JSON] | Existing dev dependency; seam `SUS` due missing signals. [VERIFIED: package-legitimacy command output] | Approved as already-present project dependency; do not add a new install task. |

**Packages removed due to [SLOP] verdict:** none. [VERIFIED: package-legitimacy command output]  
**Packages flagged as suspicious [SUS]:** existing dependencies only; planner should add a human checkpoint only if it introduces a new install or changes dependency constraints. [VERIFIED: package-legitimacy command output]

## Architecture Patterns

### System Architecture Diagram

```text
Phase 1 planner input
  -> canonical story draft (.planning/basic_story.md)
  -> story contract module under src/
      -> title, setting, sidekick, objective, accepted answer meanings
      -> hint escalation and safety boundary text
  -> LiveKit text-session behavioral tests
      -> AgentSession.start(Assistant())
      -> session.run(user_input="spoken-style prompt")
      -> RunResult.expect + LLM judge assertions
  -> expected failing tests for Phase 2 implementation
```

### Recommended Project Structure

```text
src/
├── agent.py              # Keep as deployed LiveKit entrypoint
├── story_contract.py     # Add v1 story contract and constants
└── __init__.py
tests/
├── test_agent.py         # Existing evals; may keep generic starter tests
└── test_magictales.py    # Preferred new Phase 1 behavioral contract tests
```

### Pattern 1: Typed Story Contract

**What:** Store the canonical story title, setting, sidekick, objective, success condition, hint ladder, and kid-safety boundary in a small typed Python module. [VERIFIED: .planning/phases/01-story-contract-and-tests/01-CONTEXT.md]  
**When to use:** Use when tests and future agent instructions need one importable source of truth. [VERIFIED: .planning/codebase/STRUCTURE.md]  
**Example:**

```python
# Source: project pattern recommendation from .planning/codebase/STRUCTURE.md
from dataclasses import dataclass


@dataclass(frozen=True)
class StoryObjective:
    text: str
    accepted_meanings: tuple[str, ...]


@dataclass(frozen=True)
class StoryContract:
    title: str
    sidekick: str
    objective: StoryObjective
    voice_rules: tuple[str, ...]
```

### Pattern 2: LiveKit Text-Session Behavior Test

**What:** Exercise `Assistant` through `AgentSession` and evaluate spoken-style behavior with `judge(...)`. [CITED: docs.livekit.io/agents/start/testing.md]  
**When to use:** Use for story opening, objective response, sidekick hint, retry behavior, and safety redirect tests. [VERIFIED: .planning/phases/01-story-contract-and-tests/01-CONTEXT.md]  
**Example:**

```python
# Source: https://docs.livekit.io/agents/start/testing/test-framework.md
@pytest.mark.asyncio
async def test_magictales_opening_contract() -> None:
    async with (
        _judge_llm() as judge_llm,
        AgentSession() as session,
    ):
        await session.start(Assistant())
        result = await session.run(user_input="Let's play MagicTales.")

        await (
            result.expect.next_event()
            .is_message(role="assistant")
            .judge(
                judge_llm,
                intent=(
                    "Starts the village roller-cart story with Milo, mentions "
                    "the silver whistle or grandmother's village, and asks one "
                    "spoken action question."
                ),
            )
        )
        result.expect.no_more_events()
```

### Anti-Patterns to Avoid

- **Implementing Phase 2 behavior early:** Phase 1 should define contract artifacts and failing tests, not replace the assistant with the full game master. [VERIFIED: .planning/ROADMAP.md]
- **Testing exact LLM wording:** Voice-agent output can vary; use intent judges for behavior and deterministic assertions for imported contract constants. [VERIFIED: .planning/codebase/TESTING.md]
- **Putting story data only in prompt text:** Tests and later implementation need importable constants to prevent story drift. [VERIFIED: .planning/phases/01-story-contract-and-tests/01-CONTEXT.md]
- **Auto-advancing after the final helper answer:** The locked decision requires the player to restate or provide the correct answer before the gate opens. [VERIFIED: .planning/phases/01-story-contract-and-tests/01-CONTEXT.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Agent behavioral test harness | Custom transcript runner | LiveKit `AgentSession.run` and `RunResult.expect` | Official helpers already model text-only turns, event assertions, judges, and multi-turn history. [CITED: docs.livekit.io/agents/start/testing/test-framework.md] |
| Semantic response evaluation | Regex-only freeform answer grader in Phase 1 | LLM judge intent tests plus explicit contract meanings | Phase 1 locks behavior before implementation; Phase 2 can decide deterministic evaluator details. [VERIFIED: .planning/ROADMAP.md] |
| Voice-output formatting rules | Ad hoc per-test wording rules | LiveKit prompting guidance: plain text, brief replies, one question at a time | These rules match TTS constraints and existing `Assistant` output rules. [CITED: docs.livekit.io/agents/start/prompting.md] |
| Audio pipeline tests | Local fake STT/TTS pipeline | Text-only evals in Phase 1 | LiveKit docs state built-in testing helpers use text input/output; audio pipeline tests are separate. [CITED: docs.livekit.io/agents/start/testing.md] |

**Key insight:** The planning risk is not algorithmic complexity; it is contract drift between the story draft, prompt behavior, and tests. [VERIFIED: .planning/phases/01-story-contract-and-tests/01-CONTEXT.md]

## Common Pitfalls

### Pitfall 1: Passing Tests by Making Phase 1 Too Large

**What goes wrong:** The planner asks implementers to make the new MagicTales tests pass immediately. [VERIFIED: .planning/ROADMAP.md]  
**Why it happens:** Phase 1 is test-contract work, but the tests describe Phase 2 behavior. [VERIFIED: .planning/ROADMAP.md]  
**How to avoid:** Mark new behavioral tests as expected failures or clearly document that they fail until Phase 2. [ASSUMED]  
**Warning signs:** Tasks mention objective state machines, full scene advancement, or runtime answer grading. [VERIFIED: .planning/ROADMAP.md]

### Pitfall 2: Losing the Freeform Answer Requirement

**What goes wrong:** Tests only check option A or the exact phrase "make a loud sound or call for help." [VERIFIED: .planning/basic_story.md]  
**Why it happens:** The draft is multiple-choice, but the locked decision requires spoken freeform input. [VERIFIED: .planning/phases/01-story-contract-and-tests/01-CONTEXT.md]  
**How to avoid:** Include a correct answer phrased differently, such as "You blow it to get someone's attention if you need help." [VERIFIED: .planning/phases/01-story-contract-and-tests/01-CONTEXT.md]  
**Warning signs:** Tests use only `"A"` or copy the draft answer verbatim. [VERIFIED: .planning/phases/01-story-contract-and-tests/01-CONTEXT.md]

### Pitfall 3: Helper Answer Opens the Gate

**What goes wrong:** The final helper explanation is treated as objective completion. [VERIFIED: .planning/phases/01-story-contract-and-tests/01-CONTEXT.md]  
**Why it happens:** The helper answer contains the correct content, so a loose evaluator might advance. [VERIFIED: .planning/phases/01-story-contract-and-tests/01-CONTEXT.md]  
**How to avoid:** Add a multi-turn test where wrong answers trigger hints, the helper gives the answer, and the gate remains closed until the player repeats the correct meaning. [VERIFIED: .planning/phases/01-story-contract-and-tests/01-CONTEXT.md]  
**Warning signs:** The test intent says "final helper answer opens the gate." [VERIFIED: .planning/phases/01-story-contract-and-tests/01-CONTEXT.md]

### Pitfall 4: Flaky Judge Criteria

**What goes wrong:** LLM judge intents are too broad or combine unrelated criteria, producing nondeterministic failures. [VERIFIED: .planning/codebase/TESTING.md]  
**Why it happens:** Behavioral tests judge generated text without surrounding conversation context. [CITED: docs.livekit.io/agents/start/testing/test-framework.md]  
**How to avoid:** Keep each test focused on one behavior and make judge intents explicit about must/include and must/not/include. [VERIFIED: tests/test_agent.py]  
**Warning signs:** A single judge checks story opening, safety, hinting, and completion in one assertion. [ASSUMED]

## Code Examples

### Multi-Turn Retry Contract

```python
# Source: https://docs.livekit.io/agents/start/testing/test-framework.md
@pytest.mark.asyncio
async def test_final_helper_requires_player_retry() -> None:
    async with (
        _judge_llm() as judge_llm,
        AgentSession() as session,
    ):
        await session.start(Assistant())

        await session.run(user_input="Let's start the story.")
        await session.run(user_input="I eat the whistle.")
        await session.run(user_input="I paint pictures with it.")
        result = await session.run(user_input="I don't know.")

        await (
            result.expect.next_event()
            .is_message(role="assistant")
            .judge(
                judge_llm,
                intent=(
                    "Explains that a whistle makes a loud sound, calls someone, "
                    "gets attention, or asks for help, but does not say the forest "
                    "gate opens yet and asks the player to try saying the answer."
                ),
            )
        )
        result.expect.no_more_events()
```

### Deterministic Contract Unit Check

```python
# Source: project convention; use pure assertions for contract constants.
from story_contract import V1_STORY


def test_story_contract_names_milo_and_objective() -> None:
    assert V1_STORY.sidekick == "Milo"
    assert "forest gate" in V1_STORY.objective.text
    assert "grandmother" in V1_STORY.objective.text
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual-only agent prompt checks | Text-only LiveKit behavioral evals with pytest and `AgentSession.run` | Current docs rendered `2026-06-27`. [CITED: docs.livekit.io/agents/start/testing.md] | Planner should create automated eval tests for Phase 1 contract behavior. |
| Single-turn-only assertions | Multiple `session.run(...)` calls on one session for multi-turn history | Current docs rendered `2026-06-27`. [CITED: docs.livekit.io/agents/start/testing/test-framework.md] | Retry and final-helper behavior should be tested as a conversation, not isolated strings. |
| Handoffs on affected LiveKit versions `1.5.14` through `1.6.3` | Upgrade to `livekit-agents` `1.6.4` if using handoffs with STT | Release `1.6.4` on `2026-06-24`. [CITED: LiveKit changelog pypi:livekit-agents] | Phase 1 does not use handoffs, but later planners should avoid older affected versions. |

**Deprecated/outdated:**
- Using the draft's A/B/C choices as the runtime contract is outdated for this project because Phase 1 decisions require free speech. [VERIFIED: .planning/phases/01-story-contract-and-tests/01-CONTEXT.md]
- Treating LiveKit tests as audio-room integration tests is outdated for this phase because current docs describe built-in helpers as text-only. [CITED: docs.livekit.io/agents/start/testing.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | New behavioral tests may be marked expected-fail to keep Phase 1 from implementing Phase 2. | Common Pitfalls | If the project policy forbids expected failures, planner should instead create tests in a contract file with an explicit failing-test acceptance note. |
| A2 | A broad LLM judge intent combining many criteria is more flaky than focused tests. | Common Pitfalls | Planner might create fewer, broader tests and make failures harder to diagnose. |

## Open Questions

1. **Should new MagicTales tests use `pytest.mark.xfail` or be committed as failing tests without an xfail marker?**
   - What we know: Phase 1 success criteria ask for behavioral tests before Phase 2 implementation. [VERIFIED: .planning/ROADMAP.md]
   - What's unclear: The project has no existing convention for intentional failing tests. [VERIFIED: .planning/codebase/TESTING.md]
   - Recommendation: Planner should choose one explicit convention and state it in the plan; `xfail(strict=True)` is usually clearer for CI-preserving contract tests. [ASSUMED]

2. **Should story contract tests live beside existing `tests/test_agent.py` or in a new file?**
   - What we know: Existing behavior tests live in `tests/test_agent.py`. [VERIFIED: tests/test_agent.py]
   - What's unclear: No project convention exists yet for multiple test modules. [VERIFIED: .planning/codebase/TESTING.md]
   - Recommendation: Use `tests/test_magictales.py` for new story behavior to avoid mixing starter-assistant tests with the new product contract. [ASSUMED]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| `uv` | Running tests and tooling | yes | `0.11.18`. [VERIFIED: local command] | — |
| Python | Project runtime | yes | `3.14.5`. [VERIFIED: local command] | Use CI's configured Python if local version differs. [VERIFIED: .planning/codebase/TESTING.md] |
| LiveKit CLI `lk` | Docs fallback and LiveKit operations | yes | `2.16.6`. [VERIFIED: local command] | LiveKit Docs MCP is available in this session. [VERIFIED: tool discovery] |
| LiveKit Docs MCP | Current docs verification | yes | Rendered docs timestamp `2026-06-27T12:20:24Z`. [CITED: docs.livekit.io/agents/start/testing.md] | `lk docs` CLI if MCP is unavailable. [VERIFIED: AGENTS.md] |
| Pytest collection | Validation architecture | yes | 3 tests collected. [VERIFIED: `UV_CACHE_DIR=.uv-cache uv run pytest --collect-only -q`] | — |
| Default uv cache under home | Local tool execution | no | Permission denied under sandbox. [VERIFIED: local command] | Use `UV_CACHE_DIR=.uv-cache`. [VERIFIED: .planning/codebase/TESTING.md] |

**Missing dependencies with no fallback:** none found for Phase 1 research/planning. [VERIFIED: local commands]  
**Missing dependencies with fallback:** default uv cache path is not writable; use `UV_CACHE_DIR=.uv-cache`. [VERIFIED: local command]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | pytest `9.1.1` + pytest-asyncio `1.4.0`. [VERIFIED: local importlib.metadata] |
| Config file | `pyproject.toml` with `asyncio_mode = "auto"` and function-scoped asyncio loop. [VERIFIED: pyproject.toml] |
| Quick run command | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py -q` after the new file exists. [ASSUMED] |
| Full suite command | `UV_CACHE_DIR=.uv-cache uv run pytest -v`. [VERIFIED: .planning/codebase/TESTING.md] |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| OBJ-01 | Story contract exposes one clear objective: open forest gate and return to grandmother's house. | unit | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py::test_story_contract_objective -q` | no; Wave 0. [VERIFIED: file scan] |
| SIDE-01 | Story contract names Milo and sidekick cue tests require playful objective-oriented help. | unit + behavior | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py::test_milo_sidekick_cue -q` | no; Wave 0. [VERIFIED: file scan] |
| AUDIO-01 | Agent response judge requires concise, plain, TTS-friendly output. | behavior | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py::test_voice_style_is_concise -q` | no; Wave 0. [VERIFIED: file scan] |
| SAFE-01 | Unsafe or out-of-adventure request redirects to kid-safe story boundary. | behavior | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py::test_kid_safe_redirect -q` | no; Wave 0. [VERIFIED: file scan] |
| TEST-01 | Tests cover completion, incomplete attempts, sidekick cues, story boundaries, and safety refusals. | meta/behavior | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py -q` | no; Wave 0. [VERIFIED: file scan] |
| TEST-02 | Core agent behavior uses LiveKit text-session evals. | behavior | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py -q` | no; Wave 0. [CITED: docs.livekit.io/agents/start/testing.md] |

### Sampling Rate

- **Per task commit:** `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py -q`. [ASSUMED]
- **Per wave merge:** `UV_CACHE_DIR=.uv-cache uv run pytest -v`. [VERIFIED: .planning/codebase/TESTING.md]
- **Phase gate:** Full suite collection should include existing tests plus new contract tests; expected failing behavior must be explicitly represented. [VERIFIED: .planning/ROADMAP.md]

### Wave 0 Gaps

- [ ] `src/story_contract.py` - exposes v1 story title, setting, sidekick, objective, accepted meanings, hints, voice rules, and safety boundary. [VERIFIED: .planning/phases/01-story-contract-and-tests/01-CONTEXT.md]
- [ ] `tests/test_magictales.py` or additions to `tests/test_agent.py` - covers Phase 1 behavioral contract. [VERIFIED: .planning/codebase/TESTING.md]
- [ ] Decide expected-failure convention for Phase 2-dependent tests. [ASSUMED]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | No auth behavior is changed in Phase 1. [VERIFIED: .planning/ROADMAP.md] |
| V3 Session Management | no | Tests are text-only and do not change session management. [CITED: docs.livekit.io/agents/start/testing.md] |
| V4 Access Control | no | No protected resources or roles are introduced in Phase 1. [VERIFIED: .planning/ROADMAP.md] |
| V5 Input Validation | yes | Treat player speech and story-draft text as untrusted input; tests should require safe redirect for unsafe/out-of-flow prompts. [VERIFIED: .codex/gsd-core/references/untrusted-input-boundary.md] |
| V6 Cryptography | no | Phase 1 does not add cryptography or secret handling. [VERIFIED: .planning/ROADMAP.md] |

### Known Threat Patterns for LiveKit Voice-Agent Story Tests

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Prompt injection through player speech | Tampering | Safety/story-boundary test requires refusal or redirect back to predefined adventure. [VERIFIED: .planning/REQUIREMENTS.md] |
| Unsafe kid-facing content | Information Disclosure / Elevation of Privilege | Agent instructions and tests must constrain content to ages 10-14 and decline harmful requests. [VERIFIED: .planning/REQUIREMENTS.md] |
| Story drift from canonical draft | Tampering | Importable story contract plus deterministic tests for title, sidekick, objective, and accepted answer meanings. [VERIFIED: .planning/basic_story.md] |
| Over-disclosure of internal instructions | Information Disclosure | Preserve existing voice output rule against revealing system instructions, tools, parameters, or raw outputs. [VERIFIED: src/agent.py] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/01-story-contract-and-tests/01-CONTEXT.md` - locked Phase 1 decisions and scope. [VERIFIED: codebase grep]
- `.planning/basic_story.md` - canonical v1 story draft. [VERIFIED: codebase grep]
- `.planning/REQUIREMENTS.md` and `.planning/ROADMAP.md` - requirement mapping, phase goal, and success criteria. [VERIFIED: codebase grep]
- `AGENTS.md` - project constraints for uv, entrypoint, LiveKit docs, and TDD. [VERIFIED: codebase grep]
- `src/agent.py`, `tests/test_agent.py`, and `pyproject.toml` - current agent, test, and tooling patterns. [VERIFIED: codebase grep]

### Secondary (MEDIUM confidence)

- LiveKit Docs MCP `/agents/start/testing.md` - testing and evaluation overview. [CITED: docs.livekit.io/agents/start/testing.md]
- LiveKit Docs MCP `/agents/start/testing/test-framework.md` - test framework, assertions, multi-turn tests, JudgeGroup, and caveats. [CITED: docs.livekit.io/agents/start/testing/test-framework.md]
- LiveKit Docs MCP `/agents/start/prompting.md` - voice prompt structure and output rules. [CITED: docs.livekit.io/agents/start/prompting.md]
- LiveKit changelog for `pypi:livekit-agents` - current release and handoff warning. [CITED: LiveKit changelog pypi:livekit-agents]
- PyPI JSON endpoints for `livekit-agents`, `pytest`, `pytest-asyncio`, and `ruff` - package current versions and upload timestamps. [VERIFIED: PyPI JSON]

### Tertiary (LOW confidence)

- GSD classify-confidence returned MEDIUM for `context7 --verified` and LOW for local codebase provider names in this runtime. [VERIFIED: gsd-tools classify-confidence]
- Recommendations marked `[ASSUMED]` are local planning judgment, not external facts. [ASSUMED]

## Metadata

**Confidence breakdown:**
- Standard stack: MEDIUM - current versions were verified locally and via PyPI JSON, but the GSD package-legitimacy seam lacked registry signals. [VERIFIED: local command + PyPI JSON + package-legitimacy command output]
- Architecture: HIGH - phase scope and project structure are directly constrained by local planning/codebase artifacts. [VERIFIED: .planning/codebase/STRUCTURE.md]
- Pitfalls: MEDIUM - most pitfalls come from locked decisions and LiveKit docs; expected-fail convention remains an assumption. [VERIFIED: .planning/phases/01-story-contract-and-tests/01-CONTEXT.md]

**Research date:** 2026-06-27  
**Valid until:** 2026-07-04 for LiveKit API/testing specifics because LiveKit Agents is fast-moving; 2026-07-27 for project-local story decisions unless CONTEXT.md changes. [VERIFIED: AGENTS.md]
