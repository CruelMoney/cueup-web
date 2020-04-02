/// <reference types="Cypress" />

describe('Payment', () => {
    const getIframeDocument = (selector) => {
        return cy.get(selector).its('0.contentDocument').should('exist');
    };

    const getIframeBody = (selector) => {
        return (
            getIframeDocument(selector)
                // automatically retries until body is loaded
                .its('body')
                .should('not.be.undefined')
                .then(cy.wrap)
        );
    };

    Cypress.Commands.add('completePayment', ({ isXendit } = {}) => {
        cy.get('input[name=card_country]').type('Denmark');
        cy.get('[data-cy=suggestion-list-item]').first().click();
        cy.get('input[name=card_email]').click({ force: true }).type('test@email.com');
        cy.get('input[name=card_name]').type('Christopher Dengsø');
        if (!isXendit) {
            cy.get('iframe[name^=__privateStripeFrame]').then(($iframe) => {
                const $body = $iframe.contents().find('body');
                cy.wrap($body)
                    .find('input[name="cardnumber"]')
                    .type('42424242424242421222223424242');
            });
            cy.get('.pay-form button[type=submit]').click();
        } else {
            cy.get('#card-number').type('52000000000000561222223424242');
            cy.get('.pay-form button[type=submit]').click();
        }

        cy.get('h3').should(
            'contain',
            'The DJ has been booked, and you will receive a receipt on email.'
        );
        cy.get('.card.popup.active *[data-cy=close-popup-button]').click();
        cy.get('h3').should('contain', 'The DJ has been booked');
        cy.get('[data-cy=progress-step-complete]').contains('Confirm and pay').should('exist');

        cy.get('[data-cy=event-dj]').contains('Paid and confirmed');
    });

    it('Works with only direct payout method', () => {
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
            cy.get('.pay-info').contains('Payment now');
            cy.get('[data-cy="payment-amount"]').contains('USD115.00');

            cy.completePayment();
        });
    });

    it('Works with only bank payout method', () => {
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
                    enableBankPayout: true,
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
            cy.get('[data-cy="payment-amount"]').contains('USD500.00');

            cy.completePayment();
        });
    });

    it('Works when choosing BANK in payout methods', () => {
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
                    enableBankPayout: true,
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
            cy.get('[data-cy=book-dj-button]').click();
            cy.get('[data-cy="payment-amount"]').contains('USD500.00');

            cy.get('[name="BANK"]').click();
            cy.get('[data-cy="continue-button"]').click();

            cy.completePayment();
        });
    });

    it('Works when choosing DIRECT in payout methods', () => {
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
                    enableBankPayout: true,
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
            cy.get('[data-cy=book-dj-button]').click();
            cy.get('[data-cy="payment-amount"]').contains('USD500.00');

            cy.get('[name="DIRECT"]').click();
            cy.get('[data-cy="continue-button"]').click();
            cy.get('[data-cy="payment-amount"]').contains('USD115.00');

            cy.completePayment();
        });
    });

    it.only('Works with xendit', () => {
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
                    djFeeAmount: 15000000,
                    offerAmount: 500000000,
                    serviceFeeAmount: 100000000,
                    currency: 'IDR',
                    enableBankPayout: true,
                    bankProvider: 'XENDIT',
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
            cy.get('[data-cy=offer-price]').should('contain', 'IDR5,000,000');
            cy.get('[data-cy=book-dj-button]').click();
            cy.get('[data-cy="payment-amount"]').contains('IDR5,000,000');

            cy.completePayment({ isXendit: true });
        });
    });

    it('Works with 2factor auth card', () => {
        throw new Error('Not implemented');
    });

    it('Fails gracefully if card declined', () => {
        throw new Error('Not implemented');
    });
});
