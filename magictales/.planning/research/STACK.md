# Project Research: Stack

## Question

What stack should MagicTales use for a voice-first interactive story game built from the current LiveKit Agents Python starter?

## Findings

### Keep the Existing Voice Agent Foundation

- Use LiveKit Agents for Python as the core runtime.
- Keep `src/agent.py` as the deployment entrypoint because the Dockerfile and LiveKit Cloud agent config already depend on it.
- Continue using LiveKit Inference for the current STT, LLM, TTS, and turn detector pipeline.
- Keep `uv`, `pytest`, `pytest-asyncio`, and `ruff` as the development toolchain.

### Use a Single Agent First

LiveKit workflow guidance recommends starting with a single agent and adding tools, tasks, or handoffs only when there is a concrete limitation such as instruction bloat, conflicting tool access, or a distinct conversation phase. MagicTales v1 can start with one game-master agent because the scope is one story, one objective, and one turn loop.

### Introduce Small Game Modules

The current `src/agent.py` can become hard to maintain if the whole story prompt, objective rules, and sound behavior live in one class. Add small app-level modules under `src/` as needed:

- `story.py` for the hardcoded v1 story, level objective, sidekick framing, and safe content boundaries.
- `game_state.py` for session state such as current beat, objective status, and game-ended flag if prompt-only state proves unreliable.
- `sound.py` for sound cue names and event mapping if frontend or room data events need structured sound triggers.

### Frontend Stack

For v1, use a minimal web frontend that connects to LiveKit and exposes microphone/session controls. React/Next.js with LiveKit components is the documented fast path, but the exact frontend scaffold can be chosen during its phase.

## Recommendation

Build v1 as a Python LiveKit agent with one focused game-master agent, behavioral tests first, a small story/game module split, and a minimal LiveKit web frontend. Defer multi-agent workflows, story catalogs, persistent accounts, and complex frontend visuals.

## Confidence

High. This matches the existing codebase and current LiveKit guidance for keeping voice workflows simple until complexity justifies tasks or handoffs.
