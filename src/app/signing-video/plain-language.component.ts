import {Component} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";

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
      <a class="d-flex align-items-center" routerLink="/">
        <img ngSrc="../../assets/back-blue.svg" aria-hidden="true" width="width" height="height" alt="chevron-left">
        <span>{{ 'accessibility.plainLanguage.backToTheFuture' | translate }}</span>
      </a>
      <h2 class="mt-4">{{ 'accessibility.plainLanguage.header' | translate }}</h2>
      <p class="multiline">{{ 'accessibility.plainLanguage.content' | translate }}</p>
    </div>
  `,
  styleUrl: './plain-language.component.scss'
})
export class PlainLanguageComponent {
}
