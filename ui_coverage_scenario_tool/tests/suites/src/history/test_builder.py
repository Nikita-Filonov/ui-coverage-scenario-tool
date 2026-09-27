from datetime import datetime, timedelta

from ui_coverage_scenario_tool.src.history.builder import UICoverageHistoryBuilder
from ui_coverage_scenario_tool.src.history.models import ActionHistory, AppHistory, AppHistoryState, ScenarioHistory
from ui_coverage_scenario_tool.src.tools.actions import ActionType


def test_build_histories_share_run_timestamp(settings):
    builder = UICoverageHistoryBuilder(AppHistoryState(), settings)
    actions = [ActionHistory(action_type=ActionType.CLICK, count=3)]
    app = builder.build_app_history(actions, total_actions=3, total_elements=2)
    scenario = builder.build_scenario_history(actions)
    assert isinstance(app, AppHistory)
    assert isinstance(scenario, ScenarioHistory)
    assert app.total_actions == 3
    assert app.total_elements == 2
    assert app.actions == scenario.actions == actions
    assert app.created_at == scenario.created_at == builder.created_at


def test_append_sorts_and_limits_history_without_changing_original(settings):
    builder = UICoverageHistoryBuilder(AppHistoryState(), settings)
    actions = [ActionHistory(action_type="CLICK", count=1)]
    previous = [
        ScenarioHistory(created_at=builder.created_at - timedelta(days=day), actions=actions)
        for day in [1, 4, 2, 3]
    ]
    original = list(previous)
    result = builder.append_history(previous, lambda: builder.build_scenario_history(actions))
    assert previous == original
    assert len(result) == settings.history_retention_limit
    assert [item.created_at for item in result] == [
        builder.created_at - timedelta(days=2), builder.created_at - timedelta(days=1), builder.created_at
    ]


def test_append_skips_empty_actions(settings):
    old = ScenarioHistory(created_at=datetime.now(), actions=[ActionHistory(action_type="CLICK", count=1)])
    history = [old]
    builder = UICoverageHistoryBuilder(AppHistoryState(), settings)
    assert builder.append_history(history, lambda: builder.build_scenario_history([])) == history


def test_disabled_history_does_not_build_entry(settings):
    settings.history_file = None
    builder = UICoverageHistoryBuilder(AppHistoryState(), settings)

    def unexpected_build():
        raise AssertionError("History is disabled")

    assert builder.append_history([], unexpected_build) == []


def test_app_history_uses_existing_entries(settings):
    old = AppHistory(created_at=datetime.now() - timedelta(days=1),
                     actions=[ActionHistory(action_type="CLICK", count=1)], total_actions=1, total_elements=1)
    builder = UICoverageHistoryBuilder(AppHistoryState(total=[old]), settings)
    history = builder.get_app_history([ActionHistory(action_type="CLICK", count=2)], 2, 1)
    assert history[0] == old
    assert history[-1].total_actions == 2
    assert builder.history.total == [old]


def test_scenario_history_is_separate_by_name(settings):
    old = ScenarioHistory(created_at=datetime.now() - timedelta(days=1),
                          actions=[ActionHistory(action_type="HOVER", count=1)])
    builder = UICoverageHistoryBuilder(AppHistoryState(scenarios={"Login": [old]}), settings)
    actions = [ActionHistory(action_type="CLICK", count=2)]
    login = builder.get_scenario_history("Login", actions)
    search = builder.get_scenario_history("Search", actions)
    assert login == [old, search[0]]
    assert len(search) == 1
    assert builder.history.scenarios == {"Login": [old]}
