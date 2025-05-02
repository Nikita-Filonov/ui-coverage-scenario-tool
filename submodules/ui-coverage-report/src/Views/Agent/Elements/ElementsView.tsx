import React, { Fragment } from 'react';
import { ElementView } from './ElementView';
import { useAgentInitialState } from '../../../Providers/AgentInitialStateProvider';

export const ElementsView = () => {
  const { state } = useAgentInitialState();

  return <Fragment>{state?.elements?.map((element, index) => <ElementView key={index} element={element} />)}</Fragment>;
};
