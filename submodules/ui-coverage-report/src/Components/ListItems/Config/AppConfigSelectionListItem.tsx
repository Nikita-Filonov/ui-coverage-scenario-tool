import { FC } from 'react';
import { BaseListItem } from '../BaseListItem';
import CodeIcon from '@mui/icons-material/Code';
import { AppConfig } from '../../../Models/Config';
import { AppConfigTagsLabel } from '../../Labels/Config/AppConfigTagsLabel';

type Props = {
  config: AppConfig;
  selected: boolean;
  onSelectConfig: (config: AppConfig) => void;
};

export const AppConfigSelectionListItem: FC<Props> = ({ config, selected, onSelectConfig }) => {
  const onSelect = () => onSelectConfig(config);

  return (
    <BaseListItem
      dense
      icon={<CodeIcon fontSize={'small'} />}
      label={<AppConfigTagsLabel config={config} />}
      title={config.name}
      subtitle={config.url}
      onClick={onSelect}
      selected={selected}
    />
  );
};
