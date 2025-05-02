import { BasePaper } from '../Views/BasePaper';
import Typography from '@mui/material/Typography';
import { Badge, Box, SxProps, Theme } from '@mui/material';
import React, { FC, ReactNode } from 'react';
import IconButton from '@mui/material/IconButton';
import { getActionMarginRight } from '../../Services/Views';

type ToolbarAction = {
  icon?: ReactNode;
  content?: ReactNode;
  onClick?: () => void;
  badgeContent?: ReactNode;
};

type BaseToolbarViewProps = {
  icon?: ReactNode;
  title: string;
  actions?: ToolbarAction[];
  containerSx?: SxProps<Theme>;
};

export const BaseToolbarView: FC<BaseToolbarViewProps> = (props) => {
  const { icon, title, actions = [], containerSx } = props;

  const getMarginRight = (index: number): number => getActionMarginRight({ index, actions, margin: 2 });

  return (
    <BasePaper sx={containerSx}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {icon && <Box sx={{ mr: 2 }}>{icon}</Box>}
        <Typography variant={'h6'}>{title}</Typography>
        <Box sx={{ flexGrow: 1 }} />
        {actions.map((action, index) =>
          action.icon ? (
            <IconButton key={index} sx={{ mr: getMarginRight(index) }} onClick={action.onClick}>
              <Badge badgeContent={action.badgeContent} color="primary">
                {action.icon}
              </Badge>
            </IconButton>
          ) : (
            <Box key={index} sx={{ mr: getMarginRight(index) }}>
              {action.content}
            </Box>
          )
        )}
      </Box>
    </BasePaper>
  );
};
