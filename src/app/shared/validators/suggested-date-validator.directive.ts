import {Directive, forwardRef, Inject, LOCALE_ID} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn} from '@angular/forms';
import {ValidatorUtils} from './validator-utils';
import {DateTimeGeneratorService} from '../services/utils';
import * as moment from 'moment';
import {MomentUtils} from '../services/utils/moment-utils';
import {SuggestedDatesFormConstants} from '../../create-suggested-dates/suggested-dates-form-constants';

export function suggestedDateValidator(localeId: string, dateTimeGenerator: DateTimeGeneratorService): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const startDateControl = control.get(SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_START_DATE);
    const startTimeControl = control.get(SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_START_TIME);
    const hasEndDateOnDifferentDay = (control
      .get(SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_SHOW_SUGGESTED_START_DATE_ON_DIFFERENT_DAY_FORM).value as boolean);
    const endTimeControl = (hasEndDateOnDifferentDay)
      ? control.get(SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_END_DATE_END_TIME)
      : control.get(SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_START_DATE_END_TIME);
    const endDateControl = control.get(SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_END_DATE);

    control.get('startDateEndTime');
    if (startDateControl.invalid || startTimeControl.invalid || endTimeControl.invalid) {
      return null;
    }

    let startTime: moment.Moment;
    try {
      startTime = MomentUtils.parseMomentTimeFromString(startTimeControl.value, localeId);
    } catch (e) {
      startTime = null;
    }

    let endTime: moment.Moment;
    try {
      endTime = MomentUtils.parseMomentTimeFromString(endTimeControl.value, localeId);
    } catch (e) {
      endTime = null;
    }

    if (startTime === null && endTime !== null) {
      return {endTimeEnteredButNoStartTimeEntered: {valid: false}};
    }

    let startDate: moment.Moment;
    try {
      startDate = ValidatorUtils.parseDateValue(startDateControl, localeId);
    } catch (e) {
      startDate = null;
    }

    let endDate: moment.Moment;
    try {
      endDate = ValidatorUtils.parseDateValue(endDateControl, localeId);
    } catch (e) {
      endDate = null;
    }

    const startDateTime: moment.Moment = MomentUtils.concatDateTime(startDate, startTime);
    const endDateTime: moment.Moment = MomentUtils.concatDateTime(
      endDate === null ? startDate : endDate,
      endTime === null ? startTime : endTime);

    const now: moment.Moment = dateTimeGenerator.now();
    const isStartDateTimeSameDayOrSameOrAfterCurrentDateTime = startTime !== null
      ? startDateTime.isSameOrAfter(now)
      : startDate?.isSame(now, 'day') || startDate?.isSameOrAfter(now);
    if (!isStartDateTimeSameDayOrSameOrAfterCurrentDateTime) {
      return {startDateTimeInPast: {valid: false}};
    }
    const isStartDateAfterEndDate = endTime !== null || (hasEndDateOnDifferentDay && endDate !== null)
      ? startDateTime.isSameOrAfter(endDateTime)
      : false;
    if (isStartDateAfterEndDate) {
      return {startDateAfterEndDate: {valid: false}};
    }


    /*if (endTime === null && endDate === null) {
      return null;
    }*/
    return null;
  };
}

@Directive({
  selector: '[appValidateSuggestedDate][ngModel],[appValidateSuggestedDate][formControl]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => SuggestedDateValidatorDirective), multi: true}
  ]
})
export class SuggestedDateValidatorDirective implements Validator {
  constructor(@Inject(LOCALE_ID) private localeId: string, private dateTimeGenerator: DateTimeGeneratorService) {
  }

  validate(control: AbstractControl): { [key: string]: any } | null {
    return suggestedDateValidator(this.localeId, this.dateTimeGenerator)(control);
  }
}
