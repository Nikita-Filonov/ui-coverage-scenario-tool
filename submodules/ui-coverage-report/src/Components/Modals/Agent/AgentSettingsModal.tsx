import { BaseModal } from '../BaseModal';
import { FC } from 'react';
import { AgentSettingsView } from '../../../Views/Agent/Settings/AgentSettingsView';
import { useAgentSettings } from '../../../Providers/AgentSettingsProvider';
import { ClearAllButton } from '../../Buttons/ClearAllButton';

type Props = {
  modal: boolean;
  setModal: (modal: boolean) => void;
};

export const AgentSettingsModal: FC<Props> = ({ modal, setModal }) => {
  const { settings, setSettings, clearAllSettings } = useAgentSettings();

  return (
    <BaseModal title={'Agent settings'} modal={modal} setModal={setModal}>
      <AgentSettingsView settings={settings} setSettings={setSettings} />
      <ClearAllButton onClick={clearAllSettings} />
    </BaseModal>
  );
};
