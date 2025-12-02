import { Directive, forwardRef, HostAttributeToken, inject } from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn} from '@angular/forms';

const MIN_VALUE = 0;

export function maxLengthArrayValidator(max: number): ValidatorFn {
  if (max < MIN_VALUE) {
    throw new Error(`Submitted value for max is smaller than ${MIN_VALUE}`);
  }
  return (c: AbstractControl): { [key: string]: any } => {
    if (c.value.length <= max) {
      return null;
    }
    return {invalidMaxLengthArray: {valid: false}};
  };
}

@Directive({
  selector: '[appValidateMaxLengthArray][ngModel],[appValidateMaxLengthArray][formControl]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MaxLengthArrayValidatorDirective),
    multi: true
  }],
})
export class MaxLengthArrayValidatorDirective implements Validator {
  validator: Function;

  constructor() {
    const max = inject(new HostAttributeToken('maxLength'));

    this.validator = maxLengthArrayValidator(Number(max));
  }

  validate(c: AbstractControl) {
    return this.validator(c);
  }
}
