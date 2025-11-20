import {Component} from '@angular/core';
import {Appointment} from '../shared/models';

@Component({
  selector: 'app-admin-overview',
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.scss'],
  standalone: false
})
export class AdminOverviewComponent {
  model: Appointment;

  constructor() {
  }

}
