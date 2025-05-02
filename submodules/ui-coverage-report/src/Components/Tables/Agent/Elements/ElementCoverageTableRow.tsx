import { FC } from 'react';
import { ElementCoverage } from '../../../../Models/Coverage/Coverage';
import { BaseTableRow } from '../../BaseTableRow';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import IconButton from '@mui/material/IconButton';

type Props = {
  element: ElementCoverage;
  onElementDetails: (element: ElementCoverage) => void;
};

export const ElementCoverageTableRow: FC<Props> = ({ element, onElementDetails }) => {
  const onDetails = () => onElementDetails(element);

  return (
    <BaseTableRow
      cells={[
        { value: element.selectorType },
        { value: element.selector },
        { value: element.actions.length },
        {
          align: 'right',
          value: (
            <IconButton size={'small'} onClick={onDetails}>
              <ArticleOutlinedIcon fontSize={'small'} />
            </IconButton>
          )
        }
      ]}
    />
  );
};
