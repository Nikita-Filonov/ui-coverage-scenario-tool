import { FC, PropsWithChildren, ReactNode } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { SxProps, Theme } from '@mui/material';

type BaseTableProps = {
  header: ReactNode;
  containerSx?: SxProps<Theme>;
} & PropsWithChildren;

export const BaseTable: FC<BaseTableProps> = (props) => {
  const { header, children, containerSx } = props;

  return (
    <TableContainer component={Paper} sx={{ ...containerSx, width: '100%' }}>
      <Table size={'small'}>
        {header}
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  );
};
