/// <reference types="Cypress" />
describe('Update User', () => {
    it('Goes to complete signup if no location', () => {
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
        cy.request('POST', '/test/seed/user', user);

        cy.getCookie('x-token').should('exist');

        cy.visit('/');

        cy.get('[data-cy=menu-user-link]').click();

        cy.url().should('include', '/user');

        // cy.get('input[name=email]').type(user.email);

        // cy.get('input[name=password]').type(user.password);

        // cy.get('input[name=name]').type(user.firstName + ' ' + user.lastName);

        // cy.get('input[name=phone]').type(user.phone);

        // cy.get('input[name=playingLocation]').type(user.playingLocation);

        // cy.get('button').contains('house').click();

        // const picturePath = 'images/steve_jobs.jpg';
        // cy.get('input[name=picture]').attachFile({ filePath: picturePath });

        // cy.get('textarea[name=bio]').type(user.bio);

        // cy.get('button[name=signup]').click();

        // cy.url().should('include', '/user');

        // // our auth cookie should be present
        // cy.getCookie('x-token').should('exist');

        // // // UI should reflect this user being logged in
    });
});
