import { Grid2 } from '@mui/material';
import { SearchTextField, SearchTextFieldProps } from '../TextFields/SearchTextField';
import { FC } from 'react';
import Typography from '@mui/material/Typography';

type Props = SearchTextFieldProps & { totalResults: number };

export const SearchView: FC<Props> = (props) => {
  const { totalResults, ...other } = props;

  return (
    <Grid2 sx={{ mt: 2 }} container spacing={2}>
      <Grid2 size={{ xs: 12, md: 6 }} display={'flex'} alignItems={'center'}>
        <Typography>Total results: {totalResults}</Typography>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 6 }} display={'flex'} alignItems={'center'}>
        <SearchTextField {...other} />
      </Grid2>
    </Grid2>
  );
};
