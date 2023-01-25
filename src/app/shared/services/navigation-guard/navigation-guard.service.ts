// noinspection JSUnusedLocalSymbols

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

import {AppStateService} from '../app-state/app-state.service';
import {DataRepositoryService} from '../data-service';
import {Appointment} from '../../models';
import {AppointmentProtectionResult} from '../../models/api-data-v1-dto';
import {Utils} from '../utils';
import {AppointmentPasswordValidationResult} from '../../models/api-data-v1-dto/appointmentPasswordValidationResult';

@Injectable({
  providedIn: 'root'
})
export class NameRequiredGuard implements CanActivate {

  constructor(private appStateService: AppStateService, private router: Router) {
  }

  canActivate(): boolean {
    const appointment: Appointment = this.appStateService.getAppointment();
    if (appointment.name) {
      return true;
    }
    this.router.navigate(['/home']).then();
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class TitleRequiredGuard implements CanActivate {

  constructor(private appStateService: AppStateService, private router: Router) {
  }

  canActivate(): boolean {
    const appointment: Appointment = this.appStateService.getAppointment();
    if (appointment.title) {
      return true;
    }
    this.router.navigate(['/create']).then();
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class DatesRequiredGuard implements CanActivate {

  constructor(private appStateService: AppStateService, private router: Router) {
  }

  canActivate(): boolean {
    const appointment: Appointment = this.appStateService.getAppointment();
    if (appointment.suggestedDates && appointment.suggestedDates.length > 0) {
      return true;
    }
    this.router.navigate(['/dates']).then();
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentIdRequiredGuard implements CanActivate {

  constructor(private appStateService: AppStateService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const appointment: Appointment = this.appStateService.getAppointment();
    if (!appointment) {
      return false;
    }
    const valid = this.appStateService.isAdmin && !Utils.isStringNullOrEmpty(appointment.adminId)
      || !this.appStateService.isAdmin && !Utils.isStringNullOrEmpty(appointment.appointmentId);
    if (valid) {
      return true;
    }
    this.router.navigate([route.data['fallbackRoute']]).then();
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PasswordRequiredGuard implements CanActivate {

  constructor(private appStateService: AppStateService,
              private dataRepositoryService: DataRepositoryService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.initAppointment(route);
    const appointment: Appointment = this.appStateService.getAppointment();
    const protectionFunction: Promise<AppointmentProtectionResult> = this.appStateService.isAdmin
      ? this.dataRepositoryService.isAdminProtected(appointment.adminId)
      : this.dataRepositoryService.isAppointmentProtected(appointment.appointmentId);

    return protectionFunction.then((data: AppointmentProtectionResult) => {
      if (data.protected) {
        this.appStateService.isAppointmentProtected = true;
        if (Utils.isStringNullOrWhitespace(this.appStateService.getCredentials())) {
          this.router.navigate(['/password']).then();
          return false;
        }
        // check the password
        const passwordFunction: Promise<AppointmentPasswordValidationResult> = this.appStateService.isAdmin
          ? this.dataRepositoryService.isAdminPasswordCorrect(appointment.adminId)
          : this.dataRepositoryService.isPasswordCorrect(appointment.appointmentId);
        return passwordFunction.then((correctResult: AppointmentPasswordValidationResult) => {
          // if the password is wrong navigate back to the password page
          if (!correctResult.passwordvalidation) {
            // necessary to detect changes when repeatedly navigating to the same page
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['/password', {invalid: true}]).then();
            return false;
          } else {
            return true;
          }
        });
      } else {
        // always allow access for unprotected polls
        return true;
      }
    });
  }

  private initAppointment(route: ActivatedRouteSnapshot): void {
    const appointment: Appointment = this.appStateService.getAppointment();
    const paramAdminId = route.paramMap.get('adminId');
    if (!Utils.isStringNullOrEmpty(paramAdminId)) {
      appointment.adminId = paramAdminId;
    }
    if (appointment.adminId) {
      this.appStateService.isAdmin = true;
    } else {
      appointment.appointmentId = route.paramMap.get('id');
      this.appStateService.isAdmin = false;
    }
    this.appStateService.updateAppointment(appointment);
  }
}
