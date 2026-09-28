import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def test_resume_verifier_accepts_bilingual_download_ids():
    result = subprocess.run(
        [sys.executable, 'scripts/resume/verify_resumes.py'],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    assert result.returncode == 0, result.stderr or result.stdout


if __name__ == '__main__':
    test_resume_verifier_accepts_bilingual_download_ids()
