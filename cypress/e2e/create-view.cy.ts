/// <reference types="cypress" />
import values from '../fixtures/values.json';

context('create-view', () => {
  beforeEach(() => {
    cy.moveToCreateView();
  });

  describe('Main components visible', () => {
    it('Has main components', () => {
      cy.get('#head');
      cy.get('[data-id=headerTitle]');
      cy.get('[data-id=stepperComponent]');
      cy.get('[data-id=addDetailsHeading]');
      cy.get('[data-id=titleLabel]');
      cy.get('[data-id=titleInput]');
      cy.get('[data-id=nameLabel]');
      cy.get('[data-id=nameInput]');
      cy.get('[data-id=locationLabel]');
      cy.get('[data-id=locationInput]');
      cy.get('[data-id=descriptionLabel]');
      cy.get('[data-id=descriptionInput]');

      cy.get('[data-id=back]')
        .should('not.exist');
      cy.get('[data-id=next]')
        .should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-id=footer]');
    });
  });

  describe('Form control works', () => {
    it('Adds information', () => {
      cy.get('[data-id=next]')
        .should('have.attr', 'aria-disabled', 'true');

      cy.get('[data-id=nameInput]')
        .type('Test-Name', {delay: 0})
        .should('have.value', 'Test-Name');

      cy.get('[data-id=next]')
        .should('be.enabled');

      cy.get('[data-id=locationInput]')
        .type('Test-Ort', {delay: 0})
        .should('have.value', 'Test-Ort');

      cy.get('[data-id=descriptionInput]')
        .type('Test-Beschreibung', {delay: 0})
        .should('have.value', 'Test-Beschreibung');

      cy.get('[data-id=next]').click();

      cy.location('href').should('include', '/#/dates');
    });

    it('Shows error messages on wrong input title', () => {
      cy.get('[data-id=msgRequiredTitle]').should('not.exist');
      cy.get('[data-id=msgInvalidTitle]').should('not.exist');
      cy.get('[data-id=msgLongTitle]').should('not.exist');

      cy.get('[data-id=titleInput]')
        .type('❌');
      cy.get('[data-id=msgInvalidTitle]');

      cy.get('[data-id=titleInput]')
        .clear();
      cy.get('[data-id=msgRequiredTitle]');

      cy.get('[data-id=titleInput]')
        .type(values.tooLongString, {delay: 0});
      cy.get('[data-id=msgLongTitle]');
    });

    it('Shows error messages on wrong input name', () => {
      cy.get('[data-id=msgRequiredName]').should('not.exist');
      cy.get('[data-id=msgInvalidName]').should('not.exist');
      cy.get('[data-id=msgLongName]').should('not.exist');

      cy.get('[data-id=nameInput]')
        .type('❌');
      cy.get('[data-id=msgInvalidName]');

      cy.get('[data-id=nameInput]')
        .clear();
      cy.get('[data-id=msgRequiredName]');

      cy.get('[data-id=nameInput]')
        .type(values.tooLongString, {delay: 0});
      cy.get('[data-id=msgLongName]');
    });

    it('Shows error messages on wrong input Location', () => {
      cy.get('[data-id=msgInvalidLocation]').should('not.exist');
      cy.get('[data-id=msgLongLocation]').should('not.exist');

      cy.get('[data-id=locationInput]')
        .type('❌');
      cy.get('[data-id=msgInvalidLocation]');

      cy.get('[data-id=locationInput]')
        .clear();

      cy.get('[data-id=locationInput]')
        .type(values.tooLongString, {delay: 0});
      cy.get('[data-id=msgLongLocation]');
    });

    it('Shows error messages on wrong input Description', () => {
      cy.get('[data-id=msgLongDescription]').should('not.exist');

      cy.get('[data-id=descriptionInput]')
        .type('❌');

      cy.get('[data-id=descriptionInput]')
        .clear();

      cy.get('[data-id=descriptionInput]')
        .type(values.tooLongString, {delay: 0})
        .type(values.tooLongString, {delay: 0})
        .type(values.tooLongString, {delay: 0})
        .type(values.tooLongString, {delay: 0})
        .type(values.tooLongString, {delay: 0});
      cy.get('[data-id=msgLongDescription]');
    });
  });
});
