import {Component, inject} from '@angular/core';
import {YouTubePlayer} from "@angular/youtube-player";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {Location, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-sign-language',
  standalone: true,
  imports: [
    YouTubePlayer,
    TranslateModule,
    RouterLink,
    NgOptimizedImage
  ],
  template: `
    <div class="d-flex flex-column px-4">
      <a class="d-flex align-items-center" (click)="location.back()">
        <img ngSrc="../../assets/back-blue.svg" class="back-btn" aria-hidden="true" width="width" height="height" alt="chevron-left">
        {{ 'accessibility.signLanguage.backToTheFuture' | translate }}
      </a>
      <h2 class="mt-4">{{ 'accessibility.signLanguage.header' | translate }}</h2>
      <p>{{ 'accessibility.signLanguage.content' | translate }}</p>
      <h3 class="my-4">{{ 'accessibility.signLanguage.subheader' | translate }}</h3>
      <youtube-player [videoId]="videoId" [disableCookies]="true"/>
    </div>
  `,
  styleUrl: './sign-language.component.scss'
})
export class SignLanguageComponent {
  protected readonly location = inject(Location);
  // TODO: change video ID to the correct one
  protected readonly videoId = 'zqLEO5tIuYs';
}
