/// <reference types="Cypress" />
describe('Update User', () => {
    it('Updates permalink', () => {
        const user = {
            email: 'chrdengso@gmail.com',
            password: 't5e3s4t5i8n18g12',
            firstName: 'Christopher',
            lastName: 'Dengsø',
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

        cy.getCookie('x-token').should('exist');
        cy.visit('/');
        cy.get('[data-cy=menu-user-link]').click();
        cy.url().should('include', '/user');
        cy.get('.card.popup.active *[data-cy=close-popup-button]').click();
        cy.get('[data-cy=navbutton-settings]').click();
        cy.get('input[name=permalink]').clear().type('new-permalink{enter}');

        cy.visit('/');

        cy.get('[data-cy=menu-user-link]').click();
        cy.url().should('include', 'new-permalink');
    });
});
