import { Component } from '@angular/core';
import { Appointment } from '../shared/models';
import { OverviewComponent } from '../overview/overview.component';

@Component({
  selector: 'app-admin-overview',
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.scss'],
  imports: [OverviewComponent]
})
export class AdminOverviewComponent {
  model: Appointment;

  constructor() {}
}
