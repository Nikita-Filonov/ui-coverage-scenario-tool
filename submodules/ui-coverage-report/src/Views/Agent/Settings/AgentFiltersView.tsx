import { Box } from '@mui/material';
import { ACTION_TYPES_BY_GROUP } from '../../../Services/Actions';
import { AgentFilters } from '../../../Models/Agent';
import { FC } from 'react';
import { ActionTypeFiltersView } from './ActionTypeFiltersView';
import { ActionTypeGroupFiltersView } from './ActionTypeGroupFiltersView';

type Props = {
  filters: AgentFilters;
  setFilters: (filters: AgentFilters) => void;
};

export const AgentFiltersView: FC<Props> = ({ filters, setFilters }) => {
  return (
    <Box>
      <ActionTypeGroupFiltersView filters={filters} setFilters={setFilters} />
      <ActionTypeFiltersView
        title={'Input filters'}
        actions={ACTION_TYPES_BY_GROUP.input}
        filters={filters}
        setFilters={setFilters}
      />
      <ActionTypeFiltersView
        title={'Action filters'}
        actions={ACTION_TYPES_BY_GROUP.action}
        filters={filters}
        setFilters={setFilters}
      />
      <ActionTypeFiltersView
        title={'Assert filters'}
        actions={ACTION_TYPES_BY_GROUP.assert}
        filters={filters}
        setFilters={setFilters}
      />
    </Box>
  );
};
