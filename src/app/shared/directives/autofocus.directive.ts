import {AfterContentInit, Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
  standalone: false
})
export class AutofocusDirective implements AfterContentInit {

  @Input() public autoFocus: boolean = true;

  constructor(private el: ElementRef) {
  }

  public ngAfterContentInit(): void {
    if (this.autoFocus) {
      window.setTimeout(() => {
        this.el.nativeElement.focus();
      });
    }
  }
}
