import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { AgentState } from '../Models/Agent';

export type AgentInitialStateContextProps = {
  state: AgentState;
};

const AgentInitialStateContext = createContext<AgentInitialStateContextProps | null>(null);

const AgentInitialStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<AgentState>({});

  const listener = useCallback((event: MessageEvent<AgentState>) => {
    if (event?.data) {
      setState(event.data);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', listener);

    return () => {
      window.removeEventListener('message', listener);
    };
  }, [listener]);

  return <AgentInitialStateContext.Provider value={{ state }}>{children}</AgentInitialStateContext.Provider>;
};

const useAgentInitialState = () => {
  const event = useContext(AgentInitialStateContext);
  if (event == null) {
    throw new Error('useAgentInitialState() called outside of a AgentInitialStateProvider?');
  }
  return event;
};

export { AgentInitialStateProvider, useAgentInitialState };
