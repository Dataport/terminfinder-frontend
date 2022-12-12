import {Component, Input} from '@angular/core';
import {SuggestedDate} from '../../models';
import {LocaleService} from '../../services/locale/locale.service';

@Component({
  selector: 'app-suggested-date',
  templateUrl: './suggested-date.component.html',
  styleUrls: ['./suggested-date.component.scss']
})
export class SuggestedDateComponent {
  @Input() date: SuggestedDate;

  constructor(private localeService: LocaleService) {
  }

  getLocale(): string {
    return this.localeService.getLocale().languageCode;
  }

}
