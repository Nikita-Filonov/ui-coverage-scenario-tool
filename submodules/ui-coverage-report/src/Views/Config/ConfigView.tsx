import { WidgetView } from '../../Components/Views/WidgetView';
import { BaseInfoRowView } from '../../Components/Views/BaseInfoRowView';
import { useInitialState } from '../../Providers/InitialStateProvider';
import { WidgetInfoRowsView } from '../../Components/Views/WidgetInfoRowsView';
import dayjs from 'dayjs';
import { SettingsManager } from '../../Services/Config';
import { AppConfigTagsLabel } from '../../Components/Labels/Config/AppConfigTagsLabel';

export const AppConfigView = () => {
  const { appConfig, createdAt } = useInitialState();

  return (
    <WidgetView sx={{ mt: 3 }} title={'Config'}>
      <WidgetInfoRowsView>
        <BaseInfoRowView name={'App name'} value={appConfig.name} />
        <BaseInfoRowView name={'App URL'} value={appConfig.url} />
        {Boolean(appConfig.tags?.length) && (
          <BaseInfoRowView name={'App tags'} component={<AppConfigTagsLabel config={appConfig} />} />
        )}
        <BaseInfoRowView name={'App repository'} value={appConfig.repository} />
        <BaseInfoRowView
          name={'Report created at'}
          value={dayjs(createdAt).format(SettingsManager.apiDateTimeFormat)}
        />
      </WidgetInfoRowsView>
    </WidgetView>
  );
};
