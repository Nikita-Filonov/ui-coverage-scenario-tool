import { Grid2 } from '@mui/material';
import { CoverageHistoryTotalElementsChartView } from '../../Components/Charts/CoverageHistory/CoverageHistoryTotalElementsChartView';
import { useInitialState } from '../../Providers/InitialStateProvider';
import { CoverageHistoryTotalActionsChartView } from '../../Components/Charts/CoverageHistory/CoverageHistoryTotalActionsChartView';
import { CoverageHistoryActionsChartView } from '../../Components/Charts/CoverageHistory/CoverageHistoryActionsChartView';

export const AppCoverageHistoryView = () => {
  const { appCoverage } = useInitialState();

  return (
    <Grid2 container spacing={3}>
      <Grid2 size={{ xs: 12, md: 6 }}>
        <CoverageHistoryTotalElementsChartView history={appCoverage.history} />
      </Grid2>
      <Grid2 size={{ xs: 12, md: 6 }}>
        <CoverageHistoryTotalActionsChartView history={appCoverage.history} />
      </Grid2>
      <Grid2 size={{ xs: 12 }}>
        <CoverageHistoryActionsChartView history={appCoverage.history} />
      </Grid2>
    </Grid2>
  );
};
