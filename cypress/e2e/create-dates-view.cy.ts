/// <reference types="cypress" />
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import values from '../fixtures/values.json';

dayjs.extend(utc);

context('create-dates-view', () => {
  beforeEach(() => {
    cy.moveToSelectDatesView();
  });

  describe('Main components visible', () => {
    it('Shows main components', () => {
      cy.get('#head');
      cy.get('[data-cy=headerTitle]');
      cy.get('[data-cy=stepperComponent]');
      cy.get('[data-cy=dateChooseHeading]');
      cy.get('[data-cy=enterDate]');
      cy.get('[data-cy=startDateLabel]');
      cy.get('[data-cy=startDateInput]');
      cy.get('[data-cy=addTimesButton]');
      cy.get('[data-cy=endAtOtherDayButton]');
      cy.get('[data-cy=descriptionLabel]');
      cy.get('[data-cy=descriptionInput]');
      cy.get('[data-cy=addSuggestedDateButton]');
      cy.get('[data-cy=copyModesToggle]');
      cy.get('[data-cy=back]').should('be.enabled');
      cy.get('[data-cy=next]').should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-cy=footer]');
    });
  });

  describe('Form works correctly', () => {
    it('Accepts one valid', () => {
      cy.get('[data-cy=next]').should('have.attr', 'aria-disabled', 'true');

      cy.get('[data-cy=dateChooseHeading]').click();
      cy.get('[data-cy=msgRequiredStartDate]');

      cy.get('[data-cy=startDateInput]')
        .type(dayjs().subtract(1, 'd').format('YYYY-MM-DD'))
        .should('have.value', dayjs().subtract(1, 'd').format('YYYY-MM-DD'));
      cy.get('[data-cy=msgNotInFutureStartDate]');
      cy.get('[data-cy=startDateInput]').clear();

      cy.get('[data-cy=startDateInput]')
        .type(dayjs().add(2, 'd').format('YYYY-MM-DD'))
        .should('have.value', dayjs().add(2, 'd').format('YYYY-MM-DD'));

      cy.get('[data-cy=next]').click();

      cy.location('href').should('include', '/#/settings');
    });

    it('Accepts valid start times', () => {
      cy.get('[data-cy=startDateInput]')
        .type(dayjs().add(2, 'd').format('YYYY-MM-DD'))
        .should('have.value', dayjs().add(2, 'd').format('YYYY-MM-DD'));

      cy.get('[data-cy=addTimesButton]').click();
      cy.get('[data-cy=next]').should('be.enabled');

      cy.get('[data-cy=startTimeInput]').type('00:00');
      cy.get('[data-cy=next]').should('be.enabled');
      cy.get('[data-cy=startTimeInput]').clear();

      cy.get('[data-cy=startTimeInput]').type('23:59');
      cy.get('[data-cy=next]').should('be.enabled');
      cy.get('[data-cy=startTimeInput]').clear();
    });

    it('Accepts valid end times', () => {
      cy.get('[data-cy=startDateInput]')
        .type(dayjs().add(2, 'd').format('YYYY-MM-DD'))
        .should('have.value', dayjs().add(2, 'd').format('YYYY-MM-DD'));

      cy.get('[data-cy=addTimesButton]').click();

      cy.get('[data-cy=startTimeInput]').type('10:00');
      cy.get('[data-cy=next]').should('be.enabled');

      cy.get('[data-cy=endTimeInput]').type('10:00');
      cy.get('[data-cy=next]').should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-cy=endTimeInput]').clear();

      cy.get('[data-cy=endTimeInput]').type('10:01');
      cy.get('[data-cy=next]').should('be.enabled');
      cy.get('[data-cy=endTimeInput]').clear();
    });

    it('Accepts valid end date on other day', () => {
      cy.get('[data-cy=startDateInput]')
        .type(dayjs().add(2, 'd').format('YYYY-MM-DD'))
        .should('have.value', dayjs().add(2, 'd').format('YYYY-MM-DD'));

      cy.get('[data-cy=endAtOtherDayButton]').click();
      cy.get('[data-cy=next]').should('be.enabled');

      cy.get('[data-cy=addTimesWithEndOnOtherDay]');

      cy.get('[data-cy=endDateInput]').type(dayjs().add(1, 'd').format('YYYY-MM-DD'));
      cy.get('[data-cy=next]').should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-cy=endDateInput]').clear();

      cy.get('[data-cy=endDateInput]').type(dayjs().add(2, 'd').format('YYYY-MM-DD'));
      cy.get('[data-cy=next]').should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-cy=endDateInput]').clear();

      cy.get('[data-cy=endDateInput]').type(dayjs().add(3, 'd').format('YYYY-MM-DD'));
      cy.get('[data-cy=next]').should('be.enabled');
      cy.get('[data-cy=endDateInput]').clear();
    });

    it('Accepts valid times on other day', () => {
      cy.get('[data-cy=startDateInput]')
        .type(dayjs().add(1, 'd').format('YYYY-MM-DD'))
        .should('have.value', dayjs().add(1, 'd').format('YYYY-MM-DD'));

      cy.get('[data-cy=endAtOtherDayButton]').click();
      cy.get('[data-cy=addTimesWithEndOnOtherDay]').click();
      cy.get('[data-cy=endDateInput]')
        .type(dayjs().add(2, 'd').format('YYYY-MM-DD'))
        .should('have.value', dayjs().add(2, 'd').format('YYYY-MM-DD'));
      cy.get('[data-cy=next]').should('be.enabled');

      cy.get('[data-cy=startTimeInputSecondColumn]').type('10:00');
      cy.get('[data-cy=next]').should('be.enabled');

      cy.get('[data-cy=endTimeInputSecondColumn]').type('09:00');
      cy.get('[data-cy=next]').should('be.enabled');
      cy.get('[data-cy=endTimeInputSecondColumn]');

      cy.get('[data-cy=startTimeInputSecondColumn]').clear();
      cy.get('[data-cy=next]').should('have.attr', 'aria-disabled', 'true');
    });

    it('Does not accept current date and time', () => {
      cy.get('[data-cy=startDateInput]')
        .type(dayjs().format('YYYY-MM-DD'))
        .should('have.value', dayjs().format('YYYY-MM-DD'));

      cy.get('[data-cy=addTimesButton]').click();

      cy.get('[data-cy=startTimeInput]').type(dayjs().format('HH:mm'));
      cy.get('[data-cy=next]').should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-cy=startTimeInput]').clear();

      cy.get('[data-cy=startTimeInput]').type(dayjs().add(2, 'm').format('HH:mm'));
      cy.get('[data-cy=next]').should('be.enabled');
      cy.get('[data-cy=startTimeInput]').clear();
    });

    it('Accepts valid description', () => {
      cy.get('[data-cy=descriptionInput]')
        .type('Test-Beschreibung', { delay: 0 })
        .should('have.value', 'Test-Beschreibung');
    });

    it('Does not accept too long description', () => {
      cy.get('[data-cy=descriptionTooLong]').should('not.exist');
      cy.get('[data-cy=descriptionInput]').type(values.tooLongString, { delay: 0 });
      cy.get('[data-cy=descriptionTooLong]');
    });
  });

  describe('Adds new suggested date', () => {
    it('Adds new date inputs', () => {
      cy.get('[data-cy=copyModesToggle]').should('have.length', 1);
      cy.get('#suggested-date-start-date-0').type(dayjs().add(2, 'd').format('YYYY-MM-DD'));
      cy.get('[data-cy=addSuggestedDateButton]').click();
      cy.get('#suggested-date-start-date-0');
      cy.get('#suggested-date-start-date-1');
      cy.get('[data-cy=copyModesToggle]').should('have.length', 1);

      cy.get('#suggested-date-start-date-1').type(dayjs().add(3, 'd').format('YYYY-MM-DD'));
      cy.get('[data-cy=addSuggestedDateButton]').click();
      cy.get('#suggested-date-start-date-0');
      cy.get('#suggested-date-start-date-1');
      cy.get('#suggested-date-start-date-2');
    });

    it('Does not add a new date input while the last one is invalid', () => {
      cy.get('[data-cy=addSuggestedDateButton]').should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-cy=addSuggestedDateButton]').should('be.visible').focus().type('{enter}');
      cy.get('#suggested-date-start-date-1').should('not.exist');

      cy.get('[data-cy=startDateInput]').type(dayjs().add(2, 'd').format('YYYY-MM-DD'));
      cy.get('[data-cy=addSuggestedDateButton]').should('have.attr', 'aria-disabled', 'false');
    });
  });

  describe('Copies suggested date', () => {
    const futureDate = dayjs().add(2, 'd').format('YYYY-MM-DD');
    const startTime = '10:00';
    const endTime = '11:00';

    const fillFirstDate = (start?: string, end?: string) => {
      cy.get('#suggested-date-start-date-0').type(futureDate);

      if (start) {
        cy.get('[data-cy=addTimesButton]').click();
        cy.get('#suggested-date-start-time-0').type(start);

        if (end) {
          cy.get('#suggested-date-end-time-0').type(end);
        }
      }
    };

    const openCopyModes = () => {
      cy.get('[data-cy=copyModesToggle]').click();
      cy.get('[data-cy=copyModesToggle]').should('have.attr', 'aria-expanded', 'true');
      // close the tooltip of the toggle, it would cover the options
      cy.get('[data-cy=copyModesToggle]').trigger('mouseleave').blur();
      cy.get('ngb-tooltip-window').should('not.exist');
    };

    it('Shows copy modes toggle and expands the options', () => {
      fillFirstDate();
      cy.get('[data-cy=copyModesToggle]').should('have.attr', 'aria-expanded', 'false');
      cy.get('[data-cy=copySuggestedDateButton-ALL]').should('not.be.visible');
      cy.get('[data-cy=copySuggestedDateButton-DATE_ONLY]').should('not.be.visible');
      cy.get('[data-cy=copySuggestedDateButton-SHIFT_TIME]').should('not.be.visible');
      cy.get('[data-cy=copySuggestedDateButton-NEXT_DAY]').should('not.be.visible');

      openCopyModes();

      cy.get('[data-cy=copySuggestedDateButton-ALL]').should('be.visible');
      cy.get('[data-cy=copySuggestedDateButton-DATE_ONLY]').should('be.visible');
      cy.get('[data-cy=copySuggestedDateButton-SHIFT_TIME]').should('be.visible');
      cy.get('[data-cy=copySuggestedDateButton-NEXT_DAY]').should('be.visible');
    });

    it('Disables copying while the last date is invalid', () => {
      cy.get('[data-cy=copyModesToggle]').should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-cy=copySuggestedDateButton-ALL]').should('have.attr', 'aria-disabled', 'true');

      fillFirstDate();

      cy.get('[data-cy=copyModesToggle]').should('have.attr', 'aria-disabled', 'false');
    });

    it('Copies date and times and marks the copy as duplicate', () => {
      fillFirstDate(startTime, endTime);
      openCopyModes();

      cy.get('[data-cy=copySuggestedDateButton-ALL]').click();

      cy.get('#suggested-date-start-date-1').should('have.value', futureDate);
      cy.get('#suggested-date-start-time-1').should('have.value', startTime);
      cy.get('#suggested-date-end-time-1').should('have.value', endTime);
      cy.get('#suggested-date-description-1').should('have.value', '');
      cy.get('#duplicate-suggested-date-1');
      cy.get('[data-cy=next]').should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-cy=addSuggestedDateButton]').should('have.attr', 'aria-disabled', 'true');
    });

    it('Accepts the copied date as unique after changing the description', () => {
      fillFirstDate(startTime, endTime);
      openCopyModes();

      cy.get('[data-cy=copySuggestedDateButton-ALL]').click();
      cy.get('#duplicate-suggested-date-1');
      cy.get('#suggested-date-description-1').type('Test-Beschreibung');

      cy.get('#duplicate-suggested-date-1').should('not.exist');
      cy.get('[data-cy=next]').should('be.enabled');
      cy.get('[data-cy=addSuggestedDateButton]').should('have.attr', 'aria-disabled', 'false');
    });

    it('Copies only the date', () => {
      fillFirstDate(startTime, endTime);
      openCopyModes();

      cy.get('[data-cy=copySuggestedDateButton-DATE_ONLY]').click();

      cy.get('#suggested-date-start-date-1').should('have.value', futureDate);
      cy.get('#suggested-date-start-time-1').should('not.exist');
      cy.get('#duplicate-suggested-date-1').should('not.exist');
      cy.get('[data-cy=next]').should('be.enabled');
    });

    it('Copies to the next day with the same times', () => {
      const nextDate = dayjs().add(3, 'd').format('YYYY-MM-DD');

      fillFirstDate(startTime, endTime);
      openCopyModes();

      cy.get('[data-cy=copySuggestedDateButton-NEXT_DAY]').click();

      cy.get('#suggested-date-start-date-1').should('have.value', nextDate);
      cy.get('#suggested-date-start-time-1').should('have.value', startTime);
      cy.get('#suggested-date-end-time-1').should('have.value', endTime);
      cy.get('[data-cy=next]').should('be.enabled');
    });

    it('Shifts the time range by its duration', () => {
      const shiftedEndTime = '12:00';

      fillFirstDate(startTime, endTime);
      openCopyModes();

      cy.get('[data-cy=copySuggestedDateButton-SHIFT_TIME]').click();

      cy.get('#suggested-date-start-date-1').should('have.value', futureDate);
      cy.get('#suggested-date-start-time-1').should('have.value', endTime);
      cy.get('#suggested-date-end-time-1').should('have.value', shiftedEndTime);
    });

    it('Disables shifting the time without a time range', () => {
      fillFirstDate();
      openCopyModes();

      cy.get('[data-cy=copySuggestedDateButton-SHIFT_TIME]').should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-cy=copySuggestedDateButton-SHIFT_TIME]').should('be.visible').click();
      cy.get('#suggested-date-start-date-1').should('not.exist');
    });

    it('Disables shifting the time when it would pass midnight', () => {
      fillFirstDate('22:00', '23:30');
      openCopyModes();

      cy.get('[data-cy=copySuggestedDateButton-SHIFT_TIME]').should('have.attr', 'aria-disabled', 'true');
    });

    it('Does not show copy modes without a suggested date', () => {
      cy.get('[data-cy=copyModesToggle]').should('exist');
      cy.get('#removeDate-0').click();
      cy.get('[data-cy=copyModesToggle]').should('not.exist');
    });

    it('Shows copy modes only once, below the last suggested date', () => {
      fillFirstDate();

      cy.get('[data-cy=addSuggestedDateButton]').click();
      cy.get('#suggested-date-start-date-1');
      cy.get('[data-cy=copyModesToggle]').should('have.length', 1);
      cy.get('#suggested-date-start-date-1').then(($lastDate) => {
        cy.get('[data-cy=copyModesToggle]').then(($toggle) => {
          expect($toggle[0].getBoundingClientRect().top).to.be.greaterThan($lastDate[0].getBoundingClientRect().top);
        });
      });
    });

    it('Stays expanded when a suggested date is added', () => {
      fillFirstDate(startTime, endTime);
      openCopyModes();

      cy.get('[data-cy=copySuggestedDateButton-DATE_ONLY]').click().trigger('mouseleave');
      cy.get('ngb-tooltip-window').should('not.exist');
      cy.get('#suggested-date-start-date-1');
      cy.get('[data-cy=copyModesToggle]').should('have.length', 1).and('have.attr', 'aria-expanded', 'true');

      cy.get('[data-cy=addSuggestedDateButton]').click();

      cy.get('#suggested-date-start-date-2');
      cy.get('[data-cy=copyModesToggle]').should('have.length', 1).and('have.attr', 'aria-expanded', 'true');
    });

    it('Is collapsed again after deleting all dates and creating a new one', () => {
      fillFirstDate();
      openCopyModes();

      cy.get('#removeDate-0').click();
      cy.get('[data-cy=copyModesToggle]').should('not.exist');

      cy.get('[data-cy=addSuggestedDateButton]').click();
      cy.get('#suggested-date-start-date-0');
      cy.get('[data-cy=copyModesToggle]').should('have.attr', 'aria-expanded', 'false');
    });
  });
});
