import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Location, NgOptimizedImage } from '@angular/common';
import { RouteTitleService } from '../shared/services/route-title.service';
import { VideoPlayerComponent } from '../shared/components/video-player/video-player.component';

@Component({
  selector: 'app-sign-language',
  imports: [
    TranslateModule,
    NgOptimizedImage,
    VideoPlayerComponent
  ],
  template: `
    <div class="d-flex flex-column px-4">
      <h1>{{ 'accessibility.signLanguage.header' | translate }}</h1>
      <p>{{ 'accessibility.signLanguage.content' | translate }}</p>

      @for (video of videos; track video) {
        <div class="w-100 mb-3">
          <h2 class="my-4">{{ video.titleTranslateString | translate }}</h2>
          <app-video-player
            [title]="video.titleTranslateString | translate"
            [videoSrc]="video.videoSrc"
            [placeholderSrc]="video.placeholderSrc"
          ></app-video-player>
        </div>
      }

      <a
        class="back-link btn btn-secondary btn-with-image w-100 d-flex justify-content-between"
        href="#"
        (click)="location.back()"
      >
        <img aria-hidden="true" alt="" ngSrc="../../assets/back.svg" class="back-btn" width="width" height="height" />
        {{ 'accessibility.signLanguage.backToTheFuture' | translate }}
        <div class="hidden"></div>
      </a>
    </div>
  `,
  styleUrl: './sign-language.component.scss'
})
export class SignLanguageComponent implements OnInit {
  private readonly routeTitle = inject(RouteTitleService);

  protected readonly location = inject(Location);

  protected readonly videos = [
    {
      titleTranslateString: 'accessibility.signLanguage.videos.0.title',
      videoSrc: 'https://playout.3qsdn.com/embed/fabd482c-23c3-4c5a-aea8-7fe34bd25446',
      placeholderSrc: 'assets/placeholder/Erklaerung_zur_Barrierefreiheit.png'
    },
    {
      titleTranslateString: 'accessibility.signLanguage.videos.1.title',
      videoSrc: 'https://playout.3qsdn.com/embed/662c89fd-f762-4d69-99a2-d1856e603206',
      placeholderSrc: 'assets/placeholder/Inhalt_der_Website.png'
    },
    {
      titleTranslateString: 'accessibility.signLanguage.videos.2.title',
      videoSrc: 'https://playout.3qsdn.com/embed/1b51ac2e-7f2b-4c69-ab2f-7a945a78cf29',
      placeholderSrc: 'assets/placeholder/Navigation_auf_der_Website.png'
    }
  ];

  ngOnInit(): void {
    this.routeTitle.setTitle('accessibility.signLanguage.header');
  }
}
