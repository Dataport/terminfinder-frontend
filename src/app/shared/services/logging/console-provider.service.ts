import {Injectable} from '@angular/core';
import {LogInterface} from './log.interface';

@Injectable()
export class ConsoleProvider implements LogInterface {

  public trace(message: any, ...optionalParams: any[]): void {
    // eslint-disable-next-line no-restricted-syntax
    console.trace(message, ...optionalParams);
  }

  public debug(message: any, ...optionalParams: any[]): void {
    // eslint-disable-next-line no-restricted-syntax
    console.debug(message, ...optionalParams);
  }

  public log(message: any, ...optionalParams: any[]): void {
    console.log(message, ...optionalParams);
  }

  public info(message: any, ...optionalParams: any[]): void {
    // eslint-disable-next-line no-restricted-syntax
    console.info(message, ...optionalParams);
  }

  public warn(message: any, ...optionalParams: any[]): void {
    console.warn(message, ...optionalParams);
  }

  public error(message: any, ...optionalParams: any[]): void {
    // eslint-disable-next-line no-console
    console.error(message, ...optionalParams);
  }
}
