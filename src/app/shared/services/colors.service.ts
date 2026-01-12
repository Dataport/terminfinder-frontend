import { Injectable } from '@angular/core';
import { Logger } from './logging';
import { ColorsInterface } from '../utils/colors.interface';
import { StringTransformService } from './string-transform.service';

@Injectable({
  providedIn: 'root'
})
export class ColorsService {
  colors: string[] = [
    'primary',
    'primary-lighter-10',
    'secondary',
    'light-gray',
    'medium-gray',
    'dark-gray',
    'focus-border',
    'toolbar-background-color',
    'primary-background-color',
    'danger',
    'bootstrap-form-control-color',
    // Inherited Colors - see colors.scss
    'footer-text-color',
    'border-color-input',
    'border-color-divider-icon-input'
  ];

  constructor(
    private logger: Logger,
    private stringTransformService: StringTransformService
  ) {}

  replaceCSSColorsFromCookies(): void {
    this.logger.debug('replaceCSSColorsFromCookies()');

    this.colors.forEach((color) => {
      this.logger.debug('Looking for: ', color);

      const colorValue = this.getCookie(color);
      if (colorValue) {
        this.logger.debug('Cookie found, value is: ', colorValue);
        document.documentElement.style.setProperty(`--${color}`, colorValue);
      }
    });
  }

  /**
   * Replaces CSS custom properties with values from a JSON string.
   *
   * @param colors A string representing a JSON object of type {@link ColorsInterface}.
   * @logs A warning if parsing fails or the content is not a valid JSON object.
   */
  replaceCSSColorFromEnv(colors: ColorsInterface | string): void {
    this.logger.debug('replaceCSSColorFromEnv()');

    if (!colors) {
      this.logger.debug('No colors string provided');
      return;
    }

    try {
      const colorObject = typeof colors === 'string' ? JSON.parse(colors) : colors;

      // Validate that the parsed result is a valid object
      if (!colorObject || typeof colorObject !== 'object' || Array.isArray(colorObject)) {
        throw new Error('Parsed colors is not a valid object');
      }

      this.logger.debug('Parsed colors object: ', colorObject);

      // Apply each color from the parsed object to CSS custom properties
      this.colors.forEach((colorKey) => {
        const colorValue = colorObject[colorKey as keyof ColorsInterface];
        if (colorValue) {
          this.logger.debug(`Setting CSS variable --${colorKey} to: ${colorValue}`);
          document.documentElement.style.setProperty(`--${colorKey}`, colorValue);
        }
      });
    } catch (error) {
      this.logger.warn(
        'Could not parse Colors from Environment. The Content is most likely not a valid JSON Object. Default colors are applied.'
      );
      this.logger.debug('Invalid colors string: ', colors);
    }
  }

  private getCookie(name: string): string | null {
    // 1. cookie string trennen 'foo=bar; variable=value; etc=123'
    // 2. value für regex escapen
    // 3. value auslesen
    const matches = document.cookie.match(
      new RegExp('(?:^|; )' + name.replace(/([$?*|{}\[\]\\\/+^])/g, '\\$1') + '=([^;]*)')
    );
    return matches ? decodeURIComponent(matches[1]) : null;
  }
}
