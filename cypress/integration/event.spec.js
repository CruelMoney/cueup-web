/// <reference types="Cypress" />
describe('Event', () => {
    const fillOuteventForm = () => {
        // FILL OUT EVENT FORM
        cy.get('input[name=locationName]').type('Copenhagen, Denmark', { force: true });
        cy.get('button[type=submit]').click({ force: true });
        cy.get('input[name=eventName]').type('Test event', { force: true });
        cy.get('button[name=cueup]').click({ force: true });
        cy.get('button').contains('Continue').click({ force: true });
        cy.get('textarea[name=description]').type('Test event description', { force: true });
        cy.get('button').contains('Continue').click({ force: true });
        cy.get('input[name=contactName]').type('Test organizer', { force: true });
        cy.get('input[name=contactPhone]').type('24658061', { force: true });
        cy.get('input[name=contactEmail]').type('organizer@email.com', { force: true });
        cy.get('input[name=contactEmailConfirm]').type('organizer@email.com', { force: true });
        cy.get('button[type=submit]').click({ force: true });
        cy.get('.request-form').should('contain', 'Thanks');
    };
    it('Post event from front page', () => {
        cy.request('POST', '/test/clearDB');
        cy.request('POST', '/test/seed/djs');
        cy.visit('/');

        fillOuteventForm();
    });

    it('Post event from location page', () => {
        cy.request('POST', '/test/clearDB');
        cy.request('POST', '/test/seed/djs');
        cy.visit('/book-dj/denmark/copenhagen');

        fillOuteventForm();
    });

    it('Post from direct booking page', () => {
        cy.request('POST', '/test/clearDB');
        cy.request('POST', '/test/seed/djs');
        cy.visit('/user/dj-lolbox-1/overview');

        cy.get('.sidebar button[data-cy=booking-button]').click();

        cy.get('input[name=eventName]').type('Test event');
        cy.get('button[name=date]').click();
        cy.get('.react-datepicker__day--selected').click();
        cy.get('textarea[name=description]').type('Test event description');
        cy.get('input[name=contactName]').type('Test organizer');
        cy.get('input[name=contactPhone]').type('24658061');
        cy.get('input[name=contactEmail]').type('organizer@email.com');
        cy.get('.sidebar button').contains('BOOK NOW').click();
        cy.get('h3').should('contain', 'Thanks');
    });
});
