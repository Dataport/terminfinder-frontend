import {Component, inject, OnInit} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {Location, NgOptimizedImage} from "@angular/common";
import {RouteTitleService} from "../shared/services/route-title.service";

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
      <h1>{{ 'accessibility.plainLanguage.header' | translate }}</h1>
      <p class="multiline">{{ 'accessibility.plainLanguage.content' | translate }}</p>
      <h2>{{ 'accessibility.plainLanguage.about.header' | translate }}</h2>
      <p class="multiline">{{ 'accessibility.plainLanguage.about.content' | translate }}</p>
      <h2>{{ 'accessibility.plainLanguage.howto.header' | translate }}</h2>
      @for (step of ['0', '1', '2', '3', '4']; track step) {
        <h3>{{ 'accessibility.plainLanguage.howto.step' | translate }} {{ step }}
          : {{ 'accessibility.plainLanguage.howto.steps.' + step + '.header' | translate }}</h3>
        <p class="multiline" [innerHTML]="'accessibility.plainLanguage.howto.steps.' + step + '.content' | translate"></p>
      }

      <h2>{{ 'accessibility.plainLanguage.declarationOnAccessibility.header' | translate }}</h2>
      <p class="multiline mb-4" [innerHTML]="'accessibility.plainLanguage.declarationOnAccessibility.content' | translate"></p>
      <a class="back-link btn btn-secondary btn-with-image w-100 d-flex justify-content-between" href="#" (click)="location.back()">
        <img aria-hidden="true" alt="" ngSrc="../../assets/back.svg" class="back-btn" width="width" height="2.75rem">
        {{ 'accessibility.plainLanguage.backToTheFuture' | translate }}
        <div class="hidden"></div>
      </a>
    </div>
  `,
  styleUrl: './plain-language.component.scss'
})
export class PlainLanguageComponent implements OnInit {
  protected readonly location = inject(Location);

  constructor(private routeTitle: RouteTitleService) {
  }

  ngOnInit(): void {
    this.routeTitle.setTitle('accessibility.plainLanguage.header');
  }
}
