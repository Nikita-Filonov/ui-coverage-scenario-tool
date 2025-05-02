from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict

from ui_coverage_scenario_tool.src.tools.actions import ActionType
from ui_coverage_scenario_tool.src.tools.types import AppKey, ScenarioName


class ActionHistory(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    count: int
    action_type: ActionType = Field(alias="actionType")


class ScenarioHistory(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    actions: list[ActionHistory]
    created_at: datetime = Field(alias="createdAt")


class AppHistory(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    actions: list[ActionHistory]
    created_at: datetime = Field(alias="createdAt")
    total_actions: int = Field(alias="totalActions")
    total_elements: int = Field(alias="totalElements")


class AppHistoryState(BaseModel):
    total: list[AppHistory] = Field(default_factory=list)
    scenarios: dict[ScenarioName, list[ScenarioHistory]] = Field(default_factory=dict)


class CoverageHistoryState(BaseModel):
    apps: dict[AppKey, AppHistoryState] = Field(default_factory=dict)
