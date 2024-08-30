import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {LOCALE_ID, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {AppStateService} from './shared/services/app-state/app-state.service';
import {ApiDataService, DataRepositoryService} from './shared/services/data-service';
import {ModelTransformerService} from './shared/services/transformer';
import {ConsoleProvider, Logger} from './shared/services/logging';
import {DateTimeGeneratorService} from './shared/services/generators';
import {MessageBoxComponent} from './shared/components/message-box/message-box.component';
import {HomeComponent} from './home/home.component';
import {CreateAppointmentComponent} from './create-appointment/create-appointment.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InvalidNameDirective} from './shared/validators/invalid-name.directive';
import {DateValidatorDirective} from './shared/validators/date-validator.directive';
import {DateTodayOrInFutureValidatorDirective} from './shared/validators/date-today-or-in-future-validator.directive';
import {TimeValidatorDirective} from './shared/validators/time-validator.directive';
import {MinLengthArrayValidatorDirective} from './shared/validators/min-length-array-validator.directive';
import {MaxLengthArrayValidatorDirective} from './shared/validators/max-length-array-validator.directive';
import {SuggestedDateValidatorDirective} from './shared/validators/suggested-date-validator.directive';
import {OverviewComponent} from './overview/overview.component';
import {NgOptimizedImage, registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import {LinksComponent} from './links/links.component';
import {PollComponent} from './poll/poll.component';
import {AdminAppointmentComponent} from './admin-appointment/admin-appointment.component';
import {InvalidLocationDirective} from './shared/validators/invalid-location.directive';
import {StepperComponent} from './shared/components/stepper/stepper.component';
import {AppointmentSummaryComponent} from './shared/components/appointment-summary/appointment-summary.component';
import {LeadingZeroPipe} from './shared/pipes';
import {CreateSuggestedDatesComponent} from './create-suggested-dates/create-suggested-dates.component';
import {AdminSuggestedDatesComponent} from './admin-suggested-dates/admin-suggested-dates.component';
import {AdminOverviewComponent} from './admin-overview/admin-overview.component';
import {AdminLinksComponent} from './admin-links/admin-links.component';
import {ClipboardModule} from 'ngx-clipboard';
import {
  AppointmentIdRequiredGuard,
  CanDeactivateGuard,
  DatesRequiredGuard,
  NameRequiredGuard,
  PasswordRequiredGuard,
  TitleRequiredGuard
} from './shared/services/navigation-guard/navigation-guard.service';
import {DisableCacheInterceptor} from './disable-cache-interceptor';
import {AdminInfoComponent} from './shared/components/admin-info/admin-info.component';
import {AutofocusDirective} from './shared/directives/autofocus.directive';
import {TosComponent} from './shared/components/tos/tos.component';
import {FooterComponent} from './shared/components/footer/footer.component';
import {SuggestedDateComponent} from './shared/components/suggested-date/suggested-date.component';
import {PollOptionsComponent} from './shared/components/poll-options/poll-options.component';
import {SettingsComponent} from './settings/settings.component';
import {AdminSettingsComponent} from './admin-settings/admin-settings.component';
import {InvalidPasswordDirective} from './shared/validators/invalid-password.directive';
import {PasswordComponent} from './password/password.component';
import {BasicAuthInterceptor} from './basic-auth-interceptor';
import {NgbDateParserFormatter, NgbDatepickerModule, NgbModule, NgbTimepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateCustomParserFormatter} from './shared/formatters/NgbDateCustomParserFormatter';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';
import {AppointmentResolverService} from './shared/services/resolver/appointment-resolver.service';
import {MobilePollTableComponent} from './poll/mobile-poll-table.component';
import {NavigationComponent} from './shared/components/navigation/navigation.component';
import {DatesOverviewComponent} from './shared/components/dates-overview/dates-overview.component';
import {ImprintComponent} from './juristic/imprint/imprint.component';
import {AccessibilityComponent} from './juristic/accessibility/accessibility.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {environment} from '../environments/environment';
import {LocaleService} from './shared/services/locale/locale.service';
import {BomComponent} from './juristic/bom/bom.component';
import {PrivacyComponent} from './juristic/privacy/privacy.component';
import {TermsOfServiceComponent} from './juristic/terms-of-service/terms-of-service.component';
import {CheckboxFieldComponent} from "./shared/components/checkbox-field/checkbox-field.component";
import {PlainLanguageComponent} from "./plain-language/plain-language.component";
import {AdIconsComponent} from "./shared/components/ad-icons/ad-icons.component";
import {SignLanguageComponent} from "./sign-language/sign-language.component";
import {TimeInputDirective} from "./shared/directives/time-input.directive";
import {ToastrModule, provideToastr} from "ngx-toastr";
import {BrowserAnimationsModule, provideAnimations} from "@angular/platform-browser/animations";

export const appRoutes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'create', component: CreateAppointmentComponent, canActivate: [TitleRequiredGuard], canDeactivate: [CanDeactivateGuard]},
  {path: 'dates', component: CreateSuggestedDatesComponent, canActivate: [NameRequiredGuard], canDeactivate: [CanDeactivateGuard]},
  {path: 'settings', component: SettingsComponent, canActivate: [DatesRequiredGuard], canDeactivate: [CanDeactivateGuard]},
  {path: 'overview', component: OverviewComponent, canActivate: [DatesRequiredGuard], canDeactivate: [CanDeactivateGuard]},
  {
    path: 'links',
    component: LinksComponent,
    canActivate: [AppointmentIdRequiredGuard],
    data: {fallbackRoute: '/overview'}
  },
  {
    path: 'password',
    component: PasswordComponent,
    canActivate: [AppointmentIdRequiredGuard],
    data: {fallbackRoute: '/home'}
  },
  {path: 'poll/:id', component: PollComponent, canActivate: [PasswordRequiredGuard]},
  {path: 'poll-admin', component: AdminAppointmentComponent, canActivate: [AppointmentIdRequiredGuard]},
  {path: 'admin/dates', component: AdminSuggestedDatesComponent, canActivate: [TitleRequiredGuard]},
  {
    path: 'admin/dashboard/:adminId',
    component: AdminDashboardComponent,
    canActivate: [PasswordRequiredGuard],
    resolve: {
      appointment: AppointmentResolverService
    }
  },
  {path: 'admin/overview', component: AdminOverviewComponent, canActivate: [DatesRequiredGuard]},
  {path: 'admin/links', component: AdminLinksComponent, canActivate: [AppointmentIdRequiredGuard]},
  {path: 'admin/settings', component: AdminSettingsComponent, canActivate: [DatesRequiredGuard]},
  {path: 'imprint', component: ImprintComponent},
  {path: 'privacy', component: PrivacyComponent},
  {path: 'accessibility', component: AccessibilityComponent},
  {path: 'termsOfService', component: TermsOfServiceComponent},
  {path: 'plain-language', component: PlainLanguageComponent},
  {path: 'sign-language', component: SignLanguageComponent},
  {path: 'bom', component: BomComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', redirectTo: '/home'}
];

registerLocaleData(localeDe, environment.locale);

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './locales/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        MessageBoxComponent,
        HomeComponent,
        CreateAppointmentComponent,
        OverviewComponent,
        InvalidLocationDirective,
        InvalidNameDirective,
        DateValidatorDirective,
        DateTodayOrInFutureValidatorDirective,
        TimeValidatorDirective,
        MinLengthArrayValidatorDirective,
        MaxLengthArrayValidatorDirective,
        SuggestedDateValidatorDirective,
        InvalidPasswordDirective,
        OverviewComponent,
        PasswordComponent,
        LinksComponent,
        PollComponent,
        AdminAppointmentComponent,
        LinksComponent,
        StepperComponent,
        AppointmentSummaryComponent,
        LeadingZeroPipe,
        CreateSuggestedDatesComponent,
        AdminSuggestedDatesComponent,
        AdminOverviewComponent,
        AdminLinksComponent,
        AdminInfoComponent,
        FooterComponent,
        SuggestedDateComponent,
        PollOptionsComponent,
        AutofocusDirective,
        SettingsComponent,
        AdminSettingsComponent,
        AdminDashboardComponent,
        MobilePollTableComponent,
        NavigationComponent,
        DatesOverviewComponent,
        ImprintComponent,
        AccessibilityComponent,
        AutofocusDirective,
        BomComponent,
        PrivacyComponent,
        TermsOfServiceComponent,
        AdIconsComponent,
        TimeInputDirective
    ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {useHash: true}),
    NgbDatepickerModule,
    NgbTimepickerModule,
    ClipboardModule,
    NgbModule,
    TranslateModule.forRoot({
      defaultLanguage: environment.locale === 'de-DE' ? environment.locale + '-' + environment.addressing : environment.locale,
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    TosComponent,
    CheckboxFieldComponent,
    NgOptimizedImage,
    ToastrModule.forRoot(),
  ],
  providers: [
    {
      provide: LOCALE_ID,
      deps: [LocaleService],
      useFactory: (localeService: LocaleService) => localeService.getLocale().languageCode
    },
    {provide: HTTP_INTERCEPTORS, useClass: DisableCacheInterceptor, multi: true},
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter},
    {provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true},
    DateTimeGeneratorService,
    AppStateService,
    ApiDataService,
    DataRepositoryService,
    ModelTransformerService,
    Logger,
    ConsoleProvider,
    provideAnimations(),
    provideToastr({
      maxOpened: 3,
      autoDismiss: true,
      newestOnTop: true,
      tapToDismiss: true
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
