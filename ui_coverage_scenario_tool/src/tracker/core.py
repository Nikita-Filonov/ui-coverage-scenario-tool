import warnings

from ui_coverage_scenario_tool.config import Settings, get_settings
from ui_coverage_scenario_tool.src.tools.actions import ActionType
from ui_coverage_scenario_tool.src.tools.logger import get_logger
from ui_coverage_scenario_tool.src.tools.selector import SelectorType
from ui_coverage_scenario_tool.src.tools.types import Selector, AppKey, ScenarioName, Page, PagePriority
from ui_coverage_scenario_tool.src.tracker.models.elements import CoverageElementResult
from ui_coverage_scenario_tool.src.tracker.models.pages import CoveragePageResult
from ui_coverage_scenario_tool.src.tracker.models.scenarios import CoverageScenarioResult
from ui_coverage_scenario_tool.src.tracker.models.transitions import CoverageTransitionResult
from ui_coverage_scenario_tool.src.tracker.storage import UICoverageTrackerStorage

logger = get_logger("UI_COVERAGE_TRACKER")


class UICoverageTracker:
    def __init__(self, app: str, settings: Settings | None = None):
        self.app = AppKey(app)
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
        warnings.warn(
            "track_coverage is deprecated, use track_element instead.",
            DeprecationWarning,
            stacklevel=2
        )

        self.track_element(
            selector=selector,
            action_type=action_type,
            selector_type=selector_type
        )

    def track_page(self, url: str, page: str, priority: int):
        if not self.scenario:
            logger.warning(
                "No active scenario. Did you forget to call start_scenario? Calling: track_page"
            )
            return

        self.storage.save_page_result(
            CoveragePageResult(
                app=self.app,
                url=url,
                page=Page(page),
                priority=PagePriority(priority),
                scenario=self.scenario.name,
            )
        )

    def track_element(
            self,
            selector: str,
            action_type: ActionType,
            selector_type: SelectorType,
    ):
        if not self.scenario:
            logger.warning(
                "No active scenario. Did you forget to call start_scenario? Calling: track_element"
            )
            return

        self.storage.save_element_result(
            CoverageElementResult(
                app=self.app,
                scenario=self.scenario.name,
                selector=Selector(selector),
                action_type=action_type,
                selector_type=selector_type
            )
        )

    def track_transition(self, from_page: str, to_page: str):
        if not self.scenario:
            logger.warning(
                "No active scenario. Did you forget to call start_scenario? Calling: track_transition"
            )
            return

        self.storage.save_transition_result(
            CoverageTransitionResult(
                app=self.app,
                to_page=Page(to_page),
                scenario=self.scenario.name,
                from_page=Page(from_page),
            )
        )
