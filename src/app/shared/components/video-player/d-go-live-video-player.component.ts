import {Component, input} from '@angular/core';
import {SanitizeUrlPipe} from "../../pipes/sanitize-url.pipe";

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [
    SanitizeUrlPipe
  ],
  template: `
    <div id="iframe-box">
      @if (src()) {
        <iframe
          id="kaltura_player"
          [src]="src() | sanitizeUrl"
          width="608"
          height="402"
          allowfullscreen
          webkitallowfullscreen
          mozAllowFullScreen
          allow="autoplay *; fullscreen *; encrypted-media *"
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-downloads allow-forms allow-same-origin allow-scripts allow-top-navigation allow-pointer-lock allow-popups allow-modals allow-orientation-lock allow-popups-to-escape-sandbox allow-presentation allow-top-navigation-by-user-activation"
          [title]="title()">
        </iframe>
      } @else {
        <p>no video source provided</p>
      }
    </div>
  `,
  styles: `
    #kaltura_player {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    #iframe-box {
      position: relative;
      padding-bottom: 66.118421052632%;
    }
  `
})
export class DGoLiveVideoPlayerComponent {
  src = input.required<string>();
  title = input<string>('');
}
