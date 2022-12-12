import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {externalResources} from './app/shared/constants/externalResources';
import {DynamicVariables} from './app/shared/models/dynamicVariables';

if (environment.production) {
  enableProdMode();
}

console.log('DVS-POC - apiBaseUrl:environment', environment.apiBaseUrl);

fetch(externalResources.dynamicVariables)
  .then(res => res.json())
  .then((data: DynamicVariables) => {
    environment.apiBaseUrl = data.apiBaseUrl;
    console.log('DVS-POC - apiBaseUrl:dynamicVariable', environment.apiBaseUrl);
  })
  .finally(() => {
    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.log(err));
  });
