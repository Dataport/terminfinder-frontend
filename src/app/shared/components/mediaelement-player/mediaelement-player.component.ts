import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {SanitizeUrlPipe} from "../../pipes/sanitize-url.pipe";
import {NullableUtils} from "../../utils";

declare var MediaElementPlayer: any;

@Component({
  selector: 'app-mediaelement-player',
  standalone: true,
  imports: [
    SanitizeUrlPipe
  ],
  template: `
    <div #wrapper class="video-player">
      @if (src) {
        <video
          #mediaElem
          [title]="title"
          [src]="src | sanitizeUrl"
          preload="auto"
        ></video>
      }
    </div>
  `,
  styleUrl: 'mediaelement-player.component.scss'
})

export class MediaelementPlayerComponent implements AfterViewInit, OnChanges, OnDestroy {
  private readonly QUERY_SELECTOR_VIDEO = '.mejs__video';
  private readonly QUERY_SELECTOR_OVERLAY_BUTTON = '.mejs__overlay-button';
  private readonly QUERY_SELECTOR_PLAYPAUSE_BUTTON = '.mejs__playpause-button';

  @Input() src: string;
  @Input() title: string;
  @ViewChild('wrapper') wrapper: ElementRef;
  @ViewChild('mediaElem') mediaElement: ElementRef;
  player: any;

  ngAfterViewInit() {
    this.player = new MediaElementPlayer(this.mediaElement.nativeElement, {
      // order is important - items will display in the control bar
      features: ['playpause', 'current', 'progress', 'duration', 'fullscreen'],
      iconSprite: 'assets/ext/mejs-controls.svg',
      stretching: 'responsive'
    });

    this.getInitialPlayButton().addEventListener('click', () => {
      this.moveFocusToControlPlayPauseButton();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.title.previousValue !== changes.title.currentValue
      && !NullableUtils.isStringNullOrWhitespace(changes.title.currentValue)) {
      let videoPlayerElem = this.wrapper.nativeElement.querySelector(this.QUERY_SELECTOR_VIDEO);
      videoPlayerElem.setAttribute('title', videoPlayerElem.getAttribute('aria-label'));
      videoPlayerElem.setAttribute('aria-label', this.title);

      this.getInitialPlayButton().setAttribute('aria-label', this.title);
    }
  }

  private getInitialPlayButton() {
    return this.wrapper.nativeElement.querySelector(this.QUERY_SELECTOR_OVERLAY_BUTTON);
  }

  // When clicking the initial play button, the focus moves to the whole video element
  // pressing the space-key then scrolls the entire view
  private moveFocusToControlPlayPauseButton() {
    if (this.wrapper.nativeElement) {
      let button = this.wrapper.nativeElement.querySelector(`${this.QUERY_SELECTOR_PLAYPAUSE_BUTTON} button`);
      window.setTimeout(() => {
        button.focus();
      });
    }
  }

  ngOnDestroy(): void {
    this.player.remove();
  }
}
