import {Component, OnInit} from '@angular/core';
import './operators';
import {environment} from '../environments/environment';
import {Logger} from './shared/services/logging';
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
  headlineHome = environment.title;

  constructor(
    public localeService: LocaleService,
    private logger: Logger,
    private titleService: Title,
    private translateService: TranslateService,
    private localStorageService: LocalStorageService,
  ) {
  }

  ngOnInit(): void {
    this.logger.debug('ENV: ', environment);
    this.titleService.setTitle(environment.title);

    const lang = this.localStorageService.get('language');
    this.logger.debug('LANG: ', lang);
    this.localeService.initLanguage(lang);

    this.translateService.onLangChange
      .subscribe(
        _ => {},
        _ => {
        this.connectionError = true;
      });
  }
}
