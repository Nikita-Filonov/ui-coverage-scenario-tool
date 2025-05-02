import { filterElementCoverageByActions } from './Coverage';
import { AgentState } from '../Models/Agent';
import { RefObject, useEffect } from 'react';
import { useAgentFilters } from '../Providers/AgentFiltersProvider';
import { useAgentSettings } from '../Providers/AgentSettingsProvider';
import { useInitialState } from '../Providers/InitialStateProvider';
import { useTheme } from '../Providers/ThemeProvider';

type UseAgentActionsProps = {
  frameRef: RefObject<HTMLIFrameElement | null>;
};

export const useAgentActions = ({ frameRef }: UseAgentActionsProps) => {
  const { filters } = useAgentFilters();
  const { settings } = useAgentSettings();
  const { themeMode } = useTheme();
  const { appCoverage } = useInitialState();

  useEffect(() => {
    onSyncAgent();
  }, [filters, settings, themeMode]);

  const postMessage = (state: AgentState) => {
    const frameWindow = frameRef?.current?.contentWindow;
    if (frameWindow) {
      frameWindow.postMessage(state, '*');
    }
  };

  const onSyncAgent = () => {
    const elements = filterElementCoverageByActions({ elements: appCoverage.elements, actions: filters.actions });
    postMessage({ settings, elements, themeMode });
  };

  const onClearAgent = () => postMessage({ settings, elements: [], themeMode });

  return { onSyncAgent, onClearAgent };
};
