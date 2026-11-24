import { Component, DestroyRef, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { SuggestedDateCopyMode } from '../../shared/models';
import { SUGGESTED_DATE_COPY_MODE_OPTIONS } from '../suggested-date-copy-mode-options';

@Component({
  selector: 'app-copy-modes-bar',
  templateUrl: './copy-modes-bar.component.html',
  styleUrls: ['./copy-modes-bar.component.scss'],
  imports: [
    NgClass,
    NgOptimizedImage,
    TranslatePipe
  ]
})
export class CopyModesBarComponent {
  readonly canCopy = input.required<(mode: SuggestedDateCopyMode) => boolean>();
  readonly copyMode = output<SuggestedDateCopyMode>();

  protected readonly copyModesExpanded = signal(false);
  protected readonly copyModesWide = signal(false);
  private readonly copyModesBar = viewChild<ElementRef<HTMLElement>>('copyModesBar');
  private readonly copyModesPanel = viewChild<ElementRef<HTMLElement>>('copyModesPanel');

  private copyModesTimer?: ReturnType<typeof setTimeout>;
  protected readonly SuggestedDateCopyMode = SuggestedDateCopyMode;
  protected readonly copyModeOptions = SUGGESTED_DATE_COPY_MODE_OPTIONS;
  private static readonly COLLAPSED_WIDTH_VAR = '--copy-modes-collapsed-width';

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.copyModesTimer));
  }

  protected toggleCopyModes(): void {
    const copyModesBar = this.copyModesBar()?.nativeElement;
    const copyModesPanel = this.copyModesPanel()?.nativeElement;

    if (!copyModesBar || !copyModesPanel) {
      return;
    }

    clearTimeout(this.copyModesTimer);

    if (!this.copyModesExpanded()) {
      this.openCopyModesBar(copyModesBar);
    } else {
      this.closeCopyModesBar(copyModesBar, copyModesPanel);
    }
  }

  // copyModesBar expand first, then the options open
  private openCopyModesBar(copyModesBar: HTMLElement) {
    if (!this.copyModesWide()) {
      copyModesBar.style.setProperty(
        CopyModesBarComponent.COLLAPSED_WIDTH_VAR,
        `${copyModesBar.getBoundingClientRect().width}px`
      );
      copyModesBar.getBoundingClientRect();
    }

    this.copyModesWide.set(true);

    this.copyModesTimer = setTimeout(
      () => this.copyModesExpanded.set(true),
      CopyModesBarComponent.getTransitionMs(copyModesBar)
    );
  }

  // options close first, then the copyModesBar shrinks to its content width
  private closeCopyModesBar(copyModesBar: HTMLElement, copyModesPanel: HTMLElement) {
    this.copyModesExpanded.set(false);

    this.copyModesTimer = setTimeout(() => {
      this.copyModesWide.set(false);

      this.copyModesTimer = setTimeout(
        () => copyModesBar.style.removeProperty(CopyModesBarComponent.COLLAPSED_WIDTH_VAR),
        CopyModesBarComponent.getTransitionMs(copyModesBar)
      );
    }, CopyModesBarComponent.getTransitionMs(copyModesPanel));
  }

  private static getTransitionMs(element: HTMLElement): number {
    return Math.max(
      ...getComputedStyle(element)
        .transitionDuration.split(',')
        .map((duration) => Number.parseFloat(duration) * (duration.includes('ms') ? 1 : 1000))
    );
  }
}
