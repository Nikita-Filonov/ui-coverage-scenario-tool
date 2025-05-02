import { FC } from 'react';
import { useTableSorting } from '../../../../Services/Tables/Sorting';
import { ActionCoverage } from '../../../../Models/Coverage/Coverage';
import { ActionCoverageTableRow } from './ActionCoverageTableRow';
import { ActionCoverageTableHeader } from './ActionCoverageTableHeader';
import { BaseTable } from '../../BaseTable';

type Props = {
  actions: ActionCoverage[];
};

export const ActionCoverageTable: FC<Props> = ({ actions }) => {
  const { sortedItems, orderBy, setOrderBy, orderDirection, setOrderDirection } = useTableSorting({ items: actions });

  return (
    <BaseTable
      containerSx={{ mt: 3 }}
      header={
        <ActionCoverageTableHeader
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          orderDirection={orderDirection}
          setOrderDirection={setOrderDirection}
        />
      }>
      {sortedItems.map((action, index) => (
        <ActionCoverageTableRow key={index} action={action} />
      ))}
    </BaseTable>
  );
};
