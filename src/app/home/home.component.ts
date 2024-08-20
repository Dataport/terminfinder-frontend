import {Component, Inject, isDevMode, LOCALE_ID, OnInit} from '@angular/core';
import {ApiVersion} from '../shared/models/api-data-v1-dto';
import {Appointment, Message, MessageType} from '../shared/models';
import {DataRepositoryService} from '../shared/services/data-service';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {Logger} from '../shared/services/logging';
import {Router} from '@angular/router';
import {AppStateService} from '../shared/services/app-state/app-state.service';
import {invalidNameValidator} from '../shared/validators/invalid-name.directive';
import {ValidatorConstants} from '../shared/constants/validatorConstants';
import {environment} from '../../environments/environment';
import {UserNotification, userNotifications} from '../../userNotifications';
import * as moment from 'moment';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  localUserNotifications: Array<UserNotification> = [];
  apiVersion = '';
  buildDate = '';
  apiError: Message;
  titleForm: UntypedFormGroup;
  model: Appointment;
  derivateTitle = {value: environment.title ? environment.title : 'Terminfinder'};

  constructor(
    private dataRepoService: DataRepositoryService,
    private appStateService: AppStateService,
    private logger: Logger, @Inject(LOCALE_ID) private localeId: string,
    private router: Router,
    public translate: TranslateService
  ) {
  }

  get isTosRead() {
    return this.titleForm.get('isTosRead') as UntypedFormControl;
  }

  get title() {
    return this.titleForm.get('title');
  }

  ngOnInit() {
    userNotifications.forEach(notification => {
      if (notification.derivateTitle === 'global' || notification.derivateTitle === environment.title) {
        if (moment(notification.startTime).isBefore(moment()) && moment(notification.endTime).isAfter(moment())) {
          this.localUserNotifications.push(notification);
        }
      }
    });
    this.model = this.appStateService.getAppointment();
    this.titleForm = new UntypedFormGroup({
      title: new UntypedFormControl(this.model.title, [
        Validators.required, invalidNameValidator(), Validators.maxLength(ValidatorConstants.MAX_LENGTH_NAME)
      ]),
      isTosRead: new UntypedFormControl(false, [Validators.requiredTrue])
    });

    this.dataRepoService.getApiVersion()
      .then((data: ApiVersion) => {
        this.apiVersion = data.version;
        this.buildDate = data.builddate;
        this.logger.info(`API-Data: ${JSON.stringify(data)}`);
      })
      .catch((err: any) => {
        this.apiError = {
          message: `Fehler beim Ermitteln der Daten von der API: ${err}`,
          messageType: MessageType.ERROR
        };
      });
  }

  public isDev(): boolean {
    return isDevMode();
  }

  onSubmit() {
    this.logger.debug(`Titel-Formular abgeschickt mit den Werten: ${JSON.stringify(this.titleForm.value)}`);
    this.model.title = this.titleForm.value['title'];
    this.appStateService.updateAppointment(this.model);
    if (!this.titleForm.invalid) {
      this.router.navigate(['/create']).then();
    }
  }
}
