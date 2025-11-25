import { Injectable } from '@angular/core';
import { EnvConfig } from '../../../../environments/env-config.interface';
import { environment } from '../../../../environments/environment';
import { Appointment } from '../../models';
import { NullableUtils } from '../../utils';
import { AppointmentStatusType } from '../../models/appointmentStatusType';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  isAdmin = false;
  isAppointmentProtected = false;
  private appointment: Appointment = {
    adminId: '',
    appointmentId: '',
    name: '',
    title: '',
    location: '',
    description: '',
    password: '',
    suggestedDates: [],
    suggestedDatesToDelete: [],
    participants: [],
    status: AppointmentStatusType.Started
  };
  private credentials = '';

  constructor() {}

  // noinspection JSMethodCanBeStatic
  public getEnvConfig(): EnvConfig {
    return environment;
  }

  public createNewAppointment() {
    this.appointment = {
      adminId: '',
      appointmentId: '',
      name: '',
      title: '',
      location: '',
      description: '',
      password: '',
      suggestedDates: [],
      suggestedDatesToDelete: [],
      participants: [],
      status: AppointmentStatusType.Started
    };
  }

  public getAppointment(): Appointment {
    return this.appointment;
  }

  public updateAppointment(appointment: Appointment) {
    if (NullableUtils.isObjectNullOrUndefined(appointment)) {
      throw new Error('Appointment is null or undefined');
    }
    this.appointment = appointment;
  }

  public updateCredentials(password: string) {
    if (this.isAdmin) {
      this.credentials = btoa(`${this.appointment.adminId}:${password}`);
    } else {
      this.credentials = btoa(`${this.getEnvConfig().customerId}:${password}`);
    }
  }

  public getCredentials(): string {
    return this.credentials;
  }
}
