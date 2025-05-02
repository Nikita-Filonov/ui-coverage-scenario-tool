import { BaseCheckbox } from '../../../Components/Checkboxes/BaseCheckbox';
import { ACTION_TYPES_BY_GROUP } from '../../../Services/Actions';
import { BoxView } from '../../../Components/Views/BoxView';
import { ActionType } from '../../../Models/Actions';
import { AgentFilters } from '../../../Models/Agent';
import { FC } from 'react';

type Props = {
  filters: AgentFilters;
  setFilters: (filters: AgentFilters) => void;
};

export const ActionTypeGroupFiltersView: FC<Props> = ({ filters, setFilters }) => {
  const onActions = (types: ActionType[]) => () => {
    setFilters({
      ...filters,
      actions: isActionsChecked(types)
        ? filters.actions.filter((action) => !types.includes(action)) // снять группу
        : [...filters.actions, ...types] // добавить группу
    });
  };

  const isActionsChecked = (types: ActionType[]) => types.every((action) => filters.actions.includes(action));

  return (
    <BoxView title={'Actions group filters'} containerSx={{ mt: 0 }}>
      <BaseCheckbox
        label={'Input'}
        checked={isActionsChecked(ACTION_TYPES_BY_GROUP.input)}
        onChange={onActions(ACTION_TYPES_BY_GROUP.input)}
      />
      <BaseCheckbox
        label={'Action'}
        checked={isActionsChecked(ACTION_TYPES_BY_GROUP.action)}
        onChange={onActions(ACTION_TYPES_BY_GROUP.action)}
      />
      <BaseCheckbox
        label={'Assert'}
        checked={isActionsChecked(ACTION_TYPES_BY_GROUP.assert)}
        onChange={onActions(ACTION_TYPES_BY_GROUP.assert)}
      />
    </BoxView>
  );
};
