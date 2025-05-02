import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { FC, PropsWithChildren } from 'react';
import { SxProps, Theme } from '@mui/material';

type BoxViewProps = {
  title?: string;
  containerSx?: SxProps<Theme>;
} & PropsWithChildren;

export const BoxView: FC<BoxViewProps> = ({ title, children, containerSx }) => {
  return (
    <Box sx={{ mt: 3, ...containerSx }}>
      {title && <Typography fontWeight={'bold'}>{title}</Typography>}
      {children}
    </Box>
  );
};
