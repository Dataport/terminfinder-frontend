import { inject } from '@angular/core';
import { FormControlDirective, FormControlName, NgControl, NgModel } from '@angular/forms';

export function injectNgControl() {
  const ngControl = inject(NgControl, { self: true, optional: true });

  if (!ngControl) {
    throw new Error('NgControl is not available. Make sure the component is associated with a form control.');
  }

  if (
    ngControl instanceof FormControlDirective ||
    ngControl instanceof FormControlName ||
    ngControl instanceof NgModel
  ) {
    return ngControl;
  }

  throw new Error('Invalid NgControl type. Expected FormControlDirective, FormControlName, or NgModel.');
}
