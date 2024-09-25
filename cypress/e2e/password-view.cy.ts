/// <reference types="cypress" />
import values from '../fixtures/values.json';

const getBaseHref = (url = '') => {
  return Cypress.env('baseHref') + url.replace('customerId', Cypress.env('customerId'));
};
const getApiUrl = (url) => {
  return Cypress.env('apiUrl') + url.replace('customerId', Cypress.env('customerId'));
};

context('password-view', () => {

  describe('Main components visible', () => {
    it('Has main components in poll', () => {
      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.appointmentProtectionUrl),
        },
        {
          body: values.appointmentProtection
        }
      ).as('apiCheck');

      cy.visit(getBaseHref(values.inviteLink));
      cy.url().should('include', '/#/password');

      cy.get('#head');
      cy.get('[data-id=headerTitle]');

      cy.get('[data-id=adIcons]');
      cy.get('[data-id=locked]');
      cy.get('[data-id=enter]');
      cy.get('[data-id=passwordInput]')
        .should('have.attr', 'type', 'password');

      cy.get('[data-id=userButton]')
        .should('have.attr', 'aria-disabled', 'true');

      cy.get('[data-id=footer]');
    });

    it('Has main components in admin', () => {
      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.adminProtectionUrl),
        },
        {
          body: values.adminProtection
        }
      ).as('apiCheck');

      cy.visit(getBaseHref(values.adminLink));
      cy.url().should('include', '/#/password');

      cy.get('[data-id=adminButton]')
        .should('have.attr', 'aria-disabled', 'true');

      cy.get('[data-id=footer]');
    });
  });

  describe('Password Input', () => {
    it('Shows message on invalid pw input', () => {
      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.appointmentProtectionUrl),
        },
        {
          body: values.appointmentProtection
        }
      ).as('apiCheckProtection');

      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.appointmentVerificationUrl),
        },
        {
          body: values.appointmentVerificationFail
        }
      ).as('apiCheckVerification');

      cy.visit(getBaseHref(values.inviteLink));

      cy.get('[data-id=passwordInput]')
        .type('a');

      cy.get('[data-id=userButton]')
        .click();
      cy.url().should('include', ';invalid=true');
      cy.get('[data-id=msgInvalid]');

      cy.get('[data-id=passwordInput]')
        .type('a');
      cy.get('[data-id=msgInvalid]')
        .should('not.exist');
    });

    it('Shows message on correct pw input', () => {
      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.appointmentProtectionUrl),
        },
        {
          body: values.appointmentProtection
        }
      ).as('apiCheckProtection');

      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.appointmentVerificationUrl),
        },
        {
          headers: {
            'content-type': 'application/terminfinder.api-v1+json'
          },
          body: values.appointmentVerificationSuccess
        }
      ).as('apiCheckVerification');

      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.getAppointmentUrl)
        },
        {
          headers: {
            'content-type': 'application/terminfinder.api-v1+json'
          },
          body: values.getAppointment
        }
      ).as('apiCheckAppointment');

      cy.visit(getBaseHref(values.inviteLink));

      cy.get('[data-id=passwordInput]')
        .type(values.password);

      cy.get('[data-id=userButton]')
        .click();
      cy.url().should('include', '/#/poll');
    });
  });
});

