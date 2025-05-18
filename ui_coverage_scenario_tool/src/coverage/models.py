from pydantic import BaseModel, Field, HttpUrl, ConfigDict

from ui_coverage_scenario_tool.src.history.models import ScenarioHistory, AppHistory
from ui_coverage_scenario_tool.src.tools.actions import ActionType, ActionCoverage
from ui_coverage_scenario_tool.src.tools.selector import SelectorType
from ui_coverage_scenario_tool.src.tools.types import Selector, ScenarioName, Page, PagePriority


class ScenarioCoverageStep(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    selector: Selector
    timestamp: float
    action_type: ActionType = Field(alias="actionType")
    selector_type: SelectorType = Field(alias="selectorType")


class ScenarioCoverage(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    url: HttpUrl | None = None
    name: ScenarioName
    steps: list[ScenarioCoverageStep]
    actions: list[ActionCoverage]
    history: list[ScenarioHistory]


class PageCoverageNode(BaseModel):
    url: str
    page: Page
    priority: PagePriority
    scenarios: list[ScenarioName]


class PageCoverageEdge(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    count: int
    to_page: Page = Field(alias="toPage")
    from_page: Page = Field(alias="fromPage")
    scenarios: list[ScenarioName]


class PagesCoverage(BaseModel):
    nodes: list[PageCoverageNode]
    edges: list[PageCoverageEdge]


class AppCoverage(BaseModel):
    pages: PagesCoverage
    history: list[AppHistory]
    scenarios: list[ScenarioCoverage]
