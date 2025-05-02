import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import * as React from 'react';
import { FC } from 'react';
import { TableSortLabel } from '@mui/material';
import { OrderDirection } from '../../Services/Tables/Sorting';
import { TableRowCell } from './BaseTableRow';

export type TableHeaderCell = {
  orderKey?: string;
} & TableRowCell;

type BaseTableHeaderProps = {
  cells: TableHeaderCell[];
  orderBy: string | null;
  setOrderBy: (orderBy: string | null) => void;
  orderDirection: OrderDirection;
  setOrderDirection: (direction: OrderDirection) => void;
};

export const BaseTableHeader: FC<BaseTableHeaderProps> = (props) => {
  const { cells, orderBy, setOrderBy, orderDirection, setOrderDirection } = props;

  const onOrder = (key: string | null) => () => {
    setOrderBy(key);
    setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
  };

  return (
    <TableHead>
      <TableRow>
        {cells.map((cell, index) => (
          <TableCell key={index} align={cell.align || 'left'} sx={{ whiteSpace: 'nowrap', pt: 2, pb: 2 }}>
            {cell.orderKey ? (
              <TableSortLabel
                active={orderBy === cell.orderKey}
                direction={orderDirection}
                onClick={onOrder(cell.orderKey)}>
                {cell.value}
              </TableSortLabel>
            ) : (
              cell.value
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
