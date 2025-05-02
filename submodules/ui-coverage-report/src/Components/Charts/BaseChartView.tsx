import { Box, Paper, SxProps, Theme } from '@mui/material';
import Typography from '@mui/material/Typography';
import { FC, PropsWithChildren } from 'react';

export type BaseChartViewProps = {
  title: string;
  childrenSx?: SxProps<Theme>;
  containerSx?: SxProps<Theme>;
} & PropsWithChildren;

export const BaseChartView: FC<BaseChartViewProps> = ({ title, children, childrenSx, containerSx }) => {
  return (
    <Paper sx={{ width: '100%', p: 2, mt: 3, ...containerSx }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ mr: 2 }} variant={'h6'}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ height: '100%', ...childrenSx }}>{children}</Box>
    </Paper>
  );
};
