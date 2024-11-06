import {Component, inject} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {Location, NgOptimizedImage} from "@angular/common";
import {DGoLiveVideoPlayerComponent} from "../shared/components/video-player/d-go-live-video-player.component";

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
        <img ngSrc="../../assets/back.svg" class="back-btn" aria-hidden="true" width="width" height="height"
             alt="chevron-left">
        {{ 'accessibility.signLanguage.backToTheFuture' | translate }}
        <div class="hidden"></div>
      </a>
    </div>
  `,
  styleUrl: './sign-language.component.scss'
})
export class SignLanguageComponent {
  protected readonly location = inject(Location);

  protected readonly videos = [{
    titleTranslateString: 'accessibility.signLanguage.videos.0.title',
    src: 'https://api.dgolive.de/p/105/sp/10500/embedIframeJs/uiconf_id/23448380/partner_id/105?iframeembed=true&playerId=kaltura_player&entry_id=0_tig10w13&flashvars[streamerType]=auto&amp;flashvars[localizationCode]=de&amp;flashvars[leadWithHTML5]=true&amp;flashvars[sideBarContainer.plugin]=true&amp;flashvars[sideBarContainer.position]=left&amp;flashvars[sideBarContainer.clickToClose]=true&amp;flashvars[chapters.plugin]=true&amp;flashvars[chapters.layout]=vertical&amp;flashvars[chapters.thumbnailRotator]=false&amp;flashvars[streamSelector.plugin]=true&amp;flashvars[EmbedPlayer.SpinnerTarget]=videoHolder&amp;flashvars[dualScreen.plugin]=true&amp;flashvars[hotspots.plugin]=1&amp;flashvars[Kaltura.addCrossoriginToIframe]=true&amp;&wid=0_yv17cw2w'
  }, {
    titleTranslateString: 'accessibility.signLanguage.videos.1.title',
    src: 'https://api.dgolive.de/p/105/sp/10500/embedIframeJs/uiconf_id/23448380/partner_id/105?iframeembed=true&playerId=kaltura_player&entry_id=0_ovo5c099&flashvars[streamerType]=auto&amp;flashvars[localizationCode]=de&amp;flashvars[leadWithHTML5]=true&amp;flashvars[sideBarContainer.plugin]=true&amp;flashvars[sideBarContainer.position]=left&amp;flashvars[sideBarContainer.clickToClose]=true&amp;flashvars[chapters.plugin]=true&amp;flashvars[chapters.layout]=vertical&amp;flashvars[chapters.thumbnailRotator]=false&amp;flashvars[streamSelector.plugin]=true&amp;flashvars[EmbedPlayer.SpinnerTarget]=videoHolder&amp;flashvars[dualScreen.plugin]=true&amp;flashvars[hotspots.plugin]=1&amp;flashvars[Kaltura.addCrossoriginToIframe]=true&amp;&wid=0_1wh4zre6'
  }, {
    titleTranslateString: 'accessibility.signLanguage.videos.2.title',
    src: 'https://api.dgolive.de/p/105/sp/10500/embedIframeJs/uiconf_id/23448380/partner_id/105?iframeembed=true&playerId=kaltura_player&entry_id=0_yaxniffj&flashvars[streamerType]=auto&amp;flashvars[localizationCode]=de&amp;flashvars[leadWithHTML5]=true&amp;flashvars[sideBarContainer.plugin]=true&amp;flashvars[sideBarContainer.position]=left&amp;flashvars[sideBarContainer.clickToClose]=true&amp;flashvars[chapters.plugin]=true&amp;flashvars[chapters.layout]=vertical&amp;flashvars[chapters.thumbnailRotator]=false&amp;flashvars[streamSelector.plugin]=true&amp;flashvars[EmbedPlayer.SpinnerTarget]=videoHolder&amp;flashvars[dualScreen.plugin]=true&amp;flashvars[hotspots.plugin]=1&amp;flashvars[Kaltura.addCrossoriginToIframe]=true&amp;&wid=0_3by1ymtn'
  }];
}
