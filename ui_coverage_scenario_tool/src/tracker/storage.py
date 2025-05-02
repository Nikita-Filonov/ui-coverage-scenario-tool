import uuid
from typing import TypeVar

from pydantic import BaseModel, RootModel

from ui_coverage_scenario_tool.config import Settings
from ui_coverage_scenario_tool.src.tools.logger import get_logger
from ui_coverage_scenario_tool.src.tracker.models import (
    CoverageElementResult,
    CoverageScenarioResult,
    CoverageElementResultList,
    CoverageScenarioResultList
)

logger = get_logger("UI_COVERAGE_TRACKER_STORAGE")

Coverage = TypeVar('Coverage', bound=BaseModel)
CoverageList = TypeVar('CoverageList', bound=RootModel)


class UICoverageTrackerStorage:
    def __init__(self, settings: Settings):
        self.settings = settings

    def load(
            self,
            context: str,
            coverage: type[Coverage],
            coverage_list: type[CoverageList]
    ) -> CoverageList:
        results_dir = self.settings.results_dir
        logger.info(f"Loading coverage results from directory: {results_dir}")

        if not results_dir.exists():
            logger.warning(f"Results directory does not exist: {results_dir}")
            return coverage_list(root=[])

        results = [
            coverage.model_validate_json(file.read_text())
            for file in results_dir.glob(f"*-{context}.json") if file.is_file()
        ]

        logger.info(f"Loaded {len(results)} coverage files from directory: {results_dir}")
        return coverage_list(root=results)

    def save(self, context: str, coverage: Coverage):
        results_dir = self.settings.results_dir

        if not results_dir.exists():
            logger.info(f"Results directory does not exist, creating: {results_dir}")
            results_dir.mkdir(exist_ok=True)

        result_file = results_dir.joinpath(f'{uuid.uuid4()}-{context}.json')

        try:
            result_file.write_text(coverage.model_dump_json())
        except Exception as error:
            logger.error(f"Error saving {context} coverage data to file {result_file}: {error}")

    def save_element_result(self, coverage: CoverageElementResult):
        self.save("element", coverage)

    def load_element_results(self) -> CoverageElementResultList:
        return self.load("element", CoverageElementResult, CoverageElementResultList)

    def save_scenario_result(self, coverage: CoverageScenarioResult):
        self.save("scenario", coverage)

    def load_scenario_results(self) -> CoverageScenarioResultList:
        return self.load("scenario", CoverageScenarioResult, CoverageScenarioResultList)
