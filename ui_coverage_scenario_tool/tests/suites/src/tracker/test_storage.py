import os
from pathlib import Path

import pytest
from pydantic import ValidationError

from ui_coverage_scenario_tool.config import Settings
from ui_coverage_scenario_tool.src.tracker.models.elements import CoverageElementResult, CoverageElementResultList
from ui_coverage_scenario_tool.src.tracker.models.pages import CoveragePageResult, CoveragePageResultList
from ui_coverage_scenario_tool.src.tracker.models.scenarios import CoverageScenarioResult, CoverageScenarioResultList
from ui_coverage_scenario_tool.src.tracker.models.transitions import CoverageTransitionResult, CoverageTransitionResultList
from ui_coverage_scenario_tool.src.tracker.storage import UICoverageTrackerStorage

RESULT_TYPES = [
    ("page", CoveragePageResult(app="test-service", scenario="Login", page="login", url="/login", priority=1),
     CoveragePageResultList),
    ("element", CoverageElementResult(app="test-service", scenario="Login", selector="#submit",
                                     action_type="CLICK", selector_type="CSS"), CoverageElementResultList),
    ("scenario", CoverageScenarioResult(app="test-service", name="Login"), CoverageScenarioResultList),
    ("transition", CoverageTransitionResult(app="test-service", scenario="Login", from_page="login", to_page="home"),
     CoverageTransitionResultList),
]


@pytest.mark.parametrize("context,result,result_list", RESULT_TYPES)
def test_missing_results_return_typed_empty_list(coverage_tracker_storage, context, result, result_list):
    loaded = getattr(coverage_tracker_storage, f"load_{context}_results")()
    assert isinstance(loaded, result_list)
    assert loaded.root == []


@pytest.mark.parametrize("context,result,result_list", RESULT_TYPES)
def test_save_load_round_trip_and_file_selection(settings, context, result, result_list):
    settings.results_dir = settings.results_dir / "nested" / "results"
    storage = UICoverageTrackerStorage(settings)
    save = getattr(storage, f"save_{context}_result")
    save(result)
    save(result)
    (settings.results_dir / "unrelated.json").write_text("invalid json")
    (settings.results_dir / f"directory-{context}.json").mkdir()
    for other, other_result, _ in RESULT_TYPES:
        if other != context:
            getattr(storage, f"save_{other}_result")(other_result)

    loaded = getattr(storage, f"load_{context}_results")()
    assert isinstance(loaded, result_list)
    assert loaded.root == [result, result]
    assert len([f for f in settings.results_dir.glob(f"*-{context}.json") if f.is_file()]) == 2


@pytest.mark.parametrize("context,result,result_list", RESULT_TYPES)
def test_load_rejects_invalid_result_json(settings, context, result, result_list):
    settings.results_dir.mkdir()
    (settings.results_dir / f"broken-{context}.json").write_text("invalid json")
    with pytest.raises(ValidationError):
        getattr(UICoverageTrackerStorage(settings), f"load_{context}_results")()


def test_save_logs_write_error(settings, monkeypatch, caplog):
    def fail_write(self, *args, **kwargs):
        raise OSError("disk full")

    monkeypatch.setattr(Path, "write_text", fail_write)
    UICoverageTrackerStorage(settings).save_scenario_result(RESULT_TYPES[2][1])
    assert any("Error saving scenario coverage data" in m and "disk full" in m for m in caplog.messages)


def test_clear_missing_directory_is_noop(coverage_tracker_storage):
    coverage_tracker_storage.clear()
    assert not coverage_tracker_storage.settings.results_dir.exists()


def test_clear_only_removes_result_files(settings: Settings, caplog):
    storage = UICoverageTrackerStorage(settings)
    for context, result, _ in RESULT_TYPES:
        getattr(storage, f"save_{context}_result")(result)
    unrelated = settings.results_dir / "config.json"
    unrelated.write_text("keep")
    text = settings.results_dir / "notes.txt"
    text.write_text("keep")
    directory = settings.results_dir / "directory-page.json"
    directory.mkdir()
    nested = directory / "nested-element.json"
    nested.write_text("keep")

    storage.clear()
    storage.clear()

    assert unrelated.read_text() == text.read_text() == nested.read_text() == "keep"
    assert set(settings.results_dir.iterdir()) == {unrelated, text, directory}
    assert any("Removed 4 coverage files" in message for message in caplog.messages)


def test_clear_preserves_reports_history_and_symlinks_to_them(settings: Settings):
    settings.results_dir.mkdir()
    settings.history_file = settings.results_dir / "history-scenario.json"
    settings.json_report_file = settings.results_dir / "report-page.json"
    settings.html_report_file = settings.results_dir / "report-element.json"
    protected = [settings.history_file, settings.json_report_file, settings.html_report_file]
    for path in protected:
        path.write_text("keep")
    link = settings.results_dir / "link-transition.json"
    link.symlink_to(settings.history_file)
    result_file = settings.results_dir / "collected-element.json"
    result_file.write_text("remove")

    UICoverageTrackerStorage(settings).clear()

    assert not result_file.exists()
    assert all(path.read_text() == "keep" for path in protected)
    assert link.is_symlink()


def test_clear_rejects_non_directory(settings: Settings):
    settings.results_dir.write_text("keep")
    with pytest.raises(NotADirectoryError, match="Results path is not a directory"):
        UICoverageTrackerStorage(settings).clear()
    assert settings.results_dir.read_text() == "keep"


def test_clear_propagates_deletion_error(settings: Settings, monkeypatch):
    settings.results_dir.mkdir()
    result_file = settings.results_dir / "collected-element.json"
    result_file.write_text("keep")

    def fail_unlink(self):
        raise PermissionError("permission denied")

    monkeypatch.setattr(Path, "unlink", fail_unlink)
    with pytest.raises(OSError, match="Failed to remove coverage file.*permission denied"):
        UICoverageTrackerStorage(settings).clear()
    assert result_file.read_text() == "keep"


@pytest.mark.skipif(os.name == "nt" or os.geteuid() == 0, reason="Requires POSIX permissions without root")
def test_clear_reports_unreadable_results_directory(settings: Settings):
    settings.results_dir.mkdir()
    result_file = settings.results_dir / "collected-element.json"
    result_file.write_text("keep")
    settings.results_dir.chmod(0o000)
    try:
        with pytest.raises(PermissionError):
            UICoverageTrackerStorage(settings).clear()
    finally:
        settings.results_dir.chmod(0o700)
    assert result_file.read_text() == "keep"
