import { Injectable, LOCALE_ID, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { EnvConfig } from '../../../../environments/env-config.interface';
import { TimeoutError } from 'rxjs';
import { AppStateService } from '../app-state/app-state.service';
import { HttpConstants } from './http-constants';
import { NullableUtils } from '../../utils';
import {
  ApiError,
  ApiVersion,
  Appointment,
  AppointmentProtectionResult,
  AppointmentStatusType,
  Participant
} from '../../models/api-data-v1-dto';
import { Logger } from '../logging';
import { AppointmentPasswordValidationResult } from '../../models/api-data-v1-dto/appointmentPasswordValidationResult';
import { timeout } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  private http = inject(HttpClient);
  private appState = inject(AppStateService);
  private logger = inject(Logger);
  private localeId = inject(LOCALE_ID);
  private translate = inject(TranslateService);

  private readonly apiMediaType: string;
  private readonly apiBaseUrl: string;
  private readonly requestTimeoutInMs: number;
  private readonly requestTimeoutInSeconds: number;
  private readonly uriEncodedCostumerId: string;

  /**
   * Creates a new ApiDataService
   * @param {HttpClient} http - The injected HttpClient.
   * @param {AppStateService} appState - The injected AppStateService.
   * @param {Logger} logger - The injected Logger
   * @param {string} localeId - The injected locale id e.g. 'en-US'
   * @constructor
   */
  constructor() {
    const envConfig: EnvConfig = this.appState.getEnvConfig();
    this.apiBaseUrl = envConfig.apiBaseUrl;
    this.requestTimeoutInMs = envConfig.apiRequestTimeoutInMs;
    this.requestTimeoutInSeconds = this.requestTimeoutInMs / 1000;
    this.uriEncodedCostumerId = encodeURIComponent(envConfig.customerId);
    this.apiMediaType = envConfig.apiMediaType;
  }

  /**
   * Get the api version number
   * @returns {Promise<ApiVersion>} the api version number
   */
  getApiVersion(): Promise<ApiVersion> {
    const payload = '';
    const url: string = this.apiBaseUrl + '/app';
    return <Promise<ApiVersion>>this.http
      .get<ApiVersion>(url, this.getRequestOptions())
      .pipe(timeout(this.requestTimeoutInMs))
      .toPromise()
      .then((res: HttpResponse<ApiVersion>) => {
        if (res.status !== HttpConstants.HTTP_STATUS_OK) {
          return new Promise((reject: Function) => {
            reject(this.handleApiError(res, url, payload));
          });
        }
        return res.body;
      })
      .catch((error: any) => this.handleApiError(error, url, payload));
  }

  /**
   * Create the appointment
   * @returns {Promise<Appointment>} the created appointment
   */
  createAppointment(appointment: Appointment): Promise<Appointment> {
    if (NullableUtils.isObjectNullOrUndefined(appointment)) {
      throw new Error('Submitted appointment is null or undefined');
    }

    const payload = JSON.stringify(appointment);
    const url: string = `${this.apiBaseUrl}/appointment/${this.uriEncodedCostumerId}`;
    return <Promise<Appointment>>this.http
      .post<Appointment>(url, payload, this.getRequestOptions())
      .pipe(timeout(this.requestTimeoutInMs))
      .toPromise()
      .then((res: HttpResponse<Appointment>) => {
        if (res.status !== HttpConstants.HTTP_STATUS_CREATED) {
          return new Promise((reject: Function) => {
            reject(this.handleApiError(res, url, payload));
          });
        }
        return res.body;
      })
      .catch((error: any) => this.handleApiError(error, url, payload));
  }

  /**
   * update the appointment
   * @returns {Promise<Appointment>} the updated appointment
   */
  updateAppointment(appointment: Appointment): Promise<Appointment> {
    if (NullableUtils.isObjectNullOrUndefined(appointment)) {
      throw new Error('Submitted appointment is null or undefined');
    }

    const payload = JSON.stringify(appointment);
    const url: string = `${this.apiBaseUrl}/appointment/${this.uriEncodedCostumerId}`;
    return <Promise<Appointment>>this.http
      .put<Appointment>(url, payload, this.getRequestOptions())
      .pipe(timeout(this.requestTimeoutInMs))
      .toPromise()
      .then((res: HttpResponse<Appointment>) => {
        if (res.status !== HttpConstants.HTTP_STATUS_OK) {
          return new Promise((reject: Function) => {
            reject(this.handleApiError(res, url, payload));
          });
        }
        return res.body;
      })
      .catch((error: any) => this.handleApiError(error, url, payload));
  }

  /**
   * Read an appointment by appointment id
   * @returns {Promise<Appointment>} the appointment
   */
  readAppointmentById(id: string): Promise<Appointment> {
    if (NullableUtils.isStringNullOrWhitespace(id)) {
      throw new Error('Submitted id is null or undefined or empty');
    }

    const payload = '';
    const url: string = `${this.apiBaseUrl}/appointment/${this.uriEncodedCostumerId}/${encodeURIComponent(id)}`;
    return <Promise<Appointment>>this.http
      .get<Appointment>(url, this.getRequestOptions())
      .pipe(timeout(this.requestTimeoutInMs))
      .toPromise()
      .then((res: HttpResponse<Appointment>) => {
        if (res.status !== HttpConstants.HTTP_STATUS_OK) {
          return new Promise((reject: Function) => {
            reject(this.handleApiError(res, url, payload));
          });
        }
        return res.body;
      })
      .catch((error: any) => this.handleApiError(error, url, payload));
  }

  /**
   * Read an appointment by admin id
   * @returns {Promise<Appointment>} the appointment
   */
  readAppointmentByAdminId(id: string): Promise<Appointment> {
    if (NullableUtils.isStringNullOrWhitespace(id)) {
      throw new Error('Submitted id is null or undefined or empty');
    }

    const payload = '';
    const url: string = `${this.apiBaseUrl}/admin/${this.uriEncodedCostumerId}/${encodeURIComponent(id)}`;
    return <Promise<Appointment>>this.http
      .get<Appointment>(url, this.getRequestOptions())
      .pipe(timeout(this.requestTimeoutInMs))
      .toPromise()
      .then((res: HttpResponse<Appointment>) => {
        if (res.status !== HttpConstants.HTTP_STATUS_OK) {
          return new Promise((reject: Function) => {
            reject(this.handleApiError(res, url, payload));
          });
        }
        return res.body;
      })
      .catch((error: any) => this.handleApiError(error, url, payload));
  }

  /**
   * Craete or update votings of participants of an appointment
   * @returns {Promise<Participant[]>} the participants and their votings
   */
  createOrUpdateParticipantVotingsOfAppointmentById(
    appointmentId: string,
    participants: Participant[]
  ): Promise<Participant[]> {
    if (NullableUtils.isStringNullOrWhitespace(appointmentId)) {
      throw new Error('Submitted appointmentId value is null or undefined or empty');
    }
    if (NullableUtils.isObjectNullOrUndefined(participants)) {
      throw new Error('Submitted participants value is null or undefined');
    }

    const payload = JSON.stringify(participants);
    const url: string = `${this.apiBaseUrl}/votings/${this.uriEncodedCostumerId}/${encodeURIComponent(appointmentId)}`;
    return <Promise<Participant[]>>this.http
      .put<Participant[]>(url, payload, this.getRequestOptions())
      .pipe(timeout(this.requestTimeoutInMs))
      .toPromise()
      .then((res: HttpResponse<Participant[]>) => {
        if (res.status !== HttpConstants.HTTP_STATUS_CREATED) {
          return new Promise((reject: Function) => {
            reject(this.handleApiError(res, url, payload));
          });
        }
        return res.body;
      })
      .catch((error: any) => this.handleApiError(error, url, payload));
  }

  /**
   * Delete suggested date
   * * @returns {Promise<void>}
   */
  deleteSuggestedDate(appointmentId: string, suggestedDateId: string): Promise<void> {
    if (NullableUtils.isStringNullOrWhitespace(appointmentId)) {
      throw new Error('Submitted appointmentId value is null or undefined or empty');
    }
    if (NullableUtils.isStringNullOrWhitespace(suggestedDateId)) {
      throw new Error('Submitted suggested dates value is null or undefined');
    }

    const payload = '';
    const url: string = `${this.apiBaseUrl}/suggestedDate/${this.uriEncodedCostumerId}/${encodeURIComponent(appointmentId)}/${encodeURIComponent(suggestedDateId)}`;
    return <Promise<void>>this.http
      .delete<void>(url, this.getRequestOptions())
      .pipe(timeout(this.requestTimeoutInMs))
      .toPromise()
      .then((res: HttpResponse<void>) => {
        if (res.status !== HttpConstants.HTTP_STATUS_OK) {
          return new Promise((reject: Function) => {
            reject(this.handleApiError(res, url, payload));
          });
        }
        return;
      })
      .catch((error: any) => {
        if (error instanceof HttpErrorResponse) {
          const res: HttpErrorResponse = error as HttpErrorResponse;
          if (res.status === HttpConstants.HTTP_STATUS_NOTFOUND) {
            return Promise.resolve();
          }
        }
        return this.handleApiError(error, url, payload);
      });
  }

  /**
   * Delete participant
   * * @returns {Promise<void>}
   */
  deleteParticipant(appointmentId: string, participantId: string): Promise<void> {
    if (NullableUtils.isStringNullOrWhitespace(appointmentId)) {
      throw new Error('Submitted appointmentId value is null or undefined or empty');
    }
    if (NullableUtils.isStringNullOrWhitespace(participantId)) {
      throw new Error('Submitted participant value is null or undefined');
    }

    const payload = '';
    const url: string = `${this.apiBaseUrl}/participant/${this.uriEncodedCostumerId}/${encodeURIComponent(appointmentId)}/${encodeURIComponent(participantId)}`;
    return <Promise<void>>this.http
      .delete<void>(url, this.getRequestOptions())
      .pipe(timeout(this.requestTimeoutInMs))
      .toPromise()
      .then((res: HttpResponse<void>) => {
        if (res.status !== HttpConstants.HTTP_STATUS_OK) {
          return new Promise((reject: Function) => {
            reject(this.handleApiError(res, url, payload));
          });
        }
        return;
      })
      .catch((error: any) => {
        if (error instanceof HttpErrorResponse) {
          const res: HttpErrorResponse = error as HttpErrorResponse;
          if (res.status === HttpConstants.HTTP_STATUS_NOTFOUND) {
            return Promise.resolve();
          }
        }
        return this.handleApiError(error, url, payload);
      });
  }

  isAppointmentProtected(appointmentId: string): Promise<AppointmentProtectionResult> {
    if (NullableUtils.isStringNullOrWhitespace(appointmentId)) {
      throw new Error('Submitted appointmentId value is null or undefined or empty');
    }

    const payload = '';
    const url: string = `${this.apiBaseUrl}/appointment/${this.uriEncodedCostumerId}/${encodeURIComponent(appointmentId)}/protection`;
    return <Promise<AppointmentProtectionResult>>this.http
      .get<Appointment>(url, this.getRequestOptions())
      .pipe(timeout(this.requestTimeoutInMs))
      .toPromise()
      .then((res: HttpResponse<Appointment>) => {
        if (res.status !== HttpConstants.HTTP_STATUS_OK) {
          return new Promise((reject: Function) => {
            reject(this.handleApiError(res, url, payload));
          });
        }
        return res.body;
      })
      .catch((error: any) => this.handleApiError(error, url, payload));
  }

  isAdminProtected(adminId: string): Promise<AppointmentProtectionResult> {
    if (NullableUtils.isStringNullOrWhitespace(adminId)) {
      throw new Error('Submitted adminId value is null or undefined or empty');
    }

    const payload = '';
    const url: string = `${this.apiBaseUrl}/admin/${this.uriEncodedCostumerId}/${encodeURIComponent(adminId)}/protection`;
    return <Promise<AppointmentProtectionResult>>this.http
      .get<Appointment>(url, this.getRequestOptions())
      .pipe(timeout(this.requestTimeoutInMs))
      .toPromise()
      .then((res: HttpResponse<Appointment>) => {
        if (res.status !== HttpConstants.HTTP_STATUS_OK) {
          return new Promise((reject: Function) => {
            reject(this.handleApiError(res, url, payload));
          });
        }
        return res.body;
      })
      .catch((error: any) => this.handleApiError(error, url, payload));
  }

  isPasswordCorrect(appointmentId: string): Promise<AppointmentPasswordValidationResult> {
    if (NullableUtils.isStringNullOrWhitespace(appointmentId)) {
      throw new Error('Submitted appointmentId value is null or undefined or empty');
    }

    const payload = '';
    const url: string = `${this.apiBaseUrl}/appointment/${this.uriEncodedCostumerId}/${encodeURIComponent(appointmentId)}/passwordverification`;
    return <Promise<AppointmentPasswordValidationResult>>this.http
      .get<AppointmentPasswordValidationResult>(url, this.getRequestOptions())
      .pipe(timeout(this.requestTimeoutInMs))
      .toPromise()
      .then((res: HttpResponse<AppointmentPasswordValidationResult>) => {
        if (res.status !== HttpConstants.HTTP_STATUS_OK) {
          return new Promise((reject: Function) => {
            reject(this.handleApiError(res, url, payload));
          });
        }
        return res.body;
      })
      .catch((error: any) => this.handleApiError(error, url, payload));
  }

  updateAppointmentStatus(adminId: string, status: AppointmentStatusType): Promise<Appointment> {
    if (NullableUtils.isStringNullOrWhitespace(adminId)) {
      throw new Error('Submitted adminId value is null or undefined or empty');
    }

    if (NullableUtils.isStringNullOrWhitespace(status)) {
      throw new Error('Submitted status value is null or undefined or empty');
    }

    const payload = '';
    const url: string = `${this.apiBaseUrl}/admin/${this.uriEncodedCostumerId}/${encodeURIComponent(adminId)}/${encodeURIComponent(status)}/status`;
    return <Promise<Appointment>>this.http
      .put<Appointment>(url, payload, this.getRequestOptions())
      .pipe(timeout(this.requestTimeoutInMs))
      .toPromise()
      .then((res: HttpResponse<Appointment>) => {
        if (res.status !== HttpConstants.HTTP_STATUS_OK) {
          return new Promise((reject: Function) => {
            reject(this.handleApiError(res, url, payload));
          });
        }
        return res.body;
      })
      .catch((error: any) => this.handleApiError(error, url, payload));
  }

  isAdminPasswordCorrect(adminId: string): Promise<AppointmentPasswordValidationResult> {
    if (NullableUtils.isStringNullOrWhitespace(adminId)) {
      throw new Error('Submitted adminId value is null or undefined or empty');
    }

    const payload = '';
    const url: string = `${this.apiBaseUrl}/admin/${this.uriEncodedCostumerId}/${encodeURIComponent(adminId)}/passwordverification`;
    return <Promise<AppointmentPasswordValidationResult>>this.http
      .get<AppointmentPasswordValidationResult>(url, this.getRequestOptions())
      .pipe(timeout(this.requestTimeoutInMs))
      .toPromise()
      .then((res: HttpResponse<AppointmentPasswordValidationResult>) => {
        if (res.status !== HttpConstants.HTTP_STATUS_OK) {
          return new Promise((reject: Function) => {
            reject(this.handleApiError(res, url, payload));
          });
        }
        return res.body;
      })
      .catch((error: any) => this.handleApiError(error, url, payload));
  }

  private getRequestOptions(): any {
    let headers = new HttpHeaders();
    headers = headers
      .set(HttpConstants.HTTP_HEADER_ACCEPT_LANGUAGE, this.localeId)
      .set(HttpConstants.HTTP_HEADER_ACCEPT, this.apiMediaType)
      .set(HttpConstants.HTTP_HEADER_CONTENT_TYPE, this.apiMediaType);
    return {
      headers: headers,
      responseType: 'json',
      observe: 'response'
    };
  }

  private handleApiError(
    error: any,
    requestedUrl: string,
    payloadOfRequest: string,
    resourceType?: string
  ): Promise<any> {
    this.logger.warn(`Ein Fehler ist beim Zugriff auf die API aufgetreten`);
    this.logger.warn(`Angefragte URL: ${requestedUrl}`);
    this.logger.warn(`Body der Anfrage:`, payloadOfRequest);
    this.logger.warn(`Fehlermeldung:`, error);

    let errorMsg: string;
    if (typeof error === 'string') {
      errorMsg = error;
      return Promise.reject(new Error(errorMsg));
    }

    switch (error.constructor) {
      case HttpErrorResponse:
        errorMsg = this.getErrorMessageForHttpErrorResponse(error, resourceType);
        break;
      case TimeoutError:
        errorMsg = this.translate.instant('errors.api.timeout', { seconds: this.requestTimeoutInSeconds });
        break;
      case Error: {
        const res: Error = error as Error;
        errorMsg = this.translate.instant('errors.api.unexpected', { error: res.message });
        break;
      }
      default:
        errorMsg = this.translate.instant('errors.api.unexpected', { error: JSON.stringify(error) });
    }

    return Promise.reject(new Error(errorMsg));
  }

  private getErrorMessageForHttpErrorResponse(res: HttpErrorResponse, resourceType?: string) {
    if (res.status === HttpConstants.HTTP_STATUS_NOINTERNETCON) {
      return this.translate.instant('errors.api.noInternet');
    }

    this.logger.warn(`Body der Antwort:`, res.error);

    if (!res.headers.has(HttpConstants.HTTP_HEADER_CONTENT_TYPE)) {
      return this.translate.instant('errors.api.missingContentType');
    }

    if (!res.headers.get(HttpConstants.HTTP_HEADER_CONTENT_TYPE).startsWith(this.apiMediaType)) {
      return this.translate.instant('errors.api.mediaType', {
        mediaType: res.headers.get(HttpConstants.HTTP_HEADER_CONTENT_TYPE)
      });
    }

    let errorMsg: string;
    const apiError: ApiError = res.error as ApiError;

    switch (res.status) {
      case HttpConstants.HTTP_STATUS_BADREQUEST:
        errorMsg = this.translate.instant('errors.api.badRequest', {
          status: res.status,
          details: NullableUtils.isObjectNullOrUndefined(apiError) ? '' : `${apiError.code} - ${apiError.message}`
        });
        break;
      case HttpConstants.HTTP_STATUS_FORBIDDEN:
        errorMsg = this.translate.instant('errors.api.forbidden');
        break;
      case HttpConstants.HTTP_STATUS_UNAUTHORIZED:
        errorMsg = this.translate.instant('errors.api.unauthorized');
        break;
      case HttpConstants.HTTP_STATUS_NOTFOUND:
        errorMsg = this.translate.instant('errors.api.notFound', {
          resource: resourceType ? resourceType : this.translate.instant('errors.api.resource')
        });
        break;
      case HttpConstants.HTTP_STATUS_NOTACCEPTED:
        errorMsg = this.translate.instant('errors.api.notAccepted');
        break;
      case HttpConstants.HTTP_STATUS_INTERNALSERVERERROR:
        errorMsg = this.translate.instant('errors.api.server');
        break;
      default:
        errorMsg =
          res.status > 400 && res.status < 500
            ? this.translate.instant('errors.api.client', { status: res.status })
            : this.translate.instant('errors.api.unexpectedStatus', { status: res.status });
    }

    return errorMsg;
  }
}
