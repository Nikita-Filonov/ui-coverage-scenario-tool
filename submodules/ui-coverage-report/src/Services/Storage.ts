export enum StorageKey {
  ThemeMode = 'UI_COVERAGE_THEME_MODE',
  AgentFilters = 'UI_COVERAGE_REPORT_AGENT_FILTERS',
  AgentSettings = 'UI_COVERAGE_REPORT_AGENT_SETTINGS'
}

type LoadFromStorageProps<T> = {
  key: StorageKey;
  fallback: T;
};

export const loadFromStorage = <T>({ key, fallback }: LoadFromStorageProps<T>): T => {
  const result = localStorage.getItem(key);
  if (result === null) return fallback;

  try {
    return JSON.parse(result);
  } catch {
    return fallback;
  }
};

type SaveIntoStorageProps<T> = {
  key: StorageKey;
  data: T;
};

export const saveIntoStorage = <T>({ key, data }: SaveIntoStorageProps<T>) => {
  localStorage.setItem(key, JSON.stringify(data));
};
