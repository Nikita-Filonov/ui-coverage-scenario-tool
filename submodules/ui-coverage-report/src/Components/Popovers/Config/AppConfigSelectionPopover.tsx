import { Fragment, MouseEvent, useState } from 'react';
import { AppConfigSelectionLabel } from '../../Labels/Config/ServiceSelectionLabel';
import { BasePopover } from '../BasePopover';
import { AppConfigSelectionListView } from '../../../Views/Config/AppConfigSelectionListView';

export const AppConfigSelectionPopover = () => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const onOpen = (event: MouseEvent<HTMLDivElement>) => setAnchor(event.currentTarget);

  const onClose = () => setAnchor(null);

  return (
    <Fragment>
      <AppConfigSelectionLabel onSelectAppConfig={onOpen} />
      <BasePopover anchor={anchor} setAnchor={setAnchor}>
        <AppConfigSelectionListView onSelectConfigCallback={onClose} />
      </BasePopover>
    </Fragment>
  );
};
