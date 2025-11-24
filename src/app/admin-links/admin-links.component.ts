import {Component} from '@angular/core';
import {Appointment} from '../shared/models';
import { LinksComponent } from '../links/links.component';

@Component({
  selector: 'app-admin-links',
  templateUrl: './admin-links.component.html',
  styleUrls: ['./admin-links.component.scss'],
  imports: [LinksComponent]
})
export class AdminLinksComponent {
  model: Appointment;

  constructor() {
  }

}
