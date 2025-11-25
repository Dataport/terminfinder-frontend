import {Directive} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn} from '@angular/forms';
import {ValidatorConstants} from '../constants/validatorConstants';

export function invalidNameValidator(): ValidatorFn {
  const nameRe = new RegExp(ValidatorConstants.CHAR_REGEX);
  const emptyStringRe = new RegExp('^[ ]+$');
  return (control: AbstractControl): { [key: string]: any } | null => {
    const matches = control.value === null || control.value === undefined || control.value.toString().length === 0
      || (!emptyStringRe.test(control.value) && nameRe.test(control.value));
    return matches ? null : {'invalidName': {value: control.value}};
  };
}

@Directive({
  selector: '[appInvalidName]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: InvalidNameDirective,
    multi: true
  }],
})
export class InvalidNameDirective implements Validator {
  constructor() {
  }

  validate(control: AbstractControl): { [key: string]: any } | null {
    return invalidNameValidator()(control);
  }
}
