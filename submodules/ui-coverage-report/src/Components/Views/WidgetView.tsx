import { BasePaper } from './BasePaper';
import Typography from '@mui/material/Typography';
import { FC, ReactNode } from 'react';
import { Badge, Box, Grid2, SxProps, Theme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { getActionMarginRight } from '../../Services/Views';

type WidgetAction = {
  icon?: ReactNode;
  content?: ReactNode;
  onClick?: () => void;
  badgeContent?: ReactNode;
};

type WidgetViewProps = {
  id?: string;
  sx?: SxProps<Theme>;
  title?: string | ReactNode;
  actions?: WidgetAction[];
  children?: ReactNode;
  childrenSx?: SxProps<Theme>;
};

export const WidgetView: FC<WidgetViewProps> = (props) => {
  const { id, sx, title, actions, children, childrenSx } = props;

  const getMarginRight = (index: number): number => getActionMarginRight({ index, actions, margin: 2 });

  return (
    <BasePaper id={id} sx={sx}>
      <Grid2 container sx={{ display: 'flex', alignItems: 'center' }}>
        <Grid2 sx={{ flexGrow: 1 }}>
          {title && (
            <Typography sx={{ mr: 2 }} variant={'h6'}>
              {title}
            </Typography>
          )}
        </Grid2>
        {actions?.map((action, index) => (
          <Grid2 key={index}>
            {action.icon ? (
              <IconButton key={index} sx={{ mr: getMarginRight(index) }} onClick={action.onClick}>
                <Badge badgeContent={action.badgeContent} color="primary">
                  {action.icon}
                </Badge>
              </IconButton>
            ) : (
              <Box key={index} sx={{ mr: getMarginRight(index) }}>
                {action.content}
              </Box>
            )}
          </Grid2>
        ))}
      </Grid2>
      <Box sx={childrenSx}>{children}</Box>
    </BasePaper>
  );
};
