from functools import cached_property
from typing import Self

from pydantic import BaseModel, RootModel

from ui_coverage_scenario_tool.src.tools.types import AppKey, Page, PagePriority, ScenarioName


class CoveragePageResult(BaseModel):
    app: AppKey
    url: str
    page: Page
    priority: PagePriority
    scenario: ScenarioName


class CoveragePageResultList(RootModel):
    root: list[CoveragePageResult]

    def filter(self, app: AppKey | None = None) -> Self:
        results = [
            coverage
            for coverage in self.root
            if (app is None or coverage.app.lower() == app.lower())
        ]
        return CoveragePageResultList(root=results)

    @cached_property
    def unique(self) -> Self:
        results = {item.page: item for item in self.root}
        return CoveragePageResultList(root=results.values())

    def find_scenarios(self, page: Page) -> list[ScenarioName]:
        results = [result.scenario for result in self.root if result.page == page]
        return list(set(results))
