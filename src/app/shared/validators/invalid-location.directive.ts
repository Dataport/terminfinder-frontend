import {Directive} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn} from '@angular/forms';
import {invalidNameValidator} from './invalid-name.directive';

export function invalidLocationValidator(): ValidatorFn {
  return invalidNameValidator();
}

@Directive({
  selector: '[appInvalidLocation]',
  providers: [{provide: NG_VALIDATORS, useExisting: InvalidLocationDirective, multi: true}]
})
export class InvalidLocationDirective implements Validator {
  constructor() {
  }

  validate(control: AbstractControl): { [key: string]: any } | null {
    return invalidNameValidator()(control);
  }
}
