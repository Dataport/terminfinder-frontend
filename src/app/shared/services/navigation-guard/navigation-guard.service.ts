// noinspection JSUnusedLocalSymbols

import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { AppStateService } from '../app-state/app-state.service';
import { DataRepositoryService } from '../data-service';
import { Appointment } from '../../models';
import { AppointmentProtectionResult } from '../../models/api-data-v1-dto';
import { NullableUtils } from '../../utils';
import { AppointmentPasswordValidationResult } from '../../models/api-data-v1-dto/appointmentPasswordValidationResult';
import { TranslateService } from '@ngx-translate/core';
import { LocaleService } from '../locale/locale.service';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard {
  private appStateService = inject(AppStateService);
  private translate = inject(TranslateService);

  private readonly confirmRoutes: string[] = [
    '/create',
    '/dates',
    '/settings',
    '/overview',
    '/poll-admin',
    '/admin/dates',
    '/admin/settings',
    '/admin/overview'
  ];

  canDeactivate(_, __, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot): boolean {
    if (nextState.url !== '/home') {
      return true;
    }

    let navigateToHome = this.confirmRoutes.includes(currentState.url)
      ? window.location.hostname === 'localhost' || confirm(this.translate.instant('navigation.confirmLeaving'))
      : true;

    if (navigateToHome) {
      this.appStateService.createNewAppointment();
    }

    return navigateToHome;
  }
}

@Injectable({
  providedIn: 'root'
})
export class NameRequiredGuard {
  private appStateService = inject(AppStateService);
  private router = inject(Router);

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
export class TitleRequiredGuard {
  private appStateService = inject(AppStateService);
  private router = inject(Router);

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
export class DatesRequiredGuard {
  private appStateService = inject(AppStateService);
  private router = inject(Router);

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
export class AppointmentIdRequiredGuard {
  private appStateService = inject(AppStateService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const appointment: Appointment = this.appStateService.getAppointment();
    if (!appointment) {
      return false;
    }
    const valid =
      (this.appStateService.isAdmin && !NullableUtils.isStringNullOrEmpty(appointment.adminId)) ||
      (!this.appStateService.isAdmin && !NullableUtils.isStringNullOrEmpty(appointment.appointmentId));
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
export class PasswordRequiredGuard {
  private appStateService = inject(AppStateService);
  private dataRepositoryService = inject(DataRepositoryService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    this.initAppointment(route);
    const appointment: Appointment = this.appStateService.getAppointment();
    const protectionFunction: Promise<AppointmentProtectionResult> = this.appStateService.isAdmin
      ? this.dataRepositoryService.isAdminProtected(appointment.adminId)
      : this.dataRepositoryService.isAppointmentProtected(appointment.appointmentId);

    return protectionFunction.then((data: AppointmentProtectionResult) => {
      if (data.protected) {
        this.appStateService.isAppointmentProtected = true;
        if (NullableUtils.isStringNullOrWhitespace(this.appStateService.getCredentials())) {
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
            this.router
              // prettier-ignore
              .navigate([
                '/password',
                { invalid: true }
                // prettier-ignore
              ])
              .then();
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
    if (!NullableUtils.isStringNullOrEmpty(paramAdminId)) {
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

@Injectable({
  providedIn: 'root'
})
export class DefaultLanguageGuard {
  private localeService = inject(LocaleService);

  canActivate(): boolean {
    this.localeService.useDefaultLanguage();
    return true;
  }

  canDeactivate(): boolean {
    this.localeService.useStoredLanguage();
    return true;
  }
}
