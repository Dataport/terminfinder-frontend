import {Component} from '@angular/core';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss'],
  imports: [SettingsComponent]
})
export class AdminSettingsComponent {

  constructor() {
  }

}
