from collections import Counter
from functools import cached_property
from typing import Self

from pydantic import BaseModel, RootModel

from ui_coverage_scenario_tool.src.tools.types import AppKey, Page, ScenarioName


class CoverageTransitionResult(BaseModel):
    app: AppKey
    to_page: Page
    scenario: ScenarioName
    from_page: Page


class CoverageTransitionResultList(RootModel):
    root: list[CoverageTransitionResult]

    def filter(self, app: AppKey | None = None) -> Self:
        results = [
            coverage
            for coverage in self.root
            if (app is None or coverage.app.lower() == app.lower())
        ]
        return CoverageTransitionResultList(root=results)

    @cached_property
    def unique(self) -> Self:
        results = {(result.to_page, result.from_page): result for result in self.root}
        return CoverageTransitionResultList(root=results.values())

    def find_scenarios(self, to_page: Page, from_page: Page) -> list[ScenarioName]:
        results = [
            result.scenario for result in self.root
            if (result.to_page == to_page) and (result.from_page == from_page)
        ]
        return list(set(results))

    def count_transitions(self, to_page: Page, from_page: Page) -> int:
        counter = Counter((result.to_page, result.from_page) for result in self.root)
        return counter.get((to_page, from_page), 0)
