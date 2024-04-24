import {Injectable} from '@angular/core';
import moment from 'moment';

@Injectable()
export class DateTimeGeneratorService {

  /** Create the current date time
   * @return {moment.Moment} current date time
   */
  public now(): moment.Moment {
    return moment();
  }
}
