import { Injectable, inject } from '@angular/core';
import { AppStateService } from '../app-state/app-state.service';
import { EnvConfig } from '../../../../environments/env-config.interface';
import { DateTimeGeneratorService } from '../generators';
import { LogLevel } from './logLevel';
import { LogInterface } from './log.interface';
import { ConsoleProvider } from './console-provider.service';
import moment from 'moment';
import { NullableUtils } from '../../utils';

@Injectable()
export class Logger implements LogInterface {
  private appState = inject(AppStateService);
  private dateTimeGenerator = inject(DateTimeGeneratorService);
  private consoleProvider = inject(ConsoleProvider);

  private static readonly LOGGING_MOMENT_DATETIME_FORMAT_DEFAULT_VALUE = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
  private static readonly LOG_LEVEL_THRESHOLD_DEFAULT_VALUE: LogLevel = LogLevel.TRACE;

  public readonly loggingMomentDateTimeFormat: string = Logger.LOGGING_MOMENT_DATETIME_FORMAT_DEFAULT_VALUE;
  public readonly logLevelThreshold: LogLevel = LogLevel.TRACE;

  constructor() {
    const envConfig: EnvConfig = this.appState.getEnvConfig();

    const hasLogOptions = !NullableUtils.isObjectNullOrUndefined(envConfig.consoleLoggingOptions);
    const hasMomentDateTimeFormatConfigValue =
      hasLogOptions && !NullableUtils.isObjectNullOrUndefined(envConfig.consoleLoggingOptions.momentDateTimeFormat);
    const haslogLevelThresholdConfigValue =
      hasLogOptions && !NullableUtils.isObjectNullOrUndefined(envConfig.consoleLoggingOptions.logLevelThreshold);

    this.loggingMomentDateTimeFormat = hasMomentDateTimeFormatConfigValue
      ? envConfig.consoleLoggingOptions.momentDateTimeFormat
      : Logger.LOGGING_MOMENT_DATETIME_FORMAT_DEFAULT_VALUE;
    this.logLevelThreshold = haslogLevelThresholdConfigValue
      ? envConfig.consoleLoggingOptions.logLevelThreshold
      : Logger.LOG_LEVEL_THRESHOLD_DEFAULT_VALUE;
  }

  public trace(message: any, ...optionalParams: any[]): void {
    if (this.logLevelThreshold <= LogLevel.TRACE) {
      this.logImpl(this.consoleProvider.trace, message, ...optionalParams);
    }
  }

  public debug(message: any, ...optionalParams: any[]): void {
    if (this.logLevelThreshold <= LogLevel.DEBUG) {
      this.logImpl(this.consoleProvider.debug, message, ...optionalParams);
    }
  }

  public log(message: any, ...optionalParams: any[]): void {
    if (this.logLevelThreshold <= LogLevel.LOG) {
      this.logImpl(this.consoleProvider.log, message, ...optionalParams);
    }
  }

  public info(message: any, ...optionalParams: any[]): void {
    if (this.logLevelThreshold <= LogLevel.INFO) {
      this.logImpl(this.consoleProvider.info, message, ...optionalParams);
    }
  }

  public warn(message: any, ...optionalParams: any[]): void {
    if (this.logLevelThreshold <= LogLevel.WARN) {
      this.logImpl(this.consoleProvider.warn, message, ...optionalParams);
    }
  }

  public error(message: any, ...optionalParams: any[]): void {
    this.logImpl(this.consoleProvider.error, message, ...optionalParams);
  }

  private logImpl(logFunc: Function, message: any, object?: any): void {
    let loggingPrefix = `${this.getCurrentFormattedDateTime()}:`;
    const args = [];

    if (typeof message === 'string') {
      loggingPrefix = `${loggingPrefix} ${message}`;
      args.push(loggingPrefix);
    } else {
      args.push(loggingPrefix);
      args.push(message);
    }
    if (!NullableUtils.isObjectNullOrUndefined(object)) {
      args.push(object);
    }
    logFunc.apply(null, args);
  }

  private getCurrentFormattedDateTime(): string {
    return this.formatDateTime(this.dateTimeGenerator.now());
  }

  private formatDateTime(dt: moment.Moment): string {
    return dt.format(this.loggingMomentDateTimeFormat);
  }
}
