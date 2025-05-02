export interface AppConfig {
  key: string;
  url: string;
  name: string;
  tags: string[] | null;
  repository: string | null;
}

export interface Config {
  apps: AppConfig[];
}
