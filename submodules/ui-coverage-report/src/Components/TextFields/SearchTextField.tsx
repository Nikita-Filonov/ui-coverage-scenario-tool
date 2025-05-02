import { BaseTextField } from './BaseTextField';
import { FC } from 'react';
import { IconButton, InputAdornment, Theme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { SxProps } from '@mui/system';

export type SearchTextFieldProps = {
  sx?: SxProps<Theme>;
  search: string;
  setSearch: (search: string) => void;
  placeholder: string;
};

export const SearchTextField: FC<SearchTextFieldProps> = (props) => {
  const { sx, search, setSearch, placeholder } = props;

  const onClear = () => setSearch('');

  return (
    <BaseTextField
      sx={sx}
      value={search}
      label={'Search'}
      onChange={setSearch}
      placeholder={placeholder}
      endAdornment={
        search.length > 0 && (
          <InputAdornment position="end">
            <IconButton size={'small'} edge="end" onClick={onClear}>
              <CloseIcon fontSize={'small'} />
            </IconButton>
          </InputAdornment>
        )
      }
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon fontSize={'small'} />
        </InputAdornment>
      }
    />
  );
};
