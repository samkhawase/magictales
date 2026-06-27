from pathlib import Path

from agent import build_game_instructions, load_story_markdown


def test_load_story_markdown_reads_story_file(tmp_path: Path) -> None:
    story_file = tmp_path / "story.md"
    story_file.write_text("# The Lantern Gate\n\n## Level 1\nFind the silver key.\n")

    assert load_story_markdown(story_file) == (
        "# The Lantern Gate\n\n## Level 1\nFind the silver key."
    )


def test_build_game_instructions_embeds_story_and_sidekick_rules() -> None:
    instructions = build_game_instructions(
        "# The Lantern Gate\n\n## Level 1\nAnswer: moonlight."
    )

    assert "# The Lantern Gate" in instructions
    assert "sidekick" in instructions
    assert "one question at a time" in instructions
    assert "Do not advance to the next level" in instructions
    assert "When every level is complete" in instructions
