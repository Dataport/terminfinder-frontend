import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppStateService} from '../shared/services/app-state/app-state.service';
import {DataRepositoryService} from '../shared/services/data-service';
import {Appointment as ApiAppointment, Participant as ApiParticipant} from '../shared/models/api-data-v1-dto';
import {Appointment, Message, MessageType, Participant} from '../shared/models';
import {Logger} from '../shared/services/logging';
import {Utils} from '../shared/services/utils';
import {ModelTransformerService} from '../shared/services/transformer';
import {AppointmentStatusType} from '../shared/models/appointmentStatusType';
import {PollFormHelperService} from './poll-form-helper.service';
import {UserNotification, userNotifications} from '../../userNotifications';
import {environment} from '../../environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-poll',
  providers: [PollFormHelperService],
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss']
})
export class PollComponent implements OnInit {
  model: Appointment;
  apiError: Message;
  isAppointmentPaused: boolean;
  appointmentId: string;
  localUserNotifications: Array<UserNotification> = [];
  surveyLinkUser? = environment.surveyLinkUser;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private logger: Logger,
    private dataRepoService: DataRepositoryService,
    private modelTransformer: ModelTransformerService,
    private appStateService: AppStateService,
    public formHelper: PollFormHelperService
  ) {
  }

  ngOnInit() {
    userNotifications.forEach(notification => {
      if (notification.derivateTitle === 'global' || notification.derivateTitle === environment.title) {
        if (moment(notification.startTime).isBefore(moment()) && moment(notification.endTime).isAfter(moment())) {
          this.localUserNotifications.push(notification);
        }
      }
    });

    this.model = null;
    const id = this.route.snapshot.paramMap.get('id');
    if (Utils.isObjectNullOrUndefined(id)) {
      throw new Error('id is null or undefined');
    }
    this.appointmentId = id;

    this.initModel();
  }

  public isFormInvalid(): boolean {
    if (this.formHelper.hasAddOrEditParticipantForm() && this.formHelper.getParticipantForm().invalid) {
      return true;
    } else if (this.formHelper.participantsToDelete.length === 0 && !this.formHelper.hasAddOrEditParticipantForm()) {
      return true;
    } else {
      return this.formHelper.getTosFormControl().invalid;
    }
  }

  public sendReply(): void {
    if (this.formHelper.participantsToDelete.length === 0) {
      if (!this.formHelper.hasAddOrEditParticipantForm()) {
        return;
      }
      if (this.formHelper.hasAddParticipantForm() && this.formHelper.getParticipantForm().invalid) {
        return;
      }
      if (this.formHelper.hasEditParticipantForm() && this.formHelper.getParticipantForm().invalid) {
        return;
      }
    }

    let updatedOrCreatedParticipants: Participant[];
    if (this.formHelper.hasAddOrEditParticipantForm()) {
      const updatedOrCreatedParticipant = this.formHelper.getParticipantForm().value as Participant;
      this.formHelper.lastEditedParticipant = updatedOrCreatedParticipant;
      updatedOrCreatedParticipants = [updatedOrCreatedParticipant];
    }

    this.apiError = null;
    const apiParticipantsToDelete: ApiParticipant[] =
      ModelTransformerService.transformParticipantsToApiParticipants(this.formHelper.participantsToDelete);
    this.logger.debug(`Übermittle Daten zum Löschen der Teilnehmer: ${JSON.stringify(apiParticipantsToDelete)}`, apiParticipantsToDelete);

    if (!Utils.isObjectNullOrUndefined(updatedOrCreatedParticipants)) {
      const apiParticipants: ApiParticipant[] =
        ModelTransformerService.transformParticipantsToApiParticipants(updatedOrCreatedParticipants);
      this.logger.debug(`Übermittle Daten zum Erstellen/Aktualisieren der Teilnehmer: ${JSON.stringify(apiParticipants)}`, apiParticipants);

      this.dataRepoService.createOrUpdateVotingsAndDeleteParticipantsById
      (this.model.appointmentId, apiParticipants, apiParticipantsToDelete)
        .then((result: Participant[]) => {
          this.logger.debug(`Daten der Teilnehmer erfolgreich versendet - Rückgabe von der API ist: ${JSON.stringify(result)}`, result);
          this.formHelper.deleteParticipantForm();
          this.initModel();
        }).catch((err: string) => {
        this.apiError = {
          message: `Fehler beim Abschicken der Daten zum Server: ${err}`,
          messageType: MessageType.ERROR
        };
      });
    } else {
      this.dataRepoService.deleteParticipantsOfAppointmentById
      (this.model.appointmentId, apiParticipantsToDelete)
        .then(() => {
          this.logger.debug(`Löschung der Teilnehmer erfolgreich durchgeführt`);
          this.formHelper.deleteParticipantForm();
          this.initModel();
        }).catch((err: string) => {
        this.apiError = {
          message: `Fehler beim Abschicken der Daten zum Server: ${err}`,
          messageType: MessageType.ERROR
        };
      });
    }
  }

  navigate(link: string): void {
    const anchor = document.createElement('a');
    anchor.href = link;
    anchor.rel = 'noopener noreferrer';
    anchor.target = '_blank';
    anchor.click();
  }

  private initModel(): void {
    this.model = null;
    this.formHelper.participantsToDelete = [];
    this.dataRepoService.readAppointmentById(this.appointmentId).then((data: ApiAppointment) => {
      this.logger.debug(`Abstimmung empfangen mit den Werten: ${JSON.stringify(data)}`, data);
      this.model = ModelTransformerService.transformApiAppointmentToAppointment(data);
      this.formHelper.appointment = this.model;
      if (!Utils.isObjectNullOrUndefined(this.formHelper.appointment.participants)
        && this.formHelper.appointment.participants.length > 0) {
        // pre-select a participant in the select-box
        let selectedParticipant = this.formHelper.lastEditedParticipant;
        // if no participant has been edited yet pre-select the first existing participant
        if (Utils.isObjectNullOrUndefined(selectedParticipant)) {
          this.formHelper.selectFirstParticipant();
        } else {
          // otherwise select the recently edited participant
          if (Utils.isObjectNullOrUndefined(selectedParticipant.participantId)) {
            // if the participant has no participantId yet it has been recently added
            // -> determine its id by the participants name
            // FIXME it would be better if the backend returned the participant id when adding a participant
            selectedParticipant = this.formHelper.appointment.participants.find(value => value.name === selectedParticipant.name);
            this.logger.debug('selectedParticipant:', selectedParticipant);
          }
          this.formHelper.selectParticipant(selectedParticipant.participantId);
        }
      }
      this.isAppointmentPaused = this.model.status === AppointmentStatusType.Paused;
      this.isAppointmentPaused ? this.formHelper.getTosFormControl().disable() : this.formHelper.getTosFormControl().enable();
      this.appStateService.updateAppointment(this.model);
    })
      .catch((err: any) => {
        this.apiError = {
          message: `Fehler beim Ermitteln der Daten von der API: ${err}`,
          messageType: MessageType.ERROR
        };
      });
  }
}
