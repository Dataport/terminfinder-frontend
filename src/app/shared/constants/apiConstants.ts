export class ApiConstants {
  /**
   * moment format string of a serialised date time value to send to or read from the api
   * */
  public static readonly MOMENT_FORMAT_DATE_TIME = 'YYYY-MM-DDTHH:mm:ssZ';

  public static readonly MOMENT_FORMAT_DATE = 'YYYY-MM-DD';
  /**
   * moment format string of a serialised time value to send to or read from the api
   * */
  public static readonly MOMENT_FORMAT_TIME = 'HH:mm:ss.SSSZ';
  /**
   * Max number of participants of an appointment
   * */
  public static readonly MAX_NUMBER_OF_PARTICIPANTS_OF_APPOINTMENT = 5000;
}
