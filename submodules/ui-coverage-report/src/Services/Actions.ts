import { ActionType } from '../Models/Actions';
import { ActionHistory } from '../Models/Coverage/CoverageHistory';
import dayjs from 'dayjs';
import { ActionCoverage } from '../Models/Coverage/Coverage';
import { blue, green, orange, purple } from '@mui/material/colors';

export const normalizeActionType = (action: ActionType): string => {
  return action
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

type GetActionsChartDataProps = {
  actions: (ActionHistory | ActionCoverage)[];
  createdAt: string;
};

export const getActionsChartData = (props: GetActionsChartDataProps): Record<string, number | Date> => {
  const { actions, createdAt } = props;

  const base: Record<string, number | Date> = {
    createdAt: dayjs(createdAt).toDate()
  };

  for (const action of actions) {
    base[action.type] = action.count;
  }

  return base;
};

export const MAP_ACTION_TYPE_TO_COLOR: Record<ActionType, string> = {
  // input
  [ActionType.Fill]: green['300'],
  [ActionType.Type]: green['400'],
  [ActionType.Select]: green['500'],

  // action
  [ActionType.Click]: blue['300'],
  [ActionType.Hover]: blue['400'],

  // assert
  [ActionType.Text]: purple['300'],
  [ActionType.Value]: purple['400'],
  [ActionType.Hidden]: purple['500'],
  [ActionType.Visible]: purple['600'],
  [ActionType.Checked]: orange['300'],
  [ActionType.Enabled]: orange['400'],
  [ActionType.Disabled]: orange['500'],
  [ActionType.Unchecked]: orange['600']
};

export const ACTION_TYPES_BY_GROUP: Record<'input' | 'action' | 'assert', ActionType[]> = {
  input: [ActionType.Fill, ActionType.Type, ActionType.Select],
  action: [ActionType.Click, ActionType.Hover],
  assert: [
    ActionType.Text,
    ActionType.Value,
    ActionType.Hidden,
    ActionType.Visible,
    ActionType.Checked,
    ActionType.Enabled,
    ActionType.Disabled,
    ActionType.Unchecked
  ]
};
