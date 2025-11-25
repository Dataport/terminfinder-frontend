import { HttpClient } from '@angular/common/http';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CreateAppointmentComponent } from './create-appointment/create-appointment.component';
import { OverviewComponent } from './overview/overview.component';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { LinksComponent } from './links/links.component';
import { PollComponent } from './poll/poll.component';
import { AdminAppointmentComponent } from './admin-appointment/admin-appointment.component';
import { CreateSuggestedDatesComponent } from './create-suggested-dates/create-suggested-dates.component';
import { AdminSuggestedDatesComponent } from './admin-suggested-dates/admin-suggested-dates.component';
import { AdminOverviewComponent } from './admin-overview/admin-overview.component';
import { AdminLinksComponent } from './admin-links/admin-links.component';
import {
  AppointmentIdRequiredGuard,
  CanDeactivateGuard,
  DatesRequiredGuard,
  DefaultLanguageGuard,
  NameRequiredGuard,
  PasswordRequiredGuard,
  TitleRequiredGuard
} from './shared/services/navigation-guard/navigation-guard.service';
import { SettingsComponent } from './settings/settings.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { PasswordComponent } from './password/password.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AppointmentResolverService } from './shared/services/resolver/appointment-resolver.service';
import { ImprintComponent } from './juristic/imprint/imprint.component';
import { AccessibilityComponent } from './juristic/accessibility/accessibility.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../environments/environment';
import { BomComponent } from './juristic/bom/bom.component';
import { PrivacyComponent } from './juristic/privacy/privacy.component';
import { TermsOfServiceComponent } from './juristic/terms-of-service/terms-of-service.component';
import { PlainLanguageComponent } from './plain-language/plain-language.component';
import { SignLanguageComponent } from './sign-language/sign-language.component';

export const appRoutes: Routes = [
  { path: 'home', component: HomeComponent, title: environment.title },
  {
    path: 'create',
    component: CreateAppointmentComponent,
    canActivate: [TitleRequiredGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'dates',
    component: CreateSuggestedDatesComponent,
    canActivate: [NameRequiredGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [DatesRequiredGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'overview',
    component: OverviewComponent,
    canActivate: [DatesRequiredGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'links',
    component: LinksComponent,
    canActivate: [AppointmentIdRequiredGuard],
    canDeactivate: [CanDeactivateGuard],
    data: { fallbackRoute: '/overview' }
  },
  {
    path: 'password',
    component: PasswordComponent,
    canActivate: [AppointmentIdRequiredGuard],
    canDeactivate: [CanDeactivateGuard],
    data: { fallbackRoute: '/home' }
  },
  {
    path: 'poll/:id',
    component: PollComponent,
    canActivate: [PasswordRequiredGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'poll-admin',
    component: AdminAppointmentComponent,
    canActivate: [AppointmentIdRequiredGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'admin/dates',
    component: AdminSuggestedDatesComponent,
    canActivate: [TitleRequiredGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'admin/dashboard/:adminId',
    component: AdminDashboardComponent,
    canActivate: [PasswordRequiredGuard],
    canDeactivate: [CanDeactivateGuard],
    resolve: {
      appointment: AppointmentResolverService
    }
  },
  {
    path: 'admin/overview',
    component: AdminOverviewComponent,
    canActivate: [DatesRequiredGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'admin/links',
    component: AdminLinksComponent,
    canActivate: [AppointmentIdRequiredGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'admin/settings',
    component: AdminSettingsComponent,
    canActivate: [DatesRequiredGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'imprint',
    component: ImprintComponent,
    canActivate: [DefaultLanguageGuard],
    canDeactivate: [
      DefaultLanguageGuard,
      CanDeactivateGuard
    ]
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
    canActivate: [DefaultLanguageGuard],
    canDeactivate: [
      DefaultLanguageGuard,
      CanDeactivateGuard
    ]
  },
  {
    path: 'accessibility',
    component: AccessibilityComponent,
    canActivate: [DefaultLanguageGuard],
    canDeactivate: [
      DefaultLanguageGuard,
      CanDeactivateGuard
    ]
  },
  { path: 'termsOfService', component: TermsOfServiceComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'plain-language', component: PlainLanguageComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'sign-language', component: SignLanguageComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'bom', component: BomComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

registerLocaleData(localeDe, environment.locale);

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './locales/', '.json');
}
