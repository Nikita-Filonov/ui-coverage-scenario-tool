import { ElementCoverage } from '../../../Models/Coverage/Coverage';
import { FC } from 'react';
import { WidgetInfoRowsView } from '../../../Components/Views/WidgetInfoRowsView';
import { BaseInfoRowView } from '../../../Components/Views/BaseInfoRowView';
import { Box } from '@mui/material';
import { ElementHistoryChartView } from '../../../Components/Charts/Agent/Elements/ElementHistoryChartView';
import { ActionCoverageTable } from '../../../Components/Tables/Agent/Elements/ActionCoverageTable';

type Props = {
  element: ElementCoverage;
};

export const ElementDetailsView: FC<Props> = ({ element }) => {
  return (
    <Box>
      <WidgetInfoRowsView containerSx={{ mt: 0 }}>
        <BaseInfoRowView name={'Selector'} value={element.selector} />
        <BaseInfoRowView name={'Selector type'} value={element.selectorType} />
      </WidgetInfoRowsView>
      <ActionCoverageTable actions={element.actions} />
      <ElementHistoryChartView history={element.history} />
    </Box>
  );
};
