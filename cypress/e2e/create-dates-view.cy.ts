/// <reference types="cypress" />
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import values from "../fixtures/values.json";

dayjs.extend(utc);

context('create-dates-view', () => {
  beforeEach(() => {
    cy.moveToSelectDatesView();
  });

  describe('Main components visible', () => {
    it('Shows main components', () => {
      cy.get('#head');
      cy.get('[data-id=headerTitle]');
      cy.get('[data-id=stepperComponent]');
      cy.get('[data-id=addDetailsHeading]');
      cy.get('[data-id=enterDate]');
      cy.get('[data-id=startDateLabel]');
      cy.get('[data-id=startDateInput]');
      cy.get('[data-id=addTimesButton]');
      cy.get('[data-id=endAtOtherDayButton]');
      cy.get('[data-id=descriptionLabel]');
      cy.get('[data-id=descriptionInput]');
      cy.get('[data-id=addSuggestedDateButton]');
      cy.get('[data-id=back]')
        .should('be.enabled');
      cy.get('[data-id=next]')
        .should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-id=footer]');
    });
  });

  describe('Form works correctly', () => {
    it('Accepts one valid', () => {
      cy.get('[data-id=next]')
        .should('have.attr', 'aria-disabled', 'true');

      cy.get('[data-id=addDetailsHeading]')
        .click();
      cy.get('[data-id=msgRequiredStartDate]');

      cy.get('[data-id=startDateInput]')
        .type('a')
        .should('have.value', 'a');
      cy.get('[data-id=msgInvalidStartDate]');
      cy.get('[data-id=startDateInput]')
        .clear();

      cy.get('[data-id=startDateInput]')
        .type(dayjs().subtract(1, 'd').format('DD.MM.YYYY'))
        .should('have.value', dayjs().subtract(1, 'd').format('DD.MM.YYYY'));
      cy.get('[data-id=msgNotInFutureStartDate]');
      cy.get('[data-id=startDateInput]')
        .clear();

      cy.get('[data-id=startDateInput]')
        .type(dayjs().add(2, 'd').format('DD.MM.YYYY'))
        .should('have.value', dayjs().add(2, 'd').format('DD.MM.YYYY'));

      cy.get('[data-id=next]')
        .click();

      cy.location('href')
        .should('include', '/#/settings');
    });

    it('Accepts valid start times', () => {
      cy.get('[data-id=startDateInput]')
        .type(dayjs().add(2, 'd').format('DD.MM.YYYY'))
        .should('have.value', dayjs().add(2, 'd').format('DD.MM.YYYY'));

      cy.get('[data-id=addTimesButton]')
        .click();
      cy.get('[data-id=next]')
        .should('be.enabled');

      cy.get('[data-id=startTimeInput]')
        .type('00');
      cy.get('[data-id=next]')
        .should('be.enabled');
      cy.get('[data-id=startTimeInput]')
        .clear();

      cy.get('[data-id=startTimeInput]')
        .type('2400');
      cy.get('[data-id=next]')
        .should('be.enabled');
      cy.get('[data-id=startTimeInput]')
        .clear();

      cy.get('[data-id=startTimeInput]')
        .type('25');
      cy.get('[data-id=next]')
        .should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-id=startTimeInput]')
        .clear();

      cy.get('[data-id=startTimeInput]')
        .type('250');
      cy.get('[data-id=next]')
        .should('be.enabled');
      cy.get('[data-id=startTimeInput]')
        .clear();

      cy.get('[data-id=startTimeInput]')
        .type('2400');
      cy.get('[data-id=next]')
        .should('be.enabled');
      cy.get('[data-id=startTimeInput]')
        .clear();

      cy.get('[data-id=startTimeInput]')
        .type('2401');
      cy.get('[data-id=next]')
        .should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-id=startTimeInput]')
        .clear();

      cy.get('[data-id=startTimeInput]')
        .type('010000');
      cy.get('[data-id=next]')
        .should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-id=startTimeInput]')
        .clear();
    });

    it('Accepts valid end times', () => {
      cy.get('[data-id=startDateInput]')
        .type(dayjs().add(2, 'd').format('DD.MM.YYYY'))
        .should('have.value', dayjs().add(2, 'd').format('DD.MM.YYYY'));

      cy.get('[data-id=addTimesButton]')
        .click();

      cy.get('[data-id=startTimeInput]')
        .type('10');
      cy.get('[data-id=next]')
        .should('be.enabled');

      cy.get('[data-id=endTimeInput]')
        .type('10');
      cy.get('[data-id=next]')
        .should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-id=endTimeInput]')
        .clear();

      cy.get('[data-id=endTimeInput]')
        .type('1001');
      cy.get('[data-id=next]')
        .should('be.enabled');
      cy.get('[data-id=endTimeInput]')
        .clear();

      cy.get('[data-id=endTimeInput]')
        .type('-1');
      cy.get('[data-id=next]')
        .should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-id=endTimeInput]')
        .clear();

      cy.get('[data-id=endTimeInput]')
        .type('250');
      cy.get('[data-id=next]')
        .should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-id=endTimeInput]')
        .clear();

      cy.get('[data-id=endTimeInput]')
        .type('0');
      cy.get('[data-id=next]')
        .should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-id=endTimeInput]')
        .clear();

      cy.get('[data-id=endTimeInput]')
        .type('00');
      cy.get('[data-id=next]')
        .should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-id=endTimeInput]')
        .clear();

      cy.get('[data-id=endTimeInput]')
        .type('010000');
      cy.get('[data-id=next]')
        .should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-id=endTimeInput]')
        .clear();
    });

    it('Accepts valid end date on other day', () => {
      cy.get('[data-id=startDateInput]')
        .type(dayjs().add(2, 'd').format('DD.MM.YYYY'))
        .should('have.value', dayjs().add(2, 'd').format('DD.MM.YYYY'));

      cy.get('[data-id=endAtOtherDayButton]')
        .click();
      cy.get('[data-id=next]')
        .should('be.enabled');

      cy.get('[data-id=addTimesWithEndOnOtherDay]');

      cy.get('[data-id=endDateInput]')
        .type(dayjs().add(1, 'd').format('DD.MM.YYYY'));
      cy.get('[data-id=next]')
        .should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-id=endDateInput]')
        .clear();

      cy.get('[data-id=endDateInput]')
        .type(dayjs().add(2, 'd').format('DD.MM.YYYY'));
      cy.get('[data-id=next]')
        .should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-id=endDateInput]')
        .clear();

      cy.get('[data-id=endDateInput]')
        .type(dayjs().add(3, 'd').format('DD.MM.YYYY'));
      cy.get('[data-id=next]')
        .should('be.enabled');
      cy.get('[data-id=endDateInput]')
        .clear();

      cy.get('[data-id=endDateInput]')
        .type('0');
      cy.get('[data-id=next]')
        .should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-id=endDateInput]')
        .clear();

      cy.get('[data-id=endDateInput]')
        .type('a');
      cy.get('[data-id=next]')
        .should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-id=endDateInput]')
        .clear();
    });

    it('Accepts valid times on other day', () => {
      cy.get('[data-id=startDateInput]')
        .type(dayjs().add(1, 'd').format('DD.MM.YYYY'))
        .should('have.value', dayjs().add(1, 'd').format('DD.MM.YYYY'));

      cy.get('[data-id=endAtOtherDayButton]')
        .click();
      cy.get('[data-id=addTimesWithEndOnOtherDay]')
        .click();
      cy.get('[data-id=endDateInput]')
        .type(dayjs().add(2, 'd').format('DD.MM.YYYY'))
        .should('have.value', dayjs().add(2, 'd').format('DD.MM.YYYY'));
      cy.get('[data-id=next]')
        .should('be.enabled');

      cy.get('[data-id=startTimeInputSecondColumn]')
        .type('10');
      cy.get('[data-id=next]')
        .should('be.enabled');

      cy.get('[data-id=endTimeInputSecondColumn]')
        .type('9');
      cy.get('[data-id=next]')
        .should('be.enabled');
      cy.get('[data-id=endTimeInputSecondColumn]');

      cy.get('[data-id=startTimeInputSecondColumn]')
        .clear();
      cy.get('[data-id=next]')
        .should('have.attr', 'aria-disabled', 'true');
    });

    it('Does not accept current date and time', () => {
      cy.get('[data-id=startDateInput]')
        .type(dayjs().format('DD.MM.YYYY'))
        .should('have.value', dayjs().format('DD.MM.YYYY'));

      cy.get('[data-id=addTimesButton]')
        .click();

      cy.get('[data-id=startTimeInput]')
        .type(dayjs().format('HH:mm'));
      cy.get('[data-id=next]')
        .should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-id=startTimeInput]')
        .clear();

      cy.get('[data-id=startTimeInput]')
        .type(dayjs().add(2, 'm').format('HH:mm'));
      cy.get('[data-id=next]')
        .should('be.enabled');
      cy.get('[data-id=startTimeInput]')
        .clear();
    });

    it('Ignores illegal characters for time input', () => {
      cy.get('[data-id=startDateInput]')
        .type(dayjs().add(2, 'd').format('DD.MM.YYYY'))
        .should('have.value', dayjs().add(2, 'd').format('DD.MM.YYYY'));

      cy.get('[data-id=addTimesButton]')
        .click();
      cy.get('[data-id=next]')
        .should('be.enabled');

      cy.get('[data-id=startTimeInput]')
        .type('-1');
      cy.get('[data-id=startTimeInput]')
        .should('contain.value', '1');
      cy.get('[data-id=next]')
        .should('be.enabled');
      cy.get('[data-id=startTimeInput]')
        .clear();

      cy.get('[data-id=startTimeInput]')
        .type('❌ a.,');
      cy.get('[data-id=startTimeInput]')
        .should('contain.value', '');
      cy.get('[data-id=next]')
        .should('be.enabled');
      cy.get('[data-id=startTimeInput]')
        .clear();
    });

    it('Accepts valid description', () => {
      cy.get('[data-id=descriptionInput]')
        .type('Test-Beschreibung', {delay: 0})
        .should('have.value', 'Test-Beschreibung');
    });

    it('Does not accept too long description', () => {
      cy.get('[data-id=descriptionTooLong]').should('not.exist');
      cy.get('[data-id=descriptionInput]')
        .type(values.tooLongString, {delay: 0});
      cy.get('[data-id=descriptionTooLong]');
    });
  });

  describe('Adds new suggested date', () => {
    it('Adds new date inputs', () => {
      cy.get('[data-id=addSuggestedDateButton]')
        .click();
      cy.get('#suggested-date-start-date-0');
      cy.get('#suggested-date-start-date-1');

      cy.get('[data-id=addSuggestedDateButton]')
        .click();
      cy.get('#suggested-date-start-date-0');
      cy.get('#suggested-date-start-date-1');
      cy.get('#suggested-date-start-date-2');
    });
  });

});
