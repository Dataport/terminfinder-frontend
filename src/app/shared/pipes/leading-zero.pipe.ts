import {Pipe, PipeTransform} from '@angular/core';
import {NullableUtils} from '../utils';

@Pipe({ name: 'leadingZero' })
export class LeadingZeroPipe implements PipeTransform {
  private static readonly MIN_SIZE = 1;

  transform(value: number, size: number = LeadingZeroPipe.MIN_SIZE): any {
    if (size < LeadingZeroPipe.MIN_SIZE) {
      throw new Error(`Submitted value ${size} for size is smaller than ${LeadingZeroPipe.MIN_SIZE}`);
    }
    if (NullableUtils.isObjectNullOrUndefined(value)) {
      return '0';
    }

    let result = value + '';
    if (value < 0) {
      return result;
    }
    while (result.length < size) {
      result = '0' + result;
    }
    return result;
  }
}
