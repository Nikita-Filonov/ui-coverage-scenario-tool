import { FormControl, InputLabel, OutlinedInput, SxProps, Theme } from '@mui/material';
import { ChangeEvent, FC, ReactNode } from 'react';

export type Props = {
  sx?: SxProps<Theme>;
  value: string;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  endAdornment?: ReactNode;
  startAdornment?: ReactNode;
};

export const BaseTextField: FC<Props> = (props) => {
  const { value, onChange, label, placeholder, sx, endAdornment, startAdornment } = props;

  const onInternalChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl sx={sx} size={'small'} variant="outlined" fullWidth>
      <InputLabel>{label}</InputLabel>
      <OutlinedInput
        endAdornment={endAdornment}
        startAdornment={startAdornment}
        value={value}
        label={label}
        onChange={onInternalChange}
        placeholder={placeholder}
      />
    </FormControl>
  );
};
