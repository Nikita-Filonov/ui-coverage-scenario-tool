import { AppHistory } from '../../../Models/Coverage/CoverageHistory';
import { ActionType } from '../../../Models/Actions';
import { FC, useMemo } from 'react';
import { BaseChartView } from '../BaseChartView';
import { BaseBarChart } from '../BaseBarChart';
import { dateTimeValueFormatter } from '../../../Services/Charts';
import { getActionsChartData, MAP_ACTION_TYPE_TO_COLOR, normalizeActionType } from '../../../Services/Actions';

type Props = {
  history: AppHistory[];
};

export const CoverageHistoryActionsChartView: FC<Props> = ({ history }) => {
  const chartData = useMemo(() => history.map(getActionsChartData), [history]);

  return (
    <BaseChartView title={'Actions history'} containerSx={{ mt: 0 }}>
      <BaseBarChart
        xAxis={[{ dataKey: 'createdAt', scaleType: 'band', valueFormatter: dateTimeValueFormatter }]}
        yAxis={Object.values(ActionType).map((type) => ({
          dataKey: type,
          label: normalizeActionType(type),
          color: MAP_ACTION_TYPE_TO_COLOR[type],
          stack: 'total'
        }))}
        dataset={chartData}
      />
    </BaseChartView>
  );
};
