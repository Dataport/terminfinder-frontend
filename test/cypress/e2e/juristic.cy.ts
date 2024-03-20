/// <reference types="cypress" />
import values from '../fixtures/values.json';

const getApiUrl = (url) => {
  return Cypress.env('apiUrl') + url.replace('customerId', Cypress.env('customerId'));
};

context('juristic', () => {
  describe('Juristic links visible from home view', () => {
    beforeEach(() => {
      cy.moveToHomeView();
    });

    it('Has juristic links', () => {
      cy.get('[data-cy=imprintLink]');
      cy.get('[data-cy=accessibilityLink]');
      cy.get('[data-cy=privacyLink]');
      cy.get('[data-cy=tosLink]');
      cy.get('[data-cy=tosPrivacyLink]');
    });
  });

  describe('Juristic sites are working', () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.getAppUrl),
        },
        ''
      );

      cy.moveToHomeView();
    });

    it('Imprint is working', () => {
      cy.get('[data-cy=imprintLink]')
        .click();
      cy.url().should('include', '/#/imprint');

      cy.get('[data-cy=imprintHeadline]');
      cy.get('[data-cy=content]')
        .should('not.have.html', '');

      cy.get('[data-cy=backBtn]').click();
      cy.url().should('include', '/#/home');
    });

    it('Accessibility is working', () => {
      cy.get('[data-cy=accessibilityLink]')
        .click();
      cy.url().should('include', '/#/accessibility');

      cy.get('[data-cy=content]')
        .should('not.have.html', '');

      cy.get('[data-cy=backBtn]')
        .click();
      cy.url().should('include', '/#/home');
    });

    it('Privacy is working', () => {
      cy.get('[data-cy=privacyLink]')
        .click();
      cy.url().should('include', '/#/privacy');

      cy.get('[data-cy=content]')
        .should('not.have.html', '');

      cy.get('[data-cy=backBtn]')
        .click();
      cy.url().should('include', '/#/home');
    });

    it('TOS Privacy is working', () => {
      cy.get('[data-cy=tosPrivacyLink]')
        .click();
      cy.url().should('include', '/#/privacy');

      cy.get('[data-cy=content]')
        .should('not.have.html', '');

      cy.get('[data-cy=backBtn]')
        .click();
      cy.url().should('include', '/#/home');
    });

    it('TOS is working', () => {
      cy.get('[data-cy=tosLink]')
        .click();
      cy.url().should('include', '/#/termsOfService');

      cy.get('[data-cy=content]')
        .should('not.have.html', '');

      cy.get('[data-cy=backBtn]')
        .click();
      cy.url().should('include', '/#/home');
    });
  });
});


