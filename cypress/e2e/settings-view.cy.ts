/// <reference types="cypress" />

context('settings-view', () => {
  beforeEach(() => {
    cy.moveToSettingsView();
  });

  describe('Main components visible', () => {
    it('Has main components', () => {
      cy.get('#head');
      cy.get('[data-cy=headerTitle]');
      cy.get('[data-cy=stepperComponent]');
      cy.get('[data-cy=settingsAdditionalHeading]');

      cy.get('[data-cy=generatePassword]');
      cy.get('[data-cy=securePollLabel]');
      cy.get('[data-cy=checkbox]');

      cy.get('[data-cy=back]').should('be.enabled');
      cy.get('[data-cy=next]').should('be.enabled');
      cy.get('[data-cy=footer]');
    });
  });

  describe('Password Form is working', () => {
    it('Checkbox works correctly', () => {
      cy.get('[data-cy=next]').should('be.enabled');
      cy.get('[data-cy=checkbox]').click();
      cy.get('[data-cy=next]').should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-cy=checkbox]').click();
      cy.get('[data-cy=next]').should('be.enabled');
    });

    it('Shows errors on wrong input', () => {
      cy.get('[data-cy=checkbox]').click();

      cy.get('[data-cy=passwordInput]').click();
      cy.get('[data-cy=next]').should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-cy=repeatPasswordInput]').click();
      cy.get('[data-cy=errorMsgSetPassword]');
      cy.get('[data-cy=next]').should('have.attr', 'aria-disabled', 'true');

      cy.get('[data-cy=passwordInput]').type('a');
      cy.get('[data-cy=passwordInput]').should('have.value', 'a');
      cy.get('[data-cy=next]').should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-cy=repeatPasswordInput]').click();
      cy.get('[data-cy=errorMsgSetMinimum]');
      cy.get('[data-cy=next]').should('have.attr', 'aria-disabled', 'true');

      cy.get('[data-cy=passwordInput]').clear();
      cy.get('[data-cy=passwordInput]').type('Hallo2021!');
      cy.get('[data-cy=passwordInput]').should('have.value', 'Hallo2021!');
      cy.get('[data-cy=next]').should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-cy=repeatPasswordInput]').click();
      cy.get('[data-cy=next]').should('have.attr', 'aria-disabled', 'true');

      cy.get('[data-cy=repeatPasswordInput]').type('a');
      cy.get('[data-cy=errorMsgNoMatch]');
      cy.get('[data-cy=next]').should('have.attr', 'aria-disabled', 'true');

      cy.get('[data-cy=repeatPasswordInput]').clear();
      cy.get('[data-cy=repeatPasswordInput]').type('Hallo2021!');
      cy.get('[data-cy=repeatPasswordInput]').should('have.value', 'Hallo2021!');
      cy.get('[data-cy=errorMsgNoMatch]').should('not.exist');
      cy.get('[data-cy=next]').should('be.enabled');
    });
  });
});
