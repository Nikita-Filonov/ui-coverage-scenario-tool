import { FC } from 'react';
import { OrderDirection } from '../../../../Services/Tables/Sorting';
import { BaseTableHeader } from '../../BaseTableHeader';

type Props = {
  orderBy: string | null;
  setOrderBy: (orderBy: string | null) => void;
  orderDirection: OrderDirection;
  setOrderDirection: (direction: OrderDirection) => void;
};

export const ActionCoverageTableHeader: FC<Props> = (props) => {
  const { orderBy, setOrderBy, orderDirection, setOrderDirection } = props;

  return (
    <BaseTableHeader
      cells={[
        { value: 'Action', orderKey: 'type' },
        { value: 'Count', orderKey: 'count' }
      ]}
      orderBy={orderBy}
      setOrderBy={setOrderBy}
      orderDirection={orderDirection}
      setOrderDirection={setOrderDirection}
    />
  );
};
