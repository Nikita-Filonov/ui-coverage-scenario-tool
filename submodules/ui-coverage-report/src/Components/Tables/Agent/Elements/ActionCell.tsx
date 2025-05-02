import { BaseTableCell } from '../../BaseTableCell';
import { FC, ReactNode } from 'react';
import { ActionType } from '../../../../Models/Actions';
import MouseOutlinedIcon from '@mui/icons-material/MouseOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import DoNotTouchOutlinedIcon from '@mui/icons-material/DoNotTouchOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { normalizeActionType } from '../../../../Services/Actions';

type Props = {
  type: ActionType;
};

const MAP_ACTION_TYPE_TO_ICON: Record<ActionType, ReactNode> = {
  // input
  [ActionType.Fill]: <EditOutlinedIcon sx={{ mr: 1.5 }} fontSize={'small'} />,
  [ActionType.Type]: <EditOutlinedIcon sx={{ mr: 1.5 }} fontSize={'small'} />,
  [ActionType.Select]: <EditOutlinedIcon sx={{ mr: 1.5 }} fontSize={'small'} />,

  // action
  [ActionType.Click]: <MouseOutlinedIcon sx={{ mr: 1.5 }} fontSize={'small'} />,
  [ActionType.Hover]: <MouseOutlinedIcon sx={{ mr: 1.5 }} fontSize={'small'} />,

  // assert
  [ActionType.Text]: <VisibilityOutlinedIcon sx={{ mr: 1.5 }} fontSize={'small'} />,
  [ActionType.Value]: <VisibilityOutlinedIcon sx={{ mr: 1.5 }} fontSize={'small'} />,
  [ActionType.Hidden]: <VisibilityOffOutlinedIcon sx={{ mr: 1.5 }} fontSize={'small'} />,
  [ActionType.Visible]: <VisibilityOutlinedIcon sx={{ mr: 1.5 }} fontSize={'small'} />,
  [ActionType.Checked]: <CheckBoxOutlinedIcon sx={{ mr: 1.5 }} fontSize={'small'} />,
  [ActionType.Enabled]: <ToggleOnIcon sx={{ mr: 1.5 }} fontSize={'small'} />,
  [ActionType.Disabled]: <DoNotTouchOutlinedIcon sx={{ mr: 1.5 }} fontSize={'small'} />,
  [ActionType.Unchecked]: <CheckBoxOutlineBlankIcon sx={{ mr: 1.5 }} fontSize={'small'} />
};

export const ActionCell: FC<Props> = ({ type }) => {
  return <BaseTableCell text={normalizeActionType(type)} icon={MAP_ACTION_TYPE_TO_ICON[type]} />;
};
