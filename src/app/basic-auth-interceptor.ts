import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AppStateService} from './shared/services/app-state/app-state.service';
import {Utils} from './shared/services/utils';
import {HttpConstants} from './shared/services/data-service';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {

  constructor(private appStateService: AppStateService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const appointment = this.appStateService.getAppointment();
    // if a password is set use customerId and password for basic auth
    if (appointment && !Utils.isStringNullOrWhitespace(this.appStateService.getCredentials())) {
      req = req.clone({
        setHeaders: {
          Authorization: `${HttpConstants.HTTP_HEADER_BASIC_AUTHENTICATION} ${this.appStateService.getCredentials()}`
        }
      });
    }
    return next.handle(req);
  }
}
