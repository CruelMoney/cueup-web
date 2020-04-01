/// <reference types="Cypress" />
describe('Gig', () => {
    const dj = {
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

    it('Can make offer for gig', () => {
        cy.request('POST', '/test/clearDB');
        cy.request('POST', '/test/seed/djs', { count: 10 });
        cy.request('POST', '/test/seed/user', dj).then((response) => {
            cy.setCookie('x-token', response.body.token);
        });

        const event = {
            customerUserId: 1,
            djIds: [11],
        };
        cy.request('POST', '/test/seed/event', event);

        cy.visit('/');
        cy.get('[data-cy=menu-user-link]').click();
        cy.get('.card.popup.active *[data-cy=close-popup-button]').click();
        cy.get('[data-cy=navbutton-gigs]').click();
        cy.get('[data-cy=gig-read-more]').click();
        cy.get('[data-cy=navbutton-offer]').click();
        cy.get('button').contains('Update payout info').click();
        cy.get('[name=DIRECT]').click();
        cy.get('[name=direct-description]').type('Hey ho lets go');

        cy.get('.payout-form button[type="submit"]').click();
        cy.get('.card.popup.active *[data-cy=close-popup-button]').click();

        cy.get('[data-cy=payout-options] *[name=DIRECT]').click();

        cy.get('[name=amount]').clear().type('500');
        cy.get('[data-cy=submit-offer-button]').click();

        cy.get('[data-cy=submit-offer-button]').should('contain', 'Updated');
    });
});
