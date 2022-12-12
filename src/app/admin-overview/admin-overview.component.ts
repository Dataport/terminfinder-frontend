import {Component} from '@angular/core';
// import {Router} from '@angular/router';
import {Appointment} from '../shared/models';

// import {AppStateService} from '../shared/services/app-state/app-state.service';

@Component({
  selector: 'app-admin-overview',
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.scss']
})
export class AdminOverviewComponent {
  model: Appointment;

  constructor() {
  }

}
