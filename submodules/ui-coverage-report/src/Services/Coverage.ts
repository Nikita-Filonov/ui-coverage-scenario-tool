import { ElementCoverage } from '../Models/Coverage/Coverage';
import { ActionType } from '../Models/Actions';

type FilterCoverageByActionsProps = {
  actions: ActionType[];
  elements: ElementCoverage[];
};

export const filterElementCoverageByActions = (props: FilterCoverageByActionsProps): ElementCoverage[] => {
  const { actions, elements } = props;

  const filteredElements = elements.map((element) => ({
    ...element,
    actions: element.actions.filter((action) => actions.includes(action.type)),
    history: element.history.map((history) => ({
      ...history,
      actions: history.actions.filter((action) => actions.includes(action.type))
    }))
  }));

  return filteredElements.filter((element) => element.actions.length > 0);
};
