/// <reference types="@angular/localize" />

import { isDevMode, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { appRoutes, createTranslateLoader } from './app/app.module';
import { environment } from './environments/environment';
import { LogLevel } from './app/shared/services/logging/logLevel';
import { LocaleService } from './app/shared/services/locale/locale.service';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, HttpClient } from '@angular/common/http';
import { DisableCacheInterceptor } from './app/disable-cache-interceptor';
import {
  NgbDateParserFormatter,
  NgbDatepickerModule,
  NgbTimepickerModule,
  NgbModule
} from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from './app/shared/formatters/NgbDateCustomParserFormatter';
import { BasicAuthInterceptor } from './app/basic-auth-interceptor';
import { DateTimeGeneratorService } from './app/shared/services/generators';
import { AppStateService } from './app/shared/services/app-state/app-state.service';
import { ApiDataService, DataRepositoryService } from './app/shared/services/data-service';
import { ModelTransformerService } from './app/shared/services/transformer';
import { Logger, ConsoleProvider } from './app/shared/services/logging';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { withHashLocation, provideRouter } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppComponent } from './app/app.component';

if (isDevMode()) {
  environment.consoleLoggingOptions.logLevelThreshold = LogLevel.DEBUG;
}

if (!environment.apiBaseUrl) {
  environment.apiBaseUrl = window.location.origin + '/api';
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      NgbDatepickerModule,
      NgbTimepickerModule,
      ClipboardModule,
      NgbModule,
      TranslateModule.forRoot({
        defaultLanguage:
          environment.locale === 'de-DE' ? environment.locale + '-' + environment.addressing : environment.locale,
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        }
      }),
      NgOptimizedImage,
      ToastrModule.forRoot()
    ),
    {
      provide: LOCALE_ID,
      deps: [LocaleService],
      useFactory: (localeService: LocaleService) => localeService.getLocale().languageCode
    },
    { provide: HTTP_INTERCEPTORS, useClass: DisableCacheInterceptor, multi: true },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
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
    }),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideRouter(appRoutes, withHashLocation())
  ]
}).catch((err) => console.log(err));
