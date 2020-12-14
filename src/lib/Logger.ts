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
import {config} from './Config';

export type LoggerFunction = (...data: unknown[]) => void;

export enum LogLevel {
  trace,
  debug,
  info,
  warn,
  error,
  fatal,
}

export interface Logger {
  debug: LoggerFunction;
  error: LoggerFunction;
  fatal: LoggerFunction;
  info: LoggerFunction;
  trace: LoggerFunction;
  warn: LoggerFunction;
}

export class ConsoleLogger implements Logger {
  constructor(
    private loggerName: string,
    private level: LogLevel = config.logger.level,
  ) {}

  public debug(...data: unknown[]): void {
    if (this.level <= LogLevel.debug) {
      console.debug(...this.formatLog(...data));
    }
  }

  public error(...data: unknown[]): void {
    if (this.level <= LogLevel.error) {
      console.error(...this.formatLog(...data));
    }
  }

  public fatal(...data: unknown[]): void {
    if (this.level <= LogLevel.fatal) {
      console.error(...this.formatLog(...data));
    }
  }

  public info(...data: unknown[]): void {
    if (this.level <= LogLevel.info) {
      console.log(...this.formatLog(...data));
    }
  }

  public trace(...data: unknown[]): void {
    if (this.level <= LogLevel.trace) {
      console.trace(...this.formatLog(...data));
    }
  }

  public warn(...data: unknown[]): void {
    if (this.level <= LogLevel.warn) {
      console.warn(...this.formatLog(...data));
    }
  }

  public setLogLevel(level: LogLevel): void {
    this.level = level;
  }

  private formatLog(...data: unknown[]) {
    return [`${this.loggerName}:`, ...data];
  }
}

export const logger = new ConsoleLogger('cogment');
