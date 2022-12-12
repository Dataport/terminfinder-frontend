import {AfterContentInit, Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[appAutoFocus]'
})
export class AutofocusDirective implements AfterContentInit {

  @Input() public autoFocus: boolean;

  constructor(private el: ElementRef) {
  }

  public ngAfterContentInit(): void {
    window.setTimeout(() => {
      this.el.nativeElement.focus();
    });
  }
}
