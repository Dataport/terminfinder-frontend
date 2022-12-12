import {Component, Inject, Input, LOCALE_ID, OnInit} from '@angular/core';
import {Appointment, Message, MessageType} from '../shared/models';
import {AppStateService} from '../shared/services/app-state/app-state.service';
import {Logger} from '../shared/services/logging';
import {Router} from '@angular/router';
import {Appointment as ApiAppointment, SuggestedDate as ApiSuggestedDate} from '../shared/models/api-data-v1-dto';
import {DataRepositoryService} from '../shared/services/data-service';
import {ModelTransformerService} from '../shared/services/transformer';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  model: Appointment;
  apiError: Message;

  @Input() isAdmin = false;

  constructor(
    private dataRepoService: DataRepositoryService,
    private appStateService: AppStateService,
    private modelTransformer: ModelTransformerService,
    @Inject(LOCALE_ID) private localeId: string,
    private router: Router,
    private logger: Logger) {
  }

  ngOnInit() {
    this.model = this.appStateService.getAppointment();
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
