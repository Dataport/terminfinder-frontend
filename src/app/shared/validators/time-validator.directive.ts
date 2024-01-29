import {Directive, forwardRef, Inject, LOCALE_ID} from '@angular/core';
import {NG_VALIDATORS, UntypedFormControl, Validator, ValidatorFn} from '@angular/forms';
import {Utils} from '../services/utils';
import {MomentUtils} from '../services/utils/moment-utils';

export function timeValidator(localeId: string): ValidatorFn {
  return (control: UntypedFormControl) => {
    let isValid = !Utils.isStringNullOrEmpty(control.value);

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
  providers: [
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => TimeValidatorDirective), multi: true}
  ]
})
export class TimeValidatorDirective implements Validator {

  validator: Function;

  constructor(@Inject(LOCALE_ID) private localeId: string) {
    this.validator = timeValidator(localeId);
  }

  validate(c: UntypedFormControl) {
    return this.validator(c);
  }
}
