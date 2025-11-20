import { Component, OnInit } from '@angular/core';
import './operators';
import { environment } from '../environments/environment';
import { Logger } from './shared/services/logging';
import { Title } from '@angular/platform-browser';
import { LocalStorageService } from './shared/services/data-service/local-storage.service';
import { LocaleService } from './shared/services/locale/locale.service';
import { NullableUtils } from './shared/utils';
import { ColorsService } from './shared/services/colors.service';
import { StringTransformService } from './shared/services/string-transform.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  protected readonly NullableUtils = NullableUtils;

  connectionError = false;
  headlineHome = environment.title;

  constructor(
    public localeService: LocaleService,
    private logger: Logger,
    private titleService: Title,
    private localStorageService: LocalStorageService,
    private colorsService: ColorsService,
    private stringTransformService: StringTransformService
  ) {}

  ngOnInit(): void {
    this.logger.debug('ENV: ', environment);
    this.titleService.setTitle(environment.title);

    const lang = this.localStorageService.get('language');
    this.logger.debug('LANG: ', lang);

    this.localeService
      .initLanguage(lang)
      .subscribe({
        error: _ => {
          this.connectionError = true;
        }
      });

    this.colorsService.replaceCSSColorFromEnv(this.stringTransformService.decode(environment.colors));
    this.colorsService.replaceCSSColorsFromCookies();
  }
}
