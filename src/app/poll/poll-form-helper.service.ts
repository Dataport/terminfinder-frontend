import {Injectable} from '@angular/core';
import {Appointment, Participant, SuggestedDate, Voting, VotingStatusType} from '../shared/models';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {NullableUtils} from '../shared/utils';
import {invalidNameValidator} from '../shared/validators/invalid-name.directive';
import {ValidatorConstants} from '../shared/constants/validatorConstants';
import {ApiConstants} from '../shared/constants/apiConstants';
import {ics} from 'calendar-link';
import moment from 'moment';
import {TranslateService} from '@ngx-translate/core';
import {escapeCSVCell, generateCSVFileName} from './csv-utils';

enum FormMode { VIEW, ADD, EDIT}

/**
 * A class to handle the form logic for the poll component.
 */
@Injectable()
export class PollFormHelperService {
  static readonly MAX_NUMBER_OF_PARTICIPANTS = ApiConstants.MAX_NUMBER_OF_PARTICIPANTS_OF_APPOINTMENT;
  /**
   * Initially the form contains values for the tos checkbox only.
   * The participantForm is filled when the user wants to add/edit a participant and its votings.
   */
  public participantForm: UntypedFormGroup;
  public pollForm: UntypedFormGroup;
  public appointment: Appointment = new Appointment();
  public formMode: FormMode = FormMode.VIEW;
  public lastEditedParticipant: Participant;
  public participantsToDelete: Participant[] = [];

  constructor(private fb: UntypedFormBuilder, private translate: TranslateService) {
    this.formMode = FormMode.VIEW;

    this.pollForm = this.fb.group({
      isTosRead: [false, Validators.requiredTrue],
      selectedParticipant: '',
      participantForm: this.participantForm
    });
  }

  public hasAddParticipantForm(): boolean {
    return this.formMode === FormMode.ADD;
  }

  public hasEditParticipantForm(): boolean {
    return this.formMode === FormMode.EDIT;
  }

  public hasAddOrEditParticipantForm(): boolean {
    return this.hasEditParticipantForm() || this.hasAddParticipantForm();
  }

  public getParticipantForm(): UntypedFormGroup | null {
    return this.participantForm;
  }

  public getParticipantFormName(): UntypedFormControl | null {
    return this.getParticipantForm() ? this.getParticipantForm().get('name') as UntypedFormControl : null;
  }

  public getParticipantFormVotings(): UntypedFormArray | null {
    return this.getParticipantForm() != null ? this.getParticipantForm().get('votings') as UntypedFormArray : null;
  }

  public getTosFormControl(): UntypedFormControl {
    return this.pollForm.get('isTosRead') as UntypedFormControl;
  }

  public getSelectedParticipantControl(): UntypedFormControl {
    return this.pollForm.get('selectedParticipant') as UntypedFormControl;
  }

  public castToFormGroup(abstractControl: AbstractControl): UntypedFormGroup {
    return abstractControl as UntypedFormGroup;
  }

  private formatSuggestedDateAsRange(dates: SuggestedDate) {
    const parts = [moment(dates.startDate).format("L")];

    if (dates.startTime) {
      const time = moment(dates.startTime).format("LT");
      parts.push(this.translate.instant("time.timeAt", { time }));
    }
    if (dates.endDate || dates.endTime) {
      const date = dates.endDate ? moment(dates.endDate).format("L") : "";
      parts.push(
        this.translate.instant("date.dateTo", { date }).trim(),
      );
    }

    if (dates.endTime) {
      const time = moment(dates.endTime).format("LT");
      parts.push(this.translate.instant("time.timeAt", { time }));
    }
    return parts.join(" ");
  }

  private getVotingStatusText(votingStatus: VotingStatusType) {
    switch (votingStatus) {
      case VotingStatusType.Accepted:
        return this.translate.instant("votingStatus.accepted");
      case VotingStatusType.Questionable:
        return this.translate.instant("votingStatus.questionable");
      case VotingStatusType.Declined:
        return this.translate.instant("votingStatus.declined");
      default:
        return this.translate.instant("votingStatus.unknown");
    }
  }

  public downloadCsv(): void {
    const lineBreak = "\n";
    const separator = ",";
    const metaInfoSeparator = `sep=${separator}`;

    const csv: string[][] = [
      [
        this.translate.instant("participant.participants"),
        ...this.appointment.suggestedDates.map((date) =>
          this.formatSuggestedDateAsRange(date),
        ),
      ],
    ];

    for (const { name, participantId } of this.appointment.participants) {
      csv.push([
        name,
        ...this.appointment.suggestedDates.map(({ suggestedDateId }) => {
          const votingStatus = this.getVotingBySuggestedDateIdAndParticipantId(
            suggestedDateId,
            participantId,
          )?.status;
          return this.getVotingStatusText(votingStatus);
        }),
      ]);
    }

    const csvContent = csv
      .map((cells) => cells.map((cell) => escapeCSVCell(cell)).join(separator))
      .join(lineBreak);

    const escapedCsvContent = window.btoa(
      unescape(encodeURIComponent(metaInfoSeparator + lineBreak + csvContent)),
    );

    const anchor = document.createElement("a");
    anchor.download = generateCSVFileName(
      this.translate.instant("poll.poll"),
      this.appointment.title,
    );
    anchor.href = `data:text/csv;charset=utf8;base64,${escapedCsvContent}`;
    anchor.rel = "noopener noreferrer";
    anchor.click();
  }

  public downloadCal(date: SuggestedDate, index: number): void {
    function generateDescription(lengthOfCurrentDescription: number, participants: Participant[], votingText: string): string {
      let descriptionFragment = '';
      if (participants) {
        if (lengthOfCurrentDescription) {
          descriptionFragment += '\n\r\n\r';
        }
        descriptionFragment += votingText + '\n\r';
        participants.forEach(participant => {
          descriptionFragment += participant.name + ', ';
        });
        if (participants.length) {
          descriptionFragment = descriptionFragment.slice(0, descriptionFragment.length - 2);
        }
      }
      return descriptionFragment;
    }

    let description = this.appointment.description;

    if (date.description) {
      description += '\n\r\n\r' + date.description;
    }

    const acceptingParticipants = this.getParticipantsWithVotingsOnSuggestedDate(date.suggestedDateId, VotingStatusType.Accepted);
    description += generateDescription(description.length, acceptingParticipants, 'Zugesagt:');

    const questioningParticipants = this.getParticipantsWithVotingsOnSuggestedDate(date.suggestedDateId, VotingStatusType.Questionable);
    description += generateDescription(description.length, questioningParticipants, 'Mit Vorbehalt:');

    const decliningParticipants = this.getParticipantsWithVotingsOnSuggestedDate(date.suggestedDateId, VotingStatusType.Declined);
    description += generateDescription(description.length, decliningParticipants, 'Abgelehnt:');

    let url;
    if (date.endTime || date.endDate) {
      url = ics({
          title: this.appointment.title + ' von ' + this.appointment.name,
          location: this.appointment.location,
          description: description,
          start: date.startTime ? moment(date.startTime) : moment.utc(date.startDate),
          end: date.endTime ? moment(date.endTime) : moment.utc(date.endDate).add(1, 'd'),
          allDay: !date.startTime
        }
      );
    } else {
      url = ics({
          title: this.appointment.title + ' von ' + this.appointment.name,
          location: this.appointment.location,
          description: description,
          start: date.startTime ? moment(date.startTime) : moment.utc(date.startDate),
          allDay: !date.startTime
        }
      );
    }
    const anchor = document.createElement('a');
    anchor.download = 'Umfrage-' + this.appointment.title + '-' + (index + 1) + '.ics';
    anchor.href = url;
    anchor.rel = 'noopener noreferrer';
    anchor.click();
  }

  /**
   * Switches the form to "add" mode and creates a form to add the new participant's values.
   */
  public addParticipant(): void {
    if (this.formMode === FormMode.VIEW && this.getNumberOfParticipants() < PollFormHelperService.MAX_NUMBER_OF_PARTICIPANTS) {
      this.formMode = FormMode.ADD;
      this.lastEditedParticipant = null;
      this.getSelectedParticipantControl().setValue(this.lastEditedParticipant);
      this.participantForm = this.createParticipantForm();
      this.subscribeToParticipantChanges();
    }
  }

  /**
   * Switches the form to "edit" mode and creates a form to edit the participant's values.
   */
  public editParticipant(participant: Participant): void {
    if (this.formMode === FormMode.VIEW) {
      this.formMode = FormMode.EDIT;
      this.participantForm = this.createParticipantForm(participant);
      this.subscribeToParticipantChanges();
    }
  }

  /**
   * Switches the form to "view" mode and the participant form.
   */
  public deleteParticipantForm(): void {
    this.formMode = FormMode.VIEW;
    this.participantForm = null;
  }

  public deleteEditParticipant(participant: Participant): void {
    const itemToDelete: Participant = participant;
    if (participant != null && itemToDelete.participantId !== null && itemToDelete.participantId !== undefined
      && itemToDelete.participantId !== '' && itemToDelete.participantId.length > 0) {
      this.participantsToDelete.push(itemToDelete);
      this.deleteParticipantFromModel(participant);
      this.lastEditedParticipant = null;
    }
    this.selectFirstParticipant();
    this.deleteParticipantForm();
  }

  public selectFirstParticipant(): void {
    if (NullableUtils.isObjectNullOrUndefined(this.appointment.participants)) {
      throw new Error(`this.appointment.participants must not be null`);
    }
    if (this.appointment.participants.length > 0) {
      this.selectParticipant(this.appointment.participants[0].participantId);
    }
  }

  public selectParticipant(participantId): void {
    if (NullableUtils.isObjectNullOrUndefined(participantId)) {
      throw new Error(`participantId must not be null`);
    }
    if (NullableUtils.isObjectNullOrUndefined(this.appointment.participants)) {
      throw new Error(`this.appointment.participants must not be null`);
    }
    this.pollForm.patchValue({selectedParticipant: this.appointment.participants.find(value => value.participantId === participantId)});
  }

  /**
   * Determines the voting status of the passed suggested date and participant.
   * @param suggestedDateId ID of the suggested date
   * @param participantId ID of the participant
   */
  public getVotingStatusBySuggestedDateIdAndParticipantId(suggestedDateId: string, participantId: string): string {
    const voting = this.getVotingBySuggestedDateIdAndParticipantId(suggestedDateId, participantId);
    if (!NullableUtils.isObjectNullOrUndefined(voting)) {
      return voting.status;
    } else {
      return VotingStatusType.Undefined;
    }
  }

  /**
   * Checks if the passed participant's name and votes are currently being edited.
   * @param participantId ID of the participant to check
   */
  public isEditInParticipantForm(participantId: string): boolean {
    if (!NullableUtils.isObjectNullOrUndefined(this.getParticipantForm())) {
      const control = this.getParticipantForm().get('participantId') as AbstractControl;
      return control.value === participantId;
    }
  }

  /**
   * Counts the accepted votings for the passed suggested date.
   * @param suggestedDateId ID of the suggested date
   */
  public getNumberOfAcceptedVotingsBySuggestedDate(suggestedDateId: string): number {
    if (NullableUtils.isObjectNullOrUndefined(this.appointment.participants)) {
      throw new Error(`this.appointment.participants must not be null`);
    }
    let result = 0;
    const votingStatusToSearch: VotingStatusType = VotingStatusType.Accepted;
    // accepted votings in the participant form
    const votingFromParticipantForm: Voting = this.getVotingFromParticipantFormBySuggestedDateId(suggestedDateId);
    if (votingFromParticipantForm != null && votingFromParticipantForm.status === votingStatusToSearch) {
      result++;
    }
    // accepted votings of other participants
    for (let i = 0, len = this.appointment.participants.length; i < len; ++i) {
      const participant: Participant = this.appointment.participants[i];
      // skip votings of a participant that is currently being edited (otherwise it would be counted twice)
      if (!(this.hasEditParticipantForm() && this.isEditInParticipantForm(participant.participantId))) {
        for (let j = 0, lenVotings = participant.votings.length; j < lenVotings; ++j) {
          const voting: Voting = participant.votings[j];
          if (voting.suggestedDateId === suggestedDateId && voting.status === votingStatusToSearch) {
            result++;
          }
        }
      }
    }
    return result;
  }

  /**
   * Filters participants, which align with voting type for the passed suggested date and returns array of names.
   * @param suggestedDateId ID of the suggested date
   * @param votingStatus VotingStatusType to search for
   * @return acceptingParticipants Array of Names of participants which accepts the suggested date
   */
  public getParticipantsWithVotingsOnSuggestedDate(suggestedDateId: string, votingStatus: VotingStatusType): Participant[] {
    if (NullableUtils.isObjectNullOrUndefined(this.appointment.participants)) {
      throw new Error(`this.appointment.participants must not be null`);
    }
    const acceptingParticipants = [];
    this.appointment.participants.forEach(participant => {
      participant.votings.forEach(voting => {
        if (voting.suggestedDateId === suggestedDateId && voting.status === votingStatus) {
          acceptingParticipants.push(participant);
        }
      });
    });
    return acceptingParticipants;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * this can not be static, because the html-part of the code only has access to the instance at runtime
   * since it has no access to the class itself, it also has no access to it's static members
   * **/
  public isVotingFromSuggestedDate(suggestedDate: SuggestedDate, votingOfSuggestedDate: AbstractControl): boolean {
    if (NullableUtils.isObjectNullOrUndefined(suggestedDate)) {
      throw new Error(`suggestedDate must not be null`);
    }
    if (NullableUtils.isObjectNullOrUndefined(votingOfSuggestedDate)) {
      throw new Error(`votingOfSuggestedDate must not be null`);
    }
    const voting: Voting = votingOfSuggestedDate.value as Voting;
    return suggestedDate.suggestedDateId === voting.suggestedDateId;
  }

  public getVotingBySuggestedDateIdAndParticipantId(suggestedDateId: string, participantId: string): Voting {
    if (NullableUtils.isObjectNullOrUndefined(this.appointment.participants)) {
      throw new Error(`this.appointment.participants must not be null`);
    }
    for (const participant of this.appointment.participants) {
      if (participant.participantId === participantId) {
        for (const voting of participant.votings) {
          if (voting.suggestedDateId === suggestedDateId) {
            return voting;
          }
        }
      }
    }
  }

  /**
   * Returns the total number of accepted votings of the currently edited participant.
   */
  public getNumberOfVotingsWithVotingStatusAcceptedOfAddedParticipant(): number {
    if (this.formMode !== FormMode.ADD) {
      return 0;
    }
    return this.getNumberOfVotings(this.getParticipantFormVotings(), VotingStatusType.Accepted);
  }

  public getNumberOfParticipants(): number {
    if (NullableUtils.isObjectNullOrUndefined(this.appointment.participants)) {
      throw new Error(`this.appointment.participants must not be null`);
    }
    return this.appointment.participants.length + (this.hasAddParticipantForm() ? 1 : 0);
  }

  /**
   * Returns if the poll has any participants.
   */
  public hasParticipants(): boolean {
    return !NullableUtils.isObjectNullOrUndefined(this.appointment.participants) && this.getNumberOfParticipants() > 0;
  }

  /**
   * Returns if the currently edited participant has cast any votings.
   */
  public hasParticipantVotings(): boolean {
    const votingsFormArray: UntypedFormArray = this.getParticipantFormVotings();
    const votings: Voting[] = votingsFormArray != null
      ? votingsFormArray.value as Voting[] : [];
    return votings.length > 0;
  }

  /**
   * Returns if the currently edited participant has cast any accepted or questionable votings.
   */
  public hasParticipantAcceptedOrQuestionableVotings(): boolean {
    const participantFormVotings: UntypedFormArray = this.getParticipantFormVotings();
    const votings: Voting[] = participantFormVotings != null ? participantFormVotings.value as Voting[] : [];
    for (let j = 0, lenVotings = votings.length; j < lenVotings; ++j) {
      if (votings[j].status !== VotingStatusType.Declined) {
        return true;
      }
    }
  }

  /**
   * Creates a form to edit a participant's name and votings. If a participant is passed the form is filled with its values.
   * @param participant
   */
  private createParticipantForm(participant?: Participant): UntypedFormGroup {
    if (NullableUtils.isObjectNullOrUndefined(this.appointment.suggestedDates)) {
      throw new Error(`this.appointment.suggestedDates must not be null`);
    }
    const votings: Voting[] = this.appointment.suggestedDates.map((date) => (
      {
        suggestedDateId: date.suggestedDateId,
        status: participant ? this.getVotingStatusBySuggestedDateIdAndParticipantId(
          date.suggestedDateId, participant.participantId) : VotingStatusType.Declined,
        votingId: participant && this.getVotingBySuggestedDateIdAndParticipantId(date.suggestedDateId, participant.participantId)
          ? this.getVotingBySuggestedDateIdAndParticipantId(date.suggestedDateId, participant.participantId).votingId
          : null
      } as Voting
    ));
    const votingsFormGroup: UntypedFormGroup[] = (votings.map((voting) => (
      new UntypedFormGroup({
        'status': new UntypedFormControl(voting.status),
        'suggestedDateId': new UntypedFormControl(voting.suggestedDateId),
        'votingId': new UntypedFormControl(voting.votingId ? voting.votingId : null)
      })
    )));
    return new UntypedFormGroup({
      'participantId': new UntypedFormControl(participant ? participant.participantId : null),
      'name': new UntypedFormControl(participant ? participant.name : '', [
        Validators.required, invalidNameValidator(), Validators.maxLength(ValidatorConstants.MAX_LENGTH_NAME)]
      ),
      'votings': new UntypedFormArray(votingsFormGroup)
    });
  }

  private subscribeToParticipantChanges(): void {
    if (NullableUtils.isObjectNullOrUndefined(this.participantForm)) {
      throw new Error(`this.participantForm must not be null`);
    }
    this.participantForm.valueChanges.subscribe(value => {
      this.participantForm.setValue(value, {onlySelf: true, emitEvent: false});
    });
  }

  private deleteParticipantFromModel(participant: Participant): void {
    if (NullableUtils.isObjectNullOrUndefined(this.appointment.participants)) {
      throw new Error(`this.appointment.participants must not be null`);
    }
    this.appointment.participants.forEach((item, index) => {
      if (item === participant) {
        this.appointment.participants.splice(index, 1);
      }
    });
  }

  /**
   * Returns the voting of the currently edited participant that belongs to the passed suggestedDateId.
   * @param suggestedDateId
   */
  private getVotingFromParticipantFormBySuggestedDateId(suggestedDateId: string) {
    const votingsFromParticipantForm: UntypedFormArray = this.getParticipantFormVotings();
    if (votingsFromParticipantForm != null) {
      const votings: Voting[] = votingsFromParticipantForm.value as Voting[];
      for (let i = 0, len = votings.length; i < len; ++i) {
        const voting = votings[i];
        if (voting.suggestedDateId === suggestedDateId) {
          return voting;
        }
      }
    }
    return null;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * this can not be static, because the html-part of the code only has access to the instance at runtime
   * since it has no access to the class itself, it also has no access to it's static members
   * **/
  private getNumberOfVotings(formArray: UntypedFormArray, votingStatus: VotingStatusType): number {
    let result = 0;
    const votings: Voting[] = formArray != null ? formArray.value as Voting[] : [];
    for (let j = 0, lenVotings = votings.length; j < lenVotings; ++j) {
      if (votings[j].status === votingStatus) {
        result++;
      }
    }
    return result;
  }
}
