import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { FC, ReactNode, useMemo } from 'react';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material';

export type Props = {
  name: string;
  icon?: ReactNode;
  value?: ReactNode;
  noWrap?: boolean;
  allowCopy?: boolean;
  component?: ReactNode;
  containerSx?: SxProps<Theme>;
};

export const BaseInfoRowView: FC<Props> = (props) => {
  const { name, icon, value, noWrap = false, allowCopy = true, component = false, containerSx } = props;

  const internalValue = useMemo(() => value || 'unknown', [value]);

  const onCopy = async () => {
    await navigator.clipboard.writeText(String(value));
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...containerSx }}>
      <Typography noWrap={noWrap} sx={{ display: 'flex', alignItems: 'center' }}>
        {name}: {component ? component : internalValue} {icon}
      </Typography>
      {Boolean(value) && allowCopy && (
        <Box sx={{ display: 'flex' }}>
          <IconButton size={'small'} sx={{ ml: 1 }} onClick={onCopy}>
            <ContentCopyIcon fontSize={'small'} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};
