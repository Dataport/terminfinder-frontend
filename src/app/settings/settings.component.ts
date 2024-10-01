import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Appointment} from '../shared/models';
import {AppStateService} from '../shared/services/app-state/app-state.service';
import {Router} from '@angular/router';
import {invalidPasswordValidator} from '../shared/validators/invalid-password.directive';
import {NullableUtils} from '../shared/utils';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
  settingsForm: UntypedFormGroup;
  model: Appointment;
  adminId: string;
  showPlaceholder = false;

  @Input() isAdmin = false;

  constructor(
    private appStateService: AppStateService,
    private router: Router,
    private fb: UntypedFormBuilder
  ) {
  }

  static checkPasswords(group: UntypedFormGroup): ValidationErrors | null {
    const password = group.controls.password;
    const passwordRepeat = group.controls.passwordRepeat;
    return password == null || passwordRepeat == null || password.value === passwordRepeat.value ? null
      : {notSame: true};
  }

  ngOnInit() {
    this.model = this.appStateService.getAppointment();
    const isPasswordEntered = !!this.model.password || this.appStateService.isAppointmentProtected;
    this.showPlaceholder = this.appStateService.isAppointmentProtected && this.isAdmin;
    this.settingsForm = this.fb.group({
      hasPassword: [isPasswordEntered || this.appStateService.isAppointmentProtected],
      password: [
        this.model.password, null
      ],
      passwordRepeat: [
        this.model.password, null
      ]
    }, {
      validator: isPasswordEntered ? SettingsComponent.checkPasswords : null
    });

    // Add/remove validators if password checkbox has been checked/unchecked
    this.hasPassword().valueChanges.subscribe(() => {
      if (this.hasPassword().value && this.showPlaceholder) {
        if (!NullableUtils.isStringNullOrEmpty(this.getPassword().value) || !NullableUtils.isStringNullOrEmpty(this.getPasswordRepeat().value)) {
          this.addValidators();
        } else {
          this.removeValidators();
        }
      } else if (this.hasPassword().value) {
        this.addValidators();
      } else {
        this.removeValidators();
      }
    });

    this.getPassword().valueChanges.subscribe(() => {
      if (!NullableUtils.isStringNullOrEmpty(this.getPasswordRepeat().value) || !NullableUtils.isStringNullOrEmpty(this.getPassword().value)) {
        this.addValidators();
      } else if (this.showPlaceholder) {
        this.removeValidators();
      }
    });

    this.getPasswordRepeat().valueChanges.subscribe(() => {
      if (!NullableUtils.isStringNullOrEmpty(this.getPasswordRepeat().value) || !NullableUtils.isStringNullOrEmpty(this.getPassword().value)) {
        this.addValidators();
      } else if (this.showPlaceholder) {
        this.removeValidators();
      }
    });
  }

  public hasPassword(): AbstractControl {
    return this.settingsForm.get('hasPassword');
  }

  getPassword(): AbstractControl {
    return this.settingsForm.get('password');
  }

  getPasswordRepeat(): AbstractControl {
    return this.settingsForm.get('passwordRepeat');
  }

  public goBack(): void {
    if (!this.isAdmin) {
      this.router.navigate(['/dates']).then();
    } else {
      this.router.navigate(['admin/dates']).then();
    }
  }

  public onSubmit(): void {
    this.appStateService.isAppointmentProtected = this.hasPassword().value;
    if (this.appStateService.isAppointmentProtected) {
      // if placeholder is shown that means we are in admin mode, the appointment is password protected and no new password is entered
      // in this case we get the password from credentials
      if (this.showPlaceholder && NullableUtils.isStringNullOrEmpty(this.getPassword().value)) {
        const credentials = atob(this.appStateService.getCredentials());
        this.model.password = credentials.substring(credentials.lastIndexOf(':') + 1, credentials.length);
      } else {
        this.model.password = this.getPassword().value;
      }
    } else {
      this.model.password = null;
    }

    this.appStateService.updateAppointment(this.model);
    if (!this.isAdmin) {
      this.router.navigate(['/overview']).then();
    } else {
      this.router.navigate(['/admin/overview']).then();
    }
  }

  private addValidators() {
    if (!this.getPassword().validator) {
      this.getPassword().setValidators([Validators.required, invalidPasswordValidator()]);
      this.getPassword().updateValueAndValidity();
    }
    if (!this.getPasswordRepeat().validator) {
      this.getPasswordRepeat().setValidators([Validators.required, invalidPasswordValidator()]);
      this.getPasswordRepeat().updateValueAndValidity();
    }
    if (!this.settingsForm.validator) {
      this.settingsForm.setValidators(SettingsComponent.checkPasswords);
      this.settingsForm.updateValueAndValidity();
    }
  }

  private removeValidators() {
    if (this.getPassword().validator) {
      this.getPassword().clearValidators();
      this.getPassword().setErrors(null);
    }
    if (this.getPasswordRepeat().validator) {
      this.getPasswordRepeat().clearValidators();
      this.getPasswordRepeat().setErrors(null);
    }
    if (this.settingsForm.validator) {
      this.settingsForm.clearValidators();
    }
  }
}
