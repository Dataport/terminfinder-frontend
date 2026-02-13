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

  cy.get('[data-id=createPollInput]').type('Test-Titel');
  cy.get('[data-id=checkbox]').click();
  cy.get('[data-id=createPollButton]').click();

  cy.location('href').should('include', '/#/create');
}

function moveToSelectDatesView() {
  moveToCreateView();

  cy.get('[data-id=nameInput]').type('Test-Name');

  cy.get('[data-id=locationInput]').type('Test-Ort');

  cy.get('[data-id=descriptionInput]').type('Test-Beschreibung\nNeue Zeile 1\n\nNeue Zeile 2');

  cy.get('[data-id=next]').click();

  cy.location('href').should('include', '/#/dates');
}

function moveToSettingsView() {
  moveToSelectDatesView();

  cy.get('[data-id=startDateInput]').type(dayjs().add(1, 'd').format('YYYY-MM-DD'));
  cy.get('[data-id=startDateInput]').should('have.value', dayjs().add(1, 'd').format('YYYY-MM-DD'));

  cy.get('[data-id=addTimesButton]').click();

  cy.get('[data-id=startTimeInput]').type('10:00');

  cy.get('[data-id=endAtOtherDayButton]').click();

  cy.get('[data-id=endDateInput]').type(dayjs().add(2, 'd').format('YYYY-MM-DD'));
  cy.get('[data-id=endDateInput]').should('have.value', dayjs().add(2, 'd').format('YYYY-MM-DD'));

  cy.get('[data-id=endTimeInputSecondColumn]').type('12:00');

  cy.get('[data-id=next]').click();

  cy.location('href').should('include', '/#/settings');
}

function moveToOverviewView() {
  moveToSettingsView();

  cy.get('[data-id=checkbox]').click();

  cy.get('[data-id=passwordInput]').click();

  cy.get('[data-id=passwordInput]').type('Hallo2021!');
  cy.get('[data-id=passwordInput]').should('have.value', 'Hallo2021!');

  cy.get('[data-id=repeatPasswordInput]').type('Hallo2021!');
  cy.get('[data-id=repeatPasswordInput]').should('have.value', 'Hallo2021!');

  cy.get('[data-id=next]').click();

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

  cy.get('[data-id=next]').click();
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
