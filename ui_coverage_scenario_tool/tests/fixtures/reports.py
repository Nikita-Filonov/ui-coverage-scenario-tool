import pytest

from ui_coverage_scenario_tool.config import Settings
from ui_coverage_scenario_tool.src.coverage.builder import UICoverageBuilder
from ui_coverage_scenario_tool.src.history.builder import UICoverageHistoryBuilder
from ui_coverage_scenario_tool.src.history.models import AppHistoryState
from ui_coverage_scenario_tool.src.reports.models import CoverageReportState
from ui_coverage_scenario_tool.src.reports.storage import UIReportsStorage
from ui_coverage_scenario_tool.src.tracker.models.elements import CoverageElementResultList
from ui_coverage_scenario_tool.src.tracker.models.pages import CoveragePageResultList
from ui_coverage_scenario_tool.src.tracker.models.scenarios import CoverageScenarioResultList
from ui_coverage_scenario_tool.src.tracker.models.transitions import CoverageTransitionResultList


@pytest.fixture
def coverage_builder(settings: Settings, element_results: CoverageElementResultList,
                     page_results: CoveragePageResultList, scenario_results: CoverageScenarioResultList,
                     transition_results: CoverageTransitionResultList) -> UICoverageBuilder:
    app = settings.apps[0].key
    return UICoverageBuilder(
        history_builder=UICoverageHistoryBuilder(AppHistoryState(), settings),
        page_result_list=page_results.filter(app=app),
        element_result_list=element_results.filter(app=app),
        scenario_result_list=scenario_results.filter(app=app),
        transition_result_list=transition_results.filter(app=app),
    )


@pytest.fixture
def coverage_report_state(settings: Settings, coverage_builder: UICoverageBuilder) -> CoverageReportState:
    report = CoverageReportState.init(settings)
    report.apps_coverage[settings.apps[0].key] = coverage_builder.build()
    return report


@pytest.fixture
def reports_storage(reports_settings: Settings) -> UIReportsStorage:
    return UIReportsStorage(reports_settings)
