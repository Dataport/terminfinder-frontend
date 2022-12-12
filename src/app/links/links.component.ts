import {Component, Input, OnInit} from '@angular/core';
import {Appointment} from '../shared/models';
import {AppStateService} from '../shared/services/app-state/app-state.service';
import {Router} from '@angular/router';
import {LinkGeneratorService} from '../shared/services/utils/link-generator.service';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent implements OnInit {
  model: Appointment;
  surveyLinkAdmin? = environment.surveyLinkAdmin;

  @Input() isAdmin = false;

  constructor(
    private appStateService: AppStateService,
    private linkGeneratorService: LinkGeneratorService,
    private router: Router
  ) {
  }

  get adminLink(): string {
    return this.linkGeneratorService.generateAdminLink();
  }

  get appointmentLink(): string {
    return this.linkGeneratorService.generateAppointmentLink();
  }

  get absoluteAdminLink(): string {
    return `${document.location.origin}${document.location.pathname}#${this.adminLink}`;
  }

  get absoluteAppointmentLink(): string {
    return `${document.location.origin}${document.location.pathname}#${this.appointmentLink}`;
  }

  ngOnInit(): void {
    this.model = this.appStateService.getAppointment();
  }

  navigate(link: string): void {
    const anchor = document.createElement('a');
    anchor.href = link;
    anchor.rel = 'noopener noreferrer';
    anchor.target = '_blank';
    anchor.click();
  }

  createNewAppointment(): void {
    this.appStateService.createNewAppointment();
    this.router.navigate(['/home']).then();
  }
}
