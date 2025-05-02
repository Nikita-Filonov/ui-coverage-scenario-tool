import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
import { FC, ReactNode } from 'react';

export type TableRowCell = {
  value: ReactNode;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
};

type BaseTableRowProps = {
  cells: TableRowCell[];
};

export const BaseTableRow: FC<BaseTableRowProps> = ({ cells }) => {
  return (
    <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      {cells.map((cell, index) => (
        <TableCell key={index} align={cell.align || 'left'}>
          {cell.value}
        </TableCell>
      ))}
    </TableRow>
  );
};
