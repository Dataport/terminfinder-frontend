import {Component, inject, OnInit} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {Location, NgOptimizedImage} from "@angular/common";
import {RouteTitleService} from "../shared/services/route-title.service";
import {MediaelementPlayerComponent} from "../shared/components/mediaelement-player/mediaelement-player.component";

@Component({
  selector: 'app-sign-language',
  standalone: true,
  imports: [
    TranslateModule,
    NgOptimizedImage,
    MediaelementPlayerComponent,
  ],
  template: `
    <div class="d-flex flex-column px-4">
      <h1>{{ 'accessibility.signLanguage.header' | translate }}</h1>
      <p>{{ 'accessibility.signLanguage.content' | translate }}</p>

      @for (video of videos; track video) {
        <div class="w-100 mb-3">
          <h2 class="my-4">{{ video.titleTranslateString | translate }}</h2>
          <app-mediaelement-player [src]="video.src" [title]="video.titleTranslateString | translate"></app-mediaelement-player>
        </div>
      }

      <a class="back-link btn btn-secondary btn-with-image w-100 d-flex justify-content-between" href="#" (click)="location.back()">
        <img aria-hidden="true" alt="" ngSrc="../../assets/back.svg" class="back-btn" width="width" height="height">
        {{ 'accessibility.signLanguage.backToTheFuture' | translate }}
        <div class="hidden"></div>
      </a>
    </div>
  `,
  styleUrl: './sign-language.component.scss'
})
export class SignLanguageComponent implements OnInit {
  protected readonly location = inject(Location);

  protected readonly videos = [
    {
      titleTranslateString: 'accessibility.signLanguage.videos.0.title',
      src: 'https://api.dgolive.de/p/105/sp/0/playManifest/entryId/0_tig10w13/format/url/flavorParamId/0/video.mp4'
    },
    {
      titleTranslateString: 'accessibility.signLanguage.videos.1.title',
      src: 'https://api.dgolive.de/p/105/sp/0/playManifest/entryId/0_ovo5c099/format/url/flavorParamId/0/video.mp4'
    },
    {
      titleTranslateString: 'accessibility.signLanguage.videos.2.title',
      src: 'https://api.dgolive.de/p/105/sp/0/playManifest/entryId/0_yaxniffj/format/url/flavorParamId/0/video.mp4'
    }
  ];

  constructor(private routeTitle: RouteTitleService) {
  }

  ngOnInit(): void {
    this.routeTitle.setTitle('accessibility.signLanguage.header');
  }
}
