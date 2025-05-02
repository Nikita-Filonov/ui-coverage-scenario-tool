import { ActionType } from '../../../Models/Actions';
import { BaseCheckbox } from '../../../Components/Checkboxes/BaseCheckbox';
import { normalizeActionType } from '../../../Services/Actions';
import { BoxView } from '../../../Components/Views/BoxView';
import { FC } from 'react';
import { AgentFilters } from '../../../Models/Agent';

type Props = {
  title: string;
  filters: AgentFilters;
  actions: ActionType[];
  setFilters: (filters: AgentFilters) => void;
};

export const ActionTypeFiltersView: FC<Props> = (props) => {
  const { title, filters, actions, setFilters } = props;

  const onAction = (type: ActionType) => () => {
    setFilters({
      ...filters,
      actions: filters.actions.includes(type)
        ? filters.actions.filter((action) => action !== type)
        : [...filters.actions, type]
    });
  };

  return (
    <BoxView title={title} containerSx={{ mt: 3 }}>
      {actions.map((action, index) => (
        <BaseCheckbox
          key={index}
          label={normalizeActionType(action)}
          checked={filters.actions.includes(action)}
          onChange={onAction(action)}
        />
      ))}
    </BoxView>
  );
};
