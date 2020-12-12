import {cosmiconfigSync} from 'cosmiconfig';

export interface CogmentJsSdkConfig {
  connection: {
    http: string;
  };
}

export class Config {
  private config: CogmentJsSdkConfig;
  constructor(private moduleName = 'cogment') {
    this.config = cosmiconfigSync(this.moduleName)?.search()
      ?.config as CogmentJsSdkConfig;
  }
}
