import { Directive, forwardRef, LOCALE_ID, inject } from '@angular/core';
import { NG_VALIDATORS, UntypedFormControl, Validator, ValidatorFn } from '@angular/forms';
import moment from 'moment';
import { DateTimeGeneratorService } from '../services/generators';
import { dateValidator } from './date-validator.directive';
import { ValidatorUtils } from './validator-utils';
import { MomentUtils, NullableUtils } from '../utils';

export function dateInFutureOrTodayValidator(
  localeId: string,
  dateTimeGenerator: DateTimeGeneratorService
): ValidatorFn {
  return (control: UntypedFormControl) => {
    if (NullableUtils.isObjectNullOrUndefined(control.value)) {
      return null;
    }
    const isValidDate: boolean = dateValidator(localeId)(control) === null;
    if (!isValidDate) {
      return null;
    }

    const type = typeof control.value;
    let input_string;

    if (type === 'object') {
      input_string = ValidatorUtils.serializeDateFromNgbDateStruct(control.value, localeId);
    } else {
      input_string = control.value;
    }

    const parsedDate = MomentUtils.parseMomentDateFromString(input_string, localeId);
    const now: moment.Moment = dateTimeGenerator.now();
    const isValidValue = parsedDate.isSame(now, 'day') || parsedDate.isAfter(now);
    return isValidValue
      ? null
      : {
          invalidDateNotTodayNorInFuture: {
            valid: false
          }
        };
  };
}

@Directive({
  selector: '[appValidateDateInFuture][ngModel],[appValidateDateInFuture][formControl]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateTodayOrInFutureValidatorDirective),
      multi: true
    }
  ]
})
export class DateTodayOrInFutureValidatorDirective implements Validator {
  private localeId = inject(LOCALE_ID);
  private dateTimeGenerator = inject(DateTimeGeneratorService);

  validator: Function;

  constructor() {
    this.validator = dateInFutureOrTodayValidator(this.localeId, this.dateTimeGenerator);
  }

  validate(c: UntypedFormControl) {
    return this.validator(c);
  }
}
