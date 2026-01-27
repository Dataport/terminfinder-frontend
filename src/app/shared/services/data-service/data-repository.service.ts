import { Injectable, inject } from '@angular/core';
import { ApiDataService } from './api-data-service.service';
import {
  ApiVersion,
  Appointment,
  AppointmentProtectionResult,
  AppointmentStatusType,
  Participant,
  SuggestedDate
} from '../../models/api-data-v1-dto';
import { Logger } from '../logging';
import { AppointmentPasswordValidationResult } from '../../models/api-data-v1-dto/appointmentPasswordValidationResult';

@Injectable({
  providedIn: 'root'
})
export class DataRepositoryService {
  private apiDataService = inject(ApiDataService);
  private logger = inject(Logger);

  /**
   * Get the api version number
   * @returns {Promise<ApiVersion>} the api version number
   */
  public getApiVersion(): Promise<ApiVersion> {
    return this.apiDataService.getApiVersion();
  }

  /**
   * Creates the appointment
   * @returns {Promise<Appointment>} the created appointment
   */
  public createAppointment(appointment: Appointment): Promise<Appointment> {
    return this.apiDataService.createAppointment(appointment);
  }

  /**
   * Update the appointment
   * @returns {Promise<Appointment>} the updated appointment
   */
  public updateAppointment(appointment: Appointment): Promise<Appointment> {
    return this.apiDataService.updateAppointment(appointment);
  }

  /**
   * Reads the appointment by id
   * @returns {Promise<Appointment>} the appointment
   */
  public readAppointmentById(id: string): Promise<Appointment> {
    return this.apiDataService.readAppointmentById(id);
  }

  /**
   * Reads the appointment by admin id
   * @returns {Promise<Appointment>} the appointment
   */
  public readAppointmentByAdminId(id: string): Promise<Appointment> {
    return this.apiDataService.readAppointmentByAdminId(id);
  }

  /**
   * delete participants
   * @returns {Promise<void>} the participants and their votings to delete
   */
  public deleteParticipantsOfAppointmentById(
    appointmentId: string,
    participantsToDelete: Participant[]
  ): Promise<void> {
    const promises: Promise<any>[] = [];

    participantsToDelete.forEach((participant) => {
      promises.push(this.apiDataService.deleteParticipant(appointmentId, participant.participantId));
    });

    return Promise.all(promises).then(() => {
      this.logger.log(`${participantsToDelete.length} Teilnehmer gelöscht`);
      return;
    });
  }

  /**
   * Create or update votings of participants of an appointment and delete participants
   * @returns {Promise<Participant[]>} the participants and their votings
   */
  public createOrUpdateVotingsAndDeleteParticipantsById(
    appointmentId: string,
    participants: Participant[],
    participantsToDelete: Participant[]
  ): Promise<Participant[]> {
    const promises: Promise<any>[] = [];

    participantsToDelete.forEach((participant) => {
      promises.push(this.apiDataService.deleteParticipant(appointmentId, participant.participantId));
    });

    return Promise.all(promises).then(() => {
      this.logger.log(`${participantsToDelete.length} Teilnehmer gelöscht`);
      return this.apiDataService.createOrUpdateParticipantVotingsOfAppointmentById(appointmentId, participants);
    });
  }

  /**
   * update appointment and delete suggested dates if nesseary
   * @returns {Promise<Appointment>}
   */
  public updateAppointmentAndDeleteSuggestedDates(
    appointment: Appointment,
    suggestedDates: SuggestedDate[]
  ): Promise<Appointment> {
    const promises: Promise<any>[] = [];

    suggestedDates.forEach((suggestedDate) => {
      promises.push(this.apiDataService.deleteSuggestedDate(appointment.appointmentId, suggestedDate.suggestedDateId));
    });

    return Promise.all(promises).then(() => {
      this.logger.log(`${suggestedDates.length} Terminvorschlag/Terminvorschläge gelöscht`);
      return this.apiDataService.updateAppointment(appointment);
    });
  }

  /**
   * Returns if the appointment is protected by a password.
   * @returns {Promise<AppointmentProtectionResult>} the protection result
   */
  public isAppointmentProtected(appointmentId: string): Promise<AppointmentProtectionResult> {
    return this.apiDataService.isAppointmentProtected(appointmentId);
  }

  /**
   * Returns if the admin mode is protected by a password.
   * @returns {Promise<AppointmentProtectionResult>} the protection result
   */
  public isAdminProtected(adminId: string): Promise<AppointmentProtectionResult> {
    return this.apiDataService.isAdminProtected(adminId);
  }

  /**
   * Returns if the paswword stored in the appointment model is correct.
   * @returns {Promise<AppointmentPasswordValidationResult>} the validation result
   */
  public isPasswordCorrect(appointmentId: string): Promise<AppointmentPasswordValidationResult> {
    return this.apiDataService.isPasswordCorrect(appointmentId);
  }

  /**
   * Returns if the paswword stored in the appointment model is correct.
   * @returns {Promise<AppointmentPasswordValidationResult>} the validation result
   */
  public isAdminPasswordCorrect(appointmentId: string): Promise<AppointmentPasswordValidationResult> {
    return this.apiDataService.isAdminPasswordCorrect(appointmentId);
  }

  /**
   * Update the appointment status
   * @returns {Promise<Appointment>} the updated appointment
   */
  public updateAppointmentStatus(adminId: string, status: AppointmentStatusType): Promise<Appointment> {
    return this.apiDataService.updateAppointmentStatus(adminId, status);
  }
}
