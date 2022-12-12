import {Component} from '@angular/core';
// import {Router} from '@angular/router';
import {Appointment} from '../shared/models';

// import {AppStateService} from '../shared/services/app-state/app-state.service';

@Component({
  selector: 'app-admin-links',
  templateUrl: './admin-links.component.html',
  styleUrls: ['./admin-links.component.scss']
})
export class AdminLinksComponent {
  model: Appointment;

  constructor() {
  }

}
