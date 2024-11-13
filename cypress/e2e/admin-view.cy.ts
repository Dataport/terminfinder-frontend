/// <reference types="cypress" />
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import values from '../fixtures/values.json';

dayjs.extend(utc);

const getBaseHref = (url = '') => {
  return Cypress.env('baseHref') + url.replace('customerId', Cypress.env('customerId'));
};
const getApiUrl = (url) => {
  return Cypress.env('apiUrl') + url.replace('customerId', Cypress.env('customerId'));
};

context('admin-view', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: getApiUrl(values.adminProtectionUrl),
      },
      {
        body: values.adminProtectionFalse
      }
    );

    cy.intercept(
      {
        method: 'GET',
        url: getApiUrl(values.getAdminUrl)
      },
      {
        headers: {
          'content-type': 'application/terminfinder.api-v1+json'
        },
        body: values.getAdmin
      }
    );

    cy.visit(getBaseHref(values.adminLink));
    cy.location('href').should('include', '/#/admin/');
  });

  describe('Main components visible', () => {
    it('Shows main components', () => {
      cy.get('#head');
      cy.get('[data-id=headerTitle]');
      cy.get('[data-id=adminHeading]');

      cy.get('[data-cy=overviewUrlLabel]');
      cy.get('[data-cy=overviewUrlValue]');
      cy.get('[data-cy=overviewNameLabel]');
      cy.get('[data-cy=overviewNameValue]');
      cy.get('[data-cy=overviewTitleLabel]');
      cy.get('[data-cy=overviewTitleValue]');
      cy.get('[data-cy=overviewPlaceLabel]');
      cy.get('[data-cy=overviewPlaceValue]');
      cy.get('[data-cy=overviewDescriptionLabel]');
      cy.get('[data-cy=overviewDescriptionValue]');
      cy.get('[data-cy=overviewDeleteLabel]');
      cy.get('[data-cy=overviewDeleteValue]');

      cy.get('[data-id=overviewDates]');
      cy.get('[data-id=statusPollButton]');
      cy.get('[data-id=pauseText]');
      cy.get('[data-id=continueEverytime]');

      cy.get('[data-id=changePollLink]');
      cy.get('[data-id=changePollText]');
      cy.get('[data-id=changeDetails]');

      cy.get('[data-id=footer]');
    });
  });

  describe('Pause and Continue', () => {
    it('Pause button sends correct api request', () => {
      cy.intercept(
        {
          method: 'PUT',
          url: getApiUrl(values.putAdminStatusPausedUrl)
        },
        {
          headers: {
            'content-type': 'application/terminfinder.api-v1+json'
          },
          body: values.putAdminStatusPaused
        }
      ).as('apiPutPause');

      cy.get('[data-id=statusPollButton]')
        .click();
      cy.wait('@apiPutPause');
      cy.get('[data-id=pauseText]')
        .should('not.exist');
      cy.get('[data-id=continueText]');


      cy.intercept(
        {
          method: 'PUT',
          url: getApiUrl(values.putAdminStatusStartedUrl)
        },
        {
          headers: {
            'content-type': 'application/terminfinder.api-v1+json'
          },
          body: values.putAdminStatusStarted
        }
      ).as('apiPutStarted');
      cy.get('[data-id=statusPollButton]')
        .click();
      cy.wait('@apiPutStarted');
      cy.get('[data-id=continueText]')
        .should('not.exist');
      cy.get('[data-id=pauseText]');
    });
  });

  describe('Change appointment', () => {
    it('All changes in admin view', () => {
      cy.intercept(
        {
          method: 'DELETE',
          url: getApiUrl(values.deleteSuggestedDateUrl)
        },
        {
          headers: {
            'content-type': 'application/terminfinder.api-v1+json'
          },
          body: values.getAdmin
        }
      ).as('apiDeleteSuggestedDate');

      cy.intercept(
        {
          method: 'PUT',
          url: getApiUrl(values.postCreateAppointmentUrl),
        },
        {
          statusCode: 200,
          body: values.postCreateAppointment
        }
      ).as('apiPutCreateAppointment');

      cy.get('[data-id=changePollLink]')
        .click();

      cy.get('[data-id=adminCreateAppoint]');
      cy.location('href')
        .should('include', '/#/poll-admin');
      cy.get('[data-id=next]')
        .click();

      cy.get('[data-id=adminSuggestedDates]');
      cy.location('href')
        .should('include', '/#/admin/dates');
      cy.get('#removeDate-0')
        .click();
      cy.get('[data-id=addSuggestedDateButton]')
        .click();
      cy.get('[data-id=startDateInput]')
        .type(dayjs().add(1, 'd').format('DD.MM.YYYY'));
      cy.get('[data-id=startDateInput]')
        .should('have.value', dayjs().add(1, 'd').format('DD.MM.YYYY'));
      cy.get('[data-id=next]')
        .click();

      cy.get('[data-id=adminSettings]');
      cy.location('href')
        .should('include', '/#/admin/settings');
      cy.get('[data-id=checkbox]')
        .click();
      cy.get('[data-id=passwordInput]')
        .type('Hallo2021!');
      cy.get('[data-id=passwordInput]')
        .should('have.value', 'Hallo2021!');
      cy.get('[data-id=repeatPasswordInput]')
        .type('Hallo2021!');
      cy.get('[data-id=next]')
        .click();

      cy.get('[data-id=adminOverview]');
      cy.location('href')
        .should('include', '/#/admin/overview');
      cy.get('[data-id=headerTitle]');

      cy.get('[data-id=next]')
        .click();
      cy.wait('@apiDeleteSuggestedDate');
      cy.wait('@apiPutCreateAppointment');

      cy.get('[data-id=adminLinks]');
      cy.location('href')
        .should('include', '/#/admin/links');
    });
  });
});
