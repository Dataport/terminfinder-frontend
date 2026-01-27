import { Component, inject } from '@angular/core';
import { Participant } from '../shared/models';
import { PollFormHelperService } from './poll-form-helper.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { SuggestedDateComponent } from '../shared/components/suggested-date/suggested-date.component';
import { PollOptionsComponent } from '../shared/components/poll-options/poll-options.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-mobile-poll-table',
  templateUrl: './mobile-poll-table.component.html',
  styleUrls: ['./mobile-poll-table.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    SuggestedDateComponent,
    PollOptionsComponent,
    TranslatePipe
  ]
})
export class MobilePollTableComponent {
  formHelper = inject(PollFormHelperService);

  public getSelectedParticipant(): Participant {
    return this.formHelper.getSelectedParticipantControl().value as Participant;
  }
}
