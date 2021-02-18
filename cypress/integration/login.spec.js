/// <reference types="Cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
});

describe('Login', () => {
    it('Logs in with email', () => {
        cy.setCookie('testing', 'true');

        const user = {
            email: 'test@email.com',
            password: 't5e3s4t5i8n18g12',
            firstName: 'Christopher',
            lastName: 'Dengsø',
            genres: [1, 2, 3],
            playingLocation: {
                name: 'Copenhagen',
                latitude: 55.6760968,
                longitude: 12.5683372,
            },
            phone: '12345678',
            bio:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id suscipit eros. Suspendisse at quam ac nisi aliquet pulvinar vel sit amet odio. Nulla interdum vulputate dolor, nec imperdiet purus cursus a.',
        };

        cy.request('POST', '/test/clearDB');
        cy.request('POST', '/test/seed/user', user);

        cy.visit('/');

        cy.get('[data-cy=login-button]').click();
        cy.get('input[name=email]').type(user.email);
        cy.get('input[name=password]').type(user.password + '{enter}');
        cy.url().should('include', '/user');
        // our auth cookie should be present
        cy.getCookie('x-token').should('exist');
        // // UI should reflect this user being logged in
        cy.get('h1').should('contain', user.firstName);
    });
});
