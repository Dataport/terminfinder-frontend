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

  ngOnInit(): void {
    this.model = this.appStateService.getAppointment();
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
    this.translate.get('links.email.participate').subscribe(participateTranslation => {
      let subject = `[Terminfinder] Umfrage ${this.model.title}`;
      let body = `Moin moin,%0D%0A`;
      body += `ich habe eine Umfrage erstellt:%0D%0A%0D%0A`;
      body += `Titel: ${this.model.title}%0D%0A`;
      if (this.model.location) {
        body += `Ort: ${this.model.location}%0D%0A`;
      }
      if (this.model.description) {
        body += `Beschreibung: ${this.model.description}%0D%0A`;
      }
      body += `%0D%0A${participateTranslation}%0D%0A`;
      body += `${this.absoluteAppointmentLink}%0D%0A`;
      body += `%0D%0ABeste Grüße,%0D%0A${this.model.name}`;
      window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
    });
  }

  createAdminMail(): void {
    let subject = `[Terminfinder] Admin-URL ${this.model.title}`;
    let body = `Moin moin,%0D%0A`;
    body += `hier ist die Admin-URL für folgende Umfrage:%0D%0A%0D%0A`;
    body += `Titel: ${this.model.title}%0D%0A`;
    if (this.model.location) {
      body += `Ort: ${this.model.location}%0D%0A`;
    }
    if (this.model.description) {
      body += `Beschreibung: ${this.model.description}%0D%0A`;
    }
    body += `%0D%0AURL:%0D%0A`;
    body += `${this.absoluteAdminLink}%0D%0A`;
    body += `%0D%0ABeste Grüße,%0D%0A${this.model.name}`;
    window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
  }
}
