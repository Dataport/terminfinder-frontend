import {Component} from '@angular/core';
import {Appointment} from '../shared/models';

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
