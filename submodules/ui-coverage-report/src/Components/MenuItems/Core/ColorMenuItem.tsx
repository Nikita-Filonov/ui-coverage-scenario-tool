import { BaseMenuItem } from '../BaseMenuItem';
import CircleIcon from '@mui/icons-material/Circle';
import { Color } from '../../../Models/Core';
import { FC } from 'react';
import { capitalizeFirstLetter } from '../../../Services/Core';

type Props = {
  color: Color;
};

export const ColorMenuItem: FC<Props> = ({ color }) => {
  return <BaseMenuItem icon={<CircleIcon sx={{ mr: 1.5 }} color={color} />} title={capitalizeFirstLetter(color)} />;
};
