import { FC, MouseEvent } from 'react';
import { BaseLabel } from '../BaseLabel';
import CodeIcon from '@mui/icons-material/Code';
import { useInitialState } from '../../../Providers/InitialStateProvider';

type Props = {
  onSelectAppConfig: (event: MouseEvent<HTMLDivElement>) => void;
};

export const AppConfigSelectionLabel: FC<Props> = ({ onSelectAppConfig }) => {
  const { appConfig } = useInitialState();

  return (
    <BaseLabel
      icon={<CodeIcon />}
      color={appConfig.key ? 'success' : 'warning'}
      label={appConfig.key ? appConfig.name : 'App not selected'}
      onClick={onSelectAppConfig}
    />
  );
};
