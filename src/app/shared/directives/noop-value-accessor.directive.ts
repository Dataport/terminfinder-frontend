import { Directive } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * use as host directive to forward outside formControl like this:
 * https://netbasal.com/forwarding-form-controls-to-custom-control-components-in-angular-701e8406cc55
 */
@Directive({
  selector: '[appNoopValueAccessor]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: NoopValueAccessorDirective
    }
  ]
})
export class NoopValueAccessorDirective implements ControlValueAccessor {
  writeValue(): void {}

  registerOnChange(): void {}

  registerOnTouched(): void {}
}
