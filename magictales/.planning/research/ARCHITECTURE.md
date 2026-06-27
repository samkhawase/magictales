# Project Research: Architecture

## Question

How should MagicTales v1 be structured?

## Recommended Components

### Game Master Agent

Owns the voice persona, story rules, safety boundaries, sidekick behavior, and turn-by-turn response style. It should replace the generic assistant instructions in the current `Assistant` class.

### Story Definition

Stores the one hardcoded story, level objective, sidekick identity, opening narration, allowed tone, and completion condition. For v1 this can be code-native rather than loaded from external prompt files.

### Objective Evaluation

Determines whether the player's spoken action explicitly completes the level objective. Start with prompt-level evaluation and behavioral tests. If prompt-only evaluation is inconsistent, add a small tool or structured state update in a later phase.

### Sound Cue Contract

Defines event names such as `ambient_forest`, `event_discovery`, `event_success`, and `event_wrong_turn`. The first implementation can be simple and local; later frontend work can map these events to actual audio assets.

### Minimal Frontend

Connects to the LiveKit room, handles microphone/session controls, and presents basic game state such as title, objective, current status, and connection state.

## Data Flow

1. Frontend joins a LiveKit room and connects the player microphone.
2. LiveKit dispatches the `magictales` agent.
3. Agent opens the hardcoded story and narrates the scene.
4. Player speaks one action.
5. Agent evaluates the action against the story state and objective.
6. Agent narrates advancement, gives sidekick guidance, emits/indicates sound cues, or ends the level.

## Build Order Implications

1. Lock the game prompt and behavioral tests.
2. Add explicit game loop behavior to the agent.
3. Add sound cue contracts once story turns are stable.
4. Add the minimal frontend after the agent loop is testable.
5. Polish safety, latency, and end-to-end playability last.
