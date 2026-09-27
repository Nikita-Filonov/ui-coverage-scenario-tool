import json
from pathlib import Path

from ui_coverage_scenario_tool.src.history.models import AppHistoryState, CoverageHistoryState
from ui_coverage_scenario_tool.src.history.storage import UICoverageHistoryStorage


def test_missing_history_returns_empty(settings):
    assert UICoverageHistoryStorage(settings).load().apps == {}


def test_disabled_history_load_and_save(settings, caplog):
    settings.history_file = None
    storage = UICoverageHistoryStorage(settings)
    assert storage.load().apps == {}
    storage.save(CoverageHistoryState())
    assert any("skipping history save" in m for m in caplog.messages)


def test_save_load_round_trip(settings):
    storage = UICoverageHistoryStorage(settings)
    state = CoverageHistoryState(apps={"test-service": AppHistoryState()})
    storage.save(state)
    assert storage.load() == state
    assert json.loads(settings.history_file.read_text()) == {
        "apps": {"test-service": {"total": [], "scenarios": {}}}
    }


def test_invalid_history_returns_empty(settings, caplog):
    settings.history_file.write_text("{ invalid }")
    assert UICoverageHistoryStorage(settings).load().apps == {}
    assert any("Error loading history" in m for m in caplog.messages)


def test_history_read_error_returns_empty(settings, monkeypatch, caplog):
    settings.history_file.touch()

    def fail_read(self, *args, **kwargs):
        raise PermissionError("permission denied")

    monkeypatch.setattr(Path, "read_text", fail_read)
    assert UICoverageHistoryStorage(settings).load().apps == {}
    assert any("permission denied" in m for m in caplog.messages)


def test_history_write_error_is_logged(settings, monkeypatch, caplog):
    def fail_write(self, *args, **kwargs):
        raise OSError("disk full")

    monkeypatch.setattr(Path, "write_text", fail_write)
    UICoverageHistoryStorage(settings).save(CoverageHistoryState())
    assert any("Error saving history" in m and "disk full" in m for m in caplog.messages)


def test_save_from_report_preserves_app_and_scenario_histories(settings, coverage_report_state):
    storage = UICoverageHistoryStorage(settings)
    storage.save_from_report(coverage_report_state)
    state = storage.load().apps["test-service"]
    app = coverage_report_state.apps_coverage["test-service"]
    assert state.total == app.history
    assert state.scenarios == {scenario.name: scenario.history for scenario in app.scenarios}
    data = json.loads(settings.history_file.read_text())["apps"]["test-service"]
    assert data["total"][0]["totalActions"] == 3
    assert data["scenarios"]["Login"][0]["actions"][0]["actionType"] == "CLICK"


def test_history_states_have_independent_defaults():
    first, second = CoverageHistoryState(), CoverageHistoryState()
    first.apps["app"] = AppHistoryState()
    assert second.apps == {}
    another = AppHistoryState()
    first.apps["app"].scenarios["Login"] = []
    assert another.scenarios == {}
