/// <reference types="cypress" />

context('settings-view', () => {
  beforeEach(() => {
    cy.moveToSettingsView();
  });

  describe('Main components visible', () => {
    it('Has main components', () => {
      cy.get('#head');
      cy.get('[data-id=headerTitle]');
      cy.get('[data-id=stepperComponent]');
      cy.get('[data-id=addDetailsHeading]');

      cy.get('[data-id=generatePassword]');
      cy.get('[data-id=securePollLabel]');
      cy.get('[data-id=checkbox]');

      cy.get('[data-id=back]')
        .should('be.enabled');
      cy.get('[data-id=next]')
        .should('be.enabled');
      cy.get('[data-id=footer]');
    });
  });

  describe('Password Form is working', () => {
    it('Checkbox works correctly', () => {
      cy.get('[data-id=next]').should('be.enabled');
      cy.get('[data-id=checkbox]').click();
      cy.get('[data-id=next]').should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-id=checkbox]').click();
      cy.get('[data-id=next]').should('be.enabled');
    });

    it('Shows errors on wrong input', () => {
      cy.get('[data-id=checkbox]').click();

      cy.get('[data-id=passwordInput]')
        .click();
      cy.get('[data-id=next]').should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-id=repeatPasswordInput]').click();
      cy.get('[data-id=errorMsgSetPassword]');
      cy.get('[data-id=next]').should('have.attr', 'aria-disabled', 'true');

      cy.get('[data-id=passwordInput]')
        .type('a');
      cy.get('[data-id=passwordInput]')
        .should('have.value', 'a');
      cy.get('[data-id=next]').should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-id=repeatPasswordInput]').click();
      cy.get('[data-id=errorMsgSetMinimum]');
      cy.get('[data-id=next]').should('have.attr', 'aria-disabled', 'true');

      cy.get('[data-id=passwordInput]')
        .clear();
      cy.get('[data-id=passwordInput]')
        .type('Hallo2021!');
      cy.get('[data-id=passwordInput]')
        .should('have.value', 'Hallo2021!');
      cy.get('[data-id=next]').should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-id=repeatPasswordInput]').click();
      cy.get('[data-id=next]').should('have.attr', 'aria-disabled', 'true');

      cy.get('[data-id=repeatPasswordInput]')
        .type('a');
      cy.get('[data-id=errorMsgNoMatch]');
      cy.get('[data-id=next]').should('have.attr', 'aria-disabled', 'true');

      cy.get('[data-id=repeatPasswordInput]')
        .clear();
      cy.get('[data-id=repeatPasswordInput]')
        .type('Hallo2021!');
      cy.get('[data-id=repeatPasswordInput]')
        .should('have.value', 'Hallo2021!');
      cy.get('[data-id=errorMsgNoMatch]').should('not.exist');
      cy.get('[data-id=next]').should('be.enabled');
    });
  });
});
