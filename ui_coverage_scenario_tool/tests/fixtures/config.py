import os
from pathlib import Path

import pytest

from ui_coverage_scenario_tool.config import AppConfig, Settings, get_settings


@pytest.fixture(autouse=True)
def isolated_config(tmp_path: Path, monkeypatch: pytest.MonkeyPatch):
    for name in os.environ:
        if name.startswith("UI_COVERAGE_SCENARIO_"):
            monkeypatch.delenv(name)
    for source, filename in (
        ("env_file", ".env"),
        ("yaml_file", "ui_coverage_scenario_config.yaml"),
        ("json_file", "ui_coverage_scenario_config.json"),
    ):
        monkeypatch.setitem(Settings.model_config, source, str(tmp_path / filename))
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()


@pytest.fixture
def settings(tmp_path: Path) -> Settings:
    return Settings(
        apps=[AppConfig(key="test-service", name="Test Service", url="https://example.com/login")],
        results_dir=tmp_path / "results",
        history_file=tmp_path / "history.json",
        history_retention_limit=3,
        json_report_file=tmp_path / "report.json",
        html_report_file=tmp_path / "report.html",
    )


@pytest.fixture
def coverage_history_settings(settings: Settings) -> Settings:
    return settings


@pytest.fixture
def reports_settings(settings: Settings) -> Settings:
    return settings
