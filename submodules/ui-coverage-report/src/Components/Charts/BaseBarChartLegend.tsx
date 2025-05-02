import { Box, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import { BarChartYAxis } from './BaseBarChart';

type Props = {
  yAxis: BarChartYAxis[];
};

export const BaseBarChartLegend: FC<Props> = ({ yAxis }) => {
  return (
    <Stack spacing={2} direction={'row'} flexWrap={'wrap'} justifyContent={'center'}>
      {yAxis.map((axis, index) => (
        <Box key={index} display={'flex'} alignItems={'center'}>
          <Box sx={{ width: 12, height: 12, bgcolor: axis.color, borderRadius: '2px', mr: 1 }} />
          <Typography variant="body2">{axis.label}</Typography>
        </Box>
      ))}
    </Stack>
  );
};
