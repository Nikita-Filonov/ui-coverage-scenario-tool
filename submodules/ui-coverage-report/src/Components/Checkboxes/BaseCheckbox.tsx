import { Checkbox, FormControlLabel, FormGroup, Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import { FC } from 'react';

type BaseCheckboxProps = {
  containerSx?: SxProps<Theme>;
  label?: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
};

export const BaseCheckbox: FC<BaseCheckboxProps> = (props) => {
  const { containerSx, label, checked, onChange } = props;

  return (
    <FormGroup sx={{ mt: 1, ...containerSx }}>
      <FormControlLabel
        onChange={(_, checked) => onChange && onChange(checked)}
        control={<Checkbox checked={checked} />}
        label={label}
      />
    </FormGroup>
  );
};
