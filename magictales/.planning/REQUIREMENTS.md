# Requirements: MagicTales

**Defined:** 2026-06-27
**Core Value:** Kids can feel like they are inside a spoken adventure where their voice actions matter and completing the level objective naturally moves the story forward.

## v1 Requirements

### Story Loop

- [ ] **LOOP-01**: Player can start one hardcoded MagicTales story session.
- [ ] **LOOP-02**: Agent narrates the current story situation and asks for one spoken action or choice.
- [ ] **LOOP-03**: Player can speak one action or choice per turn and receive story advancement or feedback.
- [ ] **LOOP-04**: Agent ends the level when the player explicitly completes the objective through dialogue.

### Objective

- [ ] **OBJ-01**: Story defines one clear level objective for the hardcoded v1 level.
- [ ] **OBJ-02**: Agent evaluates player dialogue against the objective and distinguishes success, partial progress, unrelated action, and unsafe/out-of-flow input.
- [ ] **OBJ-03**: Agent does not mark the objective complete unless the player's spoken action explicitly satisfies the story condition.

### Sidekick

- [ ] **SIDE-01**: Story includes a sidekick character that gives age-appropriate cues toward the objective.
- [ ] **SIDE-02**: Sidekick hints preserve player agency and do not immediately solve the objective.

### Voice and Sound

- [ ] **AUDIO-01**: Agent responses are concise and natural for text-to-speech.
- [ ] **AUDIO-02**: Game defines ambient sound cues for the hardcoded story setting.
- [ ] **AUDIO-03**: Game defines event sound cues for discovery, wrong turn or retry, and level success.
- [ ] **AUDIO-04**: Sound cues support the spoken experience without obscuring speech.

### Frontend

- [ ] **FRONT-01**: Player can join a MagicTales LiveKit voice session from a minimal frontend.
- [ ] **FRONT-02**: Frontend exposes essential session controls and connection status.
- [ ] **FRONT-03**: Frontend shows the story title, current objective, and simple game status.

### Safety and Testing

- [ ] **SAFE-01**: Agent keeps content appropriate for kids ages 10-14.
- [ ] **SAFE-02**: Agent refuses unsafe, personal-data-seeking, or out-of-adventure requests while redirecting back to the story.
- [ ] **TEST-01**: Behavioral tests cover successful objective completion, incomplete attempts, sidekick cues, story boundaries, and safety refusals.
- [ ] **TEST-02**: Tests use LiveKit Agents text-session evaluation for core agent behavior.

## v2 Requirements

### Story Content

- **STORY-01**: Author can add additional stories after the first hardcoded level works.
- **STORY-02**: Story prompts can be loaded from swappable files or a catalog.

### Player Progress

- **PROG-01**: Player progress can persist across sessions.
- **PROG-02**: Multiple levels can be chained into a longer adventure.

### Frontend Experience

- **VIS-01**: Frontend can provide richer visual companion elements for the active story.
- **VIS-02**: Frontend can show animated or illustrated state changes.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multiple stories in v1 | One hardcoded story proves the voice gameplay loop first |
| Swappable prompt files in v1 | Adds content-system complexity before the first level is validated |
| Persistent accounts or saves | Not required for a single-session vertical slice |
| Rich visual gameplay UI | Voice and sound are the primary product surface |
| Unrestricted assistant chat | Conflicts with kid-safe predefined adventure flow |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| LOOP-01 | Phase 2 | Pending |
| LOOP-02 | Phase 2 | Pending |
| LOOP-03 | Phase 2 | Pending |
| LOOP-04 | Phase 2 | Pending |
| OBJ-01 | Phase 1 | Pending |
| OBJ-02 | Phase 2 | Pending |
| OBJ-03 | Phase 2 | Pending |
| SIDE-01 | Phase 1 | Pending |
| SIDE-02 | Phase 2 | Pending |
| AUDIO-01 | Phase 1 | Pending |
| AUDIO-02 | Phase 3 | Pending |
| AUDIO-03 | Phase 3 | Pending |
| AUDIO-04 | Phase 3 | Pending |
| FRONT-01 | Phase 4 | Pending |
| FRONT-02 | Phase 4 | Pending |
| FRONT-03 | Phase 4 | Pending |
| SAFE-01 | Phase 1 | Pending |
| SAFE-02 | Phase 5 | Pending |
| TEST-01 | Phase 1 | Pending |
| TEST-02 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0

---
*Requirements defined: 2026-06-27*
*Last updated: 2026-06-27 after roadmap creation*
