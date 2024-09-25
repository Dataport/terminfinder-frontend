/// <reference types="cypress" />
import values from '../fixtures/values.json';

const getBaseHref = (url = '') => {
  return Cypress.env('baseHref') + url.replace('customerId', Cypress.env('customerId'));
};
const getApiUrl = (url) => {
  return Cypress.env('apiUrl') + url.replace('customerId', Cypress.env('customerId'));
};

context('home-view', () => {
  describe('Main components visible', () => {
    beforeEach(() => {
      cy.moveToHomeView();
    });

    it('Has main components', () => {
      cy.get('#head');
      cy.get('[data-id=headerTitle]');
      cy.get('[data-id=headerLogo]');
      cy.get('[data-id=adIcons]');
      cy.get('[data-id=createPollSlogan]');
      cy.get('[data-id=createPollLabel]');
      cy.get('[data-id=createPollInput]');
      cy.get('[data-id=tosComponent]');
      cy.get('[data-id=createPollButton]');
      cy.get('[data-id=footer]');
    });
  });

  describe('Show error on localization loading error', () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.getAppUrl),
        },
        ''
      );
      cy.intercept(
        {
          method: 'GET',
          url: 'de-DE-du.json',
        },
        (req) => {
          req.destroy();
        }
      );
      cy.intercept(
        {
          method: 'GET',
          url: 'de-DE-sie.json',
        },
        (req) => {
          req.destroy();
        }
      );
      cy.intercept(
        {
          method: 'GET',
          url: 'en-EN.json',
        },
        (req) => {
          req.destroy();
        }
      );

      cy.visit(getBaseHref());
      cy.url().should('include', '/#/home');
    });

    it('Error message shown', () => {
      cy.get('[data-cy=connectionErrorNotification]');
    });
  });

  describe('Form is working', () => {
    beforeEach(() => {
      cy.moveToHomeView();
    });

    it('Shows error messages on wrong input title', () => {
      cy.get('[data-id=msgRequiredTitle]').should('not.exist');
      cy.get('[data-id=msgInvalidTitle]').should('not.exist');
      cy.get('[data-id=msgLongTitle]').should('not.exist');

      cy.get('[data-id=createPollInput]')
        .type('❌');
      cy.get('[data-id=msgInvalidTitle]');

      cy.get('[data-id=createPollInput]')
        .clear();
      cy.get('[data-id=msgRequiredTitle]');

      cy.get('[data-id=createPollInput]')
        .type(values.tooLongString);
      cy.get('[data-id=msgLongTitle]');
    });

    it('Fills out form correctly an navigates to next page', () => {
      cy.get('[data-id=createPollButton]')
        .should('have.attr', 'aria-disabled', 'true');

      cy.get('[data-id=createPollInput]')
        .type('Test-Titel');
      cy.get('[data-id=createPollInput]')
        .should('have.value', 'Test-Titel');

      cy.get('[data-id=createPollButton]')
        .should('have.attr', 'aria-disabled', 'true');

      cy.get('[data-id=checkbox]')
        .click();

      cy.get('[data-id=createPollButton]')
        .click();

      cy.location('href')
        .should('include', '/#/create');
    });
  });

  describe('Api calls', () => {
    it('Calls api/app on page load and removes apiErrorComponent', () => {
      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.getAppUrl),
        },
        {
          body: values.getApp
        }
      ).as('apiAppCheck_noError');

      cy.moveToHomeView();
      cy.wait('@apiAppCheck_noError').then((interception) => {
        assert.equal(interception.request.method, 'GET');
      });
      cy.url().should('include', '/#/home');
    });

    it('Calls api/app on page load and shows apiErrorComponent on incorrect response', () => {
      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.getAppUrl),
        },
        ''
      ).as('apiAppCheck_error');

      cy.moveToHomeView();
      cy.wait('@apiAppCheck_error').then((interception) => {
        assert.equal(interception.request.method, 'GET');
      });
      cy.url().should('include', '/#/home');

      cy.get('[data-id=apiErrorComponent]');
    });
  });
});


