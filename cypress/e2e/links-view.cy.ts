/// <reference types="cypress" />
import values from '../fixtures/values.json';

context('links-view', () => {
  beforeEach(() => {
    cy.moveToLinksView();
  });

  describe('Main components visible', () => {
    it('Has main components', () => {
      cy.get('#head');
      cy.get('[data-id=headerTitle]');
      cy.get('[data-id=linksHeading]');
      cy.get('[data-id=appointmentTitle]');

      cy.get('[data-id=inviteLinkDescription]');
      cy.get('[data-id=inviteLinkWarning]');
      cy.get('[data-id=inviteLinkEmail]');
      cy.get('[data-id=linkAdmin]');
      cy.get('[data-id=inviteLink]');
      cy.get('[data-id=inviteLinkCopy]');
      cy.get('[data-id=inviteLinkNavigate]');

      cy.get('[data-id=adminLinkDescription]');
      cy.get('[data-id=adminLinkWarning]');
      cy.get('[data-id=adminLink]');
      cy.get('[data-id=adminLinkCopy]');
      cy.get('[data-id=adminLinkNavigate]');

      cy.get('[data-id=newAppointmentButton]').should('be.enabled');
      cy.get('[data-id=footer]');
    });
  });

  describe('Links are correct', () => {
    it('Shows correct links', () => {
      cy.get('[data-id=inviteLink]').should('contain', values.inviteLink);

      cy.get('[data-id=adminLink]').should('contain', values.adminLink);
    });
  });

  describe('Navigation to new appointment works', () => {
    it('Navigates on click of new appointment button', () => {
      cy.get('[data-id=newAppointmentButton]').click();
      cy.url().should('include', '/#/home');
    });
  });
});
