import { BarPlot } from '@mui/x-charts/BarChart';
import {
  ChartsAxisHighlight,
  ChartsGrid,
  ChartsTooltip,
  ChartsXAxis,
  ChartsYAxis,
  ResponsiveChartContainer
} from '@mui/x-charts';
import { AxisValueFormatterContext } from '@mui/x-charts/internals';
import { DatasetType } from '@mui/x-charts/models/seriesType/config';
import { Box } from '@mui/material';
import { Fragment } from 'react';
import { BaseBarChartLegend } from './BaseBarChartLegend';

export interface BarChartYAxis {
  data?: (null | number)[];
  label: string;
  color?: string;
  stack?: 'total';
  dataKey?: string;
}

interface BarChartXAxis<T> {
  data?: T[];
  dataKey?: string;
  scaleType: 'time' | 'band';
  valueFormatter?: (value: T, context: AxisValueFormatterContext) => string;
}

type BaseLineChartProps<T> = {
  xAxis: BarChartXAxis<T>[];
  yAxis: BarChartYAxis[];
  dataset?: DatasetType;
};

export const BaseBarChart = <T,>({ xAxis, yAxis, dataset }: BaseLineChartProps<T>) => {
  return (
    <Fragment>
      <Box sx={{ height: 300 }}>
        <ResponsiveChartContainer
          xAxis={xAxis}
          margin={{ top: 20, left: 35, right: 20, bottom: 35 }}
          series={yAxis.map((axis) => ({ ...axis, type: 'bar' }))}
          dataset={dataset}>
          <BarPlot />
          <ChartsGrid vertical={true} horizontal={true} />
          <ChartsXAxis />
          <ChartsYAxis />
          <ChartsTooltip slotProps={{ popper: { sx: { zIndex: 2000 } } }} />
          <ChartsAxisHighlight x={'band'} />
        </ResponsiveChartContainer>
      </Box>
      <BaseBarChartLegend yAxis={yAxis} />
    </Fragment>
  );
};
