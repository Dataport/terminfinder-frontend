import * as moment from 'moment';
import {ValidatorConstants} from '../constants/validatorConstants';
import {NullableUtils} from '../utils';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {AbstractControl} from '@angular/forms';
import {MomentUtils} from '../utils/moment-utils';

export class ValidatorUtils {
  /**
   * Serialize date or time from iso string to moment instance
   * @param {string} value
   * @param {string} localeId
   * @return {moment.Moment} the parsed value
   */
  public static parseMomentFromIsoString(value: string, localeId: string): moment.Moment {
    if (NullableUtils.isObjectNullOrUndefined(value)) {
      throw new Error(`Submitted value for value is null or undefined`);
    }
    if (NullableUtils.isObjectNullOrUndefined(localeId)) {
      throw new Error(`Submitted value for localeId is null or undefined`);
    }

    const result: moment.Moment = moment(value, moment.ISO_8601, localeId, true);
    if (!result.isValid()) {
      throw new Error(`Submitted value ${value} is not a valid moment date string`);
    }

    return result;
  }

  /**
   * Serialize time from moment instance to string
   * @param {string} value
   * @param {string} localeId
   * @return {moment.Moment} the parsed value
   */
  public static serializeTimeFromMoment(value: moment.Moment, localeId: string): string {
    if (NullableUtils.isObjectNullOrUndefined(value)) {
      throw new Error(`Submitted value for value is null or undefined`);
    }
    if (NullableUtils.isObjectNullOrUndefined(localeId)) {
      throw new Error(`Submitted value for localeId is null or undefined`);
    }
    if (!value.isValid()) {
      throw new Error(`Submitted value ${value} is an invalid moment instance`);
    }

    value.locale(localeId);

    return value.format(ValidatorConstants.MOMENT_FORMAT_TIME);
  }

  public static serializeDateFromNgbDateStruct(date: NgbDateStruct, localeId: string): string {
    if (NullableUtils.isObjectNullOrUndefined(date)) {
      throw new Error(`Submitted value for date is null or undefined`);
    }
    if (NullableUtils.isObjectNullOrUndefined(localeId)) {
      throw new Error(`Submitted value for localeId is null or undefined`);
    }

    try {
      return this.parseMomentFromNgbDateStruct(date, localeId).format(ValidatorConstants.MOMENT_FORMAT_DATE);
    } catch (e) {
      return '';
    }
  }

  public static parseMomentFromNgbDateStruct(date: NgbDateStruct, localeId: string): moment.Moment {
    if (NullableUtils.isObjectNullOrUndefined(date)) {
      throw new Error(`Submitted value for date is null or undefined`);
    }
    if (NullableUtils.isObjectNullOrUndefined(localeId)) {
      throw new Error(`Submitted value for localeId is null or undefined`);
    }

    const result = moment({year: date.year, month: date.month - 1, day: date.day}).locale(localeId).utc(true);
    if (!result.isValid()) {
      throw new Error(`Submitted date is not a valid moment date string`);
    }

    return result;
  }

  public static parseNgbDateStructFromMoment(value: moment.Moment, localeId: string): NgbDateStruct {
    if (NullableUtils.isObjectNullOrUndefined(value)) {
      throw new Error(`Submitted value for value is null or undefined`);
    }
    if (NullableUtils.isObjectNullOrUndefined(localeId)) {
      throw new Error(`Submitted value for localeId is null or undefined`);
    }

    value.locale(localeId);
    return {year: value.year(), month: value.month() + 1, day: value.date()};
  }

  public static pad(value: number, length: number): string {
    if (NullableUtils.isObjectNullOrUndefined(value)) {
      throw new Error(`Submitted value for value is null or undefined`);
    }
    if (NullableUtils.isObjectNullOrUndefined(length)) {
      throw new Error(`Submitted value for length is null or undefined`);
    }

    return String(value).padStart(length, '0');
  }

  /***
   * parses the value of a control, without knowing if value is NgbDateStruct or string
   * @param control AbstractControl, the control to parse for its value
   * @param localeId string, the localeId that should be used while parsing
   */
  public static parseDateValue(control: AbstractControl, localeId: string): moment.Moment {
    if (NullableUtils.isObjectNullOrUndefined(control)) {
      throw new Error('control is null or undefined');
    }

    const type: string = typeof (control.value);
    if (type === 'string') {
      return MomentUtils.parseMomentDateFromString(control.value, localeId);
    } else if (type === 'object') {
      return ValidatorUtils.parseMomentFromNgbDateStruct(control.value, localeId);
    } else {
      throw new Error('unknown input type');
    }
  }
}
