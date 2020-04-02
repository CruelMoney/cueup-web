/// <reference types="Cypress" />
describe('Payment', () => {
    it.only('Works with only direct payout method', () => {
        cy.request('POST', '/test/clearDB');
        cy.request('POST', '/test/seed/djs');

        const eventData = {
            customerUserId: 1,
            status: 'ACCEPTED',
            gigs: [
                { djId: 4 },
                {
                    djId: 5,
                    status: 'ACCEPTED',
                    djFeeAmount: 1500,
                    offerAmount: 50000,
                    serviceFeeAmount: 10000,
                    currency: 'USD',
                    enableDirectPayout: true,
                },
                { djId: 6 },
            ],
        };

        cy.request('POST', '/test/seed/event', eventData).then((response) => {
            const theEvent = response.body.event;

            expect(theEvent).to.not.eq(null);
            cy.visit('/event/' + theEvent.id + '/' + theEvent.hashKey + '/overview');

            cy.get('[data-cy=event-dj]').should('exist');
            cy.get('[data-cy=progress-step-incomplete]')
                .contains('Confirm and pay')
                .should('exist');
            cy.get('[data-cy=offer-price]').should('contain', 'USD500.00');
            cy.get('[data-cy=book-dj-button]').click();
            cy.get('input[name=card_country]').type('Denmark');
            cy.get('[data-cy=suggestion-list-item]').first().click();
            cy.get('input[name=card_email]').click({ force: true }).type('test@email.com');
            cy.get('input[name=card_name]').type('Christopher Dengsø');
            cy.get('iframe[name^=__privateStripeFrame]').then(($iframe) => {
                const $body = $iframe.contents().find('body');
                cy.wrap($body)
                    .find('input[name="cardnumber"]')
                    .type('42424242424242421222223424242');
            });

            cy.get('.pay-form button[type=submit]').click();
            cy.get('h3').should(
                'contain',
                'The DJ has been booked, and you will receive a receipt on email.'
            );
            cy.get('.card.popup.active *[data-cy=close-popup-button]').click();
            cy.get('h3').should('contain', 'The DJ has been booked');
            cy.get('[data-cy=progress-step-complete]').contains('Confirm and pay').should('exist');
        });
    });

    it('Works with only bank payout method', () => {
        throw new Error('Not implemented');
    });

    it('Works when choosing between payout methods', () => {
        throw new Error('Not implemented');
    });

    it('Works with xendit', () => {
        throw new Error('Not implemented');
    });

    it('Works with 2factor auth card', () => {
        throw new Error('Not implemented');
    });

    it('Fails gracefully if card declined', () => {
        throw new Error('Not implemented');
    });
});
