import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Appointment} from '../shared/models';
import {AppStateService} from '../shared/services/app-state/app-state.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {

  constructor(
    private appStateService: AppStateService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  passwordForm: FormGroup;
  model: Appointment;
  isAdmin: boolean;
  isInvalid: boolean;
  showIsInvalid = true;

  ngOnInit() {
    this.showIsInvalid = true;
    this.readIsInvalidParam();
    this.model = this.appStateService.getAppointment();
    this.isAdmin = this.appStateService.isAdmin;
    this.passwordForm = new FormGroup({
      'password': new FormControl('', [
        Validators.required
      ])
    });
  }

  private readIsInvalidParam(): void {
    this.isInvalid = this.route.snapshot.paramMap.get('invalid') != null;
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

}
