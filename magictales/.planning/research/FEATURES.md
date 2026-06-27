# Project Research: Features

## Question

What features are table stakes versus differentiators for MagicTales v1?

## Table Stakes for v1

- Voice session starts reliably and introduces the adventure.
- Agent narrates a predefined story in language appropriate for kids ages 10-14.
- Player speaks one action or choice per turn.
- Agent evaluates the spoken action against the current story situation and objective.
- Sidekick gives cues when the player needs help.
- Game ends when the player explicitly completes the objective through dialogue.
- Agent stays inside the safe adventure flow and refuses unsafe or out-of-scope requests.
- Ambient and event sounds support narration and feedback.
- Minimal frontend lets the player join, speak, hear the agent, and understand the current objective/status.
- Behavioral tests verify the core game loop and safeguards.

## Differentiators

- Sidekick-guided objective completion instead of generic assistant conversation.
- Sound-led storytelling where ambient beds and event cues make the voice experience feel like a game.
- Objective evaluation tied to explicit player action rather than buttons or hidden UI state.

## Anti-Features

- Story catalog before one story works.
- Rich visual companion before the voice loop is validated.
- Freeform assistant behavior outside the game.
- Persistent progression before the single-session loop is reliable.

## Dependencies

- Objective evaluation depends on a clear story prompt and testable completion rules.
- Sound cue triggering depends on a shared representation of story events.
- Frontend polish depends on having stable session and game-state signals from the agent.
