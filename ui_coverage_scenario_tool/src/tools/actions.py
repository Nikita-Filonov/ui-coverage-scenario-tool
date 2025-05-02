from enum import Enum
from typing import Self

from pydantic import BaseModel, ConfigDict, Field


class ActionType(str, Enum):
    FILL = "FILL"
    TYPE = "TYPE"
    TEXT = "TEXT"
    VALUE = "VALUE"
    CLICK = "CLICK"
    HOVER = "HOVER"
    SELECT = "SELECT"
    HIDDEN = "HIDDEN"
    VISIBLE = "VISIBLE"
    CHECKED = "CHECKED"
    ENABLED = "ENABLED"
    DISABLED = "DISABLED"
    UNCHECKED = "UNCHECKED"

    @classmethod
    def to_list(cls) -> list[Self]:
        return list(cls)


class ActionCoverage(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    count: int
    action_type: ActionType = Field(alias="actionType")
