/// <reference types="@angular/localize" />

import {isDevMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import { LogLevel } from './app/shared/services/logging/logLevel';

if (isDevMode()) {
  environment.consoleLoggingOptions.logLevelThreshold = LogLevel.DEBUG;
}

if (!environment.apiBaseUrl) {
  environment.apiBaseUrl = window.location.origin + '/api';
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
