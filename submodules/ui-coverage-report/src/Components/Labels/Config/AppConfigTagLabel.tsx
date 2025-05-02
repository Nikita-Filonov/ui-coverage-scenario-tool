import { BaseLabel } from '../BaseLabel';
import { FC } from 'react';

type Props = {
  tag: string;
};

export const AppConfigTagLabel: FC<Props> = ({ tag }) => {
  return <BaseLabel label={tag} color={'info'} />;
};
