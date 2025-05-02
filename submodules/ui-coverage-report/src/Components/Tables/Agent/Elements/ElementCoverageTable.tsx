import { FC } from 'react';
import { useTableSorting } from '../../../../Services/Tables/Sorting';
import { ElementCoverage } from '../../../../Models/Coverage/Coverage';
import { BaseTable } from '../../BaseTable';
import { ElementCoverageTableRow } from './ElementCoverageTableRow';
import { ElementCoverageTableHeader } from './ElementCoverageTableHeader';

type Props = {
  elements: ElementCoverage[];
  onElementDetails: (element: ElementCoverage) => void;
};

export const ElementCoverageTable: FC<Props> = ({ elements, onElementDetails }) => {
  const { sortedItems, orderBy, setOrderBy, orderDirection, setOrderDirection } = useTableSorting({ items: elements });

  return (
    <BaseTable
      containerSx={{ mt: 3 }}
      header={
        <ElementCoverageTableHeader
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          orderDirection={orderDirection}
          setOrderDirection={setOrderDirection}
        />
      }>
      {sortedItems.map((element, index) => (
        <ElementCoverageTableRow key={index} element={element} onElementDetails={onElementDetails} />
      ))}
    </BaseTable>
  );
};
