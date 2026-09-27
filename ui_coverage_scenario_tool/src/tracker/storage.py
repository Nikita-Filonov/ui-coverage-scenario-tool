import uuid
from typing import TypeVar

from pydantic import BaseModel, RootModel

from ui_coverage_scenario_tool.config import Settings
from ui_coverage_scenario_tool.src.tools.logger import get_logger
from ui_coverage_scenario_tool.src.tracker.models.elements import (
    CoverageElementResult,
    CoverageElementResultList,
)
from ui_coverage_scenario_tool.src.tracker.models.pages import (
    CoveragePageResult,
    CoveragePageResultList,
)
from ui_coverage_scenario_tool.src.tracker.models.scenarios import (
    CoverageScenarioResult,
    CoverageScenarioResultList,
)
from ui_coverage_scenario_tool.src.tracker.models.transitions import (
    CoverageTransitionResult,
    CoverageTransitionResultList,
)

logger = get_logger("UI_COVERAGE_TRACKER_STORAGE")

Result = TypeVar('Result', bound=BaseModel)
ResultList = TypeVar('ResultList', bound=RootModel)


class UICoverageTrackerStorage:
    def __init__(self, settings: Settings):
        self.settings = settings

    def load(
            self,
            context: str,
            result: type[Result],
            result_list: type[ResultList]
    ) -> ResultList:
        results_dir = self.settings.results_dir
        logger.info(f"Loading coverage results from directory: {results_dir}")

        if not results_dir.exists():
            logger.warning(f"Results directory does not exist: {results_dir}")
            return result_list(root=[])

        results = [
            result.model_validate_json(file.read_text())
            for file in results_dir.glob(f"*-{context}.json") if file.is_file()
        ]

        logger.info(f"Loaded {len(results)} coverage files from directory: {results_dir}")
        return result_list(root=results)

    def save(self, context: str, result: Result):
        results_dir = self.settings.results_dir

        if not results_dir.exists():
            logger.info(f"Results directory does not exist, creating: {results_dir}")
            results_dir.mkdir(parents=True, exist_ok=True)

        result_file = results_dir.joinpath(f'{uuid.uuid4()}-{context}.json')

        try:
            result_file.write_text(result.model_dump_json())
        except Exception as error:
            logger.error(f"Error saving {context} coverage data to file {result_file}: {error}")

    def save_page_result(self, result: CoveragePageResult):
        self.save("page", result)

    def save_element_result(self, result: CoverageElementResult):
        self.save("element", result)

    def save_scenario_result(self, result: CoverageScenarioResult):
        self.save("scenario", result)

    def save_transition_result(self, result: CoverageTransitionResult):
        self.save("transition", result)

    def load_page_results(self) -> CoveragePageResultList:
        return self.load("page", CoveragePageResult, CoveragePageResultList)

    def load_element_results(self) -> CoverageElementResultList:
        return self.load("element", CoverageElementResult, CoverageElementResultList)

    def load_scenario_results(self) -> CoverageScenarioResultList:
        return self.load("scenario", CoverageScenarioResult, CoverageScenarioResultList)

    def load_transition_results(self) -> CoverageTransitionResultList:
        return self.load("transition", CoverageTransitionResult, CoverageTransitionResultList)

    def clear(self) -> None:
        results_dir = self.settings.results_dir

        if not results_dir.exists():
            logger.info(f"Results directory does not exist: {results_dir}")
            return

        if not results_dir.is_dir():
            raise NotADirectoryError(f"Results path is not a directory: {results_dir}")

        protected_files = {
            path.resolve()
            for path in (self.settings.history_file, self.settings.json_report_file, self.settings.html_report_file)
            if path is not None
        }

        removed = 0
        suffixes = ("-page.json", "-element.json", "-scenario.json", "-transition.json")
        for file in results_dir.iterdir():
            if not file.name.endswith(suffixes) or not file.is_file() or file.resolve() in protected_files:
                continue

            try:
                file.unlink()
            except OSError as error:
                raise OSError(f"Failed to remove coverage file {file}: {error}") from error
            removed += 1

        logger.info(f"Removed {removed} coverage files from directory: {results_dir}")
