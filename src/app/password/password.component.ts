import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {Appointment} from '../shared/models';
import {AppStateService} from '../shared/services/app-state/app-state.service';
import {ActivatedRoute, Router} from '@angular/router';
import {RouteTitleService} from "../shared/services/route-title.service";

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {

  passwordForm: UntypedFormGroup;
  model: Appointment;
  isAdmin: boolean;
  isInvalid: boolean;
  showIsInvalid = true;
  passwordHidden = true;

  constructor(
    private appStateService: AppStateService,
    private router: Router,
    private route: ActivatedRoute,
    private routeTitle: RouteTitleService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit() {
    this.showIsInvalid = true;
    this.readIsInvalidParam();
    this.model = this.appStateService.getAppointment();
    this.isAdmin = this.appStateService.isAdmin;
    this.passwordForm = new UntypedFormGroup({
      'password': new UntypedFormControl('', [
        Validators.required
      ])
    });
    this.routeTitle.setTitle('settings.additional');
  }

  onSubmit() {
    if (!this.passwordForm.invalid) {
      const appointmentFromForm = this.passwordForm.value as Appointment;
      this.appStateService.updateCredentials(appointmentFromForm.password);
      if (this.appStateService.isAdmin) {
        this.router.navigate(['/admin/dashboard', this.model.adminId]).then();
      } else {
        this.router.navigate(['/poll/', this.model.appointmentId]).then();
      }
    }
  }

  private readIsInvalidParam(): void {
    this.isInvalid = this.route.snapshot.paramMap.get('invalid') != null;
  }

  protected togglePasswordVisibility() {
    this.passwordHidden = !this.passwordHidden;
  }
}
