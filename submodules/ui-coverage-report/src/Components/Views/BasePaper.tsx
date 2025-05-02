import { Paper } from '@mui/material';
import { FC, PropsWithChildren } from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

type Props = { id?: string; sx?: SxProps<Theme> } & PropsWithChildren;

export const BasePaper: FC<Props> = ({ children, id, sx }) => {
  return (
    <Paper id={id} sx={{ p: 2, ...sx }}>
      {children}
    </Paper>
  );
};
