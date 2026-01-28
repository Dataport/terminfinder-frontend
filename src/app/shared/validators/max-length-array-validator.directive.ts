import { AbstractControl, ValidatorFn } from '@angular/forms';

const MIN_VALUE = 0;

export function maxLengthArrayValidator(max: number): ValidatorFn {
  if (max < MIN_VALUE) {
    throw new Error(`Submitted value for max is smaller than ${MIN_VALUE}`);
  }
  return (c: AbstractControl): { [key: string]: any } => {
    if (c.value.length <= max) {
      return null;
    }
    return { invalidMaxLengthArray: { valid: false } };
  };
}
