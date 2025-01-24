import {Injectable} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import localeGerman from '@angular/common/locales/de';
import localeEnglish from '@angular/common/locales/en';
import {environment} from "../../../../environments/environment";
import moment from "moment/moment";
import {TranslateService} from "@ngx-translate/core";
import {LocalStorageService} from "../data-service/local-storage.service";
import {NullableUtils} from "../../utils";

export type LanguageCode = 'de-DE' | 'en-EN';
export type Addressing = 'du' | 'sie';

export interface Locale {
  languageCode: LanguageCode,
  addressing: Addressing
}

@Injectable({providedIn: 'root'})
export class LocaleService {
  private readonly DEFAULT_LOCALE: string = 'de-DE';

  private _locale: Locale = {
    languageCode: 'de-DE',
    addressing: 'du'
  };

  constructor(
    private translateService: TranslateService,
    private localStorageService: LocalStorageService,
  ) {
    if (environment.locale === 'en-EN') {
      this._locale.languageCode = 'en-EN';
    }
    if (environment.addressing === 'sie') {
      this._locale.addressing = 'sie';
    }
  }

  getIsoLanguageCode(): string {
    switch (this._locale.languageCode) {
      case 'de-DE': {
        return 'de';
      }
      case 'en-EN': {
        return 'en';
      }
    }
  }

  getLocale(): Locale {
    return this._locale;
  }

  setLocale(languageCode?: string, addressing?: string): void {
    if (!languageCode && !addressing) return;

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

    this.setMejsLanguage(this._locale.languageCode);

    switch (addressing) {
      case 'du':
        this._locale.addressing = 'du';
        break;
      case 'sie':
        this._locale.addressing = 'sie';
        break;
    }
  }

  initLanguage(lang: string) {
    if (!NullableUtils.isStringNullOrWhitespace(lang)) {
      return this.changeLanguage(lang);
    } else {
      return this.changeLanguage(navigator.language);
    }
  }

  changeLanguage(locale: string, setLocalStorage = true) {
    this.setLocale(locale);

    if (setLocalStorage) {
      this.localStorageService.set('language', this._locale.languageCode);
    }

    moment.locale(this._locale.languageCode);
    document.querySelector('html')?.setAttribute('lang', this.getIsoLanguageCode());

    return this.translateService.use(this.getLanguageCodeWithAddressing());
  }

  getLanguageCodeWithAddressing() {
    if (this._locale.languageCode === 'de-DE') {
      return this._locale.languageCode + '-' + this._locale.addressing;
    } else {
      return this._locale.languageCode;
    }
  }

  useDefaultLanguage() {
    this.changeLanguage(this.DEFAULT_LOCALE, false);

    const languageDropdown = document.querySelector('#language-dropdown .combobox');
    languageDropdown.setAttribute('aria-disabled', 'true');
    languageDropdown.setAttribute('tabindex', '-1');
    languageDropdown.classList.add('disabled');
  }

  useStoredLanguage() {
    const lang = this.localStorageService.get('language') ?? this.DEFAULT_LOCALE;
    this.changeLanguage(lang);

    const languageDropdown = document.querySelector('#language-dropdown .combobox');
    languageDropdown.setAttribute('aria-disabled', 'false');
    languageDropdown.setAttribute('tabindex', '0');
    languageDropdown.classList.remove('disabled');
  }

  setMejsLanguage(languageCode: LanguageCode) {
    const langShort = languageCode.split('-')[0];
    if ((langShort === 'de' || langShort === 'en') && mejs && mejs.i18n) {
      mejs.i18n.lang = langShort;
    }
  }
}
