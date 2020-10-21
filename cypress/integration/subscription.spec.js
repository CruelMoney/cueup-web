/// <reference types="Cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
});

describe('Subscription', () => {
    it('Can be paid', () => {
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
        cy.request('POST', '/test/seed/user', user).then((response) =>
            cy.setCookie('x-token', response.body.token)
        );

        cy.setCookie('testing', 'true');

        cy.getCookie('x-token').should('exist');
        cy.visit('/');
        cy.get('[data-cy=menu-user-link]').click();
        cy.get('[data-cy=menu-profile-link]').click({ force: true });
        cy.url().should('include', '/user');

        cy.get('[data-cy=navbutton-settings]').click();
        cy.get('[data-cy=go-pro-button]').click();
        cy.get('[data-cy=plan-1-button]').click();

        cy.get('iframe[name^=__privateStripeFrame]').then(($iframe) => {
            const $body = $iframe.contents().find('body');
            cy.wrap($body)
                .find('input[name="cardnumber"]')
                .clear()
                .wait(100)
                .type('4242424242424242');

            cy.wrap($body).find('input[name="exp-date"]').clear().type('0424');
            cy.wrap($body).find('input[name="cvc"]').clear().type('242');
            cy.wrap($body).find('input[name="postal"]').clear().type('424242');
        });

        cy.get('[data-cy=submit-button]').click();
        cy.get('[data-cy=subscription-welcome]', { timeout: 20000 }).should('exist');
    });
});
