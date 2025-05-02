import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FC, ReactNode } from 'react';

type Props = {
  text: string;
  icon?: ReactNode;
};

export const BaseTableCell: FC<Props> = ({ text, icon }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {icon}
      <Typography variant={'body2'}>{text}</Typography>
    </Box>
  );
};
