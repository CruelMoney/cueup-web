/// <reference types="Cypress" />
import 'cypress-file-upload';

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
});

describe('Signup', () => {
    beforeEach(() => {
        cy.setCookie('testing', 'true');
    });

    const user = {
        email: 'test@email.com',
        password: 't5e3s4t5i8n18g12',
        firstName: 'Christopher',
        lastName: 'Dengsø',
        playingLocation: 'Copenhagen',
        phone: '12345678',
        bio:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id suscipit eros. Suspendisse at quam ac nisi aliquet pulvinar vel sit amet odio. Nulla interdum vulputate dolor, nec imperdiet purus cursus a.',
    };

    it('Works with email', () => {
        cy.request('POST', '/test/clearDB', {});
        cy.visit('/signup');
        cy.get('input[name=email]').type(user.email);
        cy.get('input[name=password]').type(user.password);
        cy.get('input[name=name]').type(user.firstName + ' ' + user.lastName);
        cy.get('input[name=phone]').type(user.phone);
        cy.get('input[name=playingLocation]').type(user.playingLocation);
        cy.get('button').contains('house').click();
        const picturePath = 'images/steve_jobs.jpg';
        cy.get('input[name=picture]').attachFile({ filePath: picturePath });
        cy.get('textarea[name=bio]').type(user.bio);
        cy.get('button[name=signup]').click();
        cy.url().should('include', '/user');
        // our auth cookie should be present
        cy.getCookie('x-token').should('exist');
        // // UI should reflect this user being logged in
        cy.get('h1').should('contain', user.firstName);
    });

    it('Goes to complete signup if no location', () => {
        const { playingLocation, ...userNoLoation } = user;
        cy.request('POST', '/test/clearDB');
        cy.request('POST', '/test/seed/user', userNoLoation).then((response) =>
            cy.setCookie('x-token', response.body.token)
        );
        cy.getCookie('x-token').should('exist');
        cy.visit('/');
        cy.get('[data-cy=menu-user-link]').click();
        cy.get('[data-cy=menu-profile-link]').click({ force: true });
        cy.url().should('include', '/complete-signup');
    });

    it('Can complete signup', () => {
        const { playingLocation, ...userNoLoation } = user;
        cy.request('POST', '/test/clearDB');
        cy.request('POST', '/test/seed/user', userNoLoation).then((response) =>
            cy.setCookie('x-token', response.body.token)
        );
        cy.getCookie('x-token').should('exist');
        cy.visit('/');
        cy.get('[data-cy=menu-user-link]').click();
        cy.get('[data-cy=menu-profile-link]').click({ force: true });
        cy.url().should('include', '/complete-signup');

        // real test begins
        cy.get('input[name=playingLocation]').type(user.playingLocation);
        cy.get('button').contains('house').click();
        const picturePath = 'images/steve_jobs.jpg';
        cy.get('input[name=picture]').attachFile({ filePath: picturePath });
        cy.get('textarea[name=bio]').clear().type(user.bio);
        cy.get('button[name=signup]').click();
        cy.url().should('include', '/user');
        // // UI should reflect this user being logged in
        cy.get('h1').should('contain', user.firstName);
    });
});
