---
phase: 01-story-contract-and-tests
reviewed: 2026-06-27T13:04:47Z
depth: standard
files_reviewed: 2
files_reviewed_list:
  - src/story_contract.py
  - tests/test_magictales.py
findings:
  critical: 0
  warning: 0
  info: 0
  total: 0
status: clean
---

# Phase 01: Code Review Report

**Reviewed:** 2026-06-27T13:04:47Z
**Depth:** standard
**Files Reviewed:** 2
**Status:** clean after follow-up fixes

## Summary

Reviewed the importable story contract and MagicTales behavior tests for Phase 01. `src/story_contract.py` preserves the locked objective, story beats, frozen dataclass contract, and importable `V1_STORY` constant. `src/agent.py` has no diff in the current worktree and its deployment entrypoint remains intact. The deterministic tests are local-only, while the LiveKit behavior tests use the expected networked judge path.

The initial review found two warnings in the strict-xfail behavior contract: the xfail marker could hide broken test infrastructure, and the runtime backstop was coupled to prompt text rather than actual runtime readiness. Both were fixed in the follow-up execution pass.

## Narrative Findings (AI reviewer)

## Resolved Warnings

### WR-01: Strict xfail accepts infrastructure failures as expected behavior failures

**File:** `tests/test_magictales.py:9`

**Issue:** The shared `PHASE_2_XFAIL` marker uses `pytest.mark.xfail(strict=True)` without narrowing the expected failure type. Pytest treats any exception raised inside these tests as an expected xfail, not just a failed behavior assertion. That means LiveKit judge network failures, missing credentials, API/model errors, helper bugs, or unexpected `AgentSession` failures can all appear as acceptable Phase 2 RED tests. This weakens the behavioral-test contract because CI cannot distinguish "current generic assistant did not meet MagicTales behavior" from "the LiveKit eval harness did not run correctly."

**Fix applied:** Restricted expected failures to assertion failures from the behavior expectations:

```python
PHASE_2_XFAIL = pytest.mark.xfail(
    strict=True,
    raises=AssertionError,
    reason="Phase 2 implements MagicTales runtime behavior",
)
```

LiveKit network/setup errors now fail visibly instead of being swallowed as expected xfails.

### WR-02: Runtime-enabled backstop is prompt-text based and can mask Phase 2 readiness

**File:** `tests/test_magictales.py:23`

**Issue:** `_assert_magictales_runtime_enabled()` decides whether the behavior tests may XPASS by checking that `Assistant().instructions` contains `"MagicTales"`, `V1_STORY.sidekick`, and `"forest gate"`. This is not a runtime behavior check. A later implementation could correctly drive MagicTales from `V1_STORY`, tools, state, or tasks without embedding those exact strings in `Assistant.instructions`; the tests would remain xfailed and hide that the behavior contract is now satisfied. Conversely, simply adding those keywords to a generic prompt could remove the backstop before a real game-loop implementation exists, leaving the broad LLM judges as the only guard against premature XPASS.

**Fix applied:** Replaced the prompt-keyword gate with an explicit implementation sentinel that Phase 2 must deliberately change:

```python
from agent import Assistant, MAGICTALES_RUNTIME_ENABLED


def _assert_magictales_runtime_enabled() -> None:
    assert MAGICTALES_RUNTIME_ENABLED is True
```

`MAGICTALES_RUNTIME_ENABLED` is currently `False` in `src/agent.py`. Phase 2 should set it to `True` only when the MagicTales runtime path is actually wired, while the behavior tests continue verifying the user-visible contract through `AgentSession`.

## Verification After Fixes

Passed:

```bash
UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py -q
```

Result:

```text
5 passed, 8 xfailed, 32 warnings
```

Passed:

```bash
UV_CACHE_DIR=.uv-cache uv run pytest -q
```

Result:

```text
8 passed, 8 xfailed, 44 warnings
```

Passed:

```bash
UV_CACHE_DIR=.uv-cache uv run ruff check src/agent.py src/story_contract.py tests/test_magictales.py
```

Result:

```text
All checks passed!
```

---

_Reviewed: 2026-06-27T13:04:47Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_
