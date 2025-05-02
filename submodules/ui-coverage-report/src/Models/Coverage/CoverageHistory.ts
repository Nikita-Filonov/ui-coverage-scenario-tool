import { ActionType } from '../Actions';

export interface ActionHistory {
  type: ActionType;
  count: number;
}

export interface ElementHistory {
  actions: ActionHistory[];
  createdAt: string;
}

export interface AppHistory {
  actions: ActionHistory[];
  createdAt: string;
  totalActions: number;
  totalElements: number;
}
