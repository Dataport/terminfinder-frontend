/// <reference types="cypress" />

context('app-component', () => {
  beforeEach(() => {
    cy.moveToHomeView();
  });

  describe('Language dropdown works', () => {
    it('Has main components', () => {
      cy.get('[data-cy=languageDropdown]').contains('Deutsch').click();

      cy.get('[data-cy=langGerman]');
      cy.get('[data-cy=langEnglish]');
      // cy.get('[data-cy=langPlatt]');
    });

    it('Changes button text', () => {
      cy.get('[data-cy=languageDropdown]').contains('Deutsch').click();

      cy.get('[data-cy=langGerman]').click();
      cy.get('[data-cy=languageDropdown]').contains('Deutsch').click();

      cy.get('[data-cy=langEnglish]').click();
      cy.get('[data-cy=languageDropdown]').contains('English').click();
    });

    it('Changes content lang', () => {
      cy.get('[data-cy=createPollSlogan]').should(($span) => {
        expect($span.text()).to.match(/Erstelle Umfragen|Sie suchen einen/);
      });
      cy.get('html').invoke('attr', 'lang').should('eq', 'de');

      cy.get('[data-cy=languageDropdown]').click();
      cy.get('[data-cy=langEnglish]').click();
      cy.get('[data-cy=languageDropdown]').contains('English').click();
      cy.get('[data-cy=createPollSlogan]').contains('Create appointments');
      cy.get('html').invoke('attr', 'lang').should('eq', 'en');
    });

    it('Changes local storage', () => {
      cy.clearLocalStorage().should(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(localStorage.getItem('language')).to.be.null;
      });

      cy.get('[data-cy=languageDropdown]').click();
      cy.get('[data-cy=langGerman]')
        .click()
        .should(() => {
          expect(localStorage.getItem('language')).equal('"de-DE"');
        });

      cy.moveToHomeView();

      cy.get('[data-cy=createPollSlogan]').should(($span) => {
        expect($span.text()).to.match(/Erstelle Umfragen|Sie suchen einen/);
      });

      cy.get('[data-cy=languageDropdown]').click();
      cy.get('[data-cy=langEnglish]')
        .click()
        .should(() => {
          expect(localStorage.getItem('language')).to.eq('"en-EN"');
        });

      cy.moveToHomeView();

      cy.get('[data-cy=createPollSlogan]').contains('Create appointments');
    });
  });
});
