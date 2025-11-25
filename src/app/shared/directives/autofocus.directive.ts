import { AfterContentInit, Directive, ElementRef, input } from '@angular/core';

@Directive({ selector: '[appAutoFocus]' })
export class AutofocusDirective implements AfterContentInit {
  public readonly autoFocus = input<boolean>(true);

  constructor(private el: ElementRef) {}

  public ngAfterContentInit(): void {
    if (this.autoFocus()) {
      window.setTimeout(() => {
        this.el.nativeElement.focus();
      });
    }
  }
}
