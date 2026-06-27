---
phase: 01-story-contract-and-tests
plan: 01
status: complete
subsystem: story-contract
tags:
  - tdd
  - story-contract
  - pytest
dependency_graph:
  requires:
    - .planning/basic_story.md
    - .planning/phases/01-story-contract-and-tests/01-CONTEXT.md
    - AGENTS.md
  provides:
    - src/story_contract.py
    - tests/test_magictales.py
  affects:
    - Phase 02 game-loop instructions
tech_stack:
  added:
    - Python dataclasses
  patterns:
    - frozen dataclass contract
    - synchronous deterministic pytest assertions
key_files:
  created:
    - src/story_contract.py
    - tests/test_magictales.py
  modified: []
decisions:
  - Created a typed importable story contract instead of embedding story data in src/agent.py.
  - Preserved the whistle question as a success condition rather than the top-level objective.
metrics:
  duration: "not measured"
  completed: 2026-06-27T12:42:03Z
---

# Phase 01 Plan 01: Story Contract Summary

Defined the first MagicTales story as an importable frozen dataclass contract with deterministic tests for objective, accepted whistle meanings, Milo cues, voice style, and safety boundaries.

## What Changed

- Added `tests/test_magictales.py` with five deterministic unit tests:
  - `test_story_contract_objective`
  - `test_story_contract_accepted_freeform_meanings`
  - `test_milo_sidekick_cue`
  - `test_voice_style_is_concise`
  - `test_story_contract_safety_boundary`
- Added `src/story_contract.py` exporting `StoryObjective`, `StoryContract`, and `V1_STORY`.
- Kept `src/agent.py` unchanged.

## Task Commits

| Task | Commit | Result |
|------|--------|--------|
| Task 1: Add deterministic story contract tests | `fe0816b` | RED tests committed after failing with `ModuleNotFoundError: No module named 'story_contract'`. |
| Task 2: Implement the importable story contract | `7d4c2b6` | GREEN implementation committed after tests and ruff passed. |

## Verification

Passed:

```bash
UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py -q
```

Result:

```text
5 passed in 0.00s
```

Passed:

```bash
UV_CACHE_DIR=.uv-cache uv run ruff check src/story_contract.py tests/test_magictales.py
```

Result:

```text
All checks passed!
```

Confirmed `src/agent.py` remains unchanged:

```bash
git diff -- src/agent.py
```

Result: no diff.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed ruff `__all__` ordering**
- **Found during:** Task 2 verification
- **Issue:** Ruff reported `RUF022` because `__all__` was not in isort-style order.
- **Fix:** Ran scoped ruff fix for `src/story_contract.py`.
- **Files modified:** `src/story_contract.py`
- **Commit:** `7d4c2b6`

## Known Stubs

None. A stub-pattern scan over `src/story_contract.py` and `tests/test_magictales.py` found no TODO, FIXME, placeholder, coming-soon, not-available, empty-list, empty-dict, empty-string, or null placeholder values.

## Threat Flags

None. This plan added no network endpoints, auth paths, file access patterns, schema changes, or new trust-boundary code beyond the planned story contract constants and deterministic tests.

## Auth Gates

None.

## Self-Check: PASSED

- Found `src/story_contract.py`.
- Found `tests/test_magictales.py`.
- Found commit `fe0816b`.
- Found commit `7d4c2b6`.
- Confirmed `src/agent.py` has no diff.
