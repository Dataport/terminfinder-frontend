import {Component, inject} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {Location, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-plain-language',
  standalone: true,
  imports: [
    TranslateModule,
    RouterLink,
    NgOptimizedImage
  ],
  template: `
    <div class="d-flex flex-column px-4">
      <h2>{{ 'accessibility.plainLanguage.header' | translate }}</h2>
      <p class="multiline">{{ 'accessibility.plainLanguage.content' | translate }}</p>
      <h3>{{ 'accessibility.plainLanguage.about.header' | translate }}</h3>
      <p class="multiline">{{ 'accessibility.plainLanguage.about.content' | translate }}</p>
      <h3>{{ 'accessibility.plainLanguage.howto.header' | translate }}</h3>
      @for (step of ['0', '1', '2', '3', '4']; track step) {
        <h4>{{ 'accessibility.plainLanguage.howto.step' | translate }} {{ step }}
          : {{ 'accessibility.plainLanguage.howto.steps.' + step + '.header' | translate }}</h4>
        <p class="multiline" [innerHTML]="'accessibility.plainLanguage.howto.steps.' + step + '.content' | translate"></p>
      }

      <h3>{{ 'accessibility.plainLanguage.declarationOnAccessibility.header' | translate }}</h3>
      <p class="multiline mb-4" [innerHTML]="'accessibility.plainLanguage.declarationOnAccessibility.content' | translate"></p>
      <a class="back-link btn btn-secondary btn-with-image w-100 d-flex justify-content-between" href="#" (click)="location.back()">
        <img ngSrc="../../assets/back.svg" class="back-btn" aria-hidden="true" width="width" height="2.75rem" alt="chevron-left">
        {{ 'accessibility.plainLanguage.backToTheFuture' | translate }}
        <div class="hidden"></div>
      </a>
    </div>
  `,
  styleUrl: './plain-language.component.scss'
})
export class PlainLanguageComponent {
  protected readonly location = inject(Location);
}
