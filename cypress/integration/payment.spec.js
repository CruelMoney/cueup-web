/// <reference types="Cypress" />
describe('Payment', () => {
    it.only('Shows necessary info afterwards', () => {
        cy.request('POST', '/test/clearDB');
        cy.request('POST', '/test/seed/djs');

        const eventData = {
            customerUserId: 1,
            gigs: [
                { djId: 4 },
                {
                    djId: 5,
                    status: 'ACCEPTED',
                    djFeeAmount: 1500,
                    offerAmount: 50000,
                    serviceFeeAmount: 10000,
                    currency: 'USD',
                },
                { djId: 6 },
            ],
        };

        cy.request('POST', '/test/seed/event', eventData).then((response) => {
            const theEvent = response.body.event;

            expect(theEvent).to.not.eq(null);
            cy.visit('/event/' + theEvent.id + '/' + theEvent.hashKey + '/overview');

            cy.get('[data-cy=event-dj]').should('exist');
            cy.get('[data-cy=offer-price]').should('contain', 'USD500.00');
            cy.get('[data-cy=book-dj-button]').click();
        });
    });

    it('Works with 2factor auth card', () => {
        throw new Error('Not implemented');
    });

    it('Works with bank payout method', () => {
        throw new Error('Not implemented');
    });

    it('Works when choosing between payout methods', () => {
        throw new Error('Not implemented');
    });

    it('Fails gracefully if card declined', () => {
        throw new Error('Not implemented');
    });
});
