import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
import './operators';
import {environment} from '../environments/environment';
import {Logger} from './shared/services/logging';
import * as moment from 'moment';
import {Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {LocalStorageService} from './shared/services/data-service/local-storage.service';
import {LocaleService} from './shared/services/locale/locale.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  connectionError = false;

  constructor(
    public localeService: LocaleService,
    private logger: Logger,
    @Inject(LOCALE_ID) private localeId: string,
    private titleService: Title,
    private translateService: TranslateService,
    private localStorageService: LocalStorageService,
  ) {
  }

  headlineHome = environment.title;

  ngOnInit(): void {
    this.logger.debug('ENV: ', environment);
    this.titleService.setTitle(environment.title);
    const lang = this.localStorageService.get('language');
    this.logger.debug('LANG: ', lang);
    if (lang) {
      this.changeLanguage(lang);
    } else {
      this.changeLanguage(navigator.language);
    }
  }

  changeLanguage(locale: string): void {
    const newLocale = this.localeService.setLocale(locale);
    let languageCodeWithAddressing: string;

    if (newLocale.languageCode === 'de-DE') {
      languageCodeWithAddressing = newLocale.languageCode + '-' + newLocale.addressing;
    } else {
      languageCodeWithAddressing = newLocale.languageCode;
    }

    this.translateService.use(languageCodeWithAddressing).subscribe(
      _ => {
      },
      _ => {
        this.connectionError = true;
      }
    );
    moment.locale(newLocale.languageCode);
    this.localStorageService.set('language', newLocale.languageCode);
  }
}
