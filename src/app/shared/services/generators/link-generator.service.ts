import { Injectable, inject } from '@angular/core';
import { AppStateService } from '../app-state/app-state.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LinkGeneratorService {
  private appStateService = inject(AppStateService);
  private router = inject(Router);

  public generateAdminLink(): string {
    return `${this.router.createUrlTree([
      'admin/dashboard',
      this.appStateService.getAppointment().adminId
    ])}`;
  }

  public generateAbsoluteAdminLink(): string {
    return `${document.location.origin}${document.location.pathname}#${this.generateAdminLink()}`;
  }

  public generateAppointmentLink(): string {
    return `${this.router.createUrlTree([
      'poll',
      this.appStateService.getAppointment().appointmentId
    ])}`;
  }

  public generateAbsoluteAppointmentLink(): string {
    return `${document.location.origin}${document.location.pathname}#${this.generateAppointmentLink()}`;
  }
}
