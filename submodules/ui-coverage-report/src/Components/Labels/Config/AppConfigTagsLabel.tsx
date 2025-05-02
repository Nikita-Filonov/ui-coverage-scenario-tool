import { BaseLabelsView } from '../BaseLabelsView';
import { AppConfig } from '../../../Models/Config';
import { FC } from 'react';
import { AppConfigTagLabel } from './AppConfigTagLabel';

type Props = {
  config: AppConfig;
};

export const AppConfigTagsLabel: FC<Props> = ({ config }) => {
  return (
    <BaseLabelsView>{config.tags?.map((tag, index) => <AppConfigTagLabel key={index} tag={tag} />)}</BaseLabelsView>
  );
};
