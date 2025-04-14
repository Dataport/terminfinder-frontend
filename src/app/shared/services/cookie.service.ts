import {Injectable} from "@angular/core";
import {Logger} from "./logging";

@Injectable({
  providedIn: 'root'
})

export class CookieService {
  colors: string[] = [
    'primary',
    'primary-lighter-10',
    'secondary',
    'light-gray',
    'medium-gray',
    'dark-gray',
    's-h-blue',
    's-h-blue-50',
    's-h-blue-15',
    's-h-light-blue',
    'danger',
    'bootstrap-form-control-color',
    // Inherited Colors - see colors.scss
    'footer-text-color',
    'border-color-input',
    'border-color-divider-icon-input',
    'toolbar-background-color',
    'primary-background-color',
  ];

  constructor(private logger: Logger) {
  }

  replaceCSSColorsFromCookies(): void {
    this.logger.info('replaceCSSColorsFromCookies()');

    this.colors.forEach((color) => {
      this.logger.debug('Looking for: ', color);

      const colorValue = this.getCookie(color);
      if (colorValue) {
        this.logger.debug('Cookie found, value is: ', colorValue);
        document.documentElement.style.setProperty(`--${color}`, colorValue);
      }
    });
  }

  private getCookie(name: string): string | null {
    // 1. cookie string trennen "foo=bar; variable=value; etc=123"
    // 2. value für regex escapen
    // 3. value auslesen
    const matches = document.cookie.match(new RegExp(
      '(?:^|; )' + name.replace(/([$?*|{}\[\]\\\/+^])/g, '\\$1') + '=([^;]*)'
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
  }
}
