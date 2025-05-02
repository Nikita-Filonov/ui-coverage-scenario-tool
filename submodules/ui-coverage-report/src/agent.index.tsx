import { watchFrameRoot } from './Services/Frame/Root';
import { AgentInitialStateProvider } from './Providers/AgentInitialStateProvider';
import { ElementsView } from './Views/Agent/Elements/ElementsView';
import { AgentThemeProvider } from './Providers/AgentThemeProvider';

const IndexAgent = () => {
  return (
    <AgentInitialStateProvider>
      <AgentThemeProvider>
        <ElementsView />
      </AgentThemeProvider>
    </AgentInitialStateProvider>
  );
};

document.addEventListener('DOMContentLoaded', () => {
  watchFrameRoot(() => <IndexAgent />);
});
