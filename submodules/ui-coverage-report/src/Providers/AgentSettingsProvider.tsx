import { createContext, FC, PropsWithChildren, useContext, useState } from 'react';
import { Color } from '../Models/Core';
import { AgentBadgeContentType, AgentSettings } from '../Models/Agent';
import { loadFromStorage, saveIntoStorage, StorageKey } from '../Services/Storage';

const DEFAULT_AGENT_SETTINGS: AgentSettings = {
  badgeColor: Color.Primary,
  overlayColor: Color.Error,
  badgeContentType: AgentBadgeContentType.TotalNumberOfActionTypes
};

export type AgentSettingsContextProps = {
  settings: AgentSettings;
  setSettings: (settings: AgentSettings) => void;
  clearAllSettings: () => void;
};

const AgentSettingsContext = createContext<AgentSettingsContextProps | null>(null);

const AgentSettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [settings, setSettingsInternal] = useState<AgentSettings>(
    loadFromStorage({ key: StorageKey.AgentSettings, fallback: DEFAULT_AGENT_SETTINGS })
  );

  const setSettings = (settings: AgentSettings) => {
    setSettingsInternal(settings);
    saveIntoStorage({ key: StorageKey.AgentSettings, data: settings });
  };

  const clearAllSettings = () => setSettings(DEFAULT_AGENT_SETTINGS);

  return (
    <AgentSettingsContext.Provider value={{ settings, setSettings, clearAllSettings }}>
      {children}
    </AgentSettingsContext.Provider>
  );
};

const useAgentSettings = () => {
  const event = useContext(AgentSettingsContext);
  if (event == null) {
    throw new Error('useInitialState() called outside of a AgentSettingsProvider?');
  }
  return event;
};

export { AgentSettingsProvider, useAgentSettings };
