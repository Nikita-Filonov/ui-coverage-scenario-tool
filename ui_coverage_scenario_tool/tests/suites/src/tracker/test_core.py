import pytest

from ui_coverage_scenario_tool import ActionType, SelectorType, UICoverageTracker
from ui_coverage_scenario_tool.config import Settings
from ui_coverage_scenario_tool.src.tracker.models.scenarios import CoverageScenarioResult


def test_tracker_uses_resolved_settings(settings: Settings, monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setattr("ui_coverage_scenario_tool.src.tracker.core.get_settings", lambda: settings)
    assert UICoverageTracker("test-service").settings is settings


def test_scenario_lifecycle_saves_all_result_types(settings: Settings):
    tracker = UICoverageTracker("test-service", settings)
    tracker.start_scenario("https://example.com/cases/1", "Login")
    tracker.track_page("/login", "login", 1)
    tracker.track_element("#submit", ActionType.CLICK, SelectorType.CSS)
    tracker.track_transition("login", "home")
    tracker.end_scenario()

    storage = tracker.storage
    assert tracker.scenario is None
    assert storage.load_scenario_results().root == [
        CoverageScenarioResult(app="test-service", name="Login", url="https://example.com/cases/1")
    ]
    page = storage.load_page_results().root[0]
    assert (page.app, page.scenario, page.page, page.url, page.priority) == (
        "test-service", "Login", "login", "/login", 1
    )
    element = storage.load_element_results().root[0]
    assert (element.app, element.scenario, element.selector, element.action_type, element.selector_type) == (
        "test-service", "Login", "#submit", ActionType.CLICK, SelectorType.CSS
    )
    transition = storage.load_transition_results().root[0]
    assert (transition.app, transition.scenario, transition.from_page, transition.to_page) == (
        "test-service", "Login", "login", "home"
    )


@pytest.mark.parametrize("method,args", [
    ("track_page", ("/login", "login", 1)),
    ("track_element", ("#submit", ActionType.CLICK, SelectorType.CSS)),
    ("track_transition", ("login", "home")),
])
def test_tracking_without_active_scenario_is_ignored(settings: Settings, caplog, method, args):
    tracker = UICoverageTracker("test-service", settings)
    getattr(tracker, method)(*args)
    assert not settings.results_dir.exists()
    assert any("No active scenario" in message and method in message for message in caplog.messages)


def test_ending_inactive_scenario_does_not_save(settings: Settings):
    tracker = UICoverageTracker("test-service", settings)
    tracker.end_scenario()
    assert tracker.scenario is None
    assert not settings.results_dir.exists()


def test_scenarios_do_not_mix(settings: Settings):
    tracker = UICoverageTracker("test-service", settings)
    for name in ["Login", "Search"]:
        tracker.start_scenario(None, name)
        tracker.track_element("#submit", ActionType.CLICK, SelectorType.CSS)
        tracker.end_scenario()
    tracker.end_scenario()
    assert {r.name for r in tracker.storage.load_scenario_results().root} == {"Login", "Search"}
    assert {r.scenario for r in tracker.storage.load_element_results().root} == {"Login", "Search"}
    assert len(tracker.storage.load_scenario_results().root) == 2


def test_deprecated_track_coverage_delegates(settings: Settings):
    tracker = UICoverageTracker("test-service", settings)
    tracker.start_scenario(None, "Login")
    with pytest.warns(DeprecationWarning, match="use track_element"):
        tracker.track_coverage("#submit", ActionType.CLICK, SelectorType.CSS)
    assert tracker.storage.load_element_results().root[0].scenario == "Login"
