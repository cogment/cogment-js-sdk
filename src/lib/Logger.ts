/*
 *  Copyright 2021 AI Redefined Inc. <dev+cogment@ai-r.com>
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

import debugLogger from 'debug';

const MODULE_NAME = 'cogment';

export type LoggerFunction = (...data: unknown[]) => void;

export enum LogLevel {
  trace = 1,
  debug,
  info,
  warn,
  error,
  fatal,
}

export interface Logger {
  childLogger: (loggerName: string, level?: LogLevel) => Logger;
  debug: LoggerFunction;
  error: LoggerFunction;
  fatal: LoggerFunction;
  info: LoggerFunction;
  setLogLevel: (level: LogLevel) => void;
  trace: LoggerFunction;
  warn: LoggerFunction;
}

/**
 * Implements a {@link Logger} using the {@link debug#Debug | `debug`} module.
 */
export class DebugLogger implements Logger {
  private readonly debugLogger: debugLogger.Debugger;
  private readonly errorLogger: debugLogger.Debugger;
  private readonly fatalLogger: debugLogger.Debugger;
  private readonly infoLogger: debugLogger.Debugger;
  private logger: debugLogger.Debugger;
  private readonly traceLogger: debugLogger.Debugger;
  private readonly warnLogger: debugLogger.Debugger;

  /**
   *
   * @param loggerName - The logger namespace used by {@link debug#Debug}.
   * @param level - The log level for this logger.
   */
  constructor(
    private loggerName: string = MODULE_NAME,
    private level: LogLevel = LogLevel.debug,
  ) {
    this.logger = debugLogger(loggerName);

    this.traceLogger = this.logger.extend('trace');
    this.debugLogger = this.logger.extend('debug');
    this.infoLogger = this.logger.extend('info');
    this.warnLogger = this.logger.extend('warn');
    this.errorLogger = this.logger.extend('error');
    this.fatalLogger = this.logger.extend('fatal');
  }

  public childLogger(
    childLoggerName: string,
    level: LogLevel = this.level,
  ): DebugLogger {
    return new DebugLogger(`${this.loggerName}:${childLoggerName}`, level);
  }

  public debug(...data: [unknown, ...unknown[]]): void {
    if (this.level < LogLevel.debug) {
      this.debugLogger(...data);
    }
  }

  public error(...data: [unknown, ...unknown[]]): void {
    if (this.level < LogLevel.error) {
      this.errorLogger(...data);
    }
  }

  public fatal(...data: [unknown, ...unknown[]]): void {
    if (this.level < LogLevel.fatal) {
      this.fatalLogger(...data);
    }
  }

  public info(...data: [unknown, ...unknown[]]): void {
    if (this.level < LogLevel.info) {
      this.infoLogger(...data);
    }
  }

  public setLogLevel(level: LogLevel): void {
    this.level = level;
  }

  public trace(...data: [unknown, ...unknown[]]): void {
    if (this.level < LogLevel.trace) {
      this.traceLogger(...data);
    }
  }

  public warn(...data: [unknown, ...unknown[]]): void {
    if (this.level < LogLevel.warn) {
      this.warnLogger(...data);
    }
  }
}

const logger: Logger = new DebugLogger(MODULE_NAME);

/**
 * Returns a new logger that is optionally namespaced underneath the module name.
 * @param loggerName - Namespace of the logger, if none is passed, the top level namespace `cogment` is used
 * @returns A {@link Logger}
 */
export function getLogger(loggerName?: string): Logger {
  if (loggerName) {
    return logger.childLogger(loggerName);
  }
  return logger;
}
