import {Component, Inject, Input, LOCALE_ID, OnInit} from '@angular/core';
import {DataRepositoryService} from '../shared/services/data-service';
import {AppStateService} from '../shared/services/app-state/app-state.service';
import {AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {Logger} from '../shared/services/logging';
import {Router} from '@angular/router';
import {dateValidator} from '../shared/validators/date-validator.directive';
import {timeValidator} from '../shared/validators/time-validator.directive';
import {dateInFutureOrTodayValidator} from '../shared/validators/date-today-or-in-future-validator.directive';
import {minLengthArrayValidator} from '../shared/validators/min-length-array-validator.directive';
import {maxLengthArrayValidator} from '../shared/validators/max-length-array-validator.directive';
import {DateTimeGeneratorService} from '../shared/services/generators';
import {ValidatorConstants} from '../shared/constants/validatorConstants';
import {suggestedDateValidator} from '../shared/validators/suggested-date-validator.directive';
import {SuggestedDatesFormConstants} from './suggested-dates-form-constants';
import {Appointment, SuggestedDate} from '../shared/models';
import {ValidatorUtils} from '../shared/validators/validator-utils';
import * as moment from 'moment';
import {MomentUtils} from '../shared/utils';
import {ApiConstants} from '../shared/constants/apiConstants';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

import * as MobileDetect from 'mobile-detect';
import {NullableUtils} from "../shared/utils";

@Component({
  selector: 'app-create-suggested-dates',
  templateUrl: './create-suggested-dates.component.html',
  styleUrls: ['./create-suggested-dates.component.scss']
})
export class CreateSuggestedDatesComponent implements OnInit {
  public static readonly MIN_NUMBER_SUGGESTED_DATES = ValidatorConstants.MIN_NUMBER_SUGGESTED_DATES;
  public static readonly MAX_NUMBER_SUGGESTED_DATES = ValidatorConstants.MAX_NUMBER_SUGGESTED_DATES;

  public static readonly FORM_KEY_SUGGESTED_DATE_ID = SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_ID;
  public static readonly FORM_KEY_SUGGESTED_DATES = SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATES;
  public static readonly FORM_KEY_SUGGESTED_DATE_START_DATE = SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_START_DATE;
  public static readonly FORM_KEY_SUGGESTED_DATE_START_TIME = SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_START_TIME;
  public static readonly FORM_KEY_SUGGESTED_DATE_SHOW_START_TIME = SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_SHOW_START_TIME;
  public static readonly FORM_KEY_SUGGESTED_DATE_END_DATE = SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_END_DATE;
  public static readonly FORM_KEY_SUGGESTED_DATE_START_DATE_END_TIME =
    SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_START_DATE_END_TIME;
  public static readonly FORM_KEY_SUGGESTED_DATE_SHOW_START_DATE_END_TIME =
    SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_SHOW_START_DATE_END_TIME;
  public static readonly FORM_KEY_SUGGESTED_DATE_END_DATE_END_TIME = SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_END_DATE_END_TIME;
  public static readonly FORM_KEY_SUGGESTED_DATE_SHOW_END_DATE_END_TIME =
    SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_SHOW_END_DATE_END_TIME;
  public static readonly FORM_KEY_SUGGESTED_DATE_SHOW_SUGGESTED_START_DATE_ON_DIFFERENT_DAY_FORM =
    SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_SHOW_SUGGESTED_START_DATE_ON_DIFFERENT_DAY_FORM;
  public static readonly FORM_KEY_SUGGESTED_DATE_DESCRIPTION = SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_DESCRIPTION;

  @Input() isAdmin = false;
  mobiledetect = new MobileDetect(window.navigator.userAgent);
  @Input() isMobileDevice = this.mobiledetect.mobile();

  model: SuggestedDate[];
  suggestedDatesToDelete: SuggestedDate[];
  adminId: string;
  datesForm: UntypedFormGroup = new UntypedFormGroup({
      [CreateSuggestedDatesComponent.FORM_KEY_SUGGESTED_DATES]: new UntypedFormArray([],
        [
          minLengthArrayValidator(CreateSuggestedDatesComponent.MIN_NUMBER_SUGGESTED_DATES),
          maxLengthArrayValidator(CreateSuggestedDatesComponent.MAX_NUMBER_SUGGESTED_DATES)
        ])
    }
  );
  now: moment.Moment = new DateTimeGeneratorService().now();

  constructor(private dataRepoService: DataRepositoryService,
              private appStateService: AppStateService,
              @Inject(LOCALE_ID) private localeId: string,
              private router: Router,
              private logger: Logger,
              private dateTimeGenerator: DateTimeGeneratorService) {
    moment.locale(this.localeId);
  }

  private static formatDate(value: moment.Moment): string | null {
    if (NullableUtils.isObjectNullOrUndefined(value)) {
      return null;
    }
    return value.format(ApiConstants.MOMENT_FORMAT_DATE_TIME);
  }

  private static formatDateTime(value: moment.Moment): string | null {
    if (NullableUtils.isObjectNullOrUndefined(value)) {
      return null;
    }
    return value.format(ApiConstants.MOMENT_FORMAT_DATE_TIME);
  }

  ngOnInit(): void {
    this.suggestedDatesToDelete = [];

    const appointmentModel: Appointment = this.appStateService.getAppointment();
    this.adminId = appointmentModel.adminId;
    this.model = NullableUtils.isObjectNullOrUndefined(appointmentModel) || NullableUtils.isArrayNullOrEmpty(appointmentModel.suggestedDates)
      ? [] : appointmentModel.suggestedDates;
    if (NullableUtils.isArrayNullOrEmpty(this.model)) {
      this.addSuggestedDate();
    } else {
      for (let i = 0, len = this.model.length; i < len; ++i) {
        this.addExistingSuggestedDate(this.model[i]);
      }
    }
  }

  public goBack(): void {
    // noinspection JSIgnoredPromiseFromCall
    if (!this.isAdmin) {
      this.router.navigate(['/create']).then();
    } else {
      this.router.navigate(['/poll-admin']).then();
    }
  }

  public parseAndSetDate(key: string, value: string, index: number): void {
    if (key && value && index >= 0 && index < this.getSuggestedDatesFromForm().length) {
      this.getSuggestedDatesForm(index).get(key).patchValue(
        ValidatorUtils.parseNgbDateStructFromMoment(ValidatorUtils.parseMomentFromIsoString(value, this.localeId), this.localeId));
    }
  }

  public getDateAsIsoString(key: string, index: number): string | null {
    const date: NgbDateStruct = this.getSuggestedDatesForm(index).get(key).value;
    if (date) {
      return `${ValidatorUtils.pad(date.year, 4)}-${ValidatorUtils.pad(date.month, 2)}-${ValidatorUtils.pad(date.day, 2)}`;
    }
    return null;
  }

  public parseAndSetTime(key: string, value: string, index: number): void {
    if (key && value && index >= 0 && index < this.getSuggestedDatesFromForm().length) {
      this.getSuggestedDatesForm(index).get(key).patchValue(value);
    }
  }

  public getTimeAsString(key: string, index: number): string | null {
    return this.getSuggestedDatesForm(index).get(key).value;
  }

  public getSuggestedDatesFromForm(): UntypedFormArray {
    return this.datesForm.get(CreateSuggestedDatesComponent.FORM_KEY_SUGGESTED_DATES) as UntypedFormArray;
  }

  public castToFormGroup(abstractControl: AbstractControl): UntypedFormGroup {
    return abstractControl as UntypedFormGroup;
  }

  public getSuggestedDatesForm(index: number): UntypedFormGroup {
    return this.getSuggestedDatesFromForm().at(index) as UntypedFormGroup;
  }

  public getSuggestedDateIdOfSuggestedDateByIndex(index: number): AbstractControl {
    return this.getSuggestedDatesForm(index)
      .get(CreateSuggestedDatesComponent.FORM_KEY_SUGGESTED_DATE_ID) as AbstractControl;
  }

  public getStartDateOfSuggestedStartDateByIndex(index: number): AbstractControl {
    return this.getSuggestedDatesForm(index)
      .get(CreateSuggestedDatesComponent.FORM_KEY_SUGGESTED_DATE_START_DATE) as AbstractControl;
  }

  public getEndDateOfSuggestedStartDateByIndex(index: number): AbstractControl {
    return this.getSuggestedDatesForm(index)
      .get(CreateSuggestedDatesComponent.FORM_KEY_SUGGESTED_DATE_END_DATE) as AbstractControl;
  }

  public getStartTimeOfSuggestedStartDateByIndex(index: number): AbstractControl {
    return this.getSuggestedDatesForm(index)
      .get(CreateSuggestedDatesComponent.FORM_KEY_SUGGESTED_DATE_START_TIME) as AbstractControl;
  }

  public getEndTimeOfSuggestedStartDateByIndex(index: number): AbstractControl {
    return this.getSuggestedDatesForm(index)
      .get(CreateSuggestedDatesComponent.FORM_KEY_SUGGESTED_DATE_START_DATE_END_TIME) as AbstractControl;
  }

  public getEndTimeOfSuggestedEndDateByIndex(index: number): AbstractControl {
    return this.getSuggestedDatesForm(index)
      .get(CreateSuggestedDatesComponent.FORM_KEY_SUGGESTED_DATE_END_DATE_END_TIME) as AbstractControl;
  }

  public getShowSuggestedDateEndDateOnDifferentDayForm(index: number): AbstractControl {
    return this.getSuggestedDatesForm(index)
      .get(CreateSuggestedDatesComponent.FORM_KEY_SUGGESTED_DATE_SHOW_SUGGESTED_START_DATE_ON_DIFFERENT_DAY_FORM) as AbstractControl;
  }

  public getShowSuggestedDateEndDateOnDifferentDayFormValue(index: number): boolean {
    return this.getShowSuggestedDateEndDateOnDifferentDayForm(index).value as boolean;
  }

  public getDescriptionByIndex(index: number): AbstractControl {
    return this.getSuggestedDatesForm(index)
      .get(CreateSuggestedDatesComponent.FORM_KEY_SUGGESTED_DATE_DESCRIPTION) as AbstractControl;
  }

  public getShowStartDateStartTimeControl(index: number): AbstractControl {
    return this.getSuggestedDatesForm(index)
      .get(CreateSuggestedDatesComponent.FORM_KEY_SUGGESTED_DATE_SHOW_START_TIME) as AbstractControl;
  }

  public getShowStartDateStartTimeControlValue(index: number): boolean {
    return this.getShowStartDateStartTimeControl(index).value as boolean;
  }

  public setShowStartDateStartTimeControlValue(index: number, value: boolean): void {
    this.getShowStartDateStartTimeControl(index).setValue(value);
  }

  public setShowStartTimesControlValue(index: number, value: boolean): void {
    this.getShowStartDateStartTimeControl(index).setValue(value);
    this.getShowStartDateEndTimeControl(index).setValue(value);
  }

  public getShowStartDateEndTimeControl(index: number): AbstractControl {
    return this.getSuggestedDatesForm(index)
      .get(CreateSuggestedDatesComponent.FORM_KEY_SUGGESTED_DATE_SHOW_START_DATE_END_TIME) as AbstractControl;
  }

  public getShowStartDateEndTimeControlValue(index: number): boolean {
    return this.getShowStartDateEndTimeControl(index).value as boolean;
  }

  public setShowStartDateEndTimeControlValue(index: number, value: boolean): void {
    this.getShowStartDateEndTimeControl(index).setValue(value);
  }

  public getShowEndDateEndTimeControl(index: number): AbstractControl {
    return this.getSuggestedDatesFromForm().at(index)
      .get(CreateSuggestedDatesComponent.FORM_KEY_SUGGESTED_DATE_SHOW_END_DATE_END_TIME) as AbstractControl;
  }

  public getShowEndDateEndTimeControlValue(index: number): boolean {
    return this.getShowEndDateEndTimeControl(index).value as boolean;
  }

  public setShowEndDateEndTimeControlValue(index: number, value: boolean) {
    this.getShowEndDateEndTimeControl(index).setValue(value);
  }

  public closeAllControlsExcept(index: number): void {
    for (let i = 0; i < this.getSuggestedDatesFromForm().length; i++) {
      if (i !== index) {
        this.setShowStartDateStartTimeControlValue(i, false);
        this.setShowStartDateEndTimeControlValue(i, false);
        this.setShowEndDateEndTimeControlValue(i, false);
      }
    }
  }

  public getSuggestedDateIdControlValue(index: number): string {
    return this.getSuggestedDateIdOfSuggestedDateByIndex(index).value as string;
  }

  public getSuggestedDateStartDateControlValue(index: number): string {
    try {
      return ValidatorUtils.serializeDateFromNgbDateStruct(this.getStartDateOfSuggestedStartDateByIndex(index).value, this.localeId);
    } catch (e) {
      return '';
    }
  }

  public getSuggestedStartTimeControlValue(index: number): string {
    return this.getStartTimeOfSuggestedStartDateByIndex(index).value as string;
  }

  public getSuggestedDateEndDateControlValue(index: number): string {
    try {
      return ValidatorUtils.serializeDateFromNgbDateStruct(this.getEndDateOfSuggestedStartDateByIndex(index).value, this.localeId);
    } catch (e) {
      return '';
    }
  }

  public addSuggestedDate(): void {
    this.getSuggestedDatesFromForm().push(this.createSuggestedDateForm());
  }

  public onSubmit(): void {
    const model: Appointment = this.appStateService.getAppointment();
    this.logger.debug(
      `Formular hat die folgenden Werte : ${JSON.stringify(this.getSuggestedDatesFromForm().value)}`,
      this.getSuggestedDatesFromForm().value);
    const suggestedDates = this.createSuggestedDatesFromForm();
    this.logger.debug(`Ermittelten Terminoptionen sind: ${JSON.stringify(suggestedDates)}`, suggestedDates);
    model.suggestedDates = suggestedDates.sort((a, b) =>
      (a.startDate > b.startDate) ? 1 : ((a.startDate === b.startDate) && (a.startTime > b.startTime)) ? 1 : -1);
    model.suggestedDatesToDelete = this.suggestedDatesToDelete;
    this.appStateService.updateAppointment(model);
    // noinspection JSIgnoredPromiseFromCall
    if (this.isAdmin) {
      this.router.navigate(['/admin/settings']).then();
    } else {
      this.router.navigate(['/settings']).then();
    }
  }

  public showSuggestedDateEndDateOnDifferentDayForm(index: number): void {
    this.getShowSuggestedDateEndDateOnDifferentDayForm(index).setValue(true);
    this.getShowEndDateEndTimeControl(index).setValue(this.getShowStartDateEndTimeControlValue(index));
    this.getShowStartDateEndTimeControl(index).setValue(false);
    this.getEndTimeOfSuggestedStartDateByIndex(index).setValue(null);
  }

  public deleteSuggestedDateFormByIndex(index: number): void {
    const itemToDelete: SuggestedDate = this.createSuggestedDate(index);
    if (itemToDelete.suggestedDateId !== null && itemToDelete.suggestedDateId !== undefined
      && itemToDelete.suggestedDateId !== '' && itemToDelete.suggestedDateId.length > 0) {
      this.suggestedDatesToDelete.push(itemToDelete);
    }
    this.getSuggestedDatesFromForm().removeAt(index);
  }

  public isSuggestedDateFromDatabase(index: number): boolean {
    return this.getSuggestedDateIdControlValue(index) !== null;
  }

  private addExistingSuggestedDate(suggestedDate: SuggestedDate): void {
    this.getSuggestedDatesFromForm().push(this.createSuggestedDateForm(suggestedDate));
  }

  private createSuggestedDateForm(suggestedDate: SuggestedDate = null): UntypedFormGroup {
    const suggestedDateSubmitted = !NullableUtils.isObjectNullOrUndefined(suggestedDate);
    const suggestedDateIdValue: string = suggestedDateSubmitted ? suggestedDate.suggestedDateId : null;
    const startDateValue: NgbDateStruct = suggestedDateSubmitted && !NullableUtils.isObjectNullOrUndefined(suggestedDate.startDate)
      ? ValidatorUtils.parseNgbDateStructFromMoment(
        ValidatorUtils.parseMomentFromIsoString(suggestedDate.startDate, this.localeId),
        this.localeId)
      : null;
    const endDateValue: NgbDateStruct = suggestedDateSubmitted && !NullableUtils.isObjectNullOrUndefined(suggestedDate.endDate)
      ? ValidatorUtils.parseNgbDateStructFromMoment(
        ValidatorUtils.parseMomentFromIsoString(suggestedDate.endDate, this.localeId),
        this.localeId)
      : null;
    const startTimeValue: string = suggestedDateSubmitted && !NullableUtils.isObjectNullOrUndefined(suggestedDate.startTime)
      ? ValidatorUtils.serializeTimeFromMoment(
        ValidatorUtils.parseMomentFromIsoString(suggestedDate.startTime, this.localeId),
        this.localeId)
      : null;
    const endTimeValue: string = suggestedDateSubmitted && !NullableUtils.isObjectNullOrUndefined(suggestedDate.endTime)
      ? ValidatorUtils.serializeTimeFromMoment(
        ValidatorUtils.parseMomentFromIsoString(suggestedDate.endTime, this.localeId),
        this.localeId)
      : null;
    const descriptionValue: string = suggestedDateSubmitted && !NullableUtils.isStringNullOrWhitespace(suggestedDate.description)
      ? suggestedDate.description.trim()
      : null;

    return new UntypedFormGroup({
      [SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_ID]: new UntypedFormControl(suggestedDateIdValue),
      [SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_START_DATE]: new UntypedFormControl({
          value: startDateValue,
          disabled: suggestedDateIdValue !== null
        },
        [
          Validators.required,
          dateValidator(this.localeId),
          dateInFutureOrTodayValidator(this.localeId, this.dateTimeGenerator)]),
      [SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_START_TIME]: new UntypedFormControl({
          value: startTimeValue,
          disabled: suggestedDateIdValue !== null
        },
        [timeValidator(this.localeId)]),
      [SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_SHOW_START_TIME]: new UntypedFormControl(false),
      [SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_END_DATE]: new UntypedFormControl({
          value: endDateValue,
          disabled: suggestedDateIdValue !== null
        },
        [dateValidator(this.localeId)]),
      [SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_START_DATE_END_TIME]: new UntypedFormControl({
          value: endDateValue === null ? endTimeValue : null,
          disabled: suggestedDateIdValue !== null
        },
        [timeValidator(this.localeId)]),
      [SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_SHOW_START_DATE_END_TIME]: new UntypedFormControl(false),
      [SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_END_DATE_END_TIME]: new UntypedFormControl({
          value: endDateValue !== null ? endTimeValue : null,
          disabled: suggestedDateIdValue !== null
        },
        [timeValidator(this.localeId)]),
      [SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_SHOW_END_DATE_END_TIME]: new UntypedFormControl(false),
      [SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_SHOW_SUGGESTED_START_DATE_ON_DIFFERENT_DAY_FORM]: new UntypedFormControl(endDateValue !== null),
      [SuggestedDatesFormConstants.FORM_KEY_SUGGESTED_DATE_DESCRIPTION]: new UntypedFormControl(descriptionValue,
        [Validators.maxLength(ValidatorConstants.MAX_LENGTH_DATE_DESCRIPTION)]),
    }, [suggestedDateValidator(this.localeId, this.dateTimeGenerator)]);
  }

  private createSuggestedDatesFromForm(): SuggestedDate[] {
    const result: SuggestedDate[] = [];
    for (let i = 0, len = this.getSuggestedDatesFromForm().length; i < len; ++i) {
      const itemToAdd: SuggestedDate = this.createSuggestedDate(i);
      result.push(itemToAdd);
    }
    return result;
  }

  private createSuggestedDate(index: number): SuggestedDate {
    const itemToAdd: SuggestedDate = new SuggestedDate();

    itemToAdd.suggestedDateId = this.getSuggestedDateIdControlValue(index);
    const startDate: moment.Moment = this.parseDateFromString(this.getSuggestedDateStartDateControlValue(index));
    itemToAdd.startDate = this.createSerializedDateFromString(this.getSuggestedDateStartDateControlValue(index));
    itemToAdd.startTime = !NullableUtils.isStringNullOrEmpty(this.getSuggestedStartTimeControlValue(index))
      ? this.createSerializedDateTimeFromString(startDate, this.getSuggestedStartTimeControlValue(index)) : null;
    const endDateAsString: string = this.getShowSuggestedDateEndDateOnDifferentDayFormValue(index)
      ? this.getSuggestedDateEndDateControlValue(index)
      : null;
    const endDate: moment.Moment = this.parseDateFromString(endDateAsString);
    const endTimeAsString: string = this.getShowSuggestedDateEndDateOnDifferentDayFormValue(index)
      ? this.getEndTimeOfSuggestedEndDateByIndex(index).value
      : this.getEndTimeOfSuggestedStartDateByIndex(index).value;
    itemToAdd.endDate = CreateSuggestedDatesComponent.formatDate(endDate);
    itemToAdd.endTime = !NullableUtils.isStringNullOrEmpty(endTimeAsString)
      ? this.createSerializedDateTimeFromString(endDate === null ? startDate : endDate, endTimeAsString)
      : null;
    itemToAdd.description = this.getDescriptionByIndex(index).value;
    return itemToAdd;
  }

  private createSerializedDateFromString(value: string): string | null {
    const parsedDate: moment.Moment = this.parseDateFromString(value);
    return CreateSuggestedDatesComponent.formatDate(parsedDate);
  }

  private createSerializedDateTimeFromString(parsedDate: moment.Moment, value: string): string | null {
    const parsedTime: moment.Moment = this.parseTimeFromString(value);
    const parsedDateTime: moment.Moment = MomentUtils.concatDateTime(parsedDate, parsedTime);
    return CreateSuggestedDatesComponent.formatDateTime(parsedDateTime);
  }

  private parseDateFromString(value: string): moment.Moment | null {
    if (NullableUtils.isStringNullOrEmpty(value)) {
      return null;
    }
    try {
      return MomentUtils.parseMomentDateFromString(value, this.localeId);
    } catch (e) {
      return null;
    }
  }

  private parseTimeFromString(value: string): moment.Moment | null {
    if (NullableUtils.isStringNullOrEmpty(value)) {
      return null;
    }
    return MomentUtils.parseMomentTimeFromString(value, this.localeId);
  }
}
