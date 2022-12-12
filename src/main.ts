import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

if (!environment.apiBaseUrl) {
  environment.apiBaseUrl = window.location.origin + '/api';
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
