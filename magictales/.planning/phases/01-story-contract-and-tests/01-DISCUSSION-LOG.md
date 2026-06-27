# Phase 1: Story Contract and Tests - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-27
**Phase:** 1-Story Contract and Tests
**Areas discussed:** Story source, objective contract, player input, hint flow, sidekick behavior, voice style and safety, test scenarios

---

## Story Source

| Option | Description | Selected |
|--------|-------------|----------|
| Use `.planning/basic_story.md` | Treat the existing story draft as canonical for the first hardcoded adventure | yes |
| Invent a new story during planning | Planner creates a new adventure from project context | |

**User's choice:** Use `basic_story.md`.
**Notes:** File is located at `.planning/basic_story.md` and defines the village, roller cart, Milo, silver whistle, forest gate, fox, helper hints, and ending.

---

## Objective Contract

| Option | Description | Selected |
|--------|-------------|----------|
| Learn what a whistle is used for | The learning answer is the top-level objective | |
| Open the forest gate and return to grandmother's house | Learning the whistle use is part of completing the story objective | yes |

**User's choice:** Open the forest gate and return to grandmother's house.
**Notes:** The correct whistle explanation remains required, but it serves the larger story objective.

---

## Player Input

| Option | Description | Selected |
|--------|-------------|----------|
| Free speech | Player answers naturally in spoken language | yes |
| A/B/C choices | Agent expects the drafted multiple-choice labels | |
| Both | Agent can handle either free speech or explicit choice letters | |

**User's choice:** Free speech.
**Notes:** Tests should avoid depending only on the exact option text from the story draft.

---

## Hint and Retry Flow

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-advance after final helper answer | Helper explanation completes the objective | |
| Require player to repeat or provide the correct answer | Helper teaches, then player must confirm understanding in speech | yes |

**User's choice:** Complete the learning but still require the player to repeat the correct answer.
**Notes:** The final helper answer should not open the gate by itself.

---

## Voice Style and Safety

| Option | Description | Selected |
|--------|-------------|----------|
| Standard kid-safe guardrails only | Keep content age-appropriate and safe without extra custom boundaries | yes |
| Extra content restrictions | Add stricter bans such as no mild danger, no magic, or no getting lost | |

**User's choice:** No content boundaries except usual age-appropriate guardrails.
**Notes:** The story can remain light adventure with standard safety behavior.

---

## Test Scenarios

| Option | Description | Selected |
|--------|-------------|----------|
| Story-contract tests from the discussion | Opening, objective, freeform correct answer, wrong answer hints, final helper retry, safety redirect | yes |
| Minimal happy path only | Only test correct completion | |

**User's choice:** Derived from the answered Phase 1 gaps and `basic_story.md`.
**Notes:** The user did not enumerate test names, but the required scenarios are implied by the story contract decisions.

## the agent's Discretion

- Exact Python module boundaries for story constants and test helper organization.
- Exact wording of test judge intents, as long as they preserve the locked behavior.

## Deferred Ideas

None.
