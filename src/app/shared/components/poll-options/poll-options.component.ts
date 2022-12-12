import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-poll-options',
  templateUrl: './poll-options.component.html',
  styleUrls: ['./poll-options.component.scss']
})
export class PollOptionsComponent {
  @Input() formGroup: FormGroup;
  @Input() selectorId: string;
  @Input() isMobile: boolean;

  constructor() {
  }

  getPrefix(): string {
    if (this.isMobile) {
      return 'mobile';
    } else {
      return 'desktop';
    }
  }

}
