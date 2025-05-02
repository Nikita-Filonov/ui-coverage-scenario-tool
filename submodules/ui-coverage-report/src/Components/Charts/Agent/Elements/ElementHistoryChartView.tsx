import { ElementHistory } from '../../../../Models/Coverage/CoverageHistory';
import { FC, useMemo } from 'react';
import { BaseBarChart } from '../../BaseBarChart';
import { BaseChartView } from '../../BaseChartView';
import { dateTimeValueFormatter } from '../../../../Services/Charts';
import { ActionType } from '../../../../Models/Actions';
import { getActionsChartData, MAP_ACTION_TYPE_TO_COLOR, normalizeActionType } from '../../../../Services/Actions';

type Props = {
  history: ElementHistory[];
};

export const ElementHistoryChartView: FC<Props> = ({ history }) => {
  const chartData = useMemo(() => history.map(getActionsChartData), [history]);

  return (
    <BaseChartView title={'Element history'}>
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
