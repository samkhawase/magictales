---
phase: 01
slug: story-contract-and-tests
status: verified
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-27
updated: 2026-06-27
---

# Phase 01 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | pytest 9.1.1 + pytest-asyncio 1.4.0 |
| **Config file** | `pyproject.toml` |
| **Quick run command** | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py -q` |
| **Full suite command** | `UV_CACHE_DIR=.uv-cache uv run pytest -v` |
| **Estimated runtime** | ~50 seconds with networked LiveKit evals |

---

## Sampling Rate

- **After every task commit:** Run `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py -q`
- **After every plan wave:** Run `UV_CACHE_DIR=.uv-cache uv run pytest -v`
- **Before `$gsd-verify-work`:** Full suite must be green with expected-failure contract tests explicitly marked.
- **Max feedback latency:** 60 seconds with network access for LiveKit evals

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01-01 | 1 | OBJ-01 | T-01-03 | Story cannot drift from canonical level objective. | unit | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py::test_story_contract_objective -q` | ✅ | ✅ green |
| 01-01-02 | 01-01 | 1 | SIDE-01 | T-01-03 | Milo cues remain goal-oriented and do not solve silently. | unit | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py::test_milo_sidekick_cue -q` | ✅ | ✅ green |
| 01-01-03 | 01-01 | 1 | AUDIO-01 | — | Voice rules require concise, plain, TTS-friendly output. | unit | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py::test_voice_style_is_concise -q` | ✅ | ✅ green |
| 01-02-01 | 01-02 | 2 | SAFE-01 | T-01-01 / T-01-02 / T-01-04 | Unsafe or out-of-adventure speech redirects to age-appropriate story flow. | behavior | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py::test_kid_safe_redirect -q` | ✅ | ✅ xfail contract |
| 01-02-02 | 01-02 | 2 | TEST-01 | T-01-03 | Tests cover completion, incomplete attempts, sidekick cues, boundaries, and safety refusals. | meta/behavior | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py -q` | ✅ | ✅ green/xfail |
| 01-02-03 | 01-02 | 2 | TEST-02 | T-01-01 | Core behavior tests use LiveKit text-session eval patterns. | behavior | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py -q` | ✅ | ✅ green/xfail |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `src/story_contract.py` — exposes v1 story title, setting, sidekick, objective, accepted meanings, hints, voice rules, and safety boundaries.
- [x] `tests/test_magictales.py` — encodes Phase 1 behavioral contract for completion, retry, sidekick cue, voice style, and safety redirect behavior.
- [x] Expected-failure convention — Phase 2-dependent LiveKit behavior tests are marked `pytest.mark.xfail(strict=True, raises=AssertionError)` until the game loop is implemented.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
All Phase 1 behaviors have automated verification. Ambient/event/background sound playback is intentionally deferred to Phase 3 and is not a Phase 1 manual gate.

---

## Validation Audit 2026-06-27

| Metric | Count |
|--------|-------|
| Requirements checked | 6 |
| Automated coverage | 6 |
| Gaps found | 0 |
| Escalated manual-only | 0 |

Verification commands run:

```bash
UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py -q
UV_CACHE_DIR=.uv-cache uv run pytest -q
UV_CACHE_DIR=.uv-cache uv run ruff check src/agent.py src/story_contract.py tests/test_magictales.py
```

Results:

```text
tests/test_magictales.py: 5 passed, 8 xfailed
full suite: 8 passed, 8 xfailed
ruff: All checks passed
```

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 60s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** verified 2026-06-27
