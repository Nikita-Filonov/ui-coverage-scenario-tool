import { BaseFrame } from '../BaseFrame';
import { useInitialState } from '../../../Providers/InitialStateProvider';
import { FC, RefObject } from 'react';
import Box from '@mui/material/Box';

type Props = {
  frameRef: RefObject<HTMLIFrameElement | null>;
};

export const AgentFrameView: FC<Props> = ({ frameRef }) => {
  const { appConfig } = useInitialState();

  return (
    <Box sx={{ mt: 3 }}>
      <BaseFrame src={appConfig.url} frameRef={frameRef} />
    </Box>
  );
};
