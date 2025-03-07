import moment from 'moment';
import {NullableUtils} from './nullable-utils';
import {ApiConstants} from '../constants/apiConstants';
import {ValidatorConstants} from '../constants/validatorConstants';

export class MomentUtils {
  /**
   * Reset the time to midnight and return a new moment instance
   * @param {moment.Moment} obj
   * @return {moment.Moment} the resulting moment instance
   */
  public static resetTime(obj: moment.Moment): moment.Moment {
    if (NullableUtils.isObjectNullOrUndefined(obj)) {
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
    if (NullableUtils.isObjectNullOrUndefined(timeInstance)) {
      if (NullableUtils.isObjectNullOrUndefined(dateInstance)) {
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
    if (NullableUtils.isStringNullOrWhitespace(value)) {
      throw new Error(`Submitted value is null or whitespace`);
    }
    if (NullableUtils.isStringNullOrWhitespace(localeId)) {
      throw new Error(`Submitted value for localeId is null or whitespace`);
    }

    const momentVariation: moment.Moment = moment(value, ValidatorConstants.MOMENT_FORMAT_DATE_VARIATIONS, localeId, true);
    const result = moment(momentVariation, ValidatorConstants.MOMENT_FORMAT_DATE, localeId, true);

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
    if (NullableUtils.isStringNullOrWhitespace(value)) {
      throw new Error(`value ${value} is null or undefined`);
    }

    return moment(value, 'HH:mm', localeId, true);
  }
}
