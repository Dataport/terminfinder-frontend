import {ConsoleLogOptionsInterface} from '../app/shared/services/logging/';

export interface EnvConfig {
  /** The displayed title of the app **/
  readonly title: string;
  /** Default locale for translation **/
  readonly locale: string;
  /** Addressing flavor of german translation (duzen, siezen) **/
  readonly addressing: string;
  /** Version string */
  readonly version: string;
  /** Build date as utc time (iso format) */
  readonly buildDateUtc: string;
  /** Is production build */
  readonly production: boolean;
  /** Base api url */
  apiBaseUrl: string;
  /** Timeout in ms for an api request */
  readonly apiRequestTimeoutInMs: number;
  /** Customer id */
  readonly customerId: string;
  /** Options for Logging to Console */
  readonly consoleLoggingOptions: ConsoleLogOptionsInterface;
  /** E-Mail to contact owner of website */
  readonly email?: string;
  /** HTMLElement of imprint */
  readonly imprint: string;
  /** HTMLElement of privacy declaration */
  readonly privacy: string;
  /** HTMLElement of tos declaration */
  readonly termsOfService: string;
  /** HTMLElement of accessibility declaration */
  readonly accessibility: string;
  /** Link to survey as admin */
  readonly surveyLinkAdmin?: string;
  /** Link to survey as user*/
  readonly surveyLinkUser?: string;
  /** Media type of api **/
  readonly apiMediaType: string;
}
