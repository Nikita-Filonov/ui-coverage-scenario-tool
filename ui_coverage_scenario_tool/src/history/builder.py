from datetime import datetime
from typing import TypeVar, Callable

from ui_coverage_scenario_tool.config import Settings
from ui_coverage_scenario_tool.src.history.models import ScenarioHistory, AppHistoryState, ActionHistory, AppHistory
from ui_coverage_scenario_tool.src.tools.types import ScenarioName

T = TypeVar('T')


class UICoverageHistoryBuilder:
    def __init__(self, history: AppHistoryState, settings: Settings):
        self.history = history
        self.settings = settings
        self.created_at = datetime.now()

    def build_app_history(
            self,
            actions: list[ActionHistory],
            total_actions: int,
            total_elements: int
    ) -> AppHistory:
        return AppHistory(
            actions=actions,
            created_at=self.created_at,
            total_actions=total_actions,
            total_elements=total_elements
        )

    def build_scenario_history(self, actions: list[ActionHistory]) -> ScenarioHistory:
        return ScenarioHistory(created_at=self.created_at, actions=actions)

    def append_history(self, history: list[T], build_func: Callable[[], T]) -> list[T]:
        if not self.settings.history_file:
            return []

        new_item = build_func()
        if not new_item.actions:
            return history

        combined = [*history, new_item]
        combined.sort(key=lambda r: r.created_at)
        return combined[-self.settings.history_retention_limit:]

    def get_app_history(
            self,
            actions: list[ActionHistory],
            total_actions: int,
            total_elements: int
    ) -> list[AppHistory]:
        return self.append_history(
            self.history.total,
            lambda: self.build_app_history(
                actions=actions,
                total_actions=total_actions,
                total_elements=total_elements
            )
        )

    def get_scenario_history(self, name: ScenarioName, actions: list[ActionHistory]) -> list[ScenarioHistory]:
        history = self.history.scenarios.get(name, [])
        return self.append_history(history, lambda: self.build_scenario_history(actions))
