import { FC } from 'react';
import { ActionCell } from './ActionCell';
import { ActionCoverage } from '../../../../Models/Coverage/Coverage';
import { BaseTableRow } from '../../BaseTableRow';

type Props = {
  action: ActionCoverage;
};

export const ActionCoverageTableRow: FC<Props> = ({ action }) => {
  return <BaseTableRow cells={[{ value: <ActionCell type={action.type} /> }, { value: action.count }]} />;
};
