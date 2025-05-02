import { Box, SxProps, Theme, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';

type EmptyViewProps = {
  title: string;
  description: string | ReactNode;
  containerSx?: SxProps<Theme>;
};

export const EmptyView: FC<EmptyViewProps> = ({ title, description, containerSx }) => {
  return (
    <Box
      sx={{
        mt: 5,
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...containerSx
      }}>
      <FolderOpenOutlinedIcon fontSize={'large'} />
      <Typography sx={{ mt: 2 }} variant={'h6'}>
        {title}
      </Typography>
      <Typography>{description}</Typography>
    </Box>
  );
};
