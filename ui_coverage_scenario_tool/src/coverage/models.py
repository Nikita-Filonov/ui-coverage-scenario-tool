from pydantic import BaseModel, Field, HttpUrl, ConfigDict

from ui_coverage_scenario_tool.src.history.models import ScenarioHistory, AppHistory
from ui_coverage_scenario_tool.src.tools.actions import ActionType, ActionCoverage
from ui_coverage_scenario_tool.src.tools.selector import SelectorType
from ui_coverage_scenario_tool.src.tools.types import Selector, ScenarioName


# class ActionCoverage(BaseModel):
#     type: ActionType
#     count: int
#
#
# class ElementCoverage(BaseModel):
#     model_config = ConfigDict(populate_by_name=True)
#
#     history: list[ElementHistory]
#     actions: list[ActionCoverage]
#     selector: Selector
#     scenarios: list[UUID4]
#     selector_type: SelectorType = Field(alias="selectorType")


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


class AppCoverage(BaseModel):
    history: list[AppHistory]
    scenarios: list[ScenarioCoverage]
