/// <reference types="cypress" />
import values from '../fixtures/values.json';

const getApiUrl = (url) => {
  return Cypress.env('apiUrl') + url.replace('customerId', Cypress.env('customerId'));
};

context('overview-view', () => {
  beforeEach(() => {
    cy.moveToOverviewView();
  });

  describe('Main components visible', () => {
    it('Has main components', () => {
      cy.get('#head');
      cy.get('[data-id=headerTitle]');
      cy.get('[data-id=stepperComponent]');
      cy.get('[data-id=overviewHeading]');

      cy.get('[data-id=overviewNameLabel]');
      cy.get('[data-id=overviewNameValue]');
      cy.get('[data-id=overviewTitleLabel]');
      cy.get('[data-id=overviewTitleValue]')
        .should("contain.html", "Test-Titel");
      cy.get('[data-id=overviewPlaceLabel]');
      cy.get('[data-id=overviewPlaceValue]')
        .should("contain.html", "Test-Ort");
      cy.get('[data-id=overviewDescriptionLabel]');
      cy.get('[data-id=overviewDescriptionValue]')
        .should("contain.html", "Test-Beschreibung<br>Neue Zeile 1<br><br>Neue Zeile 2");
      cy.get('[data-id=overviewDatesDesktop]');

      cy.get('[data-id=back]')
        .should('be.enabled');
      cy.get('[data-id=next]')
        .should('be.enabled');
      cy.get('[data-id=footer]');
    });
  });

  describe('Api call works', () => {
    it('Sends api call, shows error on empty response body', () => {
      cy.intercept(
        {
          method: 'POST',
          url: getApiUrl(values.postCreateAppointmentUrl),
        },
        ''
      ).as('apiCheck');

      cy.get('[data-id=next]')
        .click();
      cy.url().should('include', '/#/overview');
      cy.get('[data-id=errorMessageBox]');
    });

    it('Sends api call, shows error on wrong response status code', () => {
      cy.intercept(
        {
          method: 'POST',
          url: getApiUrl(values.postCreateAppointmentUrl),
        },
        {
          statusCode: 200,
          body: values.postCreateAppointment
        }
      ).as('apiCheck');

      cy.get('[data-id=next]')
        .click();
      cy.wait('@apiCheck');
      cy.url().should('include', '/#/overview');
      cy.get('[data-id=errorMessageBox]');
    });

    it('Sends api call, shows links on correct answer', () => {
      cy.intercept(
        {
          method: 'POST',
          url: getApiUrl(values.postCreateAppointmentUrl),
        },
        {
          statusCode: 201,
          body: values.postCreateAppointment
        }
      ).as('apiCheck');

      cy.get('[data-id=next]')
        .click();
      cy.wait('@apiCheck');
      cy.url().should('include', '/#/links');
    });
  });
});
