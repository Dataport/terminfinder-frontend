import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {ValidatorUtils} from '../validators/validator-utils';
import {MomentUtils} from '../utils';

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {

  constructor(@Inject(LOCALE_ID) private localeId) {
    super();
  }

  parse(value: string): NgbDateStruct {
    try {
      return ValidatorUtils.parseNgbDateStructFromMoment(MomentUtils.parseMomentDateFromString(value, this.localeId), this.localeId);
    } catch (e) {
      return null;
    }
  }

  format(date: NgbDateStruct): string {
    if (date) {
      return ValidatorUtils.serializeDateFromNgbDateStruct(date, this.localeId);
    } else {
      return '';
    }
  }
}
