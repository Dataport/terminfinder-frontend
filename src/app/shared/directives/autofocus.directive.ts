import { AfterContentInit, Directive, ElementRef, input, inject } from '@angular/core';

@Directive({ selector: '[appAutoFocus]' })
export class AutofocusDirective implements AfterContentInit {
  private el = inject(ElementRef);

  public readonly autoFocus = input<boolean>(true);

  public ngAfterContentInit(): void {
    if (this.autoFocus()) {
      window.setTimeout(() => {
        this.el.nativeElement.focus();
      });
    }
  }
}
