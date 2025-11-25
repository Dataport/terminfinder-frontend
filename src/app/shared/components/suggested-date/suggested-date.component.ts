import { Component, input } from '@angular/core';
import { SuggestedDate } from '../../models';
import { LocaleService } from '../../services/locale/locale.service';
import { NgClass, SlicePipe, DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-suggested-date',
  templateUrl: './suggested-date.component.html',
  styleUrls: ['./suggested-date.component.scss'],
  imports: [
    NgClass,
    SlicePipe,
    DatePipe,
    TranslatePipe
  ]
})
export class SuggestedDateComponent {
  readonly date = input<SuggestedDate>(undefined);
  readonly index = input<number>(undefined);

  constructor(private localeService: LocaleService) {}

  getLocale(): string {
    return this.localeService.getLocale().languageCode;
  }
}
