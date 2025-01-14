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
    <div class="video-player">
      @if (src) {
        <video
          #mediaElem
          [title]="title()"
          [src]="src() | sanitizeUrl"
          preload="auto"
        ></video>
      }
    </div>
  `,
  styleUrl: 'mediaelement-player.component.scss'
})

export class MediaelementPlayerComponent implements AfterViewInit, OnDestroy {
  src = input.required<string>();
  title = input<string>('');
  @ViewChild('mediaElem') mediaElement: ElementRef;
  player: any;

  ngAfterViewInit() {
    this.player = new MediaElementPlayer(this.mediaElement.nativeElement, {
      // order is important - items will display in the control bar
      features: ['playpause', 'current', 'progress', 'duration', 'fullscreen'],
      iconSprite: 'assets/ext/mejs-controls.svg',
      stretching: 'responsive',
    });
  }

  ngOnDestroy(): void {
    this.player.remove();
  }
}
