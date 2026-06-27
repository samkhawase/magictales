---
phase: 02
slug: voice-game-loop
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-27
---

# Phase 02 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | pytest 9.1.1 + pytest-asyncio 1.4.0 |
| **Config file** | `pyproject.toml` |
| **Quick run command** | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py -q` |
| **Full suite command** | `UV_CACHE_DIR=.uv-cache uv run pytest -v` |
| **Estimated runtime** | ~30-120 seconds, depending on LiveKit eval credentials and network latency |

---

## Sampling Rate

- **After every task commit:** Run `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py -q`
- **After every plan wave:** Run `UV_CACHE_DIR=.uv-cache uv run pytest -v`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 120 seconds for local deterministic checks; LiveKit eval tests may exceed this when using remote inference

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | LOOP-01 | T-02-01 | MagicTales runtime starts without exposing internals | LiveKit behavior | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py::test_story_opening_starts_roller_cart_adventure -q` | yes | pending |
| 02-01-02 | 01 | 1 | LOOP-02 | T-02-02 | Spoken output remains concise and one-action focused | LiveKit behavior | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py::test_voice_style_is_concise_in_behavior -q` | yes | pending |
| 02-02-01 | 02 | 1 | LOOP-03 | T-02-03 | Player action advances or receives feedback without unsafe state mutation | LiveKit behavior + unit | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py::test_incomplete_attempt_gets_feedback_without_completion -q` | yes | pending |
| 02-02-02 | 02 | 1 | OBJ-02 | T-02-04 | Evaluator distinguishes success, partial, unrelated, and unsafe input before state mutation | unit + LiveKit behavior | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py -q` | partial; Wave 0 adds unit coverage | pending |
| 02-02-03 | 02 | 1 | OBJ-03 | T-02-05 | Level does not complete unless player gives a safe explicit objective answer | LiveKit behavior + unit | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py::test_final_helper_answer_requires_player_retry_before_advancement -q` | yes | pending |
| 02-03-01 | 03 | 2 | SIDE-02 | T-02-06 | Milo hint escalation preserves player agency before final helper disclosure | LiveKit behavior + unit | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py::test_milo_gives_sidekick_cue_without_solving_immediately -q` | yes | pending |
| 02-03-02 | 03 | 2 | LOOP-04 | T-02-07 | Completion narrates gate opening, forest ride, return home, and level completion only after success | LiveKit behavior + unit | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py::test_correct_freeform_whistle_answer_opens_gate_and_returns_home -q` | yes | pending |

*Status: pending · green · red · flaky*

---

## Wave 0 Requirements

- [ ] `tests/test_magictales.py` - add unit tests for explicit `GameState` initial values, success matching, wrong/partial matching, unrelated redirect escalation, restart after completion, and unsafe-plus-correct safety precedence.
- [ ] `tests/test_magictales.py` - remove or invert `PHASE_2_XFAIL` markers as each runtime behavior becomes implemented.
- [ ] `tests/test_agent.py` - reconcile generic assistant expectations with MagicTales identity, or document why the generic assistant test remains valid after Phase 2.

---

## Manual-Only Verifications

All Phase 2 behaviors have automated verification through deterministic unit tests or LiveKit text-only behavior tests. Full audio pipeline testing is deferred.

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [ ] Feedback latency < 120s for all eval-backed tests
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
