import { AppHistory } from '../../../Models/Coverage/CoverageHistory';
import { FC, useMemo } from 'react';
import dayjs from 'dayjs';
import { BaseChartView } from '../BaseChartView';
import { BaseBarChart } from '../BaseBarChart';
import { dateTimeValueFormatter } from '../../../Services/Charts';
import { blue } from '@mui/material/colors';

type Props = {
  history: AppHistory[];
};

export const CoverageHistoryTotalActionsChartView: FC<Props> = ({ history }) => {
  const datetimeData = useMemo(() => history.map((item) => dayjs(item.createdAt).toDate()), [history]);

  return (
    <BaseChartView title={'Total number of actions'}>
      <BaseBarChart
        xAxis={[{ data: datetimeData, scaleType: 'band', valueFormatter: dateTimeValueFormatter }]}
        yAxis={[
          {
            data: history.map((item) => item.totalActions),
            label: 'Total actions',
            color: blue['500']
          }
        ]}
      />
    </BaseChartView>
  );
};
