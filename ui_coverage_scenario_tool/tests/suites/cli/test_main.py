import json
import re
from pathlib import Path

import pytest
from click.testing import CliRunner

from ui_coverage_scenario_tool.cli.main import cli
from ui_coverage_scenario_tool.config import AppConfig, Settings
from ui_coverage_scenario_tool.src.tools.actions import ActionType
from ui_coverage_scenario_tool.src.tools.selector import SelectorType
from ui_coverage_scenario_tool.src.tracker.core import UICoverageTracker

runner = CliRunner()


def test_clear_results_reports_deletion_error(
        settings: Settings,
        monkeypatch: pytest.MonkeyPatch,
) -> None:
    settings.results_dir.mkdir()
    file = settings.results_dir / "123e4567-e89b-42d3-a456-426614174000-element.json"
    file.write_text("keep", encoding="utf-8")
    monkeypatch.setattr("ui_coverage_scenario_tool.cli.commands.clear_results.get_settings", lambda: settings)

    def fail_unlink(self: Path) -> None:
        raise OSError("permission denied")

    monkeypatch.setattr(Path, "unlink", fail_unlink)

    result = runner.invoke(cli, ["clear-results"])

    assert result.exit_code != 0
    assert "permission denied" in result.output
    assert file.exists()


def test_print_config_outputs_resolved_settings(
        settings: Settings,
        monkeypatch: pytest.MonkeyPatch,
        caplog: pytest.LogCaptureFixture,
) -> None:
    monkeypatch.setattr("ui_coverage_scenario_tool.cli.commands.print_config.get_settings", lambda: settings)

    result = runner.invoke(cli, ["print-config"])

    assert result.exit_code == 0
    config = json.loads(next(record.message for record in caplog.records if record.name == "PRINT_CONFIG"))
    assert config["apps"][0]["key"] == "test-service"
    assert config["results_dir"] == str(settings.results_dir)


def test_copy_report_updates_template(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.chdir(tmp_path)
    source = tmp_path / "submodules/ui-coverage-scenario-report/build/index.html"
    destination = tmp_path / "ui_coverage_scenario_tool/src/reports/templates/index.html"
    source.parent.mkdir(parents=True)
    destination.parent.mkdir(parents=True)
    source.write_text("<html>new template</html>", encoding="utf-8")
    destination.write_text("old template", encoding="utf-8")

    result = runner.invoke(cli, ["copy-report"])

    assert result.exit_code == 0
    assert destination.read_text(encoding="utf-8") == "<html>new template</html>"


def test_copy_report_keeps_template_when_build_is_missing(
        tmp_path: Path,
        monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.chdir(tmp_path)
    destination = tmp_path / "ui_coverage_scenario_tool/src/reports/templates/index.html"
    destination.parent.mkdir(parents=True)
    destination.write_text("current template", encoding="utf-8")

    result = runner.invoke(cli, ["copy-report"])

    assert result.exit_code == 0
    assert destination.read_text(encoding="utf-8") == "current template"


def test_copy_report_logs_copy_error(
        tmp_path: Path,
        monkeypatch: pytest.MonkeyPatch,
        caplog: pytest.LogCaptureFixture,
) -> None:
    monkeypatch.chdir(tmp_path)
    source = tmp_path / "submodules/ui-coverage-scenario-report/build/index.html"
    source.parent.mkdir(parents=True)
    source.write_text("new template", encoding="utf-8")

    def fail_copy(*args, **kwargs) -> None:
        raise OSError("disk full")

    monkeypatch.setattr("ui_coverage_scenario_tool.cli.commands.copy_report.shutil.copy", fail_copy)

    result = runner.invoke(cli, ["copy-report"])

    assert result.exit_code == 0
    assert any("Error copying the report: disk full" in message for message in caplog.messages)


@pytest.fixture
def report_template(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Path:
    template = tmp_path / "template.html"
    template.write_text(
        '<html><body><script id="state" type="application/json">OLD_STATE</script></body></html>',
        encoding="utf-8",
    )
    monkeypatch.setattr(Settings, "html_report_template_file", template)
    return template


def record_scenario(tracker: UICoverageTracker, name: str, actions: int = 1):
    tracker.start_scenario("https://example.com/cases/1", name)
    tracker.track_page("/login", "login", 1)
    tracker.track_page("/home", "home", 2)
    tracker.track_transition("login", "home")
    for _ in range(actions):
        tracker.track_element("#save", ActionType.CLICK, SelectorType.CSS)
    tracker.end_scenario()


def read_report(settings: Settings):
    return json.loads(settings.json_report_file.read_text(encoding="utf-8"))


def test_save_report_builds_separate_apps_and_embeds_json(reports_settings, report_template, monkeypatch):
    reports_settings.apps.extend([
        AppConfig(key="second-app", name="Second App", url="https://second.example.com"),
        AppConfig(key="empty-app", name="Empty App", url="https://empty.example.com"),
    ])
    monkeypatch.setattr("ui_coverage_scenario_tool.cli.commands.save_report.get_settings", lambda: reports_settings)
    first = UICoverageTracker("test-service", reports_settings)
    record_scenario(first, "Login", actions=2)
    first.start_scenario(None, "Search")
    first.track_element("#save", ActionType.VISIBLE, SelectorType.XPATH)
    first.end_scenario()
    record_scenario(UICoverageTracker("second-app", reports_settings), "Login")
    record_scenario(UICoverageTracker("unconfigured-app", reports_settings), "Ignored")

    result = runner.invoke(cli, ["save-report"])

    assert result.exit_code == 0, result.output
    report = read_report(reports_settings)
    assert set(report["appsCoverage"]) == {"test-service", "second-app", "empty-app"}
    app = report["appsCoverage"]["test-service"]
    assert app["history"][-1]["totalActions"] == 3
    assert app["history"][-1]["totalElements"] == 2
    scenarios = {scenario["name"]: scenario for scenario in app["scenarios"]}
    assert scenarios["Login"]["actions"] == [{"actionType": "CLICK", "count": 2}]
    assert len(scenarios["Login"]["steps"]) == 2
    assert scenarios["Search"]["actions"] == [{"actionType": "VISIBLE", "count": 1}]
    assert scenarios["Search"]["steps"][0]["selectorType"] == "XPATH"
    assert {node["page"] for node in app["pages"]["nodes"]} == {"login", "home"}
    assert app["pages"]["edges"] == [
        {"fromPage": "login", "toPage": "home", "count": 1, "scenarios": ["Login"]}
    ]
    assert report["appsCoverage"]["second-app"]["history"][-1]["totalActions"] == 1
    assert report["appsCoverage"]["empty-app"] == {
        "history": [], "scenarios": [], "pages": {"nodes": [], "edges": []}
    }
    html = reports_settings.html_report_file.read_text(encoding="utf-8")
    match = re.search(r'<script id="state" type="application/json">(.*?)</script>', html)
    assert match is not None
    assert json.loads(match.group(1)) == report
    history = json.loads(reports_settings.history_file.read_text(encoding="utf-8"))
    assert history["apps"]["test-service"]["total"] == app["history"]
    assert history["apps"]["test-service"]["scenarios"]["Login"] == scenarios["Login"]["history"]


def test_clear_results_between_reports_excludes_previous_run(reports_settings, report_template, monkeypatch):
    monkeypatch.setattr("ui_coverage_scenario_tool.cli.commands.clear_results.get_settings", lambda: reports_settings)
    monkeypatch.setattr("ui_coverage_scenario_tool.cli.commands.save_report.get_settings", lambda: reports_settings)
    tracker = UICoverageTracker("test-service", reports_settings)
    record_scenario(tracker, "Login")
    assert runner.invoke(cli, ["save-report"]).exit_code == 0
    assert runner.invoke(cli, ["clear-results"]).exit_code == 0
    assert reports_settings.history_file.exists()
    assert reports_settings.html_report_file.exists()
    assert reports_settings.json_report_file.exists()
    record_scenario(tracker, "Login")
    assert runner.invoke(cli, ["save-report"]).exit_code == 0

    app = read_report(reports_settings)["appsCoverage"]["test-service"]
    assert [entry["totalActions"] for entry in app["history"]] == [1, 1]
    assert len(app["scenarios"]) == 1
    assert app["scenarios"][0]["actions"] == [{"actionType": "CLICK", "count": 1}]
    assert len(app["scenarios"][0]["history"]) == 2
    assert app["pages"]["edges"][0]["count"] == 1


def test_save_report_keeps_history_with_retention_limit(reports_settings, report_template, monkeypatch):
    reports_settings.history_retention_limit = 2
    monkeypatch.setattr("ui_coverage_scenario_tool.cli.commands.save_report.get_settings", lambda: reports_settings)
    monkeypatch.setattr("ui_coverage_scenario_tool.cli.commands.clear_results.get_settings", lambda: reports_settings)
    tracker = UICoverageTracker("test-service", reports_settings)
    for count in [1, 2, 3]:
        assert runner.invoke(cli, ["clear-results"]).exit_code == 0
        record_scenario(tracker, "Login", actions=count)
        result = runner.invoke(cli, ["save-report"])
        assert result.exit_code == 0, result.output

    app = read_report(reports_settings)["appsCoverage"]["test-service"]
    assert [entry["totalActions"] for entry in app["history"]] == [2, 3]
    assert [entry["actions"][0]["count"] for entry in app["scenarios"][0]["history"]] == [2, 3]
    history = json.loads(reports_settings.history_file.read_text())
    assert [entry["totalActions"] for entry in history["apps"]["test-service"]["total"]] == [2, 3]


def test_save_report_handles_empty_results(reports_settings, report_template, monkeypatch):
    monkeypatch.setattr("ui_coverage_scenario_tool.cli.commands.save_report.get_settings", lambda: reports_settings)
    result = runner.invoke(cli, ["save-report"])
    assert result.exit_code == 0, result.output
    assert read_report(reports_settings)["appsCoverage"]["test-service"] == {
        "history": [], "scenarios": [], "pages": {"nodes": [], "edges": []}
    }


def test_clear_results_missing_directory_is_success(settings, monkeypatch):
    monkeypatch.setattr("ui_coverage_scenario_tool.cli.commands.clear_results.get_settings", lambda: settings)
    assert runner.invoke(cli, ["clear-results"]).exit_code == 0
    assert not settings.results_dir.exists()


@pytest.mark.parametrize("disabled", [
    {"history_file"}, {"html_report_file"}, {"json_report_file"},
    {"history_file", "html_report_file", "json_report_file"},
])
def test_save_report_respects_disabled_outputs(reports_settings, report_template, monkeypatch, disabled):
    output_paths = {field: getattr(reports_settings, field)
                    for field in ("history_file", "html_report_file", "json_report_file")}
    for field in disabled:
        setattr(reports_settings, field, None)
    monkeypatch.setattr("ui_coverage_scenario_tool.cli.commands.save_report.get_settings", lambda: reports_settings)
    record_scenario(UICoverageTracker("test-service", reports_settings), "Login")

    result = runner.invoke(cli, ["save-report"])

    assert result.exit_code == 0, result.output
    for field, path in output_paths.items():
        assert path.exists() == (field not in disabled)
    if "history_file" in disabled and "json_report_file" not in disabled:
        app = read_report(reports_settings)["appsCoverage"]["test-service"]
        assert app["history"] == app["scenarios"][0]["history"] == []
        assert app["scenarios"][0]["actions"] == [{"actionType": "CLICK", "count": 1}]
