from ui_coverage_scenario_tool.src.coverage.models import (
    AppCoverage,
    PagesCoverage,
    PageCoverageEdge,
    PageCoverageNode,
    ScenarioCoverage,
    ScenarioCoverageStep,
)
from ui_coverage_scenario_tool.src.history.builder import UICoverageHistoryBuilder
from ui_coverage_scenario_tool.src.history.models import ActionHistory
from ui_coverage_scenario_tool.src.tools.actions import ActionType, ActionCoverage
from ui_coverage_scenario_tool.src.tracker.models.elements import CoverageElementResultList
from ui_coverage_scenario_tool.src.tracker.models.pages import CoveragePageResultList
from ui_coverage_scenario_tool.src.tracker.models.scenarios import (
    CoverageScenarioResult,
    CoverageScenarioResultList,
)
from ui_coverage_scenario_tool.src.tracker.models.transitions import CoverageTransitionResultList


class UICoverageBuilder:
    def __init__(
            self,
            history_builder: UICoverageHistoryBuilder,
            page_result_list: CoveragePageResultList,
            element_result_list: CoverageElementResultList,
            scenario_result_list: CoverageScenarioResultList,
            transition_result_list: CoverageTransitionResultList
    ):
        self.history_builder = history_builder
        self.page_result_list = page_result_list
        self.element_result_list = element_result_list
        self.scenario_result_list = scenario_result_list
        self.transition_result_list = transition_result_list

    def build_pages_coverage(self) -> PagesCoverage:
        return PagesCoverage(
            nodes=[
                PageCoverageNode(
                    url=result.url,
                    page=result.page,
                    priority=result.priority,
                    scenarios=self.page_result_list.find_scenarios(result.page)
                )
                for result in self.page_result_list.unique.root
            ],
            edges=[
                PageCoverageEdge(
                    count=self.transition_result_list.count_transitions(
                        to_page=result.to_page,
                        from_page=result.from_page
                    ),
                    to_page=result.to_page,
                    from_page=result.from_page,
                    scenarios=self.transition_result_list.find_scenarios(
                        to_page=result.to_page,
                        from_page=result.from_page
                    )
                )
                for result in self.transition_result_list.unique.root
            ]
        )

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
            if (count := elements.count_actions(action)) > 0
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
            pages=self.build_pages_coverage(),
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
            ],
        )
