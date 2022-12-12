import {Injectable} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import localeGerman from '@angular/common/locales/de';
import localeEnglish from '@angular/common/locales/en';
import {environment} from "../../../../environments/environment";

export type LanguageCode = 'de-DE' | 'en-EN';
export type Addressing = 'du' | 'sie';

export interface Locale {
  languageCode: LanguageCode,
  addressing: Addressing
}

@Injectable({providedIn: 'root'})
export class LocaleService {

  private _locale: Locale = {
    languageCode: 'de-DE',
    addressing: 'du'
  };

  constructor() {
    if (environment.locale === 'en-EN') {
      this._locale.languageCode = 'en-EN';
    }
    if (environment.addressing === 'sie') {
      this._locale.addressing = 'sie';
    }
  }

  getLocale(): Locale {
    return this._locale;
  }

  setLocale(languageCode?: string, addressing?: string): Locale {
    if (!languageCode && !addressing) {
      return this._locale;
    }

    switch (languageCode) {
      case 'de-du':
      case 'de-sie':
      case 'de':
      case 'de-DE': {
        this._locale.languageCode = 'de-DE';
        registerLocaleData(localeGerman);
        break;
      }
      case 'en':
      case 'en-EN': {
        this._locale.languageCode = 'en-EN';
        registerLocaleData(localeEnglish);
        break;
      }
    }

    switch (addressing) {
      case 'du':
        this._locale.addressing = 'du';
        break;
      case 'sie':
        this._locale.addressing = 'sie';
        break;
    }

    return this._locale;
  }
}
