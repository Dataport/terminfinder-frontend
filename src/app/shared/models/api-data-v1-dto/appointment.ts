import {SuggestedDate} from './suggestedDate';
import {Participant} from './participant';
import {AppointmentStatusType} from './appointmentStatusType';

export class Appointment {
  appointmentId: string;
  adminId: string;
  creatorName: string;
  subject: string;
  description: string;
  place: string;
  status: AppointmentStatusType = AppointmentStatusType.Started;
  password: string;
  suggestedDates: SuggestedDate[];
  participants: Participant[];
}
