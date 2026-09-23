"""Focused regression checks for the canonical resume experience structure."""
from pathlib import Path
import json


ROOT = Path(__file__).resolve().parents[2]
BUILD = (ROOT / "scripts/resume/build_resume.py").read_text(encoding="utf-8")
PROFILE = json.loads((ROOT / "web/src/data/profile.json").read_text(encoding="utf-8"))


def test_resume_builder_includes_hannstar_between_liling_and_benwu():
    expected = "for key in ['liling', 'hannstar', 'benwu', 'ouyin']:"
    assert expected in BUILD


def test_hannstar_resume_evidence_is_compact_and_complete():
    bullets = PROFILE["resume"]["experience"]["hannstar"]
    assert len(bullets) == 1
    assert all(term in bullets[0] for term in ["标准化", "工程约束", "质量", "跨部门协同"])


if __name__ == "__main__":
    test_resume_builder_includes_hannstar_between_liling_and_benwu()
    test_hannstar_resume_evidence_is_compact_and_complete()
    print("PASS: resume builder includes HannStar in chronological experience order")
