import {Directive, HostListener} from "@angular/core";

@Directive({
  selector: 'input[appTimeInput]',
  standalone: false
})
export class TimeInputDirective {
  regexInvalidChars = /[^0-9:]/;

  constructor() {
  }

  @HostListener('keypress', ['$event']) onInput(event: KeyboardEvent): void {
    if (this.regexInvalidChars.test(event.key)) {
      event.preventDefault();
    }
  }
}
