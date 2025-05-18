import time
from collections import Counter
from functools import cached_property
from itertools import groupby
from typing import Self

from pydantic import BaseModel, RootModel, Field

from ui_coverage_scenario_tool.src.tools.actions import ActionType
from ui_coverage_scenario_tool.src.tools.selector import SelectorType
from ui_coverage_scenario_tool.src.tools.types import Selector, AppKey, ScenarioName

SelectorGroupKey = tuple[Selector, SelectorType]


class CoverageElementResult(BaseModel):
    app: AppKey
    selector: Selector
    scenario: ScenarioName
    timestamp: float = Field(default_factory=time.time)
    action_type: ActionType
    selector_type: SelectorType


class CoverageElementResultList(RootModel):
    root: list[CoverageElementResult]

    def filter(
            self,
            app: AppKey | None = None,
            scenario: ScenarioName | None = None
    ) -> Self:
        results = [
            coverage
            for coverage in self.root
            if (app is None or coverage.app.lower() == app.lower()) and
               (scenario is None or coverage.scenario.lower() == scenario.lower())
        ]
        return CoverageElementResultList(root=results)

    @cached_property
    def grouped_by_action(self) -> dict[ActionType, Self]:
        results = sorted(self.root, key=lambda r: r.action_type)
        return {
            grouper: CoverageElementResultList(root=results)
            for grouper, results in groupby(results, key=lambda r: r.action_type)
        }

    @cached_property
    def grouped_by_selector(self) -> dict[SelectorGroupKey, Self]:
        results = sorted(self.root, key=lambda r: (r.selector, r.selector_type))
        return {
            grouper: CoverageElementResultList(root=results)
            for grouper, results in groupby(results, key=lambda r: (r.selector, r.selector_type))
        }

    @property
    def total_actions(self) -> int:
        return len(self.root)

    @property
    def total_selectors(self) -> int:
        return len(self.grouped_by_selector)

    def count_actions(self, action_type: ActionType) -> int:
        counter = Counter(result.action_type for result in self.root)
        return counter.get(action_type, 0)
