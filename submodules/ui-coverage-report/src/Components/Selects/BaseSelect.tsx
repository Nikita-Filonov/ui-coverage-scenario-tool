import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import React, { ReactNode } from 'react';

export interface SelectOption<Value extends string> {
  title: string;
  value: Value;
  content?: ReactNode;
}

type BaseSelectProps<Value extends string> = {
  sx?: SxProps<Theme>;
  label: string;
  value: Value;
  options: SelectOption<Value>[];
  onSelect: (value: Value) => void;
};

export const BaseSelect = <Value extends string>(props: BaseSelectProps<Value>) => {
  const { sx, label, value, options, onSelect } = props;

  const onSelectValue = (event: SelectChangeEvent) => {
    onSelect(event.target.value as Value);
  };

  return (
    <FormControl sx={sx} size="small" fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select value={String(value || '')} label={label} onChange={onSelectValue}>
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value || ''}>
            {option.content || option.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
