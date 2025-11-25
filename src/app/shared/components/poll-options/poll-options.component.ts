import { Component, input } from '@angular/core';
import { UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-poll-options',
  templateUrl: './poll-options.component.html',
  styleUrls: ['./poll-options.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe
  ]
})
export class PollOptionsComponent {
  readonly formGroup = input<UntypedFormGroup>(undefined);
  readonly selectorId = input<string>(undefined);
  readonly isMobile = input<boolean>(undefined);
  votingStatus = [
    'declined',
    'questionable',
    'accepted'
  ];

  constructor() {}

  getPrefix(): string {
    if (this.isMobile()) {
      return 'mobile';
    } else {
      return 'desktop';
    }
  }
}
