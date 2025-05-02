import { AgentFrameView } from '../../Components/Frames/Agent/AgentFrameView';
import { useRef } from 'react';
import { AgentToolbarView } from '../../Components/Toolbar/AgentToolbarView';
import { BasePaper } from '../../Components/Views/BasePaper';
import { AgentSettingsProvider } from '../../Providers/AgentSettingsProvider';
import { AgentFiltersProvider } from '../../Providers/AgentFiltersProvider';

export const AgentView = () => {
  const frameRef = useRef<HTMLIFrameElement | null>(null);

  return (
    <BasePaper sx={{ mt: 3 }}>
      <AgentSettingsProvider>
        <AgentFiltersProvider>
          <AgentToolbarView frameRef={frameRef} />
        </AgentFiltersProvider>
      </AgentSettingsProvider>
      <AgentFrameView frameRef={frameRef} />
    </BasePaper>
  );
};
