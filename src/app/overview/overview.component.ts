import {Component, Inject, Input, LOCALE_ID, OnInit} from '@angular/core';
import {Appointment, Message, MessageType} from '../shared/models';
import {AppStateService} from '../shared/services/app-state/app-state.service';
import {Logger} from '../shared/services/logging';
import {Router} from '@angular/router';
import {Appointment as ApiAppointment, SuggestedDate as ApiSuggestedDate} from '../shared/models/api-data-v1-dto';
import {DataRepositoryService} from '../shared/services/data-service';
import {ModelTransformerService} from '../shared/services/transformer';
import {RouteTitleService} from "../shared/services/route-title.service";
import {NullableUtils} from "../shared/utils";
import { StepperComponent } from '../shared/components/stepper/stepper.component';
import { AppointmentSummaryComponent } from '../shared/components/appointment-summary/appointment-summary.component';
import { DatesOverviewComponent } from '../shared/components/dates-overview/dates-overview.component';
import { MessageBoxComponent } from '../shared/components/message-box/message-box.component';
import { NavigationComponent } from '../shared/components/navigation/navigation.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  imports: [StepperComponent, AppointmentSummaryComponent, DatesOverviewComponent, MessageBoxComponent, NavigationComponent, TranslatePipe]
})
export class OverviewComponent implements OnInit {
  model: Appointment;
  apiError: Message;

  @Input() isAdmin = false;

  constructor(
    private dataRepoService: DataRepositoryService,
    private appStateService: AppStateService,
    @Inject(LOCALE_ID) private localeId: string,
    private router: Router,
    private logger: Logger,
    private routeTitle: RouteTitleService
  ) {
  }

  ngOnInit() {
    this.model = this.appStateService.getAppointment();
    this.routeTitle.setTitle('poll.checkData');
  }

  // Happens when a user navigates back after creating the appointment
  isAppointmentSent() {
    const apiAppointment: ApiAppointment = ModelTransformerService.transformAppointmentToApiAppointment(this.model);
    return (!NullableUtils.isStringNullOrWhitespace(apiAppointment.appointmentId) && !NullableUtils.isStringNullOrWhitespace(apiAppointment.adminId));
  }

  sendCreateAppointment(): void {
    const apiAppointment: ApiAppointment = ModelTransformerService.transformAppointmentToApiAppointment(this.model);

    this.dataRepoService.createAppointment(apiAppointment)
      .then((data: ApiAppointment) => {
        this.model = ModelTransformerService.transformApiAppointmentToAppointment(data);
        this.appStateService.updateAppointment(this.model);
        this.apiError = null;
        this.logger.debug(`Umfrage erstellt mit den Werten: ${JSON.stringify(apiAppointment)}`);
        this.router.navigate(['/links']).then();
      })
      .catch((err: any) => {
        this.apiError = {
          message: `Fehler beim Ermitteln der Daten von der API: ${err}`,
          messageType: MessageType.ERROR
        };
      });
  }

  sendUpdateAppointment(): void {
    const apiSuggestedDatesToDelete: ApiSuggestedDate[] =
      ModelTransformerService.transformSuggestedDatesToApiSuggestedDates(this.model.suggestedDatesToDelete);
    const apiAppointment: ApiAppointment = ModelTransformerService.transformAppointmentToApiAppointment(this.model);

    this.dataRepoService.updateAppointmentAndDeleteSuggestedDates(apiAppointment, apiSuggestedDatesToDelete)
      .then((data: ApiAppointment) => {
        this.model = ModelTransformerService.transformApiAppointmentToAppointment(data);
        this.appStateService.updateAppointment(this.model);
        this.apiError = null;
        this.logger.debug(`Umfrage ändern mit den Werten: ${JSON.stringify(apiAppointment)}}`);
        this.logger.debug(`Terminvorschlag/Terminvorschläge lösche mit den Werten: ${JSON.stringify(apiSuggestedDatesToDelete)}`);
        this.router.navigate(['/admin/links']).then();
      })
      .catch((err: any) => {
        this.apiError = {
          message: `Fehler beim Ermitteln der Daten von der API: ${err}`,
          messageType: MessageType.ERROR
        };
      });
  }

  public goBack(): void {
    // noinspection JSIgnoredPromiseFromCall
    if (!this.isAdmin) {
      this.router.navigate(['/create']).then();
    } else {
      this.router.navigate(['/poll-admin']).then();
    }
  }
}
