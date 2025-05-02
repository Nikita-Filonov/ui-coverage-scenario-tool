import { FC } from 'react';
import { AgentBadgeContentType } from '../../../../Models/Agent';
import { BaseSelect } from '../../BaseSelect';

type Props = {
  type: AgentBadgeContentType;
  setType: (type: AgentBadgeContentType) => void;
};

export const AgentBadgeContentTypeSelect: FC<Props> = ({ type, setType }) => {
  return (
    <BaseSelect
      sx={{ mt: 3 }}
      label={'Badge content type'}
      value={type}
      options={[
        {
          title: 'Total number of actions',
          value: AgentBadgeContentType.TotalNumberOfActions
        },
        {
          title: 'Total number of action types',
          value: AgentBadgeContentType.TotalNumberOfActionTypes
        }
      ]}
      onSelect={setType}
    />
  );
};
