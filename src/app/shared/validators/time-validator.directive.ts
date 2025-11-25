import { Directive, forwardRef, LOCALE_ID, inject } from '@angular/core';
import {NG_VALIDATORS, UntypedFormControl, Validator, ValidatorFn} from '@angular/forms';
import {MomentUtils, NullableUtils} from '../utils';

export function timeValidator(localeId: string): ValidatorFn {
  return (control: UntypedFormControl) => {
    let isValid = !NullableUtils.isStringNullOrEmpty(control.value);

    if (isValid) {
      try {
        isValid = MomentUtils.parseMomentTimeFromString(control.value, localeId).isValid();
      } catch (e) {
        isValid = false;
      }
    } else {
      // pass for undefined or null value
      isValid = true;
    }

    return isValid ? null : {
      invalidTime: {
        valid: false
      }
    };
  };
}

@Directive({
  selector: '[appValidateTime][ngModel],[appValidateTime][formControl]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => TimeValidatorDirective),
    multi: true
  }],
})
export class TimeValidatorDirective implements Validator {
  private localeId = inject(LOCALE_ID);


  validator: Function;

  constructor() {
    const localeId = this.localeId;

    this.validator = timeValidator(localeId);
  }

  validate(c: UntypedFormControl) {
    return this.validator(c);
  }
}
