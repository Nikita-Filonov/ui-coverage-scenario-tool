import RefreshIcon from '@mui/icons-material/Refresh';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import { BaseToolbarView } from './BaseToolbarView';
import { FC, Fragment, RefObject, useState } from 'react';
import { AgentSettingsModal } from '../Modals/Agent/AgentSettingsModal';
import { AgentFiltersModal } from '../Modals/Agent/AgentFiltersModal';
import { useAgentActions } from '../../Services/Agent';
import { useAgentFilters } from '../../Providers/AgentFiltersProvider';

type Props = {
  frameRef: RefObject<HTMLIFrameElement | null>;
};

export const AgentToolbarView: FC<Props> = ({ frameRef }) => {
  const { filters } = useAgentFilters();
  const { onSyncAgent, onClearAgent } = useAgentActions({ frameRef });
  const [agentFiltersModal, setAgentFiltersModal] = useState(false);
  const [agentSettingsModal, setAgentSettingsModal] = useState(false);

  const onAgentFilters = () => setAgentFiltersModal(true);

  const onAgentSettings = () => setAgentSettingsModal(true);

  return (
    <Fragment>
      <BaseToolbarView
        title={'Agent frame'}
        actions={[
          { icon: <RefreshIcon />, onClick: onSyncAgent },
          { icon: <ClearIcon />, onClick: onClearAgent },
          {
            icon: <FilterAltOutlinedIcon />,
            onClick: onAgentFilters,
            badgeContent: filters.actions.length
          },
          { icon: <SettingsOutlinedIcon />, onClick: onAgentSettings }
        ]}
      />
      <AgentFiltersModal modal={agentFiltersModal} setModal={setAgentFiltersModal} />
      <AgentSettingsModal modal={agentSettingsModal} setModal={setAgentSettingsModal} />
    </Fragment>
  );
};
