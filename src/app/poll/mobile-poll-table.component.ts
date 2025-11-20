import {Component} from '@angular/core';
import {Participant} from '../shared/models';
import {PollFormHelperService} from './poll-form-helper.service';

@Component({
  selector: 'app-mobile-poll-table',
  templateUrl: './mobile-poll-table.component.html',
  styleUrls: ['./mobile-poll-table.component.scss'],
  standalone: false
})
export class MobilePollTableComponent {
  constructor(
    public formHelper: PollFormHelperService
  ) {
  }

  public getSelectedParticipant(): Participant {
    return this.formHelper.getSelectedParticipantControl().value as Participant;
  }
}
