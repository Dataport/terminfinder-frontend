/// <reference types="cypress" />
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import values from '../fixtures/values.json';

dayjs.extend(utc);

const getBaseHref = (url = '') => {
  return Cypress.expose('baseHref') + url.replace('customerId', Cypress.expose('customerId'));
};
const getApiUrl = (url) => {
  return Cypress.expose('apiUrl') + url.replace('customerId', Cypress.expose('customerId'));
};

context('admin-view', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: getApiUrl(values.adminProtectionUrl)
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
  });

  describe('Main components visible', () => {
    beforeEach(() => {
      cy.visit(getBaseHref(values.adminLink));
      cy.location('href').should('include', '/#/admin/');
    });

    it('Shows main components', () => {
      cy.get('#head');
      cy.get('[data-cy=headerTitle]');
      cy.get('[data-cy=adminHeading]');

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

      cy.get('[data-cy=overviewDates]');
      cy.get('[data-cy=statusPollButton]');
      cy.get('[data-cy=pauseText]');
      cy.get('[data-cy=continueEverytime]');

      cy.get('[data-cy=changePollLink]');
      cy.get('[data-cy=changePollText]');
      cy.get('[data-cy=changeDetails]');

      cy.get('[data-cy=footer]');
    });
  });

  describe('Pause and Continue', () => {
    beforeEach(() => {
      cy.visit(getBaseHref(values.adminLink));
      cy.location('href').should('include', '/#/admin/');
    });

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

      cy.get('[data-cy=statusPollButton]').click();
      cy.wait('@apiPutPause');
      cy.get('[data-cy=pauseText]').should('not.exist');
      cy.get('[data-cy=continueText]');

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
      cy.get('[data-cy=statusPollButton]').click();
      cy.wait('@apiPutStarted');
      cy.get('[data-cy=continueText]').should('not.exist');
      cy.get('[data-cy=pauseText]');
    });
  });

  describe('Change appointment', () => {
    beforeEach(() => {
      cy.visit(getBaseHref(values.adminLink));
      cy.location('href').should('include', '/#/admin/');
    });

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
          url: getApiUrl(values.postCreateAppointmentUrl)
        },
        {
          statusCode: 200,
          body: values.postCreateAppointment
        }
      ).as('apiPutCreateAppointment');

      cy.get('[data-cy=changePollLink]').click();

      cy.get('[data-cy=adminCreateAppoint]');
      cy.location('href').should('include', '/#/poll-admin');
      cy.get('[data-cy=next]').click();

      cy.get('[data-cy=adminSuggestedDates]');
      cy.location('href').should('include', '/#/admin/dates');
      cy.get('#removeDate-0').click();
      cy.get('#suggested-date-start-date-0').type(dayjs().add(2, 'd').format('YYYY-MM-DD'));
      cy.get('[data-cy=addSuggestedDateButton]').click();
      cy.get('#suggested-date-start-date-1').type(dayjs().add(1, 'd').format('YYYY-MM-DD'));
      cy.get('#suggested-date-start-date-1').should('have.value', dayjs().add(1, 'd').format('YYYY-MM-DD'));
      cy.get('[data-cy=next]').click();

      cy.get('[data-cy=adminSettings]');
      cy.location('href').should('include', '/#/admin/settings');
      cy.get('[data-cy=checkbox]').click();
      cy.get('[data-cy=passwordInput]').type('Hallo2021!');
      cy.get('[data-cy=passwordInput]').should('have.value', 'Hallo2021!');
      cy.get('[data-cy=repeatPasswordInput]').type('Hallo2021!');
      cy.get('[data-cy=next]').click();

      cy.get('[data-cy=adminOverview]');
      cy.location('href').should('include', '/#/admin/overview');
      cy.get('[data-cy=headerTitle]');

      cy.get('[data-cy=next]').click();
      cy.wait('@apiDeleteSuggestedDate');
      cy.wait('@apiPutCreateAppointment');

      cy.get('[data-cy=adminLinks]');
      cy.location('href').should('include', '/#/admin/links');
    });
  });

  describe('API error visible', () => {
    const cases = [
      { status: 404, text: 'Die angeforderte Ressource existiert nicht (mehr)' },
      { status: 500, text: 'Es ist ein interner Serverfehler bei der API aufgetreten' },
      { status: 503, text: "Die API hat den unerwarteten Statuscode '503' zurückgegeben" }
    ];

    cases.forEach(({ status, text }) => {
      it(String(status), () => {
        cy.intercept(
          { method: 'GET', url: getApiUrl(values.getAdminUrl) },
          { headers: { 'content-type': 'application/terminfinder.api-v1+json' }, statusCode: status }
        ).as('apiError');

        cy.visit(getBaseHref(values.adminLink));
        cy.wait('@apiError');

        cy.get('[data-cy=messageBox]').should('be.visible').and('contain.text', text);
        cy.get('[data-cy=statusPollButton]').should('not.exist');
      });
    });
  });
});
