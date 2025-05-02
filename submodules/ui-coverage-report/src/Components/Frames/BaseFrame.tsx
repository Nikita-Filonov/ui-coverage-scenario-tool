import { FC, RefObject } from 'react';
import { grey } from '@mui/material/colors';
import { EmptyView } from '../Views/EmptyView';

type Props = {
  src: string;
  frameRef: RefObject<HTMLIFrameElement | null>;
};

export const BaseFrame: FC<Props> = ({ src, frameRef }) => {
  if (!src) {
    return (
      <EmptyView
        title={'No frame source provided'}
        description={'Frame is not displayed because there is not source to load'}
        containerSx={{ mb: 7 }}
      />
    );
  }

  return (
    <iframe
      src={src}
      ref={frameRef}
      allow={'clipboard-write'}
      width="100%"
      height="600"
      style={{ border: `1px solid ${grey['500']}`, borderRadius: 5 }}
    />
  );
};
