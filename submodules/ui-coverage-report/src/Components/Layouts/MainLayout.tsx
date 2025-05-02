import { Container } from '@mui/material';
import { SxProps } from '@mui/system';
import React, { FC } from 'react';

type MainLayoutProps = {
  children: React.ReactNode;
  sx?: SxProps;
};

export const MainLayout: FC<MainLayoutProps> = ({ children, sx }) => {
  return (
    <Container
      sx={{
        pb: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        ...sx
      }}
      maxWidth={'xl'}>
      {children}
    </Container>
  );
};
