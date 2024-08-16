import {LogLevel} from './logLevel';

export interface ConsoleLogOptionsInterface {
  /**
   * Specify the date time format for logging (s. https://momentjs.com/)
   */
  readonly momentDateTimeFormat?: string;
  /**
   * Specify the threshold for log messages.
   * The order is: TRACE, DEBUG, LOG, INFO, WARN, ERROR.
   */
   logLevelThreshold?: LogLevel;
}
