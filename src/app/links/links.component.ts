import {Component, Input, OnInit} from '@angular/core';
import {Appointment} from '../shared/models';
import {AppStateService} from '../shared/services/app-state/app-state.service';
import {Router} from '@angular/router';
import {LinkGeneratorService} from '../shared/services/utils/link-generator.service';
import {environment} from '../../environments/environment';
import {TranslateService} from "@ngx-translate/core";

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
    private router: Router,
    private translate: TranslateService
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

  createPollMail(): void {
    let subject = `[Terminfinder] ${this.translate.instant('poll.poll')} ${this.model.title}`;
    let body = `${this.translate.instant('links.email.addressing')},%0D%0A`;
    body += `${this.translate.instant('links.email.creation')}:%0D%0A%0D%0A`;
    body += this.getDetailsAsMailContent();
    body += `%0D%0A${this.translate.instant('links.email.participate')}:%0D%0A`;
    body += `${this.absoluteAppointmentLink}%0D%0A`;
    body += `%0D%0A${this.translate.instant('links.email.greetings')},%0D%0A${this.model.name}`;
    window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
  }

  createAdminMail(): void {
    let subject = `[Terminfinder] Admin-URL ${this.model.title}`;
    let body = `${this.translate.instant('links.email.admin')}:%0D%0A%0D%0A`;
    body += this.getDetailsAsMailContent();
    body += 'URL:%0D%0A';
    body += `${this.absoluteAdminLink}%0D%0A`;
    window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
  }

  private getDetailsAsMailContent(): string {
    let body = `${this.translate.instant('poll.title.title')}: ${this.model.title}%0D%0A`;
    if (this.model.location) {
      body += `${this.translate.instant('poll.details.place.place')}: ${this.model.location}%0D%0A`;
    }
    if (this.model.description) {
      body += `${this.translate.instant('poll.details.description.description')}: ${this.model.description}%0D%0A`;
    }
    return body;
  }
}
