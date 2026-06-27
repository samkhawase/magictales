import textwrap

import pytest
from livekit.agents import AgentSession, inference, llm

from agent import Assistant
from story_contract import V1_STORY

PHASE_2_XFAIL = pytest.mark.xfail(
    strict=True, reason="Phase 2 implements MagicTales runtime behavior"
)


def _judge_llm() -> llm.LLM:
    return inference.LLM(model="openai/gpt-4.1-mini")


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


@PHASE_2_XFAIL
@pytest.mark.asyncio
async def test_story_opening_starts_roller_cart_adventure() -> None:
    """MagicTales starts with the locked village roller-cart story."""
    async with (
        _judge_llm() as judge_llm,
        AgentSession() as session,
    ):
        await session.start(Assistant())

        result = await session.run(user_input="Let's play MagicTales")

        await (
            result.expect.next_event()
            .is_message(role="assistant")
            .judge(
                judge_llm,
                intent=textwrap.dedent(
                    f"""\
                    Starts the predefined MagicTales story from `{V1_STORY.title}`.

                    The assistant must:
                    - Place the player in grandmother's village during summer vacation
                    - Include Milo as the sidekick
                    - Put the player in or near the small wooden roller cart
                    - Introduce the silver whistle as part of the opening adventure
                    - Ask for exactly one spoken/freeform action from the player

                    The assistant must not:
                    - Offer generic assistant help instead of starting MagicTales
                    - Present fixed A/B/C option-letter gameplay as the runtime expectation
                    - Skip directly to the fox answer, forest gate opening, or ending
                    """
                ),
            )
        )
        result.expect.no_more_events()


@PHASE_2_XFAIL
@pytest.mark.asyncio
async def test_correct_freeform_whistle_answer_opens_gate_and_returns_home() -> None:
    """A correct spoken whistle meaning completes the level objective."""
    async with (
        _judge_llm() as judge_llm,
        AgentSession() as session,
    ):
        await session.start(Assistant())

        setup_result = await session.run(
            user_input=(
                "Let's play MagicTales. I pick up the silver whistle, ride the "
                "roller cart to the forest gate, blow the whistle, and listen to "
                "the fox's question."
            )
        )
        await (
            setup_result.expect.next_event()
            .is_message(role="assistant")
            .judge(
                judge_llm,
                intent=textwrap.dedent(
                    f"""\
                    Continues the predefined story toward `{V1_STORY.objective.learning_question}`.

                    The assistant should include the forest gate, the fox, or the
                    whistle question without claiming that the level is complete.
                    """
                ),
            )
        )
        setup_result.expect.no_more_events()

        result = await session.run(
            user_input="You blow it to get someone's attention if you need help."
        )

        await (
            result.expect.next_event()
            .is_message(role="assistant")
            .judge(
                judge_llm,
                intent=textwrap.dedent(
                    f"""\
                    Treats the player's freeform answer as correct for the whistle question.

                    Accepted meanings include: {", ".join(V1_STORY.objective.accepted_meanings)}.

                    The assistant must:
                    - Recognize that the player answered in free speech, not by choosing an option letter
                    - Open the forest gate only after this player-provided correct meaning
                    - Advance through the forest ride and return to grandmother's house
                    - Signal that the objective is complete

                    The assistant must not require the exact draft wording or an A/B/C choice.
                    """
                ),
            )
        )
        result.expect.no_more_events()


@PHASE_2_XFAIL
@pytest.mark.asyncio
async def test_incomplete_attempt_gets_feedback_without_completion() -> None:
    """Incomplete actions receive a hint without ending the level."""
    async with (
        _judge_llm() as judge_llm,
        AgentSession() as session,
    ):
        await session.start(Assistant())

        result = await session.run(
            user_input=(
                "Let's play MagicTales. At the fox question, I look at the "
                "whistle and say maybe it is for sleeping."
            )
        )

        await (
            result.expect.next_event()
            .is_message(role="assistant")
            .judge(
                judge_llm,
                intent=textwrap.dedent(
                    f"""\
                    Gives feedback or a hint because the player's action does not satisfy `{V1_STORY.objective.success_condition}`.

                    The assistant should:
                    - Keep the player inside the village roller-cart adventure
                    - Encourage another spoken attempt with a useful hint
                    - Avoid saying the forest gate opened
                    - Avoid saying the cart returned to grandmother's house
                    - Avoid claiming the level or objective is complete
                    """
                ),
            )
        )
        result.expect.no_more_events()


@PHASE_2_XFAIL
@pytest.mark.asyncio
async def test_final_helper_answer_requires_player_retry_before_advancement() -> None:
    """The final helper answer teaches but does not auto-complete the level."""
    async with (
        _judge_llm() as judge_llm,
        AgentSession() as session,
    ):
        await session.start(Assistant())

        first_wrong = await session.run(
            user_input="Let's play MagicTales. At the fox question, I say it is for painting pictures."
        )
        await (
            first_wrong.expect.next_event()
            .is_message(role="assistant")
            .judge(
                judge_llm,
                intent="Gives an initial hint and keeps the forest gate closed.",
            )
        )
        first_wrong.expect.no_more_events()

        second_wrong = await session.run(user_input="I still think it is for sleeping.")
        await (
            second_wrong.expect.next_event()
            .is_message(role="assistant")
            .judge(
                judge_llm,
                intent="Gives a clearer hint without opening the gate or ending the level.",
            )
        )
        second_wrong.expect.no_more_events()

        helper_result = await session.run(user_input="I do not know. Milo, tell me.")
        await (
            helper_result.expect.next_event()
            .is_message(role="assistant")
            .judge(
                judge_llm,
                intent=textwrap.dedent(
                    f"""\
                    Provides the final helper answer: `{V1_STORY.final_helper_answer}`.

                    The assistant must still require the player to try again in
                    their own words before advancement. The forest gate remains
                    closed and the story does not return to grandmother's house yet.
                    """
                ),
            )
        )
        helper_result.expect.no_more_events()

        retry_result = await session.run(
            user_input="A whistle makes a loud sound to call someone for help."
        )
        await (
            retry_result.expect.next_event()
            .is_message(role="assistant")
            .judge(
                judge_llm,
                intent=textwrap.dedent(
                    """\
                    Now advances because the player repeated a correct whistle
                    meaning in their own words after the helper answer. The gate
                    opens and the cart can return to grandmother's house.
                    """
                ),
            )
        )
        retry_result.expect.no_more_events()
