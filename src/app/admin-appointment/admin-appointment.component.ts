import {Component} from '@angular/core';
import { CreateAppointmentComponent } from '../create-appointment/create-appointment.component';

@Component({
  selector: 'app-poll-admin',
  templateUrl: './admin-appointment.component.html',
  styleUrls: ['./admin-appointment.component.scss'],
  imports: [CreateAppointmentComponent]
})
export class AdminAppointmentComponent {
}
