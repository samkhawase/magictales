# MagicTales

## What This Is

MagicTales is a voice-first interactive story game for kids ages 10-14. The player moves through a predefined adventure by speaking one action or choice per turn, while the agent narrates, evaluates the action, and either advances the story or gives feedback.

The first version is a single hardcoded story and level. The main product quality comes from voice, sidekick guidance, ambient sound, event sounds, and a safe kid-appropriate story flow; the frontend is minimal but functional.

## Core Value

Kids can feel like they are inside a spoken adventure where their voice actions matter and completing the level objective naturally moves the story forward.

## Requirements

### Validated

- ✓ LiveKit Cloud voice agent entrypoint exists with `src/agent.py` as the deployed agent process — existing
- ✓ Realtime voice pipeline is wired with STT, LLM, TTS, turn detection, and audio input options — existing
- ✓ Agent behavior can be tested through LiveKit Agents text-session evaluations — existing
- ✓ Production deployment scaffolding exists through `Dockerfile`, `livekit.toml`, uv, and LiveKit Cloud configuration — existing

### Active

- [ ] Replace the generic assistant behavior with a MagicTales game master agent for kids ages 10-14.
- [ ] Implement one hardcoded story and one hardcoded level objective as the v1 vertical slice.
- [ ] Structure gameplay as turn-by-turn voice interaction: agent narrates, player speaks one action or choice, agent evaluates, then the story advances or gives feedback.
- [ ] Add a sidekick character in the story prompt that gives cues to help the player complete the level objective.
- [ ] Detect level completion from explicit player action in dialogue, not from hidden UI clicks or external game controls.
- [ ] End the game when the player completes the level objective.
- [ ] Provide ambient sounds, event sounds, and background effects that support the story experience.
- [ ] Build a minimal functional frontend for joining and playing the voice session.
- [ ] Maintain standard kid-safety safeguards and keep story flow constrained by the predefined prompt.

### Out of Scope

- Multiple stories or a story catalog — v1 proves the loop with one hardcoded story and level.
- Swappable story prompt files — useful later, but not needed for the first vertical slice.
- Rich visual gameplay frontend — the initial frontend should support the voice experience without becoming the main product surface.
- Persistent player accounts, saves, or progression — v1 focuses on a single session-level experience.
- Open-ended unrestricted chat — the agent should stay inside the safe predefined adventure flow.

## Context

The current codebase is a minimal LiveKit Agents Python project. It has a single `Assistant` class in `src/agent.py`, a single LiveKit RTC session handler registered as `magictales`, and behavioral tests in `tests/test_agent.py`.

MagicTales should stay voice-first. The agent should keep prompts, tools, and runtime context tight because latency matters in spoken interaction. Complex future behavior should use LiveKit Agents workflows, handoffs, or tasks rather than one large prompt.

The story is predefined as a prompt given to the LLM. The v1 loop is:

1. Agent narrates the current story situation.
2. Sidekick gives helpful cues toward the level objective.
3. Player speaks one action or choice.
4. Agent evaluates whether the spoken action explicitly completes the objective.
5. Agent advances the story, gives feedback, or ends the game when the objective is complete.

Sound is part of the primary experience. Ambient audio, event sounds, and background effects should reinforce location, tension, discovery, success, and feedback without overwhelming speech.

## Constraints

- **Tech stack**: Use LiveKit Agents Python and keep `src/agent.py` as the agent entrypoint — this is how the current project is structured and deployed.
- **Package manager**: Use `uv` for installs, running, formatting, and tests — project convention.
- **Initial scope**: Ship one hardcoded story and one hardcoded objective — proves the game loop before building story management.
- **Audience safety**: Keep content appropriate for kids ages 10-14 and preserve standard safeguards — the product is for minors.
- **Frontend scope**: Keep the frontend minimal and functional — voice and sound are the main focus at this stage.
- **Latency**: Keep agent instructions and tool surface concise — voice games need fast turn handling.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Start with one hardcoded story and level | Proves the complete voice gameplay loop before adding content systems | - Pending |
| Use explicit player dialogue actions to complete objectives | Keeps the experience voice-native and avoids hidden UI/game-state triggers | - Pending |
| Include a sidekick character in the story prompt | Gives players age-appropriate cues without breaking immersion | - Pending |
| Prioritize ambient and event sound over frontend richness | The project value is voice and sound; visuals are supporting infrastructure | - Pending |
| Keep the frontend minimal for v1 | Avoids expanding scope before the voice loop is validated | - Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `$gsd-transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `$gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-27 after initialization*
