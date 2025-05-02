export interface Config {
  repositoryUrl: string;

  apiDateFormat: string;
  apiTimeFormat: string;
}

export class SettingsManager {
  private static config: Config = {
    repositoryUrl: '',

    apiDateFormat: '',
    apiTimeFormat: ''
  };

  static setup() {
    this.config = this.getEnvConfig();
  }

  private static getEnvConfig(): Config {
    return {
      repositoryUrl: process.env.REACT_APP_REPOSITORY_URL || '',

      apiDateFormat: process.env.REACT_APP_API_DATE_FORMAT || '',
      apiTimeFormat: process.env.REACT_APP_API_TIME_FORMAT || ''
    };
  }

  static get repositoryUrl(): string {
    return this.config.repositoryUrl;
  }

  static get apiDateFormat(): string {
    return this.config.apiDateFormat;
  }

  static get apiTimeFormat(): string {
    return this.config.apiTimeFormat;
  }

  static get apiDateTimeFormat(): string {
    return `${this.apiDateFormat} ${this.apiTimeFormat}`;
  }

  static getStaticFileUrl(file: string): string {
    return `${this.repositoryUrl}/main/static/${file}`;
  }
}

SettingsManager.setup();
