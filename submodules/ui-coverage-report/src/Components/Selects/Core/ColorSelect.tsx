import { BaseSelect } from '../BaseSelect';
import { Color } from '../../../Models/Core';
import { FC } from 'react';
import { ColorMenuItem } from '../../MenuItems/Core/ColorMenuItem';

type Props = {
  label: string;
  color: Color;
  setColor: (color: Color) => void;
};

export const ColorSelect: FC<Props> = ({ label, color, setColor }) => {
  return (
    <BaseSelect
      sx={{ mt: 3 }}
      label={label}
      value={color}
      options={Object.values(Color).map((color) => ({
        title: color,
        value: color,
        content: <ColorMenuItem color={color} />
      }))}
      onSelect={setColor}
    />
  );
};
