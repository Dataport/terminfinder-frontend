/// <reference types="cypress" />

context('app-component', () => {
  beforeEach(() => {
    cy.moveToHomeView();
  });

  describe('Language dropdown works', () => {
    it('Has main components', () => {
      cy.get('[data-id=languageDropdown]')
        .contains('DE')
        .click();

      cy.get('[data-id=langGerman]');
      cy.get('[data-id=langEnglish]');
      // cy.get('[data-id=langPlatt]');
    });

    it('Changes button text', () => {
      cy.get('[data-id=languageDropdown]')
        .contains('DE')
        .click();

      cy.get('[data-id=langGerman]')
        .click();
      cy.get('[data-id=languageDropdown]')
        .contains('DE')
        .click();

      cy.get('[data-id=langEnglish]')
        .click();
      cy.get('[data-id=languageDropdown]')
        .contains('EN')
        .click();

      /*
      cy.get('[data-id=langPlatt]')
        .click();
      cy.get('[data-id=languageDropdown]')
        .contains('Platt')
        .click();
       */
    });

    it('Changes content lang', () => {
      cy.get('[data-id=createPollSlogan]')
        .should(($span) => {
          expect($span.text()).to.match(/Erstelle Umfragen|Sie suchen einen/);
        });

      cy.get('[data-id=languageDropdown]')
        .click();
      cy.get('[data-id=langEnglish]')
        .click();
      cy.get('[data-id=languageDropdown]')
        .contains('EN')
        .click();

      cy.get('[data-id=createPollSlogan]')
        .contains('Create appointments');

      /*
      cy.get('[data-id=langPlatt]')
        .click();
      cy.get('[data-id=languageDropdown]')
        .contains('Platt')
        .click();
      cy.get('[data-id=createPollSlogan]')
        .contains('Stell Umfragen un kaam');
       */
    });

    it('Changes local storage', () => {
      cy.clearLocalStorage()
        .should(() => {
          expect(localStorage.getItem('language')).to.be.null;
        });

      cy.get('[data-id=languageDropdown]')
        .click();
      cy.get('[data-id=langGerman]')
        .click()
        .should(() => {
          expect(localStorage.getItem('language')).equal('"de-DE"');
        });

      cy.moveToHomeView();

      cy.get('[data-id=createPollSlogan]')
        .should(($span) => {
          expect($span.text()).to.match(/Erstelle Umfragen|Sie suchen einen/);
        });

      cy.get('[data-id=languageDropdown]')
        .click();
      cy.get('[data-id=langEnglish]')
        .click()
        .should(() => {
          expect(localStorage.getItem('language')).to.eq('"en-EN"');
        });

      cy.moveToHomeView();

      cy.get('[data-id=createPollSlogan]')
        .contains('Create appointments');

      /*
      cy.get('[data-id=languageDropdown]')
        .click();
      cy.get('[data-id=langPlatt]')
        .click();
      cy.get('[data-id=languageDropdown]')
        .contains('Platt')
        .click()
        .should(() => {
          expect(localStorage.getItem('language')).to.eq('"platt"');
        });
      cy.moveToHomeView();
      cy.get('[data-id=createPollSlogan]')
        .contains('Stell Umfragen un kaam');
       */
    });
  });
});
