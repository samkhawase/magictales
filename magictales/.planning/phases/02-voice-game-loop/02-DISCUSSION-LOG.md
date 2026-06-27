# Phase 2: Voice Game Loop - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-27
**Phase:** 2-Voice Game Loop
**Areas discussed:** Turn Flow Control, Objective Judging, Milo Hint Style, Completion and Replay

---

## Turn Flow Control

| Option | Description | Selected |
|--------|-------------|----------|
| Accept compressed progress when it is clear | Advance through implied beats and complete if the explicit objective answer is present. | yes |
| Enforce one beat per turn | Acknowledge intent, process only the next beat, and ask for the next spoken action. | |
| Mixed approach | Allow setup compression, but require the fox's whistle answer as its own explicit turn. | |

**User's choice:** Accept compressed progress when it is clear.
**Notes:** The runtime should support flexible spoken input and not punish players for combining clear story actions.

| Option | Description | Selected |
|--------|-------------|----------|
| Gentle rewind to current beat | Keep the player at the current scene and ask for one valid current action. | |
| Flexible fast-forward if safe | Narrate obvious skipped setup quickly and continue. | yes |
| Treat as imagination/out-of-flow | Milo nudges back to the current available action. | |

**User's choice:** Flexible fast-forward if safe.
**Notes:** Safe obvious jumps can move the story forward.

| Option | Description | Selected |
|--------|-------------|----------|
| Redirect once, then offer a story-specific choice | Acknowledge imagination, return to the scene, and suggest valid spoken actions. | yes |
| Stay fully freeform | Keep redirecting without offered choices. | |
| Let Milo turn it into playful flavor | Milo jokes lightly while returning to objective action. | |

**User's choice:** Redirect once, then offer a story-specific choice.
**Notes:** The story remains freeform, but repeated off-track input can receive scaffolding.

| Option | Description | Selected |
|--------|-------------|----------|
| Small explicit state | Track current beat, hint level, final-helper-given, and completion. | yes |
| Prompt/history only | Rely on the LLM to infer state from prior turns. | |
| Hybrid | Track only hint level and completion. | |

**User's choice:** Small explicit state.
**Notes:** Explicit state is preferred for testability.

---

## Objective Judging

| Option | Description | Selected |
|--------|-------------|----------|
| Semantic match is enough | Any clear freeform wording that means one accepted use succeeds. | yes |
| Require two ideas | Player must mention loud sound plus calling, help, or attention. | |
| Require story-specific wording | Player must connect the whistle to the fox or gate. | |

**User's choice:** Semantic match is enough.
**Notes:** Exact option text is not required.

| Option | Description | Selected |
|--------|-------------|----------|
| Partial progress with a targeted hint | Acknowledge what is right, keep the gate closed, and ask for missing purpose. | |
| Accept as success | Treat reasonable whistle-related answers as enough for this age group. | yes |
| Wrong answer flow | Count it as incorrect and advance the normal hint ladder. | |

**User's choice:** Accept as success.
**Notes:** Answers like "it makes noise" or "you blow it" can pass for the v1 audience.

| Option | Description | Selected |
|--------|-------------|----------|
| Safety redirect, no state progress | Refuse or redirect briefly; keep current beat and hint level unchanged. | yes |
| Safety redirect plus gentle hint | Refuse, then restate the current objective cue. | |
| Treat as unrelated input | Use harmless out-of-flow behavior. | |

**User's choice:** Safety redirect, no state progress.
**Notes:** Unsafe input must not advance the game.

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, if the story path is clear | Fast-forward through the fox question and complete. | yes |
| Not immediately | Ask the fox question in-scene and require the answer again. | |
| Only after the whistle is found and blown | Early answers do not complete. | |

**User's choice:** Yes, if the story path is clear.
**Notes:** Clear early objective answers can complete through fast-forward.

---

## Milo Hint Style

| Option | Description | Selected |
|--------|-------------|----------|
| Playful coach | Curious, encouraging, a little funny, but never sarcastic or bossy. | |
| Excited adventure buddy | Energetic and dramatic, with stronger reactions to the cart, whistle, and fox. | yes |
| Calm helper | Gentle and clear, prioritizing comprehension over personality. | |

**User's choice:** Excited adventure buddy.
**Notes:** Milo should bring energy and in-world reactions.

| Option | Description | Selected |
|--------|-------------|----------|
| Very light nudge | Tiny object, big sound. What do people do when they need someone to hear them? | |
| Clear concept cue | A whistle makes a sound people can hear. What might you use that sound for? | yes |
| Nearly answer | It helps call someone or get attention. Can you say that back? | |

**User's choice:** Clear concept cue.
**Notes:** First hint should be useful but not fully solving.

| Option | Description | Selected |
|--------|-------------|----------|
| Escalate steadily | First playful clue, then clearer explanation, then final helper answer. | yes |
| Stay playful but not more direct | Keep varied clues without spelling it out. | |
| Ask the player to choose help level | Ask for tiny hint or big hint. | |

**User's choice:** Escalate steadily.
**Notes:** Matches the Phase 1 helper flow.

| Option | Description | Selected |
|--------|-------------|----------|
| Milo gives it | Keeps the helper role in-world and personal. | yes |
| Narrator gives it | Keeps Milo from feeling like he solved the game. | |
| Shared answer | Milo starts it, narrator confirms, then asks the player to try. | |

**User's choice:** Milo gives it.
**Notes:** Completion still requires player retry after Milo gives the final answer.

---

## Completion and Replay

| Option | Description | Selected |
|--------|-------------|----------|
| Clear level-complete ending | Narrate gate opens, forest ride, return home, and say level complete. | yes |
| In-world ending only | Narrate return home without level-complete language. | |
| Brief success plus next prompt | Confirm success, then ask whether to hear it again. | |

**User's choice:** Clear level-complete ending.
**Notes:** The ending should be explicit for tests and player understanding.

| Option | Description | Selected |
|--------|-------------|----------|
| No, game is ended | Further actions get a brief complete response and can offer replay later. | yes |
| Yes, free epilogue | Let the player chat in the completed story world. | |
| One closing turn only | Allow one final reaction, then close. | |

**User's choice:** No, game is ended.
**Notes:** Do not continue the story after completion.

| Option | Description | Selected |
|--------|-------------|----------|
| No replay yet | End cleanly; replay can be a future phase or manual new session. | |
| Simple restart phrase | If the player says "play again," reset state and restart. | yes |
| Ask at completion | End, then ask "Want to play again?" and reset if yes. | |

**User's choice:** Simple restart phrase.
**Notes:** Do not ask proactively, but support restart if requested.

| Option | Description | Selected |
|--------|-------------|----------|
| Safety wins | Redirect unsafe part and do not complete that turn. | yes |
| Split handling | Accept the correct answer but redirect unsafe action before safe completion. | |
| Ask for a clean retry | Say the answer idea is close and ask for a safe version. | |

**User's choice:** Safety wins.
**Notes:** Unsafe content in a mixed turn blocks completion.

---

## the agent's Discretion

- Exact Python module boundaries and helper function names.
- Exact phrasing, as long as the decisions in `02-CONTEXT.md` and the Phase 1 test contract are honored.

## Deferred Ideas

None.
