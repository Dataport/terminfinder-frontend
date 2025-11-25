import { SuggestedDate } from './suggestedDate';
import { Participant } from './participant';
import { AppointmentStatusType } from './appointmentStatusType';

export class Appointment {
  appointmentId: string;
  adminId: string;
  name: string;
  title: string;
  location: string;
  description: string;
  password: string;
  suggestedDates: SuggestedDate[];
  suggestedDatesToDelete: SuggestedDate[];
  participants: Participant[];
  status: AppointmentStatusType;
}
