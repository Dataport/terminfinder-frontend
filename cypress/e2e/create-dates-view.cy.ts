/// <reference types="cypress" />
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
// import values from "../fixtures/values.json";

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

    // TODO disabled until backend supports feature
    // it('Accepts valid description', () => {
    //   cy.get('[data-cy=descriptionInput]')
    //     .type('Test-Beschreibung', {delay: 0})
    //     .should('have.value', 'Test-Beschreibung');
    // });
    //
    // it('Does not accept too long description', () => {
    //   cy.get('[data-cy=descriptionTooLong]').should('not.exist');
    //   cy.get('[data-cy=descriptionInput]')
    //     .type(values.tooLongString, {delay: 0});
    //   cy.get('[data-cy=descriptionTooLong]');
    // });
  });

  describe('Adds new suggested date', () => {
    it('Adds new date inputs', () => {
      cy.get('[data-cy=addSuggestedDateButton]').click();
      cy.get('#suggested-date-start-date-0');
      cy.get('#suggested-date-start-date-1');

      cy.get('[data-cy=addSuggestedDateButton]').click();
      cy.get('#suggested-date-start-date-0');
      cy.get('#suggested-date-start-date-1');
      cy.get('#suggested-date-start-date-2');
    });
  });
});
