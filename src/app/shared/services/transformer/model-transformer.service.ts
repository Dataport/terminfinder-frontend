import {Injectable} from '@angular/core';
import {
  Appointment as ApiAppointment,
  AppointmentStatusType as ApiAppointmentStatusType,
  Participant as ApiParticipant,
  SuggestedDate as ApiSuggestedDate,
  Voting as ApiVoting,
  VotingStatusType as ApiVotingStatusType
} from '../../models/api-data-v1-dto';
import {Appointment, Participant, SuggestedDate, Voting, VotingStatusType} from '../../models';
import {NullableUtils} from '../../utils';
import * as moment from 'moment';
import {ApiConstants} from '../../constants/apiConstants';
import {AppointmentStatusType} from '../../models/appointmentStatusType';

@Injectable({
  providedIn: 'root'
})
export class ModelTransformerService {

  constructor() {
  }

  /**
   * Transform appointment instance to api appointment instance
   * @return the transformed instance
   * */
  static transformAppointmentToApiAppointment(appointment: Appointment): ApiAppointment | null {
    if (NullableUtils.isObjectNullOrUndefined(appointment)) {
      return null;
    }

    const apiAppointment = new ApiAppointment();
    apiAppointment.appointmentId = appointment.appointmentId;
    apiAppointment.adminId = appointment.adminId;
    apiAppointment.creatorName = appointment.name;
    apiAppointment.subject = appointment.title;
    apiAppointment.place = appointment.location;
    apiAppointment.description = appointment.description;
    apiAppointment.password = appointment.password;
    apiAppointment.suggestedDates = ModelTransformerService.transformSuggestedDatesToApiSuggestedDates(appointment.suggestedDates);
    apiAppointment.participants = ModelTransformerService.transformParticipantsToApiParticipants(appointment.participants);
    apiAppointment.status = ModelTransformerService.transformAppointmentStatusTypeToApiAppointmentStatusType(appointment.status);

    return apiAppointment;
  }

  /**
   * Transform suggested date instances to api suggested date instances
   * @return the transformed instances
   * */
  static transformSuggestedDatesToApiSuggestedDates(suggestedDates: SuggestedDate[]): ApiSuggestedDate[] {
    const result: ApiSuggestedDate[] = [];
    if (NullableUtils.isObjectNullOrUndefined(suggestedDates)) {
      return result;
    }
    for (let i = 0, len = suggestedDates.length; i < len; ++i) {
      const itemToAdd = ModelTransformerService.transformSuggestedDateToApiSuggestedDate(suggestedDates[i]);
      if (!NullableUtils.isObjectNullOrUndefined(itemToAdd)) {
        result.push(itemToAdd);
      }
    }
    return result;
  }

  /**
   * Transform suggested date instance to api suggested date instance
   * @return the transformed instance
   * */
  static transformSuggestedDateToApiSuggestedDate(suggestedDate: SuggestedDate): ApiSuggestedDate | null {
    if (NullableUtils.isObjectNullOrUndefined(suggestedDate)) {
      return null;
    }
    // convert date/time strings to moment values
    const startMoment = ModelTransformerService.createMomentFromDateAndTime(suggestedDate.startDate, suggestedDate.startTime);
    const endMoment = NullableUtils.isObjectNullOrUndefined(suggestedDate.endDate)
      ? ModelTransformerService.createMomentFromDateAndTime(suggestedDate.startDate, suggestedDate.endTime)
      : ModelTransformerService.createMomentFromDateAndTime(suggestedDate.endDate, suggestedDate.endTime);
    const setEndDate = !NullableUtils.isObjectNullOrUndefined(suggestedDate.endDate) || !NullableUtils.isObjectNullOrUndefined(suggestedDate.endTime);
    return {
      suggestedDateId: suggestedDate.suggestedDateId,
      startDate: startMoment.format(ApiConstants.MOMENT_FORMAT_DATE),
      startTime: !NullableUtils.isObjectNullOrUndefined(suggestedDate.startTime) ? startMoment.format(ApiConstants.MOMENT_FORMAT_TIME) : null,
      endDate: setEndDate ? endMoment.format(ApiConstants.MOMENT_FORMAT_DATE) : null,
      endTime: !NullableUtils.isObjectNullOrUndefined(suggestedDate.endTime) ? endMoment.format(ApiConstants.MOMENT_FORMAT_TIME) : null,
      description: !NullableUtils.isStringNullOrWhitespace(suggestedDate.description) ? suggestedDate.description : null
    } as ApiSuggestedDate;
  }

  /**
   * Transform participant instances to api participant instances
   * @return the transformed instances
   * */
  static transformParticipantsToApiParticipants(participants: Participant[]): ApiParticipant[] {
    const result: ApiParticipant[] = [];
    if (NullableUtils.isObjectNullOrUndefined(participants)) {
      return result;
    }
    for (let i = 0, len = participants.length; i < len; ++i) {
      const itemToAdd = ModelTransformerService.transformParticipantToApiParticipant(participants[i]);
      if (!NullableUtils.isObjectNullOrUndefined(itemToAdd)) {
        result.push(itemToAdd);
      }
    }
    return result;
  }

  /**
   * Transform a participant instance to an api participant instance
   * @return the transformed instances
   * */
  static transformParticipantToApiParticipant(participant: Participant): ApiParticipant | null {
    if (NullableUtils.isObjectNullOrUndefined(participant)) {
      return null;
    }
    return {
      name: participant.name,
      participantId: participant.participantId,
      votings: ModelTransformerService.transformVotingsToApiVotings(participant.votings)
    } as ApiParticipant;
  }

  /**
   * Transform voting instances to api voting instances
   * @return the transformed instance
   * */
  static transformVotingsToApiVotings(votings: Voting[]): ApiVoting[] {
    const result: ApiVoting[] = [];
    if (NullableUtils.isObjectNullOrUndefined(votings)) {
      return result;
    }
    for (let i = 0, len = votings.length; i < len; ++i) {
      const itemToAdd = ModelTransformerService.transformVotingToApiVoting(votings[i]);
      if (!NullableUtils.isObjectNullOrUndefined(itemToAdd)) {
        result.push(itemToAdd);
      }
    }
    return result;
  }

  /**
   * Transform a voting instance to an api voting instance
   * @return the transformed instance
   * */
  static transformVotingToApiVoting(voting: Voting): ApiVoting | null {
    if (NullableUtils.isObjectNullOrUndefined(voting)) {
      return null;
    }
    return {
      suggestedDateId: voting.suggestedDateId,
      status: ModelTransformerService.transformVotingStatusTypeToApiVotingStatusType(voting.status),
      votingId: voting.votingId
    } as ApiVoting;
  }

  /**
   * Transform a voting instance to an api voting instance
   * @return the transformed instance
   * */
  static transformVotingStatusTypeToApiVotingStatusType(votingStatusType: VotingStatusType): ApiVotingStatusType {
    if (votingStatusType === VotingStatusType.Declined) {
      return ApiVotingStatusType.Declined;
    }
    if (votingStatusType === VotingStatusType.Accepted) {
      return ApiVotingStatusType.Accepted;
    }
    if (votingStatusType === VotingStatusType.Questionable) {
      return ApiVotingStatusType.Questionable;
    }
    if (votingStatusType === VotingStatusType.Undefined) {
      return ApiVotingStatusType.Undefined;
    }
    throw new Error(`Submitted value ${votingStatusType} is not supported`);
  }

  /**
   * Transform an appointment status instance to an api appointment status instance
   * @return the transformed instance
   * */
  static transformAppointmentStatusTypeToApiAppointmentStatusType(statusType: AppointmentStatusType): ApiAppointmentStatusType {
    if (statusType === AppointmentStatusType.Started) {
      return ApiAppointmentStatusType.Started;
    }
    if (statusType === AppointmentStatusType.Paused) {
      return ApiAppointmentStatusType.Paused;
    }
    throw new Error(`Submitted value ${statusType} is not supported`);
  }

  /**
   * Transform an api appointment instance to form appointment instance
   * @return the transformed instance
   * */
  static transformApiAppointmentToAppointment(appointment: ApiAppointment): Appointment | null {
    if (NullableUtils.isObjectNullOrUndefined(appointment)) {
      return null;
    }

    const result = new Appointment();
    result.appointmentId = appointment.appointmentId;
    result.adminId = appointment.adminId;
    result.name = appointment.creatorName;
    result.title = appointment.subject;
    result.location = appointment.place;
    result.description = appointment.description;
    result.password = appointment.password;
    // suggested dates sorted by start date and start time
    result.suggestedDates = ModelTransformerService.transformApiSuggestedDatesToSuggestedDates(appointment.suggestedDates).sort((a, b) =>
      (a.startDate > b.startDate) ? 1 : ((a.startDate === b.startDate) && (a.startTime > b.startTime)) ? 1 : -1);
    // participants sorted by name
    result.participants = ModelTransformerService.transformApiParticipantsToParticipants(appointment.participants).sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
    result.status = ModelTransformerService.transformApiAppointmentStatusTypeToAppointmentStatusType(appointment.status);

    return result;
  }

  /**
   * Transform api suggested date instances to suggested date instances
   * @return the transformed instances
   * */
  static transformApiSuggestedDatesToSuggestedDates(suggestedDates: ApiSuggestedDate[]): SuggestedDate[] {
    const result: SuggestedDate[] = [];
    if (NullableUtils.isObjectNullOrUndefined(suggestedDates)) {
      return result;
    }
    for (let i = 0, len = suggestedDates.length; i < len; ++i) {
      const itemToAdd = ModelTransformerService.transformApiSuggestedDateToSuggestedDate(suggestedDates[i]);
      if (!NullableUtils.isObjectNullOrUndefined(itemToAdd)) {
        result.push(itemToAdd);
      }
    }
    return result;
  }

  /**
   * Transform api suggested date instance to suggested date instance
   * @return the transformed instance
   * */
  static transformApiSuggestedDateToSuggestedDate(suggestedDate: ApiSuggestedDate): SuggestedDate | null {
    if (NullableUtils.isObjectNullOrUndefined(suggestedDate)) {
      return null;
    }
    const startMoment = ModelTransformerService.createMomentFromApiDateAndTime(suggestedDate.startDate, suggestedDate.startTime);
    const endMoment = !NullableUtils.isObjectNullOrUndefined(suggestedDate.endDate)
      ? ModelTransformerService.createMomentFromApiDateAndTime(suggestedDate.endDate, suggestedDate.endTime)
      : ModelTransformerService.createMomentFromApiDateAndTime(suggestedDate.startDate, suggestedDate.endTime);
    const startDateDifferentFromEndDate = !endMoment.local().isSame(startMoment.local(), 'day');
    return {
      suggestedDateId: suggestedDate.suggestedDateId,
      startDate: !NullableUtils.isObjectNullOrUndefined(suggestedDate.startDate)
        ? startMoment.local().format(ApiConstants.MOMENT_FORMAT_DATE) : null,
      startTime: !NullableUtils.isObjectNullOrUndefined(suggestedDate.startTime) ? startMoment.local().format() : null,
      endDate: (!NullableUtils.isObjectNullOrUndefined(suggestedDate.endDate) || !NullableUtils.isObjectNullOrUndefined(suggestedDate.endTime))
      && startDateDifferentFromEndDate ? endMoment.local().format(ApiConstants.MOMENT_FORMAT_DATE) : null,
      endTime: !NullableUtils.isObjectNullOrUndefined(suggestedDate.endTime) ? endMoment.local().format() : null,
      description: !NullableUtils.isStringNullOrWhitespace(suggestedDate.description) ? suggestedDate.description : null
    } as ApiSuggestedDate;
  }

  /**
   * Transform api participant instances to participant instances
   * @return the transformed instances
   * */
  static transformApiParticipantsToParticipants(participants: ApiParticipant[]): Participant[] {
    const result: Participant[] = [];
    if (NullableUtils.isObjectNullOrUndefined(participants)) {
      return result;
    }
    for (let i = 0, len = participants.length; i < len; ++i) {
      const itemToAdd = ModelTransformerService.transformApiParticipantToParticipant(participants[i]);
      if (!NullableUtils.isObjectNullOrUndefined(itemToAdd)) {
        result.push(itemToAdd);
      }
    }
    return result;
  }

  /**
   * Transform an api participant instance to a participant instance
   * @return the transformed instances
   * */
  static transformApiParticipantToParticipant(participant: ApiParticipant): Participant | null {
    if (NullableUtils.isObjectNullOrUndefined(participant)) {
      return null;
    }
    return {
      name: participant.name,
      participantId: participant.participantId,
      votings: ModelTransformerService.transformVotingsToApiVotings(participant.votings)
    } as Participant;
  }

  /**
   * Transform api voting instances to voting instances
   * @return the transformed instance
   * */
  static transformApiVotingsToVotings(votings: ApiVoting[]): Voting[] {
    const result: Voting[] = [];
    if (NullableUtils.isObjectNullOrUndefined(votings)) {
      return result;
    }
    for (let i = 0, len = votings.length; i < len; ++i) {
      const itemToAdd = ModelTransformerService.transformApiVotingToVoting(votings[i]);
      if (!NullableUtils.isObjectNullOrUndefined(itemToAdd)) {
        result.push(itemToAdd);
      }
    }
    return result;
  }

  /**
   * Transform an api voting instance to a voting instance
   * @return the transformed instance
   * */
  static transformApiVotingToVoting(voting: ApiVoting): Voting | null {
    if (NullableUtils.isObjectNullOrUndefined(voting)) {
      return null;
    }
    return {
      suggestedDateId: voting.suggestedDateId,
      status: ModelTransformerService.transformApiVotingStatusTypeToVotingStatusType(voting.status)
    } as Voting;
  }

  /**
   * Transform an api voting instance to a voting instance
   * @return the transformed instance
   * */
  public static transformApiVotingStatusTypeToVotingStatusType(votingStatusType: ApiVotingStatusType): VotingStatusType {
    if (votingStatusType === ApiVotingStatusType.Declined) {
      return VotingStatusType.Declined;
    }
    if (votingStatusType === ApiVotingStatusType.Accepted) {
      return VotingStatusType.Accepted;
    }
    if (votingStatusType === ApiVotingStatusType.Questionable) {
      return VotingStatusType.Questionable;
    }
    if (votingStatusType === ApiVotingStatusType.Undefined) {
      return VotingStatusType.Undefined;
    }
    throw new Error(`Submitted value ${votingStatusType} is not supported`);
  }

  /**
   * Transform an api appointment status instance to an appointment status instance
   * @return the transformed instance
   * */
  static transformApiAppointmentStatusTypeToAppointmentStatusType(statusType: ApiAppointmentStatusType): AppointmentStatusType {
    if (statusType === ApiAppointmentStatusType.Started) {
      return AppointmentStatusType.Started;
    }
    if (statusType === ApiAppointmentStatusType.Paused) {
      return AppointmentStatusType.Paused;
    }
    throw new Error(`Submitted value ${statusType} is not supported`);
  }

  /**
   * Takes api date and (optional) time string to create a moment object.
   * @param date date to parse
   * @param time optional time to parse
   */
  private static createMomentFromApiDateAndTime(date: string, time: string): moment.Moment {
    if (NullableUtils.isObjectNullOrUndefined(date)) {
      return null;
    }
    // FIXME workaround for dates without times. If we took 00:00 here different user timezones would result in different dates.
    // Example: 01/01/2020 00:00+01 would lead to 12/31/2019 in UTC which is not desired when the user only submits a date.
    if (NullableUtils.isObjectNullOrUndefined(time)) {
      time = '12:00:00+00:00';
    }
    const dateTime = `${date}T${time}`;
    return moment.utc(dateTime, ApiConstants.MOMENT_FORMAT_DATE_TIME);
  }

  /**
   * Takes date and (optional) time string to create a moment object.
   * @param date date to parse
   * @param time optional time to parse
   */
  private static createMomentFromDateAndTime(date: string, time: string): moment.Moment {
    if (NullableUtils.isObjectNullOrUndefined(date)) {
      return null;
    }
    // FIXME workaround for dates without times. If we took 00:00 here different user timezones would result in different dates.
    // Example: 01/01/2020 00:00+01 would lead to 12/31/2019 in UTC which is not desired when the user only submits a date.
    const timeMoment = NullableUtils.isObjectNullOrUndefined(time) ? moment('12:00', 'HH:MM') : moment(time, ApiConstants.MOMENT_FORMAT_DATE_TIME);
    const dateMoment = moment(date, ApiConstants.MOMENT_FORMAT_DATE);
    const dateTime = `${dateMoment.format(ApiConstants.MOMENT_FORMAT_DATE)}T${timeMoment.format(ApiConstants.MOMENT_FORMAT_TIME)}`;
    return moment.utc(dateTime, ApiConstants.MOMENT_FORMAT_DATE_TIME);
  }
}
