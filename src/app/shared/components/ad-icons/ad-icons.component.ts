import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-ad-icons',
  templateUrl: './ad-icons.component.html',
  styleUrl: './ad-icons.component.scss',
  imports: [TranslatePipe]
})
export class AdIconsComponent {
  constructor() {}
}
