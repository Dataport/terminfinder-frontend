/// <reference types="cypress" />
import values from '../fixtures/values.json';

const getBaseHref = (url = '') => {
  return Cypress.expose('baseHref') + url.replace('customerId', Cypress.expose('customerId'));
};
const getApiUrl = (url) => {
  return Cypress.expose('apiUrl') + url.replace('customerId', Cypress.expose('customerId'));
};

context('home-view', () => {
  describe('Main components visible', () => {
    beforeEach(() => {
      cy.moveToHomeView();
    });

    it('Has main components', () => {
      cy.get('#head');
      cy.get('[data-cy=headerTitle]');
      cy.get('[data-cy=headerLogo]');
      cy.get('[data-cy=adIcons]');
      cy.get('[data-cy=createPollSlogan]');
      cy.get('[data-cy=createPollLabel]');
      cy.get('[data-cy=createPollInput]');
      cy.get('[data-cy=tosComponent]');
      cy.get('[data-cy=createPollButton]');
      cy.get('[data-cy=footer]');
    });
  });

  describe('Show error on localization loading error', () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.getAppUrl)
        },
        ''
      );
      cy.intercept(
        {
          method: 'GET',
          url: 'de-DE-du.json'
        },
        (req) => {
          req.destroy();
        }
      );
      cy.intercept(
        {
          method: 'GET',
          url: 'de-DE-sie.json'
        },
        (req) => {
          req.destroy();
        }
      );
      cy.intercept(
        {
          method: 'GET',
          url: 'en-EN.json'
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
      cy.get('[data-cy=msgRequiredTitle]').should('not.exist');
      cy.get('[data-cy=msgInvalidTitle]').should('not.exist');
      cy.get('[data-cy=msgLongTitle]').should('not.exist');

      cy.get('[data-cy=createPollInput]').type('❌');
      cy.get('[data-cy=msgInvalidTitle]');

      cy.get('[data-cy=createPollInput]').clear();
      cy.get('[data-cy=msgRequiredTitle]');

      cy.get('[data-cy=createPollInput]').type(values.tooLongString);
      cy.get('[data-cy=msgLongTitle]');
    });

    it('Fills out form correctly an navigates to next page', () => {
      cy.get('[data-cy=createPollButton]').should('have.attr', 'aria-disabled', 'true');

      cy.get('[data-cy=createPollInput]').type('Test-Titel');
      cy.get('[data-cy=createPollInput]').should('have.value', 'Test-Titel');

      cy.get('[data-cy=createPollButton]').should('have.attr', 'aria-disabled', 'true');

      cy.get('[data-cy=checkbox]').click();

      cy.get('[data-cy=createPollButton]').click();

      cy.location('href').should('include', '/#/create');
    });
  });

  describe('Api calls', () => {
    it('Calls api/app on page load and removes apiErrorComponent', () => {
      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.getAppUrl)
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
          url: getApiUrl(values.getAppUrl)
        },
        ''
      ).as('apiAppCheck_error');

      cy.moveToHomeView();
      cy.wait('@apiAppCheck_error').then((interception) => {
        assert.equal(interception.request.method, 'GET');
      });
      cy.url().should('include', '/#/home');

      cy.get('[data-cy=apiErrorComponent]');
    });
  });
});
