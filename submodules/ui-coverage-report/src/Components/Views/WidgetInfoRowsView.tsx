import { Grid2, SxProps, Theme } from '@mui/material';
import { Children, FC, ReactNode } from 'react';

type Props = {
  children: ReactNode[] | ReactNode;
  containerSx?: SxProps<Theme>;
};

export const WidgetInfoRowsView: FC<Props> = (props) => {
  const { children, containerSx } = props;

  return (
    <Grid2 container spacing={1} sx={{ mt: 2, ...containerSx }}>
      {Children.map(
        children,
        (child, index) =>
          child && (
            <Grid2 key={index} size={{ xs: 12 }}>
              {child}
            </Grid2>
          )
      )}
    </Grid2>
  );
};
