/// <reference types="cypress" />
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import values from '../fixtures/values.json';

dayjs.extend(utc);

const getBaseHref = (url = '') => {
  return Cypress.expose('baseHref') + url.replace('customerId', Cypress.expose('customerId'));
};
const getApiUrl = (url) => {
  return Cypress.expose('apiUrl') + url.replace('customerId', Cypress.expose('customerId'));
};

function moveToHomeView() {
  cy.visit(getBaseHref());
  cy.url().should('include', '/#/home');
}

function moveToCreateView() {
  moveToHomeView();

  cy.get('[data-cy=createPollInput]').type('Test-Titel');
  cy.get('[data-cy=checkbox]').click();
  cy.get('[data-cy=createPollButton]').click();

  cy.location('href').should('include', '/#/create');
}

function moveToSelectDatesView() {
  moveToCreateView();

  cy.get('[data-cy=nameInput]').type('Test-Name');

  cy.get('[data-cy=locationInput]').type('Test-Ort');

  cy.get('[data-cy=descriptionInput]').type('Test-Beschreibung\nNeue Zeile 1\n\nNeue Zeile 2');

  cy.get('[data-cy=next]').click();

  cy.location('href').should('include', '/#/dates');
}

function moveToSettingsView() {
  moveToSelectDatesView();

  cy.get('[data-cy=startDateInput]').type(dayjs().add(1, 'd').format('YYYY-MM-DD'));
  cy.get('[data-cy=startDateInput]').should('have.value', dayjs().add(1, 'd').format('YYYY-MM-DD'));

  cy.get('[data-cy=addTimesButton]').click();

  cy.get('[data-cy=startTimeInput]').type('10:00');

  cy.get('[data-cy=endAtOtherDayButton]').click();

  cy.get('[data-cy=endDateInput]').type(dayjs().add(2, 'd').format('YYYY-MM-DD'));
  cy.get('[data-cy=endDateInput]').should('have.value', dayjs().add(2, 'd').format('YYYY-MM-DD'));

  cy.get('[data-cy=endTimeInputSecondColumn]').type('12:00');

  cy.get('[data-cy=next]').click();

  cy.location('href').should('include', '/#/settings');
}

function moveToOverviewView() {
  moveToSettingsView();

  cy.get('[data-cy=checkbox]').click();

  cy.get('[data-cy=passwordInput]').click();

  cy.get('[data-cy=passwordInput]').type('Hallo2021!');
  cy.get('[data-cy=passwordInput]').should('have.value', 'Hallo2021!');

  cy.get('[data-cy=repeatPasswordInput]').type('Hallo2021!');
  cy.get('[data-cy=repeatPasswordInput]').should('have.value', 'Hallo2021!');

  cy.get('[data-cy=next]').click();

  cy.location('href').should('include', '/#/overview');
}

function moveToLinksView() {
  moveToOverviewView();
  cy.intercept(
    {
      method: 'POST',
      url: getApiUrl(values.postCreateAppointmentUrl)
    },
    {
      statusCode: 201,
      body: values.postCreateAppointment
    }
  );

  cy.get('[data-cy=next]').click();
  cy.url().should('include', '/#/links');
}

Cypress.Commands.add('moveToHomeView', () => {
  moveToHomeView();
});

Cypress.Commands.add('moveToCreateView', () => {
  moveToCreateView();
});

Cypress.Commands.add('moveToSelectDatesView', () => {
  moveToSelectDatesView();
});

Cypress.Commands.add('moveToSettingsView', () => {
  moveToSettingsView();
});

Cypress.Commands.add('moveToOverviewView', () => {
  moveToOverviewView();
});

Cypress.Commands.add('moveToLinksView', () => {
  moveToLinksView();
});
