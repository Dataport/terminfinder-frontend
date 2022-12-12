import {Directive} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn} from '@angular/forms';
import {ValidatorConstants} from '../constants/validatorConstants';

const passwordValidCharset = `^[${ValidatorConstants.PASSWORD_ALLOWED_CHARS}${ValidatorConstants.PASSWORD_SPECIAL_CHARS}]*$`;
const passwordNumberRegex = `^(?=(.*[0-9]){${ValidatorConstants.MIN_NUMBER_PASSWORD},}).*$`;
const passwordCapitalRegex = `^(?=(.*[A-Z]){${ValidatorConstants.MIN_CAPITAL_CHARS_PASSWORD},}).*$`;
const passwordSpecialRegex =
  `^(?=(.*[${ValidatorConstants.PASSWORD_SPECIAL_CHARS}]){${ValidatorConstants.MIN_SPECIAL_CHARS_PASSWORD},}).*$`;
const passwordLengthRegex = `^.{${ValidatorConstants.MIN_LENGHT_PASSWORD},${ValidatorConstants.MAX_LENGHT_PASSWORD}}$`;

export function invalidPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const val = control.value;
    const valid = val === null || val === undefined || val.toString().length === 0 || (
      new RegExp(passwordValidCharset).test(val) &&
      new RegExp(passwordNumberRegex).test(val) &&
      new RegExp(passwordCapitalRegex).test(val) &&
      new RegExp(passwordSpecialRegex).test(val) &&
      new RegExp(passwordLengthRegex).test(val)
    );
    return valid ? null : {'invalidPassword': {value: control.value}};
  };
}

@Directive({
  selector: '[appInvalidPassword]',
  providers: [{provide: NG_VALIDATORS, useExisting: InvalidPasswordDirective, multi: true}]
})
export class InvalidPasswordDirective implements Validator {
  constructor() {
  }

  validate(control: AbstractControl): { [key: string]: any } | null {
    return invalidPasswordValidator()(control);
  }
}
