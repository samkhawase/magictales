# Phase 2: Voice Game Loop - Context

**Gathered:** 2026-06-27
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase turns the current generic LiveKit assistant into a MagicTales game master that runs one playable voice story level from the Phase 1 story contract.

It implements turn-by-turn spoken gameplay, objective judging, Milo hint behavior, explicit completion, and simple restart behavior for the hardcoded v1 story. It does not add the sound cue layer, frontend, multiple stories, persistence, or rich visual gameplay.

</domain>

<decisions>
## Implementation Decisions

### Turn Flow Control
- **D-01:** The game master should accept compressed player progress when intent is clear. If the player says a combined action such as picking up the whistle, reaching the gate, blowing the whistle, and giving a correct objective answer, the agent may advance through the implied beats and complete the level.
- **D-02:** If the player jumps ahead safely before an object or character has been introduced, the agent should fast-forward through obvious missing setup rather than blocking the player.
- **D-03:** Repeated harmless unrelated input should get one redirect, then the agent should offer story-specific spoken choices while keeping the player inside the current scene.
- **D-04:** Phase 2 should use small explicit game state rather than relying only on prompt/history. Track at least current beat, hint level, whether Milo's final helper answer has been given, and whether the level is complete.

### Objective Judging
- **D-05:** Any clear semantic match to one accepted whistle use should count as a successful objective answer. Exact wording and option letters are not required.
- **D-06:** For the v1 age range, a reasonable whistle-related answer such as "it makes noise" or "you blow it" may count as success, even if it does not mention multiple accepted meanings.
- **D-07:** Unsafe or clearly out-of-adventure input should trigger a brief safety redirect with no state progress and no hint-level progress.
- **D-08:** If the player gives the correct objective answer before the fox explicitly asks the question, and the story path is clear, the agent may fast-forward through the fox question and complete because the player explicitly answered the objective.

### Milo Hint Style
- **D-09:** Milo should sound like an excited adventure buddy: energetic, dramatic, and reactive to the cart, whistle, fox, and forest gate.
- **D-10:** Milo's first wrong-answer hint should be a clear concept cue that points toward sound and hearing without giving the full final answer.
- **D-11:** Repeated wrong answers should escalate steadily: playful clue, clearer explanation, then final helper answer after the player is stuck.
- **D-12:** Milo may give the final helper answer directly. Even then, the player must still try again in their own words before the level can complete.

### Completion and Replay
- **D-13:** Successful completion should be explicit: narrate the forest gate opening, the forest ride, the return to grandmother's house, and say that the level is complete.
- **D-14:** After completion, the adventure is ended. Further story actions should not continue the epilogue; the agent should briefly say the adventure is complete and can offer replay.
- **D-15:** Phase 2 should support a simple restart phrase. If the player says "play again" or a close equivalent after completion, reset explicit game state and restart the hardcoded story.
- **D-16:** If a player gives a correct answer and unsafe content in the same turn, safety wins. Redirect the unsafe part and do not complete the level on that turn.

### the agent's Discretion
The planner may choose the exact Python module boundaries and helper function names for game state, objective evaluation, and restart handling, as long as `src/agent.py` remains the deployed entrypoint, `V1_STORY` remains the source of story truth, and the Phase 1 strict expected-failure behavior tests are converted to passing Phase 2 runtime coverage.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product Scope
- `.planning/PROJECT.md` — MagicTales v1 product definition, core value, scope constraints, and key decisions.
- `.planning/REQUIREMENTS.md` — Phase 2 requirement IDs: LOOP-01, LOOP-02, LOOP-03, LOOP-04, OBJ-02, OBJ-03, SIDE-02.
- `.planning/ROADMAP.md` — Phase 2 goal, success criteria, dependencies, and planned split.

### Story and Prior Phase Contract
- `.planning/basic_story.md` — Original hardcoded story draft with the village roller-cart adventure, whistle, Milo, fox, helper flow, and ending.
- `.planning/phases/01-story-contract-and-tests/01-CONTEXT.md` — Locked Phase 1 decisions for story source, objective, freeform input, hint/retry flow, sidekick, voice style, safety, and tests.
- `.planning/phases/01-story-contract-and-tests/01-01-SUMMARY.md` — Story contract implementation summary and files created.
- `.planning/phases/01-story-contract-and-tests/01-02-SUMMARY.md` — LiveKit behavior test summary, strict xfail contract, and `MAGICTALES_RUNTIME_ENABLED` handoff.

### Existing Code and Tests
- `src/agent.py` — Current LiveKit entrypoint, `Assistant`, `MAGICTALES_RUNTIME_ENABLED`, session pipeline, and deployment shape.
- `src/story_contract.py` — `V1_STORY`, `StoryContract`, and `StoryObjective` source of truth for Phase 2 runtime behavior.
- `tests/test_magictales.py` — Deterministic story contract tests and strict expected-failure LiveKit behavior tests that Phase 2 should make pass.
- `tests/test_agent.py` — Existing generic LiveKit text-session evaluation pattern.

### Codebase Maps
- `.planning/codebase/STACK.md` — LiveKit Agents Python, LiveKit Inference, uv, pytest, ruff, Docker, and deployment stack.
- `.planning/codebase/ARCHITECTURE.md` — Current single-agent architecture, session orchestration, test evaluation flow, and latency guidance.
- `.planning/codebase/TESTING.md` — Existing pytest and LiveKit behavioral eval conventions.

### LiveKit Documentation Consulted
- `/agents/logic/workflows/` — Current LiveKit guidance on agents, tools, tasks, task groups, handoffs, and choosing the simplest workflow pattern.
- `/agents/logic/tasks/` — Current LiveKit task and task group concepts relevant if Phase 2 chooses scoped subflows later.
- `/agents/logic/supervisor-pattern/` — Current LiveKit guidance on keeping one supervisor in control while delegating focused tasks.
- `/agents/start/testing/?agents-sdk=python` — Current LiveKit Python testing guidance for text-session behavioral tests.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/story_contract.py`: use `V1_STORY` for title, setting, opening beat, sidekick cues, helper hints, accepted meanings, voice rules, and safety boundaries.
- `tests/test_magictales.py`: contains the Phase 2 behavior contract. The strict xfail tests should become real passing tests only when the runtime path is implemented.
- `src/agent.py`: keep `Assistant`, `server`, `@server.rtc_session(agent_name="magictales")`, and `cli.run_app(server)` importable/deployable.

### Established Patterns
- Use `uv` for tests, linting, formatting, and runtime commands.
- Use LiveKit Agents text-session evaluations with `AgentSession`, `session.start(Assistant())`, `session.run(user_input=...)`, and `RunResult.expect`.
- Keep voice output plain text, concise, kid-safe, and suitable for text to speech.
- Keep the voice agent prompt and tool/context surface small because latency matters.

### Integration Points
- `Assistant` is the runtime behavior point that currently still uses generic assistant instructions.
- `MAGICTALES_RUNTIME_ENABLED` is currently false and acts as a deliberate sentinel for Phase 2 behavior tests.
- Any explicit state should be integrated without changing the deployed entrypoint shape in `src/agent.py`.

</code_context>

<specifics>
## Specific Ideas

The runtime should feel flexible rather than rigidly turn-locked. Clear combined actions may advance through multiple story beats, but unsafe content always blocks completion. Repeated harmless off-track input should still preserve the voice-first freeform feel, while offering one or two spoken story-specific choices after the first redirect.

Milo should be more energetic than a calm tutor. He can deliver the final helper answer in-world, but completion still depends on the player repeating a safe correct idea in their own words unless the player already gave a correct answer directly.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within Phase 2 scope.

</deferred>

---

*Phase: 2-Voice Game Loop*
*Context gathered: 2026-06-27*
