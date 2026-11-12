import { SuggestedDateCopyMode } from '../shared/models';

export interface SuggestedDateCopyModeOption {
  mode: SuggestedDateCopyMode;
  labelKey: string;
  icon: string;
}

export const SUGGESTED_DATE_COPY_MODE_OPTIONS: SuggestedDateCopyModeOption[] = [
  { mode: SuggestedDateCopyMode.ALL, labelKey: 'date.copy.all', icon: 'assets/copy-suggested-date.svg' },
  {
    mode: SuggestedDateCopyMode.DATE_ONLY,
    labelKey: 'date.copy.dateOnly',
    icon: 'assets/copy-suggested-date-date-only.svg'
  },
  {
    mode: SuggestedDateCopyMode.SHIFT_TIME,
    labelKey: 'date.copy.shiftTime',
    icon: 'assets/copy-suggested-date-shift-time.svg'
  },
  {
    mode: SuggestedDateCopyMode.NEXT_DAY,
    labelKey: 'date.copy.nextDay',
    icon: 'assets/copy-suggested-date-next-day.svg'
  }
];
