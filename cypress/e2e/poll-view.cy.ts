/// <reference types="cypress" />
import values from '../fixtures/values.json';
import path from "path";

const getBaseHref = (url = '') => {
  return Cypress.env('baseHref') + url.replace('customerId', Cypress.env('customerId'));
};
const getApiUrl = (url) => {
  return Cypress.env('apiUrl') + url.replace('customerId', Cypress.env('customerId'));
};

const DOWNLOADS_FOLDER = Cypress.config('downloadsFolder');

context('poll-view', () => {

  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: getApiUrl(values.appointmentProtectionUrl),
      },
      {
        body: values.appointmentProtectionFalse
      }
    );
  });

  describe('Main components visible', () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.getAppointmentUrl)
        },
        {
          headers: {
            'content-type': 'application/terminfinder.api-v1+json'
          },
          body: values.getAppointment
        }
      );

      cy.visit(getBaseHref(values.inviteLink));
    });

    it('Shows main components', () => {
      cy.get('#head');
      cy.get('[data-id=headerTitle]');
      cy.get('[data-id=pollHeading]');

      cy.get('[data-cy=overviewTitleValue]')
        .should("contain.html", "Test-Titel");
      cy.get('[data-cy=overviewPlaceLabel]');
      cy.get('[data-cy=overviewPlaceValue]')
        .should("contain.html", "Test-Ort");
      cy.get('[data-cy=overviewDescriptionLabel]');
      cy.get('[data-cy=overviewDescriptionValue]')
        .should("contain.html", "Test-Beschreibung<br>Neue Zeile 1<br><br>Neue Zeile 2");

      cy.get('[data-id=numberParticipants]');
      cy.get('[data-id=tableHead]');
      cy.get('[data-id=tableBody]');
      cy.get('[data-id=participantSummary]');
      cy.get('[data-id=addParticipantButton]');

      cy.get('[data-id=tos]');
      cy.get('[data-id=checkbox]');
      cy.get('[data-id=submitNoParticipationButton]')
        .should('not.exist');
      cy.get('[data-id=addParticipantButton]');

      cy.get('[data-id=footer]');
    });
  });

  describe('Main components visible', () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.getAppointmentUrl)
        },
        {
          headers: {
            'content-type': 'application/terminfinder.api-v1+json'
          },
          body: values.getAppointment_1_user
        }
      );

      cy.visit(getBaseHref(values.inviteLink));
    });
  });

  describe('Name input', () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.getAppointmentUrl)
        },
        {
          headers: {
            'content-type': 'application/terminfinder.api-v1+json'
          },
          body: values.getAppointment
        }
      );

      cy.visit(getBaseHref(values.inviteLink));
    });

    it('Shows no name msg', () => {
      cy.get('[data-id=addParticipantButton]')
        .click();

      cy.get('[data-id=nameInput]')
        .click();
      cy.get('[data-id=pollHeading]')
        .click();
      cy.get('[data-id=noNameMsg]');

      cy.get('[data-id=nameInput]')
        .type('a');
      cy.get('[data-id=noNameMsg]')
        .should('not.exist');
    });

    it('Shows name invalid msg', () => {
      cy.get('[data-id=addParticipantButton]')
        .click();

      cy.get('[data-id=nameInput]')
        .clear();
      cy.get('[data-id=nameInput]')
        .type('❌');
      cy.get('[data-id=nameInvalidMsg]');
    });

    it('Shows name too long msg', () => {
      cy.get('[data-id=addParticipantButton]')
        .click();

      cy.get('[data-id=nameInput]')
        .clear();
      cy.get('[data-id=nameInput]')
        .type(values.tooLongString);
      cy.get('[data-id=tooLongMsg]');
    });

    it('Disappears on delete button', () => {
      cy.get('[data-id=addParticipantButton]')
        .click();

      cy.get('[data-id=nameInput]')
        .clear();
      cy.get('[data-id=nameInput]')
        .type('a');
      cy.get('[data-id=deleteParticipantButton]')
        .click();
      cy.get('[data-id=nameInput]')
        .should('not.exist');
    });
  });

  describe('Poll options', () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.getAppointmentUrl)
        },
        {
          headers: {
            'content-type': 'application/terminfinder.api-v1+json'
          },
          body: values.getAppointment
        }
      );

      cy.visit(getBaseHref(values.inviteLink));
    });

    it('Shows options', () => {
      cy.get('[data-id=addParticipantButton]')
        .click();

      cy.get('#desktop-label-status-declined-0');
      cy.get('#desktop-voting-status-declined-0');
      cy.get('#desktop-label-status-questionable-0');
      cy.get('#desktop-voting-status-questionable-0');
      cy.get('#desktop-label-status-accepted-0');
      cy.get('#desktop-voting-status-accepted-0');

      cy.get('#desktop-label-status-declined-1');
      cy.get('#desktop-voting-status-declined-1');
      cy.get('#desktop-label-status-questionable-1');
      cy.get('#desktop-voting-status-questionable-1');
      cy.get('#desktop-label-status-accepted-1');
      cy.get('#desktop-voting-status-accepted-1');
    });

    it('Options clickable', () => {
      cy.get('[data-id=addParticipantButton]')
        .click();

      cy.get('#desktop-voting-status-declined-0')
        .click();
      cy.get('#desktop-voting-status-questionable-0')
        .click();
      cy.get('#desktop-voting-status-accepted-0')
        .click();
      cy.get('#desktop-voting-status-accepted-0')
        .should('be.checked');

      cy.get('#desktop-voting-status-declined-0')
        .should('not.be.checked');
      cy.get('#desktop-voting-status-questionable-0')
        .should('not.be.checked');

      cy.get('#desktop-voting-status-declined-1')
        .click();
      cy.get('#desktop-voting-status-questionable-1')
        .click();
      cy.get('#desktop-voting-status-accepted-1')
        .click();

      cy.get('#desktop-voting-status-questionable-1')
        .click();
      cy.get('#desktop-voting-status-questionable-1')
        .should('be.checked');
      cy.get('#desktop-voting-status-declined-1')
        .should('not.be.checked');
      cy.get('#desktop-voting-status-accepted-1')
        .should('not.be.checked');
    });

    it('Options change column counter', () => {
      cy.get('[data-id=addParticipantButton]')
        .click();
      cy.get('[data-id=nameInput]')
        .type('a');

      cy.get('#summary-column-0')
        .should('contain.html', '0');
      cy.get('#desktop-voting-status-accepted-0')
        .click();
      cy.get('#desktop-voting-status-accepted-0')
        .should('be.checked');
      cy.get('#summary-column-0')
        .should('contain.html', '1');
      cy.get('#summary-column-1')
        .should('contain.html', '0');
      cy.get('#desktop-voting-status-questionable-0')
        .click();
      cy.get('#desktop-voting-status-questionable-0')
        .should('be.checked');
      cy.get('#summary-column-0')
        .should('contain.html', '0');

      cy.get('#desktop-voting-status-questionable-1')
        .click();
      cy.get('#summary-column-1')
        .should('contain.html', '0');
      cy.get('#summary-column-0')
        .should('contain.html', '0');
      cy.get('#desktop-voting-status-accepted-1')
        .click();
      cy.get('#summary-column-1')
        .should('contain.html', '1');
      cy.get('#summary-column-0')
        .should('contain.html', '0');
      cy.get('#desktop-voting-status-declined-1')
        .click();
      cy.get('#summary-column-1')
        .should('contain.html', '0');
    });

    it('Options change summary counter', () => {
      cy.get('[data-id=addParticipantButton]')
        .click();

      cy.get('[data-id=nameInput]')
        .type('Test');
      cy.get('[data-id=nameInput]')
        .should('have.value', 'Test');
      cy.get('[data-id=checkbox]')
        .click();

      cy.get('[data-id=addedParticipation]')
        .should('not.exist');
      cy.get('#desktop-voting-status-accepted-0')
        .click();
      cy.get('#desktop-voting-status-accepted-0')
        .should('be.checked');
      cy.get('[data-id=addedParticipation]')
        .should('contain.html', '01');
      cy.get('#desktop-voting-status-questionable-0')
        .click();
      cy.get('#desktop-voting-status-questionable-0')
        .should('be.checked');
      cy.get('[data-id=addedParticipation]')
        .should('contain.html', '00');

      cy.get('#desktop-voting-status-accepted-0')
        .click();
      cy.get('#desktop-voting-status-accepted-0')
        .should('be.checked');
      cy.get('#desktop-voting-status-accepted-1')
        .click();
      cy.get('#desktop-voting-status-accepted-1')
        .should('be.checked');
      cy.get('[data-id=addedParticipation]')
        .should('contain.html', '02');

      cy.get('#desktop-voting-status-declined-0')
        .click();
      cy.get('#desktop-voting-status-declined-0')
        .should('be.checked');
      cy.get('#desktop-voting-status-declined-1')
        .click();
      cy.get('#desktop-voting-status-declined-1')
        .should('be.checked');
      cy.get('[data-id=addedParticipation]')
        .should('not.exist');
    });
  });

  describe('Submit button', () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.getAppointmentUrl)
        },
        {
          headers: {
            'content-type': 'application/terminfinder.api-v1+json'
          },
          body: values.getAppointment
        }
      );

      cy.visit(getBaseHref(values.inviteLink));
    });

    it('Shows inactive button on loading', () => {
      cy.get('[data-id=submitPoll]')
        .should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-id=submitNoParticipationButton]')
        .should('not.exist');
    });

    it('Shows inactive button on invalid form', () => {
      cy.get('[data-id=checkbox]')
        .click();

      cy.get('[data-id=submitPoll]')
        .should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-id=submitNoParticipationButton]')
        .should('not.exist');

      cy.get('[data-id=addParticipantButton]')
        .click();

      cy.get('[data-id=nameInput]')
        .type('Test');
      cy.get('[data-id=nameInput]')
        .should('have.value', 'Test');
      cy.get('[data-id=checkbox]')
        .click();

      cy.get('[data-id=submitNoParticipationButton]')
        .should('have.attr', 'aria-disabled', 'true');
      cy.get('[data-id=submitPoll]')
        .should('not.exist');

      cy.get('[data-id=checkbox]')
        .click();

      cy.get('[data-id=submitPoll]')
        .should('not.exist');
      cy.get('[data-id=submitNoParticipationButton]')
        .should('be.enabled');

      cy.get('#desktop-voting-status-accepted-0')
        .click();
      cy.get('#desktop-voting-status-accepted-0')
        .should('be.checked');

      cy.get('[data-id=submitNoParticipationButton]')
        .should('not.exist');
      cy.get('[data-id=submitPoll]')
        .should('be.enabled');
    });

    it('Submits new participation', () => {
      cy.intercept(
        {
          method: 'PUT',
          url: getApiUrl(values.putParticipantUrl),
        },
        {
          headers: {
            'content-type': 'application/terminfinder.api-v1+json'
          },
          statusCode: 201,
          body: values.putParticipant
        }
      );

      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.getAppointmentUrl)
        },
        {
          headers: {
            'content-type': 'application/terminfinder.api-v1+json'
          },
          body: values.getAppointment_1_user
        }
      );

      cy.get('[data-id=addParticipantButton]')
        .click();

      cy.get('[data-id=nameInput]')
        .type('Test');
      cy.get('[data-id=nameInput]')
        .should('have.value', 'Test');
      cy.get('[data-id=checkbox]')
        .click();

      cy.get('[data-id=submitNoParticipationButton]')
        .click();

      cy.url().should('include', '/#/poll');
    });
  });

  describe('Multiple users', () => {
    it('Add second participant', () => {
      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.getAppointmentUrl)
        },
        {
          headers: {
            'content-type': 'application/terminfinder.api-v1+json'
          },
          body: values.getAppointment_1_user
        }
      );

      cy.visit(getBaseHref(values.inviteLink));

      cy.intercept(
        {
          method: 'PUT',
          url: getApiUrl(values.putParticipantUrl),
        },
        {
          headers: {
            'content-type': 'application/terminfinder.api-v1+json'
          },
          statusCode: 201,
          body: values.putParticipant_1
        }
      );

      cy.get('[data-id=addParticipantButton]')
        .click();

      cy.get('[data-id=nameInput]')
        .type('Testerin');
      cy.get('[data-id=nameInput]')
        .should('have.value', 'Testerin');

      cy.get('#desktop-voting-status-accepted-1')
        .click();
      cy.get('#desktop-voting-status-accepted-1')
        .should('be.checked');

      cy.get('#summary-column-1')
        .should('contain.html', '2');

      cy.get('[data-id=checkbox]')
        .click();

      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.getAppointmentUrl)
        },
        {
          headers: {
            'content-type': 'application/terminfinder.api-v1+json'
          },
          body: values.getAppointment_2_user
        }
      );

      cy.get('[data-id=submitPoll]')
        .click();

      cy.url().should('include', '/#/poll');
      cy.get('[data-id=numberParticipants]')
        .should('contain.html', '2 Teilnehmende');
      cy.get('[data-id=submitPoll]')
        .should('have.attr', 'aria-disabled', 'true');
    });
  });

  describe('Edit participation', () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.getAppointmentUrl)
        },
        {
          headers: {
            'content-type': 'application/terminfinder.api-v1+json'
          },
          body: values.getAppointment_1_user
        }
      );

      cy.visit(getBaseHref(values.inviteLink));
    });

    it('Edit participation', () => {
      cy.intercept(
        {
          method: 'PUT',
          url: getApiUrl(values.putParticipantUrl),
        },
        ''
      ).as('apiCheckPutParticipant');

      cy.get('#editButton-0')
        .click();

      cy.get('#desktop-voting-status-accepted-0')
        .click();
      cy.get('#desktop-voting-status-accepted-0')
        .should('be.checked');

      cy.get('[data-id=checkbox]')
        .click();

      cy.get('[data-id=submitPoll]')
        .click();

      cy.wait('@apiCheckPutParticipant').then((interception) => {
        assert.equal(interception.request.method, 'PUT');
        assert.equal(JSON.stringify(interception.request.body[0].votings), JSON.stringify([
            {
              'suggestedDateId': 'suggestedDateId-0',
              'status': 'accepted',
              'votingId': 'voting-0'
            },
            {
              'suggestedDateId': 'suggestedDateId-1',
              'status': 'accepted',
              'votingId': 'voting-1'
            }
          ])
        );
      });
    });

    it('Edit name', () => {
      cy.intercept(
        {
          method: 'PUT',
          url: getApiUrl(values.putParticipantUrl),
        },
        ''
      ).as('apiCheckPutParticipant');

      cy.get('#editButton-0')
        .click();

      cy.get('[data-id=nameEditLabel]');
      cy.get('[data-id=nameEditInput]')
        .clear();
      cy.get('[data-id=nameEditInput]')
        .type('NeuerName');
      cy.get('[data-id=nameEditInput]')
        .should('have.value', 'NeuerName');

      cy.get('[data-id=checkbox]')
        .click();

      cy.get('[data-id=submitPoll]')
        .click();

      cy.wait('@apiCheckPutParticipant').then((interception) => {
        assert.equal(interception.request.method, 'PUT');
        assert.equal(interception.request.body[0].name, 'NeuerName');
      });
    });

    it('Delete participant', () => {
      cy.intercept(
        {
          method: 'DELETE',
          url: getApiUrl(values.deleteParticipantUrl),
        },
        ''
      ).as('apiCheckDeleteParticipant');

      cy.get('#editButton-0')
        .click();

      cy.get('[data-id=deleteEditedParticipantButton]')
        .click();

      cy.get('[data-id=checkbox]')
        .click();

      cy.get('[data-id=submitPoll]')
        .click();

      cy.wait('@apiCheckDeleteParticipant').then((interception) => {
        assert.equal(interception.request.method, 'DELETE');
        assert.equal(interception.request.body, '');
      });
    });
  });

  describe('Download information', () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.getAppointmentUrl)
        },
        {
          headers: {
            'content-type': 'application/terminfinder.api-v1+json'
          },
          body: values.getAppointment_1_user
        }
      );

      cy.visit(getBaseHref(values.inviteLink));
    });

    it('Download csv file', () => {
      cy.get('[data-id=downloadCsvButton]')
        .click();

      const downloadedFilename = path.join(DOWNLOADS_FOLDER, 'Umfrage-Test-Titel.csv');

      cy.readFile(downloadedFilename, 'binary', {timeout: 15000})
        .should(buffer => expect(buffer.length).to.be.gt(100));
    });

    it('Download ics files', () => {
      cy.get('#download-cal-0')
        .click();
      const downloadedFilename1 = path.join(DOWNLOADS_FOLDER, 'Umfrage-Test-Titel-1.ics');
      cy.readFile(downloadedFilename1, 'binary', {timeout: 15000})
        .should(buffer => expect(buffer.length).to.be.gt(100));

      cy.get('#download-cal-1')
        .click();
      const downloadedFilename2 = path.join(DOWNLOADS_FOLDER, 'Umfrage-Test-Titel-2.ics');
      cy.readFile(downloadedFilename2, 'binary', {timeout: 15000})
        .should(buffer => expect(buffer.length).to.be.gt(100));
    });
  });

  describe('Download information with incomplete data', () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          url: getApiUrl(values.getAppointmentUrl)
        },
        {
          headers: {
            'content-type': 'application/terminfinder.api-v1+json'
          },
          body: values.getAppointment_1_user_incomplete
        }
      );

      cy.visit(getBaseHref(values.inviteLink));
    });

    it('Download csv file with incomplete data', () => {
      cy.get('[data-id=downloadCsvButton]')
        .click();

      const downloadedFilename = path.join(DOWNLOADS_FOLDER, 'Umfrage-Test-Titel.csv');

      cy.readFile(downloadedFilename, 'binary', {timeout: 15000})
        .should(buffer => expect(buffer.length).to.be.gt(100));
    });
  });
});
