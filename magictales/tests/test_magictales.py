from story_contract import V1_STORY


def _contains_all(text: str, expected_parts: tuple[str, ...]) -> bool:
    lowered = text.lower()
    return all(part in lowered for part in expected_parts)


def test_story_contract_objective() -> None:
    """The first level objective stays focused on the forest gate return."""
    objective = V1_STORY.objective

    assert "forest gate" in objective.text.lower()
    assert "grandmother" in objective.text.lower()
    assert "whistle" not in objective.text.lower()
    assert _contains_all(
        objective.success_condition,
        ("answer", "whistle", "before", "return"),
    )
    assert "forest gate" in objective.success_condition.lower()


def test_story_contract_accepted_freeform_meanings() -> None:
    """The whistle answer is semantic, not tied to option letters."""
    accepted_meanings = " ".join(V1_STORY.objective.accepted_meanings).lower()

    assert "a." not in accepted_meanings
    assert "option" not in accepted_meanings
    assert "loud sound" in accepted_meanings
    assert "call someone" in accepted_meanings
    assert "get attention" in accepted_meanings
    assert "signal danger" in accepted_meanings
    assert "ask for help" in accepted_meanings


def test_milo_sidekick_cue() -> None:
    """Milo helps the player reason without opening the gate for them."""
    assert V1_STORY.sidekick == "Milo"

    first_hint = V1_STORY.helper_hints[0].lower()
    assert "hear" in first_hint
    assert "loud sound, call someone, get attention" not in first_hint

    first_cue = V1_STORY.sidekick_cues[0].lower()
    assert "milo" in first_cue
    assert "adventure" in first_cue or "interesting" in first_cue

    final_helper = V1_STORY.final_helper_answer.lower()
    assert "make a loud sound" in final_helper
    assert "call someone" in final_helper
    assert "get attention" in final_helper
    assert "ask for help" in final_helper
    assert V1_STORY.requires_player_retry_after_final_helper is True


def test_voice_style_is_concise() -> None:
    """Voice rules remain brief, plain, and suitable for text to speech."""
    voice_rules = " ".join(V1_STORY.voice_rules).lower()

    assert "plain text" in voice_rules
    assert "brief" in voice_rules
    assert "one question at a time" in voice_rules
    assert "friendly" in voice_rules
    assert "playful" in voice_rules


def test_story_contract_safety_boundary() -> None:
    """The story boundary is safe for kids and does not expose internals."""
    safety_boundary = " ".join(V1_STORY.safety_boundary).lower()

    assert "kids ages 10-14" in safety_boundary
    assert "predefined adventure" in safety_boundary
    assert "internal" in safety_boundary
    assert "system instructions" in safety_boundary
    assert "developer instructions" in safety_boundary
