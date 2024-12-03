import {Directive, forwardRef, Inject, LOCALE_ID} from '@angular/core';
import {NG_VALIDATORS, UntypedFormControl, Validator, ValidatorFn} from '@angular/forms';
import * as moment from 'moment';
import {NullableUtils} from '../utils';
import {ValidatorConstants} from '../constants/validatorConstants';

export function dateValidator(localeId: string): ValidatorFn {
  return (control: UntypedFormControl) => {
    const type = typeof (control.value);
    let isValid: boolean;
    if (type === 'object') {
      isValid = true;
    } else {
      isValid = !NullableUtils.isStringNullOrEmpty(control.value)
        ? moment(control.value, ValidatorConstants.MOMENT_FORMAT_DATE_VARIATIONS, localeId, true).isValid()
        : true;
    }
    return isValid ? null : {
      invalidDate: {
        valid: false
      }
    };
  };
}

@Directive({
  selector: '[appValidateDate][ngModel],[appValidateDate][formControl]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => DateValidatorDirective), multi: true}
  ]
})
export class DateValidatorDirective implements Validator {
  validator: Function;

  constructor(@Inject(LOCALE_ID) private localeId: string) {
    this.validator = dateValidator(localeId);
  }

  validate(c: UntypedFormControl) {
    return this.validator(c);
  }
}
