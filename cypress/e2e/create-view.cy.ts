/// <reference types="cypress" />
import values from '../fixtures/values.json';

context('create-view', () => {
  beforeEach(() => {
    cy.moveToCreateView();
  });

  describe('Main components visible', () => {
    it('Has main components', () => {
      cy.get('#head');
      cy.get('[data-cy=headerTitle]');
      cy.get('[data-cy=stepperComponent]');
      cy.get('[data-cy=addDetailsHeading]');
      cy.get('[data-cy=titleLabel]');
      cy.get('[data-cy=titleInput]');
      cy.get('[data-cy=nameLabel]');
      cy.get('[data-cy=nameInput]');
      cy.get('[data-cy=locationLabel]');
      cy.get('[data-cy=locationInput]');
      cy.get('[data-cy=descriptionLabel]');
      cy.get('[data-cy=descriptionInput]');

      cy.get('[data-cy=back]').should('not.exist');
      cy.get('[data-cy=next]').should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-cy=footer]');
    });
  });

  describe('Form control works', () => {
    it('Adds information', () => {
      cy.get('[data-cy=next]').should('have.attr', 'aria-disabled', 'true');

      cy.get('[data-cy=nameInput]').type('Test-Name', { delay: 0 }).should('have.value', 'Test-Name');

      cy.get('[data-cy=next]').should('be.enabled');

      cy.get('[data-cy=locationInput]').type('Test-Ort', { delay: 0 }).should('have.value', 'Test-Ort');

      cy.get('[data-cy=descriptionInput]')
        .type('Test-Beschreibung', { delay: 0 })
        .should('have.value', 'Test-Beschreibung');

      cy.get('[data-cy=next]').click();

      cy.location('href').should('include', '/#/dates');
    });

    it('Shows error messages on wrong input title', () => {
      cy.get('[data-cy=msgRequiredTitle]').should('not.exist');
      cy.get('[data-cy=msgInvalidTitle]').should('not.exist');
      cy.get('[data-cy=msgLongTitle]').should('not.exist');

      cy.get('[data-cy=titleInput]').type('❌');
      cy.get('[data-cy=msgInvalidTitle]');

      cy.get('[data-cy=titleInput]').clear();
      cy.get('[data-cy=msgRequiredTitle]');

      cy.get('[data-cy=titleInput]').type(values.tooLongString, { delay: 0 });
      cy.get('[data-cy=msgLongTitle]');
    });

    it('Shows error messages on wrong input name', () => {
      cy.get('[data-cy=msgRequiredName]').should('not.exist');
      cy.get('[data-cy=msgInvalidName]').should('not.exist');
      cy.get('[data-cy=msgLongName]').should('not.exist');

      cy.get('[data-cy=nameInput]').type('❌');
      cy.get('[data-cy=msgInvalidName]');

      cy.get('[data-cy=nameInput]').clear();
      cy.get('[data-cy=msgRequiredName]');

      cy.get('[data-cy=nameInput]').type(values.tooLongString, { delay: 0 });
      cy.get('[data-cy=msgLongName]');
    });

    it('Shows error messages on wrong input Location', () => {
      cy.get('[data-cy=msgInvalidLocation]').should('not.exist');
      cy.get('[data-cy=msgLongLocation]').should('not.exist');

      cy.get('[data-cy=locationInput]').type('❌');
      cy.get('[data-cy=msgInvalidLocation]');

      cy.get('[data-cy=locationInput]').clear();

      cy.get('[data-cy=locationInput]').type(values.tooLongString, { delay: 0 });
      cy.get('[data-cy=msgLongLocation]');
    });

    it('Shows error messages on wrong input Description', () => {
      cy.get('[data-cy=msgLongDescription]').should('not.exist');

      cy.get('[data-cy=descriptionInput]').type('❌');

      cy.get('[data-cy=descriptionInput]').clear();

      cy.get('[data-cy=descriptionInput]')
        .type(values.tooLongString, { delay: 0 })
        .type(values.tooLongString, { delay: 0 })
        .type(values.tooLongString, { delay: 0 })
        .type(values.tooLongString, { delay: 0 })
        .type(values.tooLongString, { delay: 0 });
      cy.get('[data-cy=msgLongDescription]');
    });
  });
});
