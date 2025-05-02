import { BoxView } from '../../Components/Views/BoxView';
import { List } from '@mui/material';
import { useInitialState } from '../../Providers/InitialStateProvider';
import { EmptyView } from '../../Components/Views/EmptyView';
import { SearchTextField } from '../../Components/TextFields/SearchTextField';
import { FC, useMemo, useState } from 'react';
import { AppConfig } from '../../Models/Config';
import { AppConfigSelectionListItem } from '../../Components/ListItems/Config/AppConfigSelectionListItem';

type Props = {
  onSelectConfigCallback?: () => void;
};

export const AppConfigSelectionListView: FC<Props> = ({ onSelectConfigCallback }) => {
  const { appConfig, appConfigs, setAppConfig } = useInitialState();
  const [search, setSearch] = useState('');

  const filteredConfigs = useMemo(
    () => appConfigs.filter((config) => config.name.toLowerCase().includes(search.toLowerCase())),
    [search, appConfigs]
  );

  const onSelectConfig = (config: AppConfig) => {
    setAppConfig(config);

    if (onSelectConfigCallback) {
      onSelectConfigCallback();
    }
  };

  return (
    <BoxView title={'Applications'} containerSx={{ mt: 0 }}>
      {appConfigs.length === 0 && (
        <EmptyView title={'Empty applications'} description={'There is no applications to select'} />
      )}
      {appConfigs.length > 0 && (
        <SearchTextField sx={{ mt: 2 }} search={search} setSearch={setSearch} placeholder={'Search by name'} />
      )}
      <List dense>
        {filteredConfigs.map((item, index) => (
          <AppConfigSelectionListItem
            key={index}
            config={item}
            selected={item.key == appConfig.key}
            onSelectConfig={onSelectConfig}
          />
        ))}
      </List>
    </BoxView>
  );
};
