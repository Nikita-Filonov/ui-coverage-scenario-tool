"""Check the installed wheel outside the source tree. Run with python -I."""

import importlib.metadata
import importlib.resources
import json
import os
import subprocess
import sys
from pathlib import Path
from tempfile import TemporaryDirectory


def check_wheel():
    if not sys.flags.isolated:
        raise RuntimeError("Run this check with python -I to exclude the source tree")

    with TemporaryDirectory(prefix="ui-scenario-wheel-") as directory:
        previous_directory = Path.cwd()
        try:
            os.chdir(directory)
            for key in list(os.environ):
                if key.startswith("UI_COVERAGE_SCENARIO_"):
                    del os.environ[key]
            package = importlib.resources.files("ui_coverage_scenario_tool")
            assert (package / "src/reports/templates/index.html").is_file()
            assert not (package / "tests").is_dir()
            distribution = importlib.metadata.distribution("ui-coverage-scenario-tool")
            entry_point = next(point for point in distribution.entry_points if point.name == "ui-coverage-scenario-tool")
            assert entry_point.group == "console_scripts"
            assert entry_point.value == "ui_coverage_scenario_tool.cli.main:cli"
            from ui_coverage_scenario_tool import ActionType, SelectorType, UICoverageTracker
            from ui_coverage_scenario_tool.config import get_settings

            Path("ui_coverage_scenario_config.json").write_text(json.dumps({
                "apps": [{"key": "wheel-check", "name": "Wheel Check", "url": "https://example.com"}],
            }), encoding="utf-8")
            tracker = UICoverageTracker("wheel-check")
            tracker.start_scenario(None, "Login")
            tracker.track_page("/login", "login", 1)
            tracker.track_page("/home", "home", 2)
            tracker.track_element("#submit", ActionType.CLICK, SelectorType.CSS)
            tracker.track_transition("login", "home")
            tracker.end_scenario()

            executable = Path(sys.executable).with_name("ui-coverage-scenario-tool")
            environment = {key: value for key, value in os.environ.items()
                           if not key.startswith("UI_COVERAGE_SCENARIO_") and key != "PYTHONPATH"}
            for command in ["--help", "print-config", "save-report"]:
                subprocess.run([str(executable), command], env=environment, check=True, capture_output=True, text=True)

            report = json.loads(Path("coverage-report.json").read_text(encoding="utf-8"))
            app = report["appsCoverage"]["wheel-check"]
            assert app["history"][0]["totalActions"] == 1
            assert app["pages"]["edges"][0]["count"] == 1
            assert app["scenarios"][0]["steps"][0]["selector"] == "#submit"
            html = Path("index.html").read_text(encoding="utf-8")
            state = html.split('<script id="state" type="application/json">', 1)[1].split('</script>', 1)[0]
            assert json.loads(state) == report

            subprocess.run([str(executable), "clear-results"], env=environment, check=True, capture_output=True, text=True)
            assert list(Path("coverage-results").iterdir()) == []
            assert Path("coverage-history.json").is_file()
            assert Path("coverage-report.json").is_file()
            assert Path("index.html").is_file()
            get_settings.cache_clear()
        finally:
            os.chdir(previous_directory)
    print("Installed wheel check passed")


if __name__ == "__main__":
    check_wheel()
