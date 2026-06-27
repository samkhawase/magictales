# Roadmap: MagicTales

## Overview

MagicTales v1 turns the existing LiveKit voice assistant starter into a playable voice-first story game. The roadmap builds the smallest complete vertical slice: lock the hardcoded story and safety contract, implement the turn-by-turn objective loop, add sound cues, provide a minimal frontend, then harden the full kid-safe play experience.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Story Contract and Tests** - Define the hardcoded story, objective, sidekick, safety rules, and baseline behavioral tests.
- [ ] **Phase 2: Voice Game Loop** - Replace the generic assistant with turn-by-turn MagicTales gameplay and objective completion.
- [ ] **Phase 3: Sound Cue Layer** - Add ambient and event sound cue contracts that support the story.
- [ ] **Phase 4: Minimal Frontend** - Build the smallest functional LiveKit frontend for playing the session.
- [ ] **Phase 5: End-to-End Hardening** - Verify safety, latency, audio clarity, and complete playthrough quality.

## Phase Details

### Phase 1: Story Contract and Tests

**Goal**: Define the hardcoded v1 story, objective, sidekick, voice style, and test contract before changing core agent behavior.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: [OBJ-01, SIDE-01, AUDIO-01, SAFE-01, TEST-01, TEST-02]
**UI hint**: no
**Success Criteria** (what must be TRUE):

  1. The v1 story has a clear title, setting, level objective, sidekick, opening beat, success condition, and kid-safe boundaries.
  2. Behavioral tests describe successful completion, incomplete attempts, sidekick cue behavior, and safety redirects.
  3. Agent voice rules are concise enough for spoken output and preserve the existing LiveKit test pattern.

**Plans**: 1/2 plans executed

Plans:
**Wave 1**

- [x] 01-01-PLAN.md — Define story contract, objective examples, sidekick behavior, and safety boundaries.

**Wave 2** *(blocked on Wave 1 completion)*

- [ ] 01-02-PLAN.md — Add failing behavioral tests for the MagicTales game loop and safeguards.

### Phase 2: Voice Game Loop

**Goal**: Turn the current generic assistant into a MagicTales game master that runs one playable voice story level.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: [LOOP-01, LOOP-02, LOOP-03, LOOP-04, OBJ-02, OBJ-03, SIDE-02]
**UI hint**: no
**Success Criteria** (what must be TRUE):

  1. Player can start the hardcoded story and hear an in-world introduction.
  2. Each player action receives advancement, feedback, or a sidekick hint based on the current objective.
  3. The level ends only when the player's spoken action explicitly satisfies the objective.
  4. All Phase 1 behavioral tests pass.

**Plans**: 3 plans

Plans:

- [ ] 02-01: Refactor assistant instructions into a MagicTales game master using the story contract.
- [ ] 02-02: Implement objective evaluation behavior for success, partial progress, unrelated input, and retry feedback.
- [ ] 02-03: Tune sidekick cues and level-ending behavior until tests pass reliably.

### Phase 3: Sound Cue Layer

**Goal**: Define and integrate ambient and event sound cues that can drive the audio experience without competing with speech.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: [AUDIO-02, AUDIO-03, AUDIO-04]
**UI hint**: no
**Success Criteria** (what must be TRUE):

  1. Story events map to named ambient and event sound cues.
  2. Discovery, retry, and success moments have explicit cue names.
  3. Sound cue behavior is documented or exposed in a way the frontend can consume.
  4. Agent spoken responses remain clear and concise around sound moments.

**Plans**: 2 plans

Plans:

- [ ] 03-01: Add a sound cue contract for ambient setting, discovery, retry, and success events.
- [ ] 03-02: Integrate sound cue signaling into story turns and cover it with tests or structured assertions.

### Phase 4: Minimal Frontend

**Goal**: Build a minimal functional frontend that lets a player join and play a MagicTales LiveKit voice session.
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: [FRONT-01, FRONT-02, FRONT-03]
**UI hint**: yes
**Success Criteria** (what must be TRUE):

  1. Player can join a LiveKit session and use microphone/audio controls.
  2. Frontend shows connection state and basic session status.
  3. Frontend shows story title, objective, and simple play state.
  4. Frontend remains minimal and does not become a rich visual game surface.

**Plans**: 3 plans

Plans:

- [ ] 04-01: Choose or scaffold the minimal LiveKit web frontend path.
- [ ] 04-02: Add room connection, microphone/session controls, and status UI.
- [ ] 04-03: Display MagicTales story title, objective, and simple game status.

### Phase 5: End-to-End Hardening

**Goal**: Validate the full v1 playthrough for kid safety, story containment, audio clarity, and deployment readiness.
**Mode:** mvp
**Depends on**: Phase 4
**Requirements**: [SAFE-02]
**UI hint**: no
**Success Criteria** (what must be TRUE):

  1. Agent refuses unsafe, personal-data-seeking, and out-of-adventure requests while redirecting to the story.
  2. A full playthrough can complete from frontend join to level success.
  3. Tests and manual checks cover the complete happy path and key failure paths.
  4. Deployment and local run docs reflect the MagicTales app rather than the starter template.

**Plans**: 2 plans

Plans:

- [ ] 05-01: Add safety and story-boundary hardening tests and prompt fixes.
- [ ] 05-02: Run end-to-end playthrough checks and update docs for MagicTales usage.

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Story Contract and Tests | 1/2 | In Progress|  |
| 2. Voice Game Loop | 0/3 | Not started | - |
| 3. Sound Cue Layer | 0/2 | Not started | - |
| 4. Minimal Frontend | 0/3 | Not started | - |
| 5. End-to-End Hardening | 0/2 | Not started | - |
