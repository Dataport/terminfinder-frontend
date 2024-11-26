import {Component, inject, OnInit} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {Location, NgOptimizedImage} from "@angular/common";
import {DGoLiveVideoPlayerComponent} from "../shared/components/video-player/d-go-live-video-player.component";
import {RouteTitleService} from "../shared/services/route-title.service";

@Component({
  selector: 'app-sign-language',
  standalone: true,
  imports: [
    TranslateModule,
    RouterLink,
    NgOptimizedImage,
    DGoLiveVideoPlayerComponent,
  ],
  template: `
    <div class="d-flex flex-column px-4">
      <h1>{{ 'accessibility.signLanguage.header' | translate }}</h1>
      <p>{{ 'accessibility.signLanguage.content' | translate }}</p>

      @for (video of videos; track video) {
        <div class="w-100 mb-3">
          <h2 class="my-4">{{ video.titleTranslateString | translate }}</h2>
          <app-video-player [src]="video.src" [title]="video.titleTranslateString | translate"></app-video-player>
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

  protected readonly videos = [{
    titleTranslateString: 'accessibility.signLanguage.videos.0.title',
    src: 'https://dataport.mediaspace.dgolive.de/embed/secure/iframe/entryId/0_tig10w13/uiConfId/23448421/pbc/117/st/0'
  }, {
    titleTranslateString: 'accessibility.signLanguage.videos.1.title',
    src: 'https://dataport.mediaspace.dgolive.de/embed/secure/iframe/entryId/0_ovo5c099/uiConfId/23448421/pbc/117/st/0'
  }, {
    titleTranslateString: 'accessibility.signLanguage.videos.2.title',
    src: 'https://dataport.mediaspace.dgolive.de/embed/secure/iframe/entryId/0_yaxniffj/uiConfId/23448421/pbc/117/st/0'
  }];

  constructor(private routeTitle: RouteTitleService) {
  }

  ngOnInit(): void {
    this.routeTitle.setTitle('accessibility.signLanguage.header');
  }
}
