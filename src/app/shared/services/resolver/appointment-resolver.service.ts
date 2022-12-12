import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot} from '@angular/router';
import {Appointment} from '../../models';
import {Utils} from '../utils';
import {AppStateService} from '../app-state/app-state.service';
import {Appointment as ApiAppointment} from '../../models/api-data-v1-dto';
import {ModelTransformerService} from '../transformer';
import {DataRepositoryService} from '../data-service';
import {Logger} from '../logging';


@Injectable({
  providedIn: 'root'
})
export class AppointmentResolverService {
  model: Appointment;

  constructor(
    private appStateService: AppStateService,
    private dataRepoService: DataRepositoryService,
    private logger: Logger, @Inject(LOCALE_ID) private localeId: string,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Promise<Appointment> | Observable<never> {
    this.model = this.appStateService.getAppointment();
    const adminId = route.paramMap.get('adminId');
    if (Utils.isObjectNullOrUndefined(adminId)) {
      throw new Error('adminId is null or undefined');
    }
    return this.getAppointment(adminId);
  }

  private getAppointment(adminId: string): Promise<Appointment> | null {
    return this.dataRepoService.readAppointmentByAdminId(adminId).then((data: ApiAppointment) => {
      this.logger.debug(`Umfrage mittels AdminId empfangen mit den Werten: ${JSON.stringify(data)}`, data);
      return ModelTransformerService.transformApiAppointmentToAppointment(data);
    })
      .catch((err: any) => {
        this.logger.error(`Fehler beim Ermitteln der Daten von der API: ${err}`);
        return null;
      });
  }
}
