import { Config } from './Config';
import { AppCoverage } from './Coverage/Coverage';

export interface InitialState {
  config: Config;
  createdAt: string;
  appsCoverage: { [x: string]: AppCoverage };
}
