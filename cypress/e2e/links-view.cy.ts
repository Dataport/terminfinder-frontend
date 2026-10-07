/// <reference types="cypress" />
import values from '../fixtures/values.json';

context('links-view', () => {
  beforeEach(() => {
    cy.moveToLinksView();
  });

  describe('Main components visible', () => {
    it('Has main components', () => {
      cy.get('#head');
      cy.get('[data-cy=headerTitle]');
      cy.get('[data-cy=linksHeading]');
      cy.get('[data-cy=appointmentTitle]');

      cy.get('[data-cy=inviteLinkDescription]');
      cy.get('[data-cy=inviteLinkWarning]');
      cy.get('[data-cy=inviteLinkEmail]');
      cy.get('[data-cy=linkAdmin]');
      cy.get('[data-cy=inviteLink]');
      cy.get('[data-cy=inviteLinkCopy]');
      cy.get('[data-cy=inviteLinkNavigate]');

      cy.get('[data-cy=adminLinkDescription]');
      cy.get('[data-cy=adminLinkWarning]');
      cy.get('[data-cy=adminLink]');
      cy.get('[data-cy=adminLinkCopy]');
      cy.get('[data-cy=adminLinkNavigate]');

      cy.get('[data-cy=newAppointmentButton]').should('be.enabled');
      cy.get('[data-cy=footer]');
    });
  });

  describe('Links are correct', () => {
    it('Shows correct links', () => {
      cy.get('[data-cy=inviteLink]').should('contain', values.inviteLink);

      cy.get('[data-cy=adminLink]').should('contain', values.adminLink);
    });
  });

  describe('Navigation to new appointment works', () => {
    it('Navigates on click of new appointment button', () => {
      cy.get('[data-cy=newAppointmentButton]').click();
      cy.url().should('include', '/#/home');
    });
  });
});
