/// <reference types="cypress" />
import values from '../fixtures/values.json';

const getBaseHref = (url = '') => {
  return Cypress.expose('baseHref') + url.replace('customerId', Cypress.expose('customerId'));
};
const getApiUrl = (url) => {
  return Cypress.expose('apiUrl') + url.replace('customerId', Cypress.expose('customerId'));
};

context('password-view', () => {
  describe('Main components visible', () => {
    it('Has main components in poll', () => {
      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.appointmentProtectionUrl)
        },
        {
          body: values.appointmentProtection
        }
      ).as('apiCheck');

      cy.visit(getBaseHref(values.inviteLink));
      cy.url().should('include', '/#/password');

      cy.get('#head');
      cy.get('[data-cy=headerTitle]');

      cy.get('[data-cy=adIcons]');
      cy.get('[data-cy=locked]');
      cy.get('[data-cy=enter]');
      cy.get('[data-cy=passwordInput]').should('have.attr', 'type', 'password');

      cy.get('[data-cy=userButton]').should('have.attr', 'aria-disabled', 'true');

      cy.get('[data-cy=footer]');
    });

    it('Has main components in admin', () => {
      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.adminProtectionUrl)
        },
        {
          body: values.adminProtection
        }
      ).as('apiCheck');

      cy.visit(getBaseHref(values.adminLink));
      cy.url().should('include', '/#/password');

      cy.get('[data-cy=adminButton]').should('have.attr', 'aria-disabled', 'true');

      cy.get('[data-cy=footer]');
    });
  });

  describe('Password Input', () => {
    it('Shows message on invalid pw input', () => {
      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.appointmentProtectionUrl)
        },
        {
          body: values.appointmentProtection
        }
      ).as('apiCheckProtection');

      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.appointmentVerificationUrl)
        },
        {
          body: values.appointmentVerificationFail
        }
      ).as('apiCheckVerification');

      cy.visit(getBaseHref(values.inviteLink));

      cy.get('[data-cy=passwordInput]').type('a');

      cy.get('[data-cy=userButton]').click();
      cy.url().should('include', ';invalid=true');
      cy.get('[data-cy=msgInvalid]');

      cy.get('[data-cy=passwordInput]').type('a');
      cy.get('[data-cy=msgInvalid]').should('not.exist');
    });

    it('Shows message on correct pw input', () => {
      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.appointmentProtectionUrl)
        },
        {
          body: values.appointmentProtection
        }
      ).as('apiCheckProtection');

      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.appointmentVerificationUrl)
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

      cy.get('[data-cy=passwordInput]').type(values.password);

      cy.get('[data-cy=userButton]').click();
      cy.url().should('include', '/#/poll');
    });
  });
});
