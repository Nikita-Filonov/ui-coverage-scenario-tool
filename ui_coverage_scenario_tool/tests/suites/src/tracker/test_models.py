import pytest
from pydantic import ValidationError

from ui_coverage_scenario_tool.src.tools.actions import ActionType
from ui_coverage_scenario_tool.src.tools.selector import SelectorType
from ui_coverage_scenario_tool.src.tracker.models.elements import CoverageElementResult, CoverageElementResultList
from ui_coverage_scenario_tool.src.tracker.models.pages import CoveragePageResultList
from ui_coverage_scenario_tool.src.tracker.models.scenarios import CoverageScenarioResult, CoverageScenarioResultList
from ui_coverage_scenario_tool.src.tracker.models.transitions import CoverageTransitionResultList


@pytest.mark.parametrize("app,scenario,count", [
    (None, None, 4), ("TEST-SERVICE", None, 3), (None, "LOGIN", 3),
    ("test-service", "login", 2), ("missing", None, 0), (None, "missing", 0),
])
def test_element_filter(element_results: CoverageElementResultList, app, scenario, count):
    filtered = element_results.filter(app=app, scenario=scenario)
    assert len(filtered.root) == count
    assert len(element_results.root) == 4


def test_element_groups_and_counts(element_results: CoverageElementResultList):
    results = element_results.filter(app="test-service")
    assert results.total_actions == 3
    assert results.total_selectors == 2
    assert results.grouped_by_action[ActionType.CLICK].total_actions == 2
    assert results.grouped_by_action[ActionType.VISIBLE].total_actions == 1
    assert results.grouped_by_selector[("#submit", SelectorType.CSS)].total_actions == 2
    assert results.grouped_by_selector[("#submit", SelectorType.XPATH)].total_actions == 1
    assert results.count_actions(ActionType.CLICK) == 2
    assert results.count_actions(ActionType.FILL) == 0


def test_page_filter_uniqueness_and_scenarios(page_results: CoveragePageResultList):
    results = page_results.filter(app="TEST-SERVICE")
    assert len(page_results.filter().root) == 4
    assert len(page_results.filter(app="missing").root) == 0
    assert len(results.root) == 3
    assert {page.page for page in results.unique.root} == {"login", "home"}
    assert set(results.find_scenarios("home")) == {"Login", "Search"}
    assert results.find_scenarios("missing") == []


def test_scenario_filter(scenario_results: CoverageScenarioResultList):
    assert len(scenario_results.filter().root) == 3
    assert [s.name for s in scenario_results.filter(app="TEST-SERVICE").root] == ["Login", "Search"]
    assert scenario_results.filter(app="missing").root == []


def test_transition_direction_uniqueness_and_counts(transition_results: CoverageTransitionResultList):
    results = transition_results.filter(app="TEST-SERVICE")
    assert len(transition_results.filter().root) == 5
    assert transition_results.filter(app="missing").root == []
    assert len(results.unique.root) == 2
    assert results.count_transitions(to_page="home", from_page="login") == 3
    assert results.count_transitions(to_page="login", from_page="home") == 1
    assert results.count_transitions(to_page="missing", from_page="home") == 0
    assert set(results.find_scenarios(to_page="home", from_page="login")) == {"Login", "Search"}
    assert results.find_scenarios(to_page="missing", from_page="home") == []


def test_empty_element_results():
    results = CoverageElementResultList(root=[])
    assert results.total_actions == results.total_selectors == 0
    assert results.grouped_by_action == results.grouped_by_selector == {}
    assert results.count_actions(ActionType.CLICK) == 0


def test_models_validate_and_round_trip():
    result = CoverageElementResult(app="app", scenario="Login", selector="#submit",
                                   action_type="CLICK", selector_type="CSS")
    assert result.timestamp > 0
    assert CoverageElementResult.model_validate_json(result.model_dump_json()) == result
    assert CoverageScenarioResult(app="app", name="Login").url is None
    with pytest.raises(ValidationError):
        CoverageScenarioResult(app="app", name="Login", url="invalid")
    with pytest.raises(ValidationError):
        CoverageElementResult(app="app", scenario="Login", selector="#submit",
                              action_type="INVALID", selector_type="CSS")
