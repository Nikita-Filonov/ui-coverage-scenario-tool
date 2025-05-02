import { Badge } from '@mui/material';
import { AgentBadgeContentType, AgentSettings } from '../../../../Models/Agent';
import { ActionCoverage } from '../../../../Models/Coverage/Coverage';
import { FC, useMemo } from 'react';

type Props = {
  actions: ActionCoverage[];
  settings?: AgentSettings;
};

export const ElementBadge: FC<Props> = ({ actions, settings }) => {
  const content = useMemo(() => {
    switch (settings?.badgeContentType) {
      case AgentBadgeContentType.TotalNumberOfActions:
        return actions.reduce((total, action) => total + action.count, 0);
      case AgentBadgeContentType.TotalNumberOfActionTypes:
        return actions.length;
      default:
        return 0;
    }
  }, [actions, settings?.badgeContentType]);

  return <Badge color={settings?.badgeColor} badgeContent={content} />;
};
