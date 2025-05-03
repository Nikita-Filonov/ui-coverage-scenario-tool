from ui_coverage_scenario_tool.config import Settings, get_settings
from ui_coverage_scenario_tool.src.tools.actions import ActionType
from ui_coverage_scenario_tool.src.tools.logger import get_logger
from ui_coverage_scenario_tool.src.tools.selector import SelectorType
from ui_coverage_scenario_tool.src.tools.types import Selector, AppKey, ScenarioName
from ui_coverage_scenario_tool.src.tracker.models import (
    CoverageElementResult,
    CoverageScenarioResult
)
from ui_coverage_scenario_tool.src.tracker.storage import UICoverageTrackerStorage

logger = get_logger("UI_COVERAGE_TRACKER")


class UICoverageTracker:
    def __init__(self, app: str, settings: Settings | None = None):
        self.app = app
        self.settings = settings or get_settings()

        self.storage = UICoverageTrackerStorage(self.settings)
        self.scenario: CoverageScenarioResult | None = None

    def start_scenario(self, url: str | None, name: str):
        self.scenario = CoverageScenarioResult(
            url=url,
            app=AppKey(self.app),
            name=ScenarioName(name)
        )

    def end_scenario(self):
        if self.scenario:
            self.storage.save_scenario_result(self.scenario)

        self.scenario = None

    def track_coverage(
            self,
            selector: str,
            action_type: ActionType,
            selector_type: SelectorType,
    ):
        if not self.scenario:
            logger.warning("No active scenario. Did you forget to call start_scenario?")
            return

        self.storage.save_element_result(
            CoverageElementResult(
                app=AppKey(self.app),
                scenario=self.scenario.name,
                selector=Selector(selector),
                action_type=action_type,
                selector_type=selector_type
            )
        )
