from ui_coverage_scenario_tool.src.history.builder import UICoverageHistoryBuilder
from ui_coverage_scenario_tool.src.history.models import AppHistoryState
from ui_coverage_scenario_tool.src.tools.actions import ActionType
from ui_coverage_scenario_tool.src.tools.selector import SelectorType
from ui_coverage_scenario_tool.src.tracker.models.elements import CoverageElementResultList
from ui_coverage_scenario_tool.src.tracker.models.pages import CoveragePageResultList
from ui_coverage_scenario_tool.src.tracker.models.scenarios import CoverageScenarioResult
from ui_coverage_scenario_tool.src.tracker.models.transitions import CoverageTransitionResultList


def test_pages_coverage_builds_unique_nodes_and_directed_edges(coverage_builder):
    pages = coverage_builder.build_pages_coverage()
    nodes = {node.page: node for node in pages.nodes}
    assert set(nodes) == {"login", "home"}
    assert nodes["login"].url == "/login"
    assert nodes["login"].priority == 1
    assert set(nodes["home"].scenarios) == {"Login", "Search"}
    edges = {(edge.from_page, edge.to_page): edge for edge in pages.edges}
    assert set(edges) == {("login", "home"), ("home", "login")}
    assert edges[("login", "home")].count == 3
    assert set(edges[("login", "home")].scenarios) == {"Login", "Search"}
    assert edges[("home", "login")].count == 1


def test_scenario_coverage_filters_steps_and_aggregates_actions(coverage_builder):
    scenario = coverage_builder.build_scenario_coverage(coverage_builder.scenario_result_list.root[0])
    assert scenario.name == "Login"
    assert str(scenario.url) == "https://example.com/cases/1"
    assert [(step.timestamp, step.action_type, step.selector_type) for step in scenario.steps] == [
        (1, ActionType.CLICK, SelectorType.CSS), (2, ActionType.VISIBLE, SelectorType.CSS),
    ]
    assert {action.action_type: action.count for action in scenario.actions} == {
        ActionType.CLICK: 1, ActionType.VISIBLE: 1
    }
    assert len(scenario.history) == 1
    assert [a.model_dump() for a in scenario.history[0].actions] == [a.model_dump() for a in scenario.actions]


def test_scenario_with_no_actions_has_no_history(coverage_builder):
    scenario = coverage_builder.build_scenario_coverage(CoverageScenarioResult(app="test-service", name="Empty"))
    assert scenario.steps == scenario.actions == scenario.history == []
    assert scenario.url is None


def test_app_coverage_aggregates_all_scenarios(coverage_builder):
    app = coverage_builder.build()
    assert [scenario.name for scenario in app.scenarios] == ["Login", "Search"]
    assert app.history[-1].total_actions == 3
    assert app.history[-1].total_elements == 2
    assert {action.action_type: action.count for action in app.history[-1].actions} == {
        ActionType.CLICK: 2, ActionType.VISIBLE: 1
    }
    assert all(s.history[-1].created_at == app.history[-1].created_at for s in app.scenarios)


def test_empty_app_builds_empty_coverage(coverage_builder):
    coverage_builder.page_result_list = CoveragePageResultList(root=[])
    coverage_builder.element_result_list = CoverageElementResultList(root=[])
    coverage_builder.scenario_result_list = coverage_builder.scenario_result_list.filter(app="missing")
    coverage_builder.transition_result_list = CoverageTransitionResultList(root=[])
    assert coverage_builder.build().model_dump(by_alias=True) == {
        "pages": {"nodes": [], "edges": []}, "scenarios": [], "history": []
    }


def test_disabled_history_keeps_scenario_actions(settings, coverage_builder):
    settings.history_file = None
    coverage_builder.history_builder = UICoverageHistoryBuilder(AppHistoryState(), settings)
    app = coverage_builder.build()
    assert app.history == []
    assert app.scenarios[0].history == []
    assert app.scenarios[0].actions
