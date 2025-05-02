from ui_coverage_scenario_tool.src.coverage.models import (
    AppCoverage,
    ScenarioCoverage,
    ScenarioCoverageStep
)
from ui_coverage_scenario_tool.src.history.builder import UICoverageHistoryBuilder
from ui_coverage_scenario_tool.src.history.models import ActionHistory
from ui_coverage_scenario_tool.src.tools.actions import ActionType, ActionCoverage
from ui_coverage_scenario_tool.src.tracker.models import (
    CoverageScenarioResult,
    CoverageElementResultList,
    CoverageScenarioResultList,
)


class UICoverageBuilder:
    def __init__(
            self,
            history_builder: UICoverageHistoryBuilder,
            element_result_list: CoverageElementResultList,
            scenario_result_list: CoverageScenarioResultList,
    ):
        self.history_builder = history_builder
        self.element_result_list = element_result_list
        self.scenario_result_list = scenario_result_list

    def build_scenario_coverage(self, scenario: CoverageScenarioResult) -> ScenarioCoverage:
        elements = self.element_result_list.filter(scenario=scenario.name)

        steps = [
            ScenarioCoverageStep(
                selector=element.selector,
                timestamp=element.timestamp,
                action_type=element.action_type,
                selector_type=element.selector_type
            )
            for element in elements.root
        ]
        actions = [
            ActionCoverage(count=count, action_type=action)
            for action in ActionType.to_list()
            if (count := elements.count_action(action)) > 0
        ]

        return ScenarioCoverage(
            url=scenario.url,
            name=scenario.name,
            steps=steps,
            actions=actions,
            history=self.history_builder.get_scenario_history(
                name=scenario.name,
                actions=[ActionHistory(**action.model_dump()) for action in actions],
            ),
        )

    def build(self) -> AppCoverage:
        return AppCoverage(
            history=self.history_builder.get_app_history(
                actions=[
                    ActionHistory(count=results.total_actions, action_type=action)
                    for action, results in self.element_result_list.grouped_by_action.items()
                    if results.total_actions > 0
                ],
                total_actions=self.element_result_list.total_actions,
                total_elements=self.element_result_list.total_selectors
            ),
            scenarios=[
                self.build_scenario_coverage(scenario)
                for scenario in self.scenario_result_list.root
            ]
        )
