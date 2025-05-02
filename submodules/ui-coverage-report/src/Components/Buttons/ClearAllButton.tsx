import { Button } from '@mui/material';
import { FC } from 'react';

type Props = {
  onClick: () => void;
};

export const ClearAllButton: FC<Props> = ({ onClick }) => {
  return (
    <Button sx={{ mt: 3 }} size={'small'} variant={'outlined'} onClick={onClick}>
      Clear all
    </Button>
  );
};
