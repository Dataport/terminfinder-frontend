import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-info',
  templateUrl: './admin-info.component.html',
  styleUrls: ['./admin-info.component.scss'],
  imports: [TranslatePipe]
})
export class AdminInfoComponent {
  constructor() {}
}
