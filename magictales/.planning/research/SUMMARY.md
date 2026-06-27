# Project Research Summary

## Key Findings

**Stack:** Keep the existing LiveKit Agents Python starter, `src/agent.py` entrypoint, LiveKit Inference voice pipeline, uv, pytest, and ruff. Add small story/game/sound modules only when they make the game loop clearer.

**Table Stakes:** A reliable voice session, predefined kid-safe story, turn-by-turn spoken actions, objective evaluation, sidekick hints, level ending, sound cues, a minimal frontend, and behavioral tests.

**Watch Out For:** Prompt bloat, fuzzy objective completion, sidekick over-explaining, sound competing with speech, frontend scope expansion, and under-tested kid safety.

## Implications for Roadmap

1. Start with tests and a tight story/game contract.
2. Convert the generic assistant into a MagicTales game master.
3. Add sound cue support after the story loop is stable.
4. Add the minimal frontend after the voice loop has a reliable contract.
5. Finish with hardening, latency, safety, and an end-to-end playtest.

## Sources

- `.planning/PROJECT.md`
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/STACK.md`
- LiveKit docs: Workflows, Testing and evaluation, Test framework, Connecting to LiveKit, Starter apps
