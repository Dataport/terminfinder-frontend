import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { uniqueSuggestedDateValidator } from './unique-suggested-dates-validator.directive';
import { SuggestedDatesFormConstants as C } from '../../create-suggested-dates/suggested-dates-form-constants';

function group(
  overrides: Partial<{ start: string; startTime: string; end: string; endTime: string; desc: string }> = {}
): UntypedFormGroup {
  return new UntypedFormGroup(
    {
      [C.FORM_KEY_SUGGESTED_DATE_START_DATE]: new UntypedFormControl(overrides.start ?? '01.01.2030'),
      [C.FORM_KEY_SUGGESTED_DATE_START_TIME]: new UntypedFormControl(overrides.startTime ?? '12:00'),
      [C.FORM_KEY_SUGGESTED_DATE_END_DATE]: new UntypedFormControl(overrides.end ?? null),
      [C.FORM_KEY_SUGGESTED_DATE_START_DATE_END_TIME]: new UntypedFormControl(overrides.endTime ?? '13:00'),
      [C.FORM_KEY_SUGGESTED_DATE_END_DATE_END_TIME]: new UntypedFormControl(null),
      [C.FORM_KEY_SUGGESTED_DATE_SHOW_SUGGESTED_START_DATE_ON_DIFFERENT_DAY_FORM]: new UntypedFormControl(false),
      [C.FORM_KEY_SUGGESTED_DATE_DESCRIPTION]: new UntypedFormControl(overrides.desc ?? null)
    },
    [uniqueSuggestedDateValidator()]
  );
}

describe('uniqueSuggestedDateValidator', () => {
  const errorsOf = (groups: UntypedFormGroup[]) => {
    new UntypedFormArray(groups); // sets the parent of each group
    return groups.map((g) => g.validator(g));
  };

  it('accepts a single date', () => {
    expect(errorsOf([group()])).toEqual([null]);
  });

  it('reports the number of the identical earlier date on the later one', () => {
    expect(
      errorsOf([
        group(),
        group({ startTime: '14:00' }),
        group()
      ])
    ).toEqual([
      null,
      null,
      { duplicateSuggestedDate: { duplicateOf: 1 } }
    ]);
  });

  it('treats null and blank description as equal', () => {
    expect(
      errorsOf([
        group({ desc: '  ' }),
        group()
      ])[1]
    ).not.toBeNull();
  });

  it('accepts dates differing only in description', () => {
    expect(
      errorsOf([
        group({ desc: 'A' }),
        group({ desc: 'B' })
      ])
    ).toEqual([
      null,
      null
    ]);
  });

  it('accepts dates differing in time or date', () => {
    expect(
      errorsOf([
        group(),
        group({ startTime: '14:00' })
      ])[1]
    ).toBeNull();
    expect(
      errorsOf([
        group(),
        group({ start: '02.01.2030' })
      ])[1]
    ).toBeNull();
  });
});
