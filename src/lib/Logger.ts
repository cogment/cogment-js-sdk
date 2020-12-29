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
import debug from 'debug';

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
  setLogLevel: (level: LogLevel) => void;
  debug: LoggerFunction;
  error: LoggerFunction;
  fatal: LoggerFunction;
  info: LoggerFunction;
  trace: LoggerFunction;
  warn: LoggerFunction;
}

/**
 * Implements a {@link Logger} using the {@link debug#Debug | debug} module.
 */
export class DebugLogger implements Logger {
  private readonly traceLogger: debug.Debugger;
  private readonly debugLogger: debug.Debugger;
  private readonly infoLogger: debug.Debugger;
  private readonly warnLogger: debug.Debugger;
  private readonly errorLogger: debug.Debugger;
  private readonly fatalLogger: debug.Debugger;
  private logger: debug.Debugger;

  /**
   *
   * @param loggerName - The logger namespace used by {@link debug#Debug}.
   * @param level - The log level for this logger.
   */
  constructor(
    private loggerName: string = MODULE_NAME,
    private level: LogLevel = LogLevel.debug,
  ) {
    const logger = (this.logger = debug(loggerName));

    this.traceLogger = logger.extend('trace');
    this.debugLogger = logger.extend('debug');
    this.infoLogger = logger.extend('info');
    this.warnLogger = logger.extend('warn');
    this.errorLogger = logger.extend('error');
    this.fatalLogger = logger.extend('fatal');
  }

  public childLogger(
    childLoggerName: string,
    level: LogLevel = this.level,
  ): DebugLogger {
    return new DebugLogger(`${this.loggerName}:${childLoggerName}`, level);
  }

  public setLogLevel(level: LogLevel): void {
    this.level = level;
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

export class ConsoleLogger implements Logger {
  constructor(
    private loggerName: string,
    private level: LogLevel = LogLevel.debug,
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

  public childLogger(loggerName: string, level?: LogLevel): Logger {
    throw new Error('childLogger() is not implemented.');
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
