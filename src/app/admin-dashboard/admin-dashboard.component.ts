import { Component, OnInit, inject } from '@angular/core';
import { Appointment, Message, MessageType } from '../shared/models';
import { Appointment as ApiAppointment } from '../shared/models/api-data-v1-dto';
import { AppStateService } from '../shared/services/app-state/app-state.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AppointmentStatusType } from '../shared/models/appointmentStatusType';
import { DataRepositoryService } from '../shared/services/data-service';
import { Logger } from '../shared/services/logging';
import { ModelTransformerService } from '../shared/services/transformer';
import { RouteTitleService } from '../shared/services/route-title.service';
import { AppointmentSummaryComponent } from '../shared/components/appointment-summary/appointment-summary.component';
import { DatesOverviewComponent } from '../shared/components/dates-overview/dates-overview.component';
import { MessageBoxComponent } from '../shared/components/message-box/message-box.component';
import { AppointmentResolverResult } from '../shared/services/resolver/appointment-resolver.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [
    AppointmentSummaryComponent,
    DatesOverviewComponent,
    MessageBoxComponent,
    RouterLink,
    TranslatePipe
  ]
})
export class AdminDashboardComponent implements OnInit {
  private appStateService = inject(AppStateService);
  private dataRepoService = inject(DataRepositoryService);
  private logger = inject(Logger);
  private route = inject(ActivatedRoute);
  private routeTitle = inject(RouteTitleService);
  private translate = inject(TranslateService);

  model: Appointment;
  isStarted: boolean;
  isStatusDisabled: boolean;
  apiError: Message;

  ngOnInit() {
    this.route.data.subscribe((data: { appointment: AppointmentResolverResult }) => {
      if (!data.appointment.appointment) {
        this.apiError = {
          message: this.translate.instant('errors.api.requestFailed', { error: data.appointment.error }),
          messageType: MessageType.ERROR
        };
        return;
      }
      this.model = data.appointment.appointment;
      this.isStarted = this.model.status === AppointmentStatusType.Started;
      this.appStateService.updateAppointment(this.model);
    });
    this.routeTitle.setTitle('poll.configure');
  }

  public toggleStatus(): void {
    if (this.isStatusDisabled) return;

    const statusType = this.isStarted ? AppointmentStatusType.Paused : AppointmentStatusType.Started;

    this.dataRepoService
      .updateAppointmentStatus(this.model.adminId, statusType)
      .then((result: ApiAppointment) => {
        this.logger.debug(
          `Status der Umfrage erfolgreich gesetzt; neuer Status: ${JSON.stringify(result.status)}`,
          result
        );
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
