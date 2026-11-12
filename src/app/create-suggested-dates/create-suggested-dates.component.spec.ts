import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import moment from 'moment';
import { AppStateService } from '../shared/services/app-state/app-state.service';
import { RouteTitleService } from '../shared/services/route-title.service';
import { Logger } from '../shared/services/logging';
import { DateTimeGeneratorService } from '../shared/services/generators';
import { CreateSuggestedDatesComponent } from './create-suggested-dates.component';
import { SuggestedDatesFormConstants as Keys } from './suggested-dates-form-constants';
import { SuggestedDateCopyMode } from '../shared/models';

describe('CreateSuggestedDatesComponent copy modes', () => {
  const startDate = moment().add(10, 'days');
  const startDateText = startDate.format('YYYY-MM-DD');
  const nextDayText = startDate.clone().add(1, 'day').format('YYYY-MM-DD');
  const endDate = startDate.clone().add(2, 'days');
  const endDateText = endDate.format('YYYY-MM-DD');
  const nextDayEndDateText = endDate.clone().add(1, 'day').format('YYYY-MM-DD');

  let component: CreateSuggestedDatesComponent;

  const setLast = (values: Record<string, unknown>): void => {
    const array = component.getSuggestedDatesFromForm();
    const last = component.getSuggestedDatesForm(array.length - 1);
    last.patchValue(values);
    last.markAsDirty();
  };

  const lastValue = (): Record<string, unknown> => {
    const array = component.getSuggestedDatesFromForm();
    return component.getSuggestedDatesForm(array.length - 1).getRawValue();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LOCALE_ID, useValue: 'de-DE' },
        DateTimeGeneratorService,
        { provide: Logger, useValue: { debug: () => undefined } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: RouteTitleService, useValue: { setTitle: () => undefined } },
        { provide: AppStateService, useValue: { getAppointment: () => ({ adminId: null, suggestedDates: [] }) } }
      ]
    });
    component = TestBed.runInInjectionContext(() => new CreateSuggestedDatesComponent());
    component.ngOnInit();
  });

  it('copies everything except the description', () => {
    setLast({
      [Keys.FORM_KEY_SUGGESTED_DATE_START_DATE]: startDateText,
      [Keys.FORM_KEY_SUGGESTED_DATE_START_TIME]: '12:00',
      [Keys.FORM_KEY_SUGGESTED_DATE_START_DATE_END_TIME]: '13:00',
      [Keys.FORM_KEY_SUGGESTED_DATE_DESCRIPTION]: 'text'
    });
    component.copyLastSuggestedDate(SuggestedDateCopyMode.ALL);

    const copy = lastValue();
    expect(component.getSuggestedDatesFromForm().length).toBe(2);
    expect(copy[Keys.FORM_KEY_SUGGESTED_DATE_START_DATE]).toBe(startDateText);
    expect(copy[Keys.FORM_KEY_SUGGESTED_DATE_START_TIME]).toBe('12:00');
    expect(copy[Keys.FORM_KEY_SUGGESTED_DATE_START_DATE_END_TIME]).toBe('13:00');
    expect(copy[Keys.FORM_KEY_SUGGESTED_DATE_DESCRIPTION]).toBeNull();
  });

  it('copies only the date', () => {
    setLast({
      [Keys.FORM_KEY_SUGGESTED_DATE_START_DATE]: startDateText,
      [Keys.FORM_KEY_SUGGESTED_DATE_START_TIME]: '12:00',
      [Keys.FORM_KEY_SUGGESTED_DATE_START_DATE_END_TIME]: '13:00'
    });
    component.copyLastSuggestedDate(SuggestedDateCopyMode.DATE_ONLY);

    const copy = lastValue();
    expect(copy[Keys.FORM_KEY_SUGGESTED_DATE_START_DATE]).toBe(startDateText);
    expect(copy[Keys.FORM_KEY_SUGGESTED_DATE_START_TIME]).toBeNull();
    expect(copy[Keys.FORM_KEY_SUGGESTED_DATE_START_DATE_END_TIME]).toBeNull();
  });

  it('shifts the time range by its duration', () => {
    setLast({
      [Keys.FORM_KEY_SUGGESTED_DATE_START_DATE]: startDateText,
      [Keys.FORM_KEY_SUGGESTED_DATE_START_TIME]: '12:00',
      [Keys.FORM_KEY_SUGGESTED_DATE_START_DATE_END_TIME]: '13:30'
    });
    component.copyLastSuggestedDate(SuggestedDateCopyMode.SHIFT_TIME);

    const copy = lastValue();
    expect(copy[Keys.FORM_KEY_SUGGESTED_DATE_START_DATE]).toBe(startDateText);
    expect(copy[Keys.FORM_KEY_SUGGESTED_DATE_START_TIME]).toBe('13:30');
    expect(copy[Keys.FORM_KEY_SUGGESTED_DATE_START_DATE_END_TIME]).toBe('15:00');
  });

  it('disables shifting without a time range, with an end on another day, or past midnight', () => {
    setLast({ [Keys.FORM_KEY_SUGGESTED_DATE_START_DATE]: startDateText });
    expect(component.canCopyLastSuggestedDate(SuggestedDateCopyMode.SHIFT_TIME)).toBe(false);

    setLast({
      [Keys.FORM_KEY_SUGGESTED_DATE_START_TIME]: '22:00',
      [Keys.FORM_KEY_SUGGESTED_DATE_START_DATE_END_TIME]: '23:00'
    });
    expect(component.canCopyLastSuggestedDate(SuggestedDateCopyMode.SHIFT_TIME)).toBe(false);

    setLast({
      [Keys.FORM_KEY_SUGGESTED_DATE_START_TIME]: '10:00',
      [Keys.FORM_KEY_SUGGESTED_DATE_START_DATE_END_TIME]: '11:00'
    });
    expect(component.canCopyLastSuggestedDate(SuggestedDateCopyMode.SHIFT_TIME)).toBe(true);

    setLast({
      [Keys.FORM_KEY_SUGGESTED_DATE_SHOW_SUGGESTED_START_DATE_ON_DIFFERENT_DAY_FORM]: true
    });
    expect(component.canCopyLastSuggestedDate(SuggestedDateCopyMode.SHIFT_TIME)).toBe(false);
  });

  it('copies to the next day with the same time and moves the end date', () => {
    setLast({
      [Keys.FORM_KEY_SUGGESTED_DATE_START_DATE]: startDateText,
      [Keys.FORM_KEY_SUGGESTED_DATE_START_TIME]: '12:00',
      [Keys.FORM_KEY_SUGGESTED_DATE_SHOW_SUGGESTED_START_DATE_ON_DIFFERENT_DAY_FORM]: true,
      [Keys.FORM_KEY_SUGGESTED_DATE_END_DATE]: endDateText,
      [Keys.FORM_KEY_SUGGESTED_DATE_END_DATE_END_TIME]: '14:00'
    });
    component.copyLastSuggestedDate(SuggestedDateCopyMode.NEXT_DAY);

    const copy = lastValue();
    expect(copy[Keys.FORM_KEY_SUGGESTED_DATE_START_DATE]).toBe(nextDayText);
    expect(copy[Keys.FORM_KEY_SUGGESTED_DATE_START_TIME]).toBe('12:00');
    expect(copy[Keys.FORM_KEY_SUGGESTED_DATE_END_DATE]).toBe(nextDayEndDateText);
    expect(copy[Keys.FORM_KEY_SUGGESTED_DATE_END_DATE_END_TIME]).toBe('14:00');
  });

  it('keeps copying from an unedited copy while it is valid', () => {
    setLast({
      [Keys.FORM_KEY_SUGGESTED_DATE_START_DATE]: startDateText,
      [Keys.FORM_KEY_SUGGESTED_DATE_START_TIME]: '12:00',
      [Keys.FORM_KEY_SUGGESTED_DATE_START_DATE_END_TIME]: '13:00'
    });
    component.copyLastSuggestedDate(SuggestedDateCopyMode.SHIFT_TIME);
    expect(component.canCopyLastSuggestedDate(SuggestedDateCopyMode.NEXT_DAY)).toBe(true);

    component.copyLastSuggestedDate(SuggestedDateCopyMode.NEXT_DAY);
    expect(component.getSuggestedDatesFromForm().length).toBe(3);
    expect(lastValue()[Keys.FORM_KEY_SUGGESTED_DATE_START_DATE]).toBe(nextDayText);
  });

  it('does not copy an ALL copy, which is a duplicate of its source', () => {
    setLast({
      [Keys.FORM_KEY_SUGGESTED_DATE_START_DATE]: startDateText,
      [Keys.FORM_KEY_SUGGESTED_DATE_START_TIME]: '12:00',
      [Keys.FORM_KEY_SUGGESTED_DATE_START_DATE_END_TIME]: '13:00'
    });
    component.copyLastSuggestedDate(SuggestedDateCopyMode.ALL);
    expect(component.canCopyLastSuggestedDate(SuggestedDateCopyMode.DATE_ONLY)).toBe(false);
  });

  it('does not copy while the last entry is untouched', () => {
    component.copyLastSuggestedDate(SuggestedDateCopyMode.ALL);
    expect(component.getSuggestedDatesFromForm().length).toBe(1);
  });
});
