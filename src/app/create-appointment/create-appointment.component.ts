import {Component, Inject, Input, LOCALE_ID, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Appointment} from '../shared/models';
import {AppStateService} from '../shared/services/app-state/app-state.service';
import {invalidNameValidator} from '../shared/validators/invalid-name.directive';
import {Logger} from '../shared/services/logging';
import {ValidatorConstants} from '../shared/constants/validatorConstants';
import {Router} from '@angular/router';
import {invalidLocationValidator} from '../shared/validators/invalid-location.directive';

@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.scss']
})
export class CreateAppointmentComponent implements OnInit {
  detailsForm: FormGroup;
  model: Appointment;

  @Input() isAdmin = false;

  constructor(
    private appStateService: AppStateService,
    private logger: Logger, @Inject(LOCALE_ID) private localeId: string,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.model = this.appStateService.getAppointment();
    this.fillForm();
  }

  private fillForm() {
    this.detailsForm = new FormGroup({
      'name': new FormControl(this.model.name, [
        Validators.required, invalidNameValidator(), Validators.maxLength(ValidatorConstants.MAX_LENGTH_NAME)
      ]),
      'title': new FormControl(this.model.title, [
        Validators.required, invalidNameValidator(), Validators.maxLength(ValidatorConstants.MAX_LENGTH_TITLE)
      ]),
      'location': new FormControl(this.model.location, [
        invalidLocationValidator(), Validators.maxLength(ValidatorConstants.MAX_LENGTH_LOCATION)
      ]),
      'description': new FormControl(this.model.description, [
        Validators.maxLength(ValidatorConstants.MAX_LENGTH_DESCRIPTION)
      ])
    });
  }

  get name(): AbstractControl {
    return this.detailsForm.get('name');
  }

  get title(): AbstractControl {
    return this.detailsForm.get('title');
  }

  get location(): AbstractControl {
    return this.detailsForm.get('location');
  }

  get description(): AbstractControl {
    return this.detailsForm.get('description');
  }

  public onSubmit(): void {
    this.logger.debug(`Detail-Formular abgeschickt mit den Werten: ${JSON.stringify(this.detailsForm.value)}`);
    const appointmentFromForm: Appointment = this.detailsForm.value as Appointment;
    this.model.name = appointmentFromForm.name;
    this.model.title = appointmentFromForm.title;
    this.model.location = appointmentFromForm.location;
    this.model.description = appointmentFromForm.description;
    this.appStateService.updateAppointment(this.model);
    if (!this.isAdmin) {
      this.router.navigate(['/dates']).then();
    } else {
      this.router.navigate(['/admin/dates']).then();
    }
  }
}
