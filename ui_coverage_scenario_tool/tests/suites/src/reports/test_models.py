from datetime import datetime

from ui_coverage_scenario_tool.config import Settings
from ui_coverage_scenario_tool.src.reports.models import CoverageReportState


def test_report_init_uses_config(settings):
    state = CoverageReportState.init(settings)
    assert state.config.apps == settings.apps
    assert state.apps_coverage == {}
    assert isinstance(state.created_at, datetime)


def test_report_init_allows_empty_apps():
    state = CoverageReportState.init(Settings(apps=[]))
    assert state.config.apps == []
    assert state.apps_coverage == {}


def test_report_defaults_are_independent(settings):
    first, second = CoverageReportState.init(settings), CoverageReportState.init(settings)
    first.apps_coverage["unused"] = None
    assert second.apps_coverage == {}


def test_report_serialization_uses_frontend_aliases(coverage_report_state):
    data = coverage_report_state.model_dump(mode="json", by_alias=True)
    assert "createdAt" in data
    app = data["appsCoverage"]["test-service"]
    assert app["history"][0]["totalActions"] == 3
    assert app["history"][0]["totalElements"] == 2
    assert app["scenarios"][0]["steps"][0]["actionType"] == "CLICK"
    assert app["scenarios"][0]["steps"][0]["selectorType"] == "CSS"
    assert app["pages"]["edges"][0]["fromPage"] == "login"
    assert app["pages"]["edges"][0]["toPage"] == "home"
    assert CoverageReportState.model_validate_json(coverage_report_state.model_dump_json(by_alias=True)) == coverage_report_state
