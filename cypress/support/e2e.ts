/// <reference types="cypress" />
import './commands';

declare global {
  namespace Cypress {
    // noinspection JSUnusedGlobalSymbols
    interface Chainable<Subject> {
      /**
       * Moves to home view
       * @example
       * cy.moveToHomeView()
       */
      moveToHomeView(): Chainable<any>;

      /**
       * Moves to create view
       * @example
       * cy.moveToCreateView()
       */
      moveToCreateView(): Chainable<any>;

      /**
       * Moves to select dates view
       * @example
       * cy.moveToSelectDatesView()
       */
      moveToSelectDatesView(): Chainable<any>;

      /**
       * Moves to password view
       * @example
       * cy.moveToSettingsView()
       */
      moveToSettingsView(): Chainable<any>;

      /**
       * Moves to overview view
       * @example
       * cy.moveToSettingsView()
       */
      moveToOverviewView(): Chainable<any>;

      /**
       * Moves to linksView
       * @example
       * cy.moveToSettingsView()
       */
      moveToLinksView(): Chainable<any>;
    }
  }
}
