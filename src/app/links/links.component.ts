import {Component, OnInit, input} from '@angular/core';
import {Appointment} from '../shared/models';
import {AppStateService} from '../shared/services/app-state/app-state.service';
import { Router, RouterLink } from '@angular/router';
import {LinkGeneratorService} from '../shared/services/generators';
import {environment} from '../../environments/environment';
import { TranslateService, TranslatePipe } from "@ngx-translate/core";
import {ToastrService} from "ngx-toastr";
import {RouteTitleService} from "../shared/services/route-title.service";
import { ClipboardModule } from 'ngx-clipboard';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss'],
  imports: [ClipboardModule, RouterLink, NgOptimizedImage, TranslatePipe]
})
export class LinksComponent implements OnInit {
  model: Appointment;
  surveyLinkAdmin? = environment.surveyLinkAdmin;

  readonly isAdmin = input(false);

  constructor(
    private appStateService: AppStateService,
    private linkGeneratorService: LinkGeneratorService,
    private router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
    private routeTitle: RouteTitleService
  ) {
  }

  get adminLink(): string {
    return this.linkGeneratorService.generateAdminLink();
  }

  get absoluteAdminLink(): string {
    return this.linkGeneratorService.generateAbsoluteAdminLink();
  }

  get appointmentLink(): string {
    return this.linkGeneratorService.generateAppointmentLink();
  }

  get absoluteAppointmentLink(): string {
    return this.linkGeneratorService.generateAbsoluteAppointmentLink();
  }

  ngOnInit(): void {
    this.model = this.appStateService.getAppointment();
    this.routeTitle.setTitle('links.done');
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

  protected showToastPollLinkCopied() {
    this.showToast(
      this.translate.instant("links.invite.copySuccess"),
      this.translate.instant("poll.poll")
    );
  }

  protected showToastAdminLinkCopied() {
    this.showToast(
      this.translate.instant("links.admin.copySuccess"),
      this.translate.instant("poll.edit")
    );
  }
  protected showToastAdminLinkCopyFailed() {
    this.showToast(
      this.translate.instant("links.admin.copyFailed"),
      this.translate.instant("poll.edit"),
      false
    );
  }

  protected showToastPollLinkCopyFailed() {
    this.showToast(
      this.translate.instant("links.invite.copyFailed"),
      this.translate.instant("poll.poll"),
      false
    );
  }

  private showToast(message: string, title?: string, success: boolean = true): void {
    if (success)
      this.toastr.success(message, title);
    else
      this.toastr.error(message, title);
  }
}
