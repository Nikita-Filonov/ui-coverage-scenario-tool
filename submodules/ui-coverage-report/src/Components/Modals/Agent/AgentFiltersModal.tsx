import { BaseModal } from '../BaseModal';
import { FC } from 'react';
import { useAgentFilters } from '../../../Providers/AgentFiltersProvider';
import { AgentFiltersView } from '../../../Views/Agent/Settings/AgentFiltersView';
import { ClearAllButton } from '../../Buttons/ClearAllButton';

type Props = {
  modal: boolean;
  setModal: (modal: boolean) => void;
};

export const AgentFiltersModal: FC<Props> = ({ modal, setModal }) => {
  const { filters, setFilters, clearAllFilters } = useAgentFilters();

  return (
    <BaseModal title={'Agent filters'} modal={modal} setModal={setModal}>
      <AgentFiltersView filters={filters} setFilters={setFilters} />
      <ClearAllButton onClick={clearAllFilters} />
    </BaseModal>
  );
};
