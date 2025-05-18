from typing import Self

from pydantic import HttpUrl, BaseModel, RootModel

from ui_coverage_scenario_tool.src.tools.types import AppKey, ScenarioName


class CoverageScenarioResult(BaseModel):
    app: AppKey
    url: HttpUrl | None = None
    name: ScenarioName


class CoverageScenarioResultList(RootModel):
    root: list[CoverageScenarioResult]

    def filter(self, app: AppKey | None = None) -> Self:
        results = [
            coverage
            for coverage in self.root
            if (app is None or coverage.app.lower() == app.lower())
        ]
        return CoverageScenarioResultList(root=results)
