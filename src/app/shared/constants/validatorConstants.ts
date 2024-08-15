export class ValidatorConstants {
  /**
   * valid chars for names and locations
   * */
  public static readonly CHAR_REGEX = '^[0-9a-zA-ZáàâäãåçéèêëíìîïñøØóòôöõúùûüýÿßæåÅÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆ'
    + '´`\'+\\-_,.;:!?§$€@#\\/()=%&*" ]*$';

  /**
   * maximum length of all input fields
   */
  public static readonly MAX_LENGTH_NAME = 50;
  public static readonly MAX_LENGTH_TITLE = 300;
  public static readonly MAX_LENGTH_LOCATION = 300;
  public static readonly MAX_LENGTH_DESCRIPTION = 1500;
  public static readonly MIN_NUMBER_SUGGESTED_DATES = 1;
  public static readonly MAX_NUMBER_SUGGESTED_DATES = 100;
  public static readonly MAX_LENGTH_DATE_DESCRIPTION = 100;
  public static readonly MOMENT_FORMAT_DATE = 'DD.MM.YYYY';
  public static readonly MOMENT_FORMAT_DATE_VARIATIONS = [
    'DD.MM.YYYY',
    'DD.MM.YY',
    'DD.M.YYYY',
    'DD.M.YY',
    'D.MM.YYYY',
    'D.MM.YY',
    'D.M.YYYY',
    'D.M.YY',
  ];
  public static readonly MOMENT_FORMAT_TIME = 'HH:mm';

  /**
   * valid chars for passwords
   */
  public static readonly PASSWORD_ALLOWED_CHARS = '0-9a-zA-Z';
  public static readonly PASSWORD_SPECIAL_CHARS = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';

  /**
   * requirements for valid password
   */
  public static readonly MIN_LENGHT_PASSWORD = 8;
  public static readonly MAX_LENGHT_PASSWORD = 30;
  public static readonly MIN_CAPITAL_CHARS_PASSWORD = 1;
  public static readonly MIN_SPECIAL_CHARS_PASSWORD = 1;
  public static readonly MIN_NUMBER_PASSWORD = 1;
}
