import {Component, OnInit} from '@angular/core';
import {Appointment, Message, MessageType} from '../shared/models';
import {Appointment as ApiAppointment} from '../shared/models/api-data-v1-dto';
import {AppStateService} from '../shared/services/app-state/app-state.service';
import {ActivatedRoute} from '@angular/router';
import {AppointmentStatusType} from '../shared/models/appointmentStatusType';
import {DataRepositoryService} from '../shared/services/data-service';
import {Logger} from '../shared/services/logging';
import {ModelTransformerService} from '../shared/services/transformer';
import {RouteTitleService} from "../shared/services/route-title.service";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone: false
})
export class AdminDashboardComponent implements OnInit {
  model: Appointment;
  isStarted: boolean;
  isStatusDisabled: boolean;
  apiError: Message;

  constructor(
    private appStateService: AppStateService,
    private dataRepoService: DataRepositoryService,
    private logger: Logger,
    private route: ActivatedRoute,
    private routeTitle: RouteTitleService
  ) {
  }

  ngOnInit() {
    this.route.data.subscribe((data: { appointment: Appointment }) => {
      this.model = data.appointment;
      this.isStarted = this.model.status === AppointmentStatusType.Started;
      this.appStateService.updateAppointment(data.appointment);
    });
    this.routeTitle.setTitle('poll.configure');
  }

  public toggleStatus(): void {
    if (this.isStatusDisabled) return;

    const statusType = this.isStarted
      ? AppointmentStatusType.Paused
      : AppointmentStatusType.Started;

    this.dataRepoService
      .updateAppointmentStatus(this.model.adminId, statusType)
      .then((result: ApiAppointment) => {
        this.logger.debug(`Status der Umfrage erfolgreich gesetzt; neuer Status: ${JSON.stringify(result.status)}`, result);
        this.model = ModelTransformerService.transformApiAppointmentToAppointment(result);
        this.appStateService.updateAppointment(this.model);
        this.isStarted = this.model.status === AppointmentStatusType.Started;
        this.isStatusDisabled = false;
      })
      .catch((err: string) => {
        this.isStatusDisabled = true;
        this.apiError = {
          message: `Fehler beim Abschicken der Daten zum Server: ${err}`,
          messageType: MessageType.ERROR
        };
      });
  }
}
