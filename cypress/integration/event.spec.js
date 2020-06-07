/// <reference types="Cypress" />

describe('Event', () => {
    const fillOuteventForm = () => {
        // FILL OUT EVENT FORM
        cy.get('input[name=locationName]').type('Copenhagen, Denmark', { force: true }).wait(1000);
        cy.get('button[type=submit]').click({ force: true });
        cy.get('input[name=eventName]').type('Test event', { force: true });
        cy.get('button[name=cueup]').click({ force: true });
        cy.get('button').contains('Continue').click({ force: true });
        cy.get('textarea[name=description]').type('Test event description', { force: true });
        cy.get('button').contains('Continue').click({ force: true });
        cy.get('input[name=contactName]').type('Test organizer', { force: true });
        cy.get('input[name=contactPhone]').type('24658061', { force: true });
        cy.get('input[name=contactEmail]').type('organizer@email.com', { force: true });
        cy.get('[data-cy=submit-event]').click({ force: true });
    };
    describe('Creating', () => {
        it('Post event from front page', () => {
            cy.request('POST', '/test/clearDB');
            cy.request('POST', '/test/seed/djs');
            cy.visit('/');

            fillOuteventForm();

            cy.url().should('include', '/event');
            cy.get('h1').contains('Test event');
        });

        it('Post event from location page', () => {
            cy.request('POST', '/test/clearDB');
            cy.request('POST', '/test/seed/djs');
            cy.visit('/book-dj/denmark/copenhagen');

            fillOuteventForm();

            cy.url().should('include', '/event');
            cy.get('h1').contains('Test event');
        });

        it('Post from direct booking page', () => {
            cy.request('POST', '/test/clearDB');
            cy.request('POST', '/test/seed/djs');
            cy.visit('/user/dj-lolbox-1/overview');

            cy.get('.sidebar button[data-cy=booking-button]').click();

            cy.get('input[name=eventName]').type('Test event');
            cy.get('button[name=date]').click();
            cy.get('.react-datepicker__day--selected').click();
            cy.get('textarea[name=description]')
                .type('Test event description', { force: true })
                .wait(1000);
            cy.get('input[name=contactName]').type('Test organizer', { force: true });
            cy.get('input[name=contactPhone]').type('24658061', { force: true });
            cy.get('input[name=contactEmail]').type('organizer@email.com', { force: true });
            cy.get('.sidebar button').contains('BOOK NOW').click();
            cy.get('h3').should('contain', 'Thanks');
        });
    });

    describe('Managing', () => {
        it('Shows DJs', () => {
            cy.request('POST', '/test/clearDB');
            cy.request('POST', '/test/seed/djs');

            const eventData = {
                customerUserId: 1,
                gigs: [{ djId: 4 }, { djId: 5 }, { djId: 6 }],
            };

            cy.request('POST', '/test/seed/event', eventData).then((response) => {
                const theEvent = response.body.event;

                expect(theEvent).to.not.eq(null);
                cy.visit('/event/' + theEvent.id + '/' + theEvent.hashKey + '/overview');

                cy.get('[data-cy=event-dj]').should('exist');

                // try chatting
                const message = 'Testing chat 🤓' + Math.random();
                cy.get('[data-cy=message-dj-button]').first().click().wait(2000);
                cy.get('[name=chat-input]').type(message + '{enter}');
                cy.get('.message-wrapper.send').last().should('contain', message);
                cy.get('.message-wrapper.send').next().should('contain', 'Delivered');
                // cy.get('.card.popup.active *[data-cy=close-popup-button]').click();

                // try visit profile
                cy.get('[data-cy=dj-profile-button]').first().click();
                cy.get('h1').should('contain', 'Dj lolbox');
            });
        });

        it.only('Handles many DJs', () => {
            cy.request('POST', '/test/clearDB');
            cy.request('POST', '/test/seed/djs');

            const eventData = {
                customerUserId: 1,
                gigs: [
                    { djId: 4 },
                    { djId: 5 },
                    { djId: 6 },
                    { djId: 7 },
                    { djId: 8 },
                    { djId: 9 },
                    { djId: 10 },
                    { djId: 11 },
                ],
            };

            cy.request('POST', '/test/seed/event', eventData).then((response) => {
                const theEvent = response.body.event;

                expect(theEvent).to.not.eq(null);
                cy.visit('/event/' + theEvent.id + '/' + theEvent.hashKey + '/overview');

                cy.get('[data-cy=event-dj]').should('exist');

                // try chatting

                // try visit profile
                // cy.get('[data-cy=dj-profile-button]').first().click();
                // cy.get('h1').should('contain', 'Dj lolbox');
            });
        });
    });
});
