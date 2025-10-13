import { TestBed } from '@angular/core/testing';
import { ColorsService } from './colors.service';
import { Logger } from './logging';
import { ColorsInterface } from '../utils/colors.interface';

describe('ColorsService', () => {
  let service: ColorsService;
  let loggerSpy: jest.Mocked<Logger>;
  let documentSpy: jest.SpyInstance;

  beforeEach(() => {
    // Create spy for Logger
    const loggerSpyObj = {
      info: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      log: jest.fn(),
      trace: jest.fn(),
      loggingMomentDateTimeFormat: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
      logLevelThreshold: 0 // LogLevel.TRACE
    };

    TestBed.configureTestingModule({
      providers: [
        ColorsService,
        { provide: Logger, useValue: loggerSpyObj }
      ]
    });

    service = TestBed.inject(ColorsService);
    loggerSpy = TestBed.inject(Logger) as jest.Mocked<Logger>;

    // Setup document.documentElement.style.setProperty spy
    documentSpy = jest.spyOn(document.documentElement.style, 'setProperty');
  });

  afterEach(() => {
    // Clear all cookies - reliable approach
    document.cookie.split(";").forEach(cookie => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });

    // Clear all jest mocks
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('replaceCSSColorsFromCookies', () => {

    it('should set CSS property when cookie exists', () => {
      // Set a test cookie
      document.cookie = 'primary=#ff0000';

      service.replaceCSSColorsFromCookies();

      expect(documentSpy).toHaveBeenCalledWith('--primary', '#ff0000');
      expect(loggerSpy.debug).toHaveBeenCalledWith('Cookie found, value is: ', '#ff0000');
    });

    it('should not set CSS property when cookie does not exist', () => {
      service.replaceCSSColorsFromCookies();

      expect(documentSpy).not.toHaveBeenCalled();
    });

    it('should not set CSS property when cookie is not a predefined color', () => {
      document.cookie = 'some-key=#ff0000';

      service.replaceCSSColorsFromCookies();

      expect(documentSpy).not.toHaveBeenCalled();
    });

    it('should handle multiple color cookies', () => {
      document.cookie = 'primary=#ff0000';
      document.cookie = 'secondary=#00ff00';

      service.replaceCSSColorsFromCookies();

      expect(documentSpy).toHaveBeenCalledWith('--primary', '#ff0000');
      expect(documentSpy).toHaveBeenCalledWith('--secondary', '#00ff00');
      expect(documentSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('replaceCSSColorFromEnv', () => {

    it('should handle null colors parameter', () => {
      service.replaceCSSColorFromEnv(null);

      expect(loggerSpy.debug).toHaveBeenCalledWith('No colors string provided');
      expect(documentSpy).not.toHaveBeenCalled();
    });

    it('should handle empty string colors parameter', () => {
      service.replaceCSSColorFromEnv('');

      expect(loggerSpy.debug).toHaveBeenCalledWith('No colors string provided');
      expect(documentSpy).not.toHaveBeenCalled();
    });

    it('should parse valid JSON and set CSS properties', () => {
      const colorsJson = JSON.stringify({
        primary: '#ff0000',
        secondary: '#00ff00'
      } satisfies ColorsInterface);

      service.replaceCSSColorFromEnv(colorsJson);

      expect(documentSpy).toHaveBeenCalledWith('--primary', '#ff0000');
      expect(documentSpy).toHaveBeenCalledWith('--secondary', '#00ff00');
      expect(loggerSpy.debug).toHaveBeenCalledWith('Parsed colors object: ', expect.any(Object));
    });

    it('should only set CSS properties for colors that have values', () => {
      const colorsJson = JSON.stringify({
        primary: '#ff0000',
        secondary: undefined,
        'light-gray': null,
        'dark-gray': '#333333'
      } satisfies ColorsInterface);

      service.replaceCSSColorFromEnv(colorsJson);

      expect(documentSpy).toHaveBeenCalledWith('--primary', '#ff0000');
      expect(documentSpy).toHaveBeenCalledWith('--dark-gray', '#333333');
      expect(documentSpy).toHaveBeenCalledTimes(2);
    });

    it('should skip invalid colors names gracefully', () => {
      const colorsJson = JSON.stringify({
         tertiary: '#ff0000', // tertiary does not exist on ColorsInterface
      });

      service.replaceCSSColorFromEnv(colorsJson);

      expect(documentSpy).not.toHaveBeenCalled();
    });

    it('should handle invalid JSON gracefully', () => {
      const invalidJson = '{ invalid json }';

      service.replaceCSSColorFromEnv(invalidJson);

      expect(loggerSpy.warn).toHaveBeenCalled();
      expect(loggerSpy.debug).toHaveBeenCalledWith('Invalid colors string: ', invalidJson);
      expect(documentSpy).not.toHaveBeenCalled();
    });

    it('should handle non-string JSON object input gracefully', () => {
      let nonStringJsonObject = '123';
      service.replaceCSSColorFromEnv(nonStringJsonObject);

      nonStringJsonObject = '[]';
      service.replaceCSSColorFromEnv(nonStringJsonObject);

      nonStringJsonObject = '[1,2,3]';
      service.replaceCSSColorFromEnv(nonStringJsonObject);

      expect(loggerSpy.warn).toHaveBeenCalledTimes(3);
      expect(loggerSpy.debug).toHaveBeenCalledWith('Invalid colors string: ', '123');
      expect(loggerSpy.debug).toHaveBeenCalledWith('Invalid colors string: ', '[]');
      expect(loggerSpy.debug).toHaveBeenCalledWith('Invalid colors string: ', '[1,2,3]');
      expect(documentSpy).not.toHaveBeenCalled();
    });
  });
});
