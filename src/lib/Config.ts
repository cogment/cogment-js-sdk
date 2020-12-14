/*
 *  Copyright 2020 Artificial Intelligence Redefined <dev+cogment@ai-r.com>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import {cosmiconfigSync} from 'cosmiconfig';
import {LogLevel} from './Logger';

export interface CogmentJsSdkConnectionConfig {
  http: string;
}

export interface CogmentJsSdkLoggerConfig {
  level: LogLevel;
}

export interface CogmentJsSdkConfig {
  connection: CogmentJsSdkConnectionConfig;
  logger: CogmentJsSdkLoggerConfig;
}

export class Config implements CogmentJsSdkConfig {
  public connection: CogmentJsSdkConnectionConfig;
  public logger: CogmentJsSdkLoggerConfig;
  private config: CogmentJsSdkConfig;

  constructor(private moduleName = 'cogment') {
    this.config = cosmiconfigSync(this.moduleName)?.search()
      ?.config as CogmentJsSdkConfig;
    this.connection = this.config.connection;
    this.logger = this.config.logger;
  }
}

const config = new Config('cogment');

export {config};
