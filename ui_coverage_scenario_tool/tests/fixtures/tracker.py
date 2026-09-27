import pytest

from ui_coverage_scenario_tool.config import Settings
from ui_coverage_scenario_tool.src.tools.actions import ActionType
from ui_coverage_scenario_tool.src.tools.selector import SelectorType
from ui_coverage_scenario_tool.src.tracker.models.elements import CoverageElementResult, CoverageElementResultList
from ui_coverage_scenario_tool.src.tracker.models.pages import CoveragePageResult, CoveragePageResultList
from ui_coverage_scenario_tool.src.tracker.models.scenarios import CoverageScenarioResult, CoverageScenarioResultList
from ui_coverage_scenario_tool.src.tracker.models.transitions import CoverageTransitionResult, CoverageTransitionResultList
from ui_coverage_scenario_tool.src.tracker.storage import UICoverageTrackerStorage


@pytest.fixture
def element_results() -> CoverageElementResultList:
    return CoverageElementResultList(root=[
        CoverageElementResult(app="test-service", scenario="Login", selector="#submit", timestamp=1,
                              action_type=ActionType.CLICK, selector_type=SelectorType.CSS),
        CoverageElementResult(app="test-service", scenario="Login", selector="#submit", timestamp=2,
                              action_type=ActionType.VISIBLE, selector_type=SelectorType.CSS),
        CoverageElementResult(app="test-service", scenario="Search", selector="#submit", timestamp=3,
                              action_type=ActionType.CLICK, selector_type=SelectorType.XPATH),
        CoverageElementResult(app="other-app", scenario="Login", selector="#submit", timestamp=4,
                              action_type=ActionType.CLICK, selector_type=SelectorType.CSS),
    ])


@pytest.fixture
def page_results() -> CoveragePageResultList:
    return CoveragePageResultList(root=[
        CoveragePageResult(app="test-service", scenario="Login", page="login", url="/login", priority=1),
        CoveragePageResult(app="test-service", scenario="Login", page="home", url="/home", priority=2),
        CoveragePageResult(app="test-service", scenario="Search", page="home", url="/home", priority=2),
        CoveragePageResult(app="other-app", scenario="Login", page="other", url="/other", priority=3),
    ])


@pytest.fixture
def scenario_results() -> CoverageScenarioResultList:
    return CoverageScenarioResultList(root=[
        CoverageScenarioResult(app="test-service", name="Login", url="https://example.com/cases/1"),
        CoverageScenarioResult(app="test-service", name="Search"),
        CoverageScenarioResult(app="other-app", name="Login"),
    ])


@pytest.fixture
def transition_results() -> CoverageTransitionResultList:
    return CoverageTransitionResultList(root=[
        CoverageTransitionResult(app="test-service", scenario="Login", from_page="login", to_page="home"),
        CoverageTransitionResult(app="test-service", scenario="Login", from_page="login", to_page="home"),
        CoverageTransitionResult(app="test-service", scenario="Search", from_page="login", to_page="home"),
        CoverageTransitionResult(app="test-service", scenario="Search", from_page="home", to_page="login"),
        CoverageTransitionResult(app="other-app", scenario="Login", from_page="other", to_page="home"),
    ])


@pytest.fixture
def coverage_tracker_storage(settings: Settings) -> UICoverageTrackerStorage:
    return UICoverageTrackerStorage(settings)
