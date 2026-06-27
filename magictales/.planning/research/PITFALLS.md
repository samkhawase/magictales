# Project Research: Pitfalls

## Question

What can go wrong when building MagicTales v1?

## Pitfalls

### Prompt Becomes the Whole Application

**Warning signs:** Long instructions mix story text, safety policy, turn rules, objective logic, and frontend signaling.

**Prevention:** Keep the story definition and game rules organized in small modules or clearly separated constants. Add tests for behavior before changing core instructions.

**Phase:** Phase 1 and Phase 2.

### Objective Completion Is Too Fuzzy

**Warning signs:** The player completes the objective sometimes, but similar valid actions fail or invalid actions pass.

**Prevention:** Define the objective and completion examples explicitly. Test successful action, partial action, unrelated action, and unsafe action.

**Phase:** Phase 2.

### Sidekick Over-Explains

**Warning signs:** The sidekick solves the level for the player or turns every response into instructions.

**Prevention:** Specify cue strength: hint first, then clearer cue after repeated failure, while preserving player agency.

**Phase:** Phase 2.

### Sound Competes With Speech

**Warning signs:** Ambient beds or effects make speech harder to understand.

**Prevention:** Treat sounds as supportive cues, keep them short or quiet around speech, and test the spoken experience as primary.

**Phase:** Phase 3.

### Frontend Scope Expands Too Early

**Warning signs:** Work shifts into visual design before the voice loop works.

**Prevention:** Keep the first frontend to connection, mic controls, status, objective, and simple play feedback.

**Phase:** Phase 4.

### Kid Safety Relies Only on Good Intent

**Warning signs:** Tests only cover happy path story turns.

**Prevention:** Add misuse and out-of-flow tests for unsafe content, personal data, and attempts to leave the story.

**Phase:** Phase 1 and Phase 5.
