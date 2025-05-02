import dayjs from 'dayjs';
import { SettingsManager } from './Config';

export const dateTimeValueFormatter = (value: Date): string => dayjs(value).format(SettingsManager.apiDateTimeFormat);
