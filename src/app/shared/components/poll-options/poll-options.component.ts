import {Component, Input} from '@angular/core';
import { UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-poll-options',
  templateUrl: './poll-options.component.html',
  styleUrls: ['./poll-options.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, TranslatePipe]
})
export class PollOptionsComponent {
  @Input() formGroup: UntypedFormGroup;
  @Input() selectorId: string;
  @Input() isMobile: boolean;
  votingStatus = ['declined', 'questionable', 'accepted'];

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
