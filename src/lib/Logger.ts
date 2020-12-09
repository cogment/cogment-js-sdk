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

export type LoggerFunction = (...data: unknown[]) => void;

export interface Logger {
  debug: LoggerFunction;
  error: LoggerFunction;
  fatal: LoggerFunction;
  info: LoggerFunction;
  trace: LoggerFunction;
  warn: LoggerFunction;
}

export class ConsoleLogger implements Logger {
  constructor(private loggerName: string) {}

  private formatLog(...data: unknown[]) {
    return [`${this.loggerName}:`, ...data];
  }

  public debug(...data: unknown[]): void {
    console.debug(...this.formatLog(...data));
  }

  public error(...data: unknown[]): void {
    console.error(...this.formatLog(...data));
  }

  public fatal(...data: unknown[]): void {
    console.error(...this.formatLog(...data));
  }

  public info(...data: unknown[]): void {
    console.log(...this.formatLog(...data));
  }

  public trace(...data: unknown[]): void {
    console.trace(...this.formatLog(...data));
  }

  public warn(...data: unknown[]): void {
    console.warn(...this.formatLog(...data));
  }
}

export const logger: Logger = new ConsoleLogger('cogment');
