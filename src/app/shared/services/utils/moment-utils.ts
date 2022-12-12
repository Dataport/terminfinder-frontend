import * as moment from 'moment';
import {Utils} from './utils';
import {ApiConstants} from '../../constants/apiConstants';
import {ValidatorConstants} from '../../constants/validatorConstants';

export class MomentUtils {
  /**
   * Reset the time to midnight and return a new moment instance
   * @param {moment.Moment} obj
   * @return {moment.Moment} the resulting moment instance
   */
  public static resetTime(obj: moment.Moment): moment.Moment {
    if (Utils.isObjectNullOrUndefined(obj)) {
      throw new Error(`Submitted value is null or undefined`);
    }
    const result: moment.Moment = moment(obj);
    result.hours(0);
    result.minutes(0);
    result.seconds(0);
    result.milliseconds(0);
    return result;
  }

  /**
   * Concat the date and time from two moment instances. If the time instance is null or undefined
   * @param dateInstance
   * @param timeInstance
   * @return {moment.Moment} the concatenated moment instance
   */
  public static concatDateTime(dateInstance: moment.Moment, timeInstance: moment.Moment): moment.Moment {
    if (Utils.isObjectNullOrUndefined(timeInstance)) {
      if (Utils.isObjectNullOrUndefined(dateInstance)) {
        return null;
      } else {
        return moment(dateInstance.format(ApiConstants.MOMENT_FORMAT_DATE), ApiConstants.MOMENT_FORMAT_DATE);
      }
    } else {
      timeInstance.utcOffset(dateInstance.utcOffset(), true);
      return moment({
        y: dateInstance.year(),
        month: dateInstance.month(),
        utcOffset: dateInstance.utcOffset,
        date: dateInstance.date(),
        hours: timeInstance.hours(),
        minutes: timeInstance.minutes()
      });
    }
  }

  /**
   * Parse date from string as moment value
   * @param {string} value
   * @param {string} localeId
   * @return {moment.Moment} the parsed value
   */
  public static parseMomentDateFromString(value: string, localeId: string): moment.Moment {
    if (Utils.isObjectNullOrUndefined(value)) {
      throw new Error(`Submitted value is null or undefined`);
    }
    if (Utils.isObjectNullOrUndefined(localeId)) {
      throw new Error(`Submitted value for localeId is null or undefined`);
    }

    const result: moment.Moment = moment(value, ValidatorConstants.MOMENT_FORMAT_DATE, localeId, true);
    if (!result.isValid()) {
      throw new Error(`Submitted value ${value} is not a valid moment date string`);
    }
    return result;
  }

  /**
   * Parse time from string as moment value
   * @param {string} value
   * @param {string} localeId
   * @return {moment.Moment} the parsed value
   */
  public static parseMomentTimeFromString(value: string, localeId: string): moment.Moment {
    if (Utils.isStringNullOrEmpty(value)) {
      throw new Error(`value ${value} is null or undefined`);
    }

    if (value.indexOf(':') !== -1) {
      let hours: string = value.substring(0, value.indexOf(':'));
      let minutes: string = value.substring(value.indexOf(':') + 1);
      if (hours.length === 1) {
        hours = '0' + hours;
      }
      if (minutes.length === 1) {
        minutes = '0' + minutes;
      }

      return moment(`${hours}:${minutes}`, 'HH:mm', localeId, true);
    } else if (value.length === 1) {
      return moment(`${value}00`, 'hmm', localeId, true).utc(true);
    } else if (value.length === 2) {
      return moment(`${value}00`, 'HHmm', localeId, true).utc(true);
    } else if (value.length === 3) {
      return moment(value, 'hmm', localeId, true).utc(true);
    } else {
      const mom = moment(value, 'HHmm', localeId, true).utc(true);
      if (!mom.isValid()) {
        throw new Error(`given value ${value} is not a valid time string`);
      }
      return mom;
    }
  }
}
