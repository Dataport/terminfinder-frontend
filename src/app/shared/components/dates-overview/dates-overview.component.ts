import {Component, Input} from '@angular/core';
import {Appointment} from '../../models';

@Component({
  selector: 'app-dates-overview',
  templateUrl: './dates-overview.component.html',
  styleUrls: ['./dates-overview.component.scss'],
  standalone: false
})
export class DatesOverviewComponent {
  @Input() appointment: Appointment;

  constructor() {
  }

}
