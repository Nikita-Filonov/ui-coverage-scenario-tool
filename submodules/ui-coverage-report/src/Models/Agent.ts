import { ElementCoverage } from './Coverage/Coverage';
import { Color } from './Core';
import { ActionType } from './Actions';
import { ThemeMode } from './Theme';

export enum AgentBadgeContentType {
  TotalNumberOfActions = 'TOTAL_NUMBER_OF_ACTIONS',
  TotalNumberOfActionTypes = 'TOTAL_NUMBER_OF_ACTION_TYPES'
}

export interface AgentFilters {
  actions: ActionType[];
}

export interface AgentSettings {
  badgeColor: Color;
  overlayColor: Color;
  badgeContentType: AgentBadgeContentType;
}

export interface AgentState {
  settings?: AgentSettings;
  elements?: ElementCoverage[];
  themeMode?: ThemeMode;
}
