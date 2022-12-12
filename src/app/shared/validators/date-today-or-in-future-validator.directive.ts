import {Directive, forwardRef, Inject, LOCALE_ID} from '@angular/core';
import {NG_VALIDATORS, FormControl, Validator, ValidatorFn} from '@angular/forms';
import * as moment from 'moment';
import {DateTimeGeneratorService, Utils} from '../services/utils';
import {dateValidator} from './date-validator.directive';
import {ValidatorUtils} from './validator-utils';
import {MomentUtils} from '../services/utils/moment-utils';

export function dateInFutureOrTodayValidator(localeId: string, dateTimeGenerator: DateTimeGeneratorService): ValidatorFn {
  return (control: FormControl) => {
    if (Utils.isObjectNullOrUndefined(control.value)) {
      return null;
    }
    const isValidDate: boolean = (dateValidator(localeId))(control) === null;
    if (!isValidDate) {
      return null;
    }

    const type = typeof (control.value);
    let input_string;

    if (type === 'object') {
      input_string = ValidatorUtils.serializeDateFromNgbDateStruct(control.value, localeId);
    } else {
      input_string = control.value;
    }

    const parsedDate = MomentUtils.parseMomentDateFromString(input_string, localeId);
    const now: moment.Moment = dateTimeGenerator.now();
    const isValidValue = parsedDate.isSame(now, 'day') || parsedDate.isAfter(now);
    return isValidValue ? null : {
      invalidDateNotTodayNorInFuture: {
        valid: false
      }
    };
  };
}

@Directive({
  selector: '[appValidateDateInFuture][ngModel],[appValidateDateInFuture][formControl]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => DateTodayOrInFutureValidatorDirective), multi: true}
  ]
})
export class DateTodayOrInFutureValidatorDirective implements Validator {

  validator: Function;

  constructor(@Inject(LOCALE_ID) private localeId: string, private dateTimeGenerator: DateTimeGeneratorService) {
    this.validator = dateInFutureOrTodayValidator(localeId, dateTimeGenerator);
  }

  validate(c: FormControl) {
    return this.validator(c);
  }
}
