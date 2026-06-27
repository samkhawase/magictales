---
phase: 01
slug: story-contract-and-tests
status: verified
threats_open: 0
asvs_level: 1
created: 2026-06-27
updated: 2026-06-27
---

# Phase 01 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| Planning artifact -> story contract | `.planning/basic_story.md` and Phase 1 decisions become executable Python constants. | Story text, objective, hint ladder, safety boundary |
| Child/player speech -> future LiveKit AgentSession | Free-form user speech is simulated by text-session tests and can contain unsafe requests, unrelated actions, or prompt injection. | Untrusted player input |
| Story contract -> spoken output | `V1_STORY` voice and safety rules later shape kid-facing generated speech. | Kid-facing story instructions |
| Test harness -> CI result | Networked LiveKit judge calls determine behavioral eval outcomes. | LLM eval result and xfail/pass status |

---

## Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation | Status |
|-----------|----------|-----------|----------|-------------|------------|--------|
| T-01-01 | Tampering | future free-form player speech | high | mitigate | `V1_STORY.safety_boundary` encodes story containment and instruction non-disclosure; `test_prompt_injection_does_not_override_story_contract` and `test_kid_safe_redirect` require refusal/redirect behavior before Phase 2 runtime work can pass. | closed |
| T-01-02 | Information Disclosure | assistant response text | medium | mitigate | `test_story_contract_safety_boundary` checks internal/system/developer instruction non-disclosure; `test_prompt_injection_does_not_override_story_contract` covers runtime behavior as strict RED contract. | closed |
| T-01-03 | Tampering | story progression behavior | medium | mitigate | Deterministic tests assert canonical story beats, objective, accepted meanings, hint ladder, and retry requirement; behavior tests prevent opening the gate on incomplete attempts or helper disclosure alone. | closed |
| T-01-04 | Elevation of Privilege | kid-facing safety boundary | high | mitigate | `V1_STORY.safety_boundary` names kids ages 10-14 and predefined adventure containment; behavior tests require age-appropriate redirects for unsafe content. | closed |
| T-01-05 | Repudiation | test contract semantics | low | mitigate | Behavior test names and judge intents reference `V1_STORY`; `MAGICTALES_RUNTIME_ENABLED` plus `xfail(raises=AssertionError)` prevent infrastructure failures from being counted as expected RED behavior. | closed |
| T-01-SC | Tampering | package/dependency supply chain | high | mitigate | No package or dependency changes were made in Phase 1; commits are limited to Python source, tests, and planning artifacts. | closed |

*Status: open · closed · open — below high threshold (non-blocking)*
*Severity: critical > high > medium > low — only open threats at or above workflow.security_block_on count toward threats_open*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

No accepted risks.

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-06-27 | 6 | 6 | 0 | Codex |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-06-27
