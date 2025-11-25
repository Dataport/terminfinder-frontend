import { Directive, forwardRef, HostAttributeToken, inject } from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn} from '@angular/forms';

const MIN_VALUE = 0;

export function minLengthArrayValidator(min: number): ValidatorFn {
  if (min < MIN_VALUE) {
    throw new Error(`Submitted value for min is smaller than ${MIN_VALUE}`);
  }
  return (c: AbstractControl): { [key: string]: any } => {
    if (c.value.length >= min) {
      return null;
    }
    return {invalidMinLengthArray: {valid: false}};
  };
}

@Directive({
  selector: '[appValidateMinLengthArray][ngModel],[appValidateMinLengthArray][formControl]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MinLengthArrayValidatorDirective),
    multi: true
  }],
})
export class MinLengthArrayValidatorDirective implements Validator {
  private min = inject(new HostAttributeToken('minLength'));

  validator: Function;

  constructor() {
    const min = this.min;

    this.validator = minLengthArrayValidator(Number(min));
  }

  validate(c: AbstractControl) {
    return this.validator(c);
  }
}
