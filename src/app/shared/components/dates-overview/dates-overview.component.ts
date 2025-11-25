import {Component, input} from '@angular/core';
import {Appointment} from '../../models';
import { SuggestedDateComponent } from '../suggested-date/suggested-date.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-dates-overview',
  templateUrl: './dates-overview.component.html',
  styleUrls: ['./dates-overview.component.scss'],
  imports: [SuggestedDateComponent, TranslatePipe]
})
export class DatesOverviewComponent {
  readonly appointment = input<Appointment>(undefined);

  constructor() {
  }

}
