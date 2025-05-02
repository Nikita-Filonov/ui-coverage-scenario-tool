import { ActionType } from '../Actions';
import { AppHistory, ElementHistory } from './CoverageHistory';
import { SelectorType } from '../Selector';

export interface ActionCoverage {
  type: ActionType;
  count: number;
}

export interface ElementCoverage {
  history: ElementHistory[];
  actions: ActionCoverage[];
  selector: string;
  selectorType: SelectorType;
}

export interface AppCoverage {
  history: AppHistory[];
  elements: ElementCoverage[];
}
