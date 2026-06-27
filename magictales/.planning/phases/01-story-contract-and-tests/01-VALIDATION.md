---
phase: 01
slug: story-contract-and-tests
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-27
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
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py -q`
- **After every plan wave:** Run `UV_CACHE_DIR=.uv-cache uv run pytest -v`
- **Before `$gsd-verify-work`:** Full suite must be green or expected-failure contract tests must be explicitly marked.
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01-01 | 1 | OBJ-01 | T-01-03 | Story cannot drift from canonical level objective. | unit | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py::test_story_contract_objective -q` | ❌ W0 | ⬜ pending |
| 01-01-02 | 01-01 | 1 | SIDE-01 | T-01-03 | Milo cues remain goal-oriented and do not solve silently. | unit | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py::test_milo_sidekick_cue -q` | ❌ W0 | ⬜ pending |
| 01-01-03 | 01-01 | 1 | AUDIO-01 | — | Voice rules require concise, plain, TTS-friendly output. | unit | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py::test_voice_style_is_concise -q` | ❌ W0 | ⬜ pending |
| 01-02-01 | 01-02 | 1 | SAFE-01 | T-01-01 / T-01-02 / T-01-04 | Unsafe or out-of-adventure speech redirects to age-appropriate story flow. | behavior | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py::test_kid_safe_redirect -q` | ❌ W0 | ⬜ pending |
| 01-02-02 | 01-02 | 1 | TEST-01 | T-01-03 | Tests cover completion, incomplete attempts, sidekick cues, boundaries, and safety refusals. | meta/behavior | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py -q` | ❌ W0 | ⬜ pending |
| 01-02-03 | 01-02 | 1 | TEST-02 | T-01-01 | Core behavior tests use LiveKit text-session eval patterns. | behavior | `UV_CACHE_DIR=.uv-cache uv run pytest tests/test_magictales.py -q` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/story_contract.py` — expose v1 story title, setting, sidekick, objective, accepted meanings, hints, voice rules, and safety boundaries.
- [ ] `tests/test_magictales.py` — encode Phase 1 behavioral contract for completion, retry, sidekick cue, voice style, and safety redirect behavior.
- [ ] Expected-failure convention — Phase 2-dependent LiveKit behavior tests must be marked `pytest.mark.xfail(strict=True)` until the game loop is implemented.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Ambient/event/background sound quality | AUDIO-01 | Phase 1 only contracts sound categories; actual audio playback is planned later. | Confirm Phase 1 story contract names ambient forest/village sounds, event cues, and background effects for future implementation. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
