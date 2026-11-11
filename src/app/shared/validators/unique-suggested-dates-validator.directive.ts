import { AbstractControl, UntypedFormArray, UntypedFormGroup, ValidatorFn } from '@angular/forms';
import { SuggestedDatesFormConstants } from '../../create-suggested-dates/suggested-dates-form-constants';

/**
 * Validates a single suggested date against the preceding ones in the parent array.
 * The error contains the 1-based number of the first identical suggested date.
 */
export function uniqueSuggestedDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const parent = control.parent as UntypedFormArray | null;
    if (!parent?.controls) {
      return null;
    }

    const ownIndex = parent.controls.indexOf(control);
    if (ownIndex < 1) {
      return null;
    }

    const ownKey = suggestedDateKey(control as UntypedFormGroup);
    const duplicateIndex = parent.controls
      .slice(0, ownIndex)
      .findIndex((other) => suggestedDateKey(other as UntypedFormGroup) === ownKey);

    return duplicateIndex >= 0 ? { duplicateSuggestedDate: { duplicateOf: duplicateIndex + 1 } } : null;
  };
}

export function suggestedDateKey(group: UntypedFormGroup): string {
  const raw = group.getRawValue();
  const hasEndDateOnDifferentDay =
    !!raw[SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_SHOW_SUGGESTED_START_DATE_ON_DIFFERENT_DAY_FORM];

  return JSON.stringify([
    normalize(raw[SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_START_DATE]),
    normalize(raw[SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_START_TIME]),
    hasEndDateOnDifferentDay ? normalize(raw[SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_END_DATE]) : '',
    normalize(
      raw[
        hasEndDateOnDifferentDay
          ? SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_END_DATE_END_TIME
          : SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_START_DATE_END_TIME
      ]
    ),
    normalize(raw[SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_DESCRIPTION])
  ]);
}

// Form controls hold null for empty fields, so non-strings become '' before trimming.
const normalize = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');
