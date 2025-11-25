import { Component } from '@angular/core';
import { CreateSuggestedDatesComponent } from '../create-suggested-dates/create-suggested-dates.component';

@Component({
  selector: 'app-admin-suggested-dates',
  templateUrl: './admin-suggested-dates.component.html',
  styleUrls: ['./admin-suggested-dates.component.scss'],
  imports: [CreateSuggestedDatesComponent]
})
export class AdminSuggestedDatesComponent {
  constructor() {}
}
