import {AfterViewInit, Component, ElementRef, input, OnDestroy, ViewChild} from '@angular/core';
import {SanitizeUrlPipe} from "../../pipes/sanitize-url.pipe";

declare var MediaElementPlayer: any;

@Component({
  selector: 'app-mediaelement-player',
  standalone: true,
  imports: [
    SanitizeUrlPipe
  ],
  template: `
    <div id="player">
      @if (src) {
        <video
          #player
          width="608"
          height="402"
          [title]="title()"
          [src]="src() | sanitizeUrl"
        ></video>
      }
    </div>
  `,
  styles: `
    video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    #player {
      position: relative;
      padding-bottom: 66.118421052632%;
    }`
})

export class MediaelementPlayerComponent implements AfterViewInit, OnDestroy {
  src = input.required<string>();
  title = input<string>('');
  @ViewChild('player') mediaElement: ElementRef;
  player: any;

  ngAfterViewInit() {
    this.player = new MediaElementPlayer(this.mediaElement.nativeElement, {
      iconSprite: 'assets/ext/mejs-controls.svg',
      // order is important - items will display in the control bar
      features: ['playpause', 'current', 'progress', 'duration', 'volume', 'fullscreen']
    });
  }

  ngOnDestroy(): void {
    this.player.remove();
  }
}
