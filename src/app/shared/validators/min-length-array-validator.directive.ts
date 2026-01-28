import { AbstractControl, ValidatorFn } from '@angular/forms';

const MIN_VALUE = 0;

export function minLengthArrayValidator(min: number): ValidatorFn {
  if (min < MIN_VALUE) {
    throw new Error(`Submitted value for min is smaller than ${MIN_VALUE}`);
  }
  return (c: AbstractControl): { [key: string]: any } => {
    if (c.value.length >= min) {
      return null;
    }
    return { invalidMinLengthArray: { valid: false } };
  };
}
