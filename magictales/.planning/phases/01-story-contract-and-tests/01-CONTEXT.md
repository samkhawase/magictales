# Phase 1: Story Contract and Tests - Context

**Gathered:** 2026-06-27
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase defines the hardcoded v1 story contract, objective completion rules, sidekick behavior, voice style, safety boundaries, and failing behavioral tests before changing the runtime agent behavior.

It does not implement the full game loop, frontend, or sound system. Those are later phases.

</domain>

<decisions>
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

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Story Contract
- `.planning/basic_story.md` — Canonical v1 hardcoded story draft, including scenes, Milo, whistle objective, helper hints, and ending.
- `.planning/PROJECT.md` — Product context, core value, scope boundaries, and key decisions.
- `.planning/REQUIREMENTS.md` — Phase 1 requirement IDs and v1/v2 scope.
- `.planning/ROADMAP.md` — Phase 1 goal, success criteria, and plan split.

### Codebase Patterns
- `.planning/codebase/TESTING.md` — Existing LiveKit Agents pytest/eval patterns for text-session behavioral tests.
- `.planning/codebase/CONVENTIONS.md` — Python, test, and voice-agent conventions.
- `.planning/codebase/STRUCTURE.md` — Where new story/test code should live.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/agent.py`: Existing `Assistant` class and LiveKit `AgentServer` entrypoint. Keep importability and deployment shape intact.
- `tests/test_agent.py`: Existing behavioral eval pattern using `AgentSession`, `_judge_llm()`, `session.run(user_input=...)`, and LLM judge intents.

### Established Patterns
- Tests are async pytest functions with fresh `AgentSession()` and `Assistant()` per test.
- Voice-agent responses should be concise, plain text, and TTS-friendly.
- Use `uv run pytest`, `uv run ruff check`, and `uv run ruff format` for verification.

### Integration Points
- Story contract can be introduced under `src/` while preserving `src/agent.py` as the app entrypoint.
- Phase 1 should create failing tests first, then Phase 2 can implement the MagicTales game master behavior.

</code_context>

<specifics>
## Specific Ideas

The first playable story is a village roller-cart adventure during summer vacation. The player is visiting grandmother's village, finds a silver whistle, reaches a forest gate, meets a fox, learns what a whistle is used for, opens the gate, rides through the forest, and returns to grandmother's house.

The correct freeform answer can be any semantically equivalent statement that a whistle makes a loud sound, calls someone, gets attention, signals danger, or asks for help.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within Phase 1 scope.

</deferred>

---

*Phase: 1-Story Contract and Tests*
*Context gathered: 2026-06-27*
