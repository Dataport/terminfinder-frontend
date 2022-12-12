import {Attribute, Directive, forwardRef} from '@angular/core';
import {NG_VALIDATORS, AbstractControl, Validator, ValidatorFn} from '@angular/forms';

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
  providers: [
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => MaxLengthArrayValidatorDirective), multi: true}
  ]
})
export class MaxLengthArrayValidatorDirective implements Validator {
  validator: Function;

  constructor(@Attribute('maxLength') max: number) {
    this.validator = maxLengthArrayValidator(max);
  }

  validate(c: AbstractControl) {
    return this.validator(c);
  }
}
