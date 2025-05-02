import { AppHistory } from '../../../Models/Coverage/CoverageHistory';
import { FC, useMemo } from 'react';
import dayjs from 'dayjs';
import { BaseChartView } from '../BaseChartView';
import { BaseBarChart } from '../BaseBarChart';
import { dateTimeValueFormatter } from '../../../Services/Charts';
import { green } from '@mui/material/colors';

type Props = {
  history: AppHistory[];
};

export const CoverageHistoryTotalElementsChartView: FC<Props> = ({ history }) => {
  const datetimeData = useMemo(() => history.map((item) => dayjs(item.createdAt).toDate()), [history]);

  return (
    <BaseChartView title={'Total number of elements'}>
      <BaseBarChart
        xAxis={[{ data: datetimeData, scaleType: 'band', valueFormatter: dateTimeValueFormatter }]}
        yAxis={[
          {
            data: history.map((item) => item.totalElements),
            label: 'Total elements',
            color: green['500']
          }
        ]}
      />
    </BaseChartView>
  );
};
