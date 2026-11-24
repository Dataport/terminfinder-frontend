import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { CopyModesBarComponent } from './copy-modes-bar.component';
import { SuggestedDateCopyMode } from '../../shared/models';

describe('CopyModesBarComponent', () => {
  let fixture: ComponentFixture<CopyModesBarComponent>;
  let emitted: SuggestedDateCopyMode[];

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTranslateService()] });
    fixture = TestBed.createComponent(CopyModesBarComponent);
    emitted = [];
    fixture.componentRef.setInput('canCopy', () => true);
    fixture.componentInstance.copyMode.subscribe((mode) => emitted.push(mode));
    fixture.detectChanges();
  });

  it('emits the mode of the clicked option', () => {
    const button: HTMLElement = fixture.nativeElement.querySelector(
      `[data-cy="copySuggestedDateButton-${SuggestedDateCopyMode.NEXT_DAY}"]`
    );
    button.click();
    expect(emitted).toEqual([SuggestedDateCopyMode.NEXT_DAY]);
  });

  it('marks options as aria-disabled when copying is not possible', () => {
    fixture.componentRef.setInput(
      'canCopy',
      (mode: SuggestedDateCopyMode) => mode !== SuggestedDateCopyMode.SHIFT_TIME
    );
    fixture.detectChanges();
    const button: HTMLElement = fixture.nativeElement.querySelector(
      `[data-cy="copySuggestedDateButton-${SuggestedDateCopyMode.SHIFT_TIME}"]`
    );
    expect(button.getAttribute('aria-disabled')).toBe('true');
  });

  it('expands after toggling and clears its timer on destroy', () => {
    jest.useFakeTimers();
    try {
      const toggle: HTMLElement = fixture.nativeElement.querySelector('[data-cy="copyModesToggle"]');
      toggle.click();
      jest.advanceTimersByTime(1000);
      fixture.detectChanges();
      expect(toggle.getAttribute('aria-expanded')).toBe('true');
      expect(() => fixture.destroy()).not.toThrow();
    } finally {
      jest.useRealTimers();
    }
  });
});
