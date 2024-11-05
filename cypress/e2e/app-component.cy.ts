/// <reference types="cypress" />

context('app-component', () => {
  beforeEach(() => {
    cy.moveToHomeView();
  });

  describe('Language dropdown works', () => {
    it('Has main components', () => {
      cy.get('[data-id=languageDropdown]')
        .contains('Deutsch')
        .click();

      cy.get('[data-id=langGerman]');
      cy.get('[data-id=langEnglish]');
      // cy.get('[data-id=langPlatt]');
    });

    it('Changes button text', () => {
      cy.get('[data-id=languageDropdown]')
        .contains('Deutsch')
        .click();

      cy.get('[data-id=langGerman]')
        .click();
      cy.get('[data-id=languageDropdown]')
        .contains('Deutsch')
        .click();

      cy.get('[data-id=langEnglish]')
        .click();
      cy.get('[data-id=languageDropdown]')
        .contains('English')
        .click();
    });

    it('Changes content lang', () => {
      cy.get('[data-id=createPollSlogan]')
        .should(($span) => {
          expect($span.text()).to.match(/Erstelle Umfragen|Sie suchen einen/);
        });
      cy.get('html')
        .invoke('attr', 'lang')
        .should('eq', 'de');

      cy.get('[data-id=languageDropdown]')
        .click();
      cy.get('[data-id=langEnglish]')
        .click();
      cy.get('[data-id=languageDropdown]')
        .contains('English')
        .click();
      cy.get('[data-id=createPollSlogan]')
        .contains('Create appointments');
      cy.get('html')
        .invoke('attr', 'lang')
        .should('eq', 'en');
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
    });
  });
});
