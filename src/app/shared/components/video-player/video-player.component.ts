import {Component, input} from '@angular/core';
import {SanitizeUrlPipe} from "../../pipes/sanitize-url.pipe";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [
    SanitizeUrlPipe,
    NgOptimizedImage
  ],
  template: `
    <div>
      @if (!isLoaded) {
        <button class="btn" (click)="loadIframe()">
          <img [ngSrc]="placeholderSrc()" width="width" height="height" alt="" aria-hidden="true">
        </button>
      } @else {
        @if (videoSrc()) {
          <iframe
            [title]="title()"
            [src]="videoSrc() | sanitizeUrl"
            width="608"
            height="402"
            allowfullscreen
            webkitallowfullscreen
            mozAllowFullScreen
            allow="autoplay *; fullscreen *; encrypted-media *"
            referrerPolicy="no-referrer-when-downgrade"
            sandbox="allow-downloads allow-forms allow-same-origin allow-scripts allow-top-navigation allow-pointer-lock allow-popups allow-modals allow-orientation-lock allow-popups-to-escape-sandbox allow-presentation allow-top-navigation-by-user-activation">
          </iframe>
        } @else {
          <p>no video source provided</p>
        }
      }
    </div>
  `,
  styles: `
    button {
      width: 100%;
      border: 0;
      padding: 0;
    }

    img {
      width: inherit;
      /* mimic video player appearance */
      padding: 5% 0;
      background-color: black;
      border-radius: .5em;
    }

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    div:has(iframe) {
      position: relative;
      padding-bottom: 66.118421052632%;
    }
  `
})
export class VideoPlayerComponent {
  readonly videoSrc = input.required<string>();
  readonly placeholderSrc = input.required<string>();
  title = input<string>('');
  isLoaded = false;

  loadIframe() {
    this.isLoaded = true;
  }
}
