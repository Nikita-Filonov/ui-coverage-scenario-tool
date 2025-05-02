import { FC } from 'react';
import { OrderDirection } from '../../../../Services/Tables/Sorting';
import { BaseTableHeader } from '../../BaseTableHeader';

type Props = {
  orderBy: string | null;
  setOrderBy: (orderBy: string | null) => void;
  orderDirection: OrderDirection;
  setOrderDirection: (direction: OrderDirection) => void;
};

export const ElementCoverageTableHeader: FC<Props> = (props) => {
  const { orderBy, setOrderBy, orderDirection, setOrderDirection } = props;

  return (
    <BaseTableHeader
      cells={[
        { value: 'Selector type', orderKey: 'selectorType' },
        { value: 'Selector', orderKey: 'selector' },
        { value: 'Number of actions', orderKey: 'actions' },
        { value: undefined, align: 'right' }
      ]}
      orderBy={orderBy}
      setOrderBy={setOrderBy}
      orderDirection={orderDirection}
      setOrderDirection={setOrderDirection}
    />
  );
};
