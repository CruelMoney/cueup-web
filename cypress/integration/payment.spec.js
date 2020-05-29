/// <reference types="Cypress" />

describe('Payment', () => {
    const getIframeBody = (selector) => {
        // get the iframe > document > body
        // and retry until the body element is not empty
        return cy.get(selector).its('0.contentDocument.body').should('not.be.empty').then(cy.wrap);
    };
    function confirm3DSecureDialog(confirm = true) {
        cy.wait(5000);
        cy.get('iframe[name^=__privateStripeFrame]').then(($firstIFrame) => {
            cy.wrap($firstIFrame.contents().find('iframe#challengeFrame')).then(($secondIFrame) => {
                // authorise
                const target = confirm ? '#test-source-authorize-3ds' : '#test-source-fail-3ds';
                cy.wrap($secondIFrame.contents().find(target)).click();
            });
        });
    }
    Cypress.Commands.add('completePayment', ({ isXendit, cardNumber, withTwoFactor } = {}) => {
        cy.get('input[name=card_country]').clear().type('Denmark');
        cy.get('[data-cy=suggestion-list-item]').first().click();
        cy.get('input[name=card_email]').click({ force: true }).clear().type('test@email.com');
        cy.get('input[name=card_name]').clear().type('Christopher Dengsø');
        if (!isXendit) {
            cy.get('iframe[name^=__privateStripeFrame]').then(($iframe) => {
                const $body = $iframe.contents().find('body');
                cy.wrap($body)
                    .find('input[name="cardnumber"]')
                    .clear()
                    .wait(100)
                    .type(cardNumber || '4242424242424242');

                cy.wrap($body).find('input[name="exp-date"]').clear().type('0424');
                cy.wrap($body).find('input[name="cvc"]').clear().type('242');
                cy.wrap($body).find('input[name="postal"]').clear().type('424242');
            });
            cy.get('.pay-form button[type=submit]').click();

            if (withTwoFactor) {
                confirm3DSecureDialog();
            }
        } else {
            cy.get('#card-number')
                .clear()
                .type((cardNumber || '5200000000000056') + '1222223424242');
            cy.get('.pay-form button[type=submit]').click();
            cy.wait(5000);
        }
    });

    Cypress.Commands.add('assertPaid', () => {
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

            cy.wait(1000);

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
            cy.assertPaid();
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
            cy.wait(1000);

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
            cy.assertPaid();
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
            cy.wait(1000);

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
            cy.assertPaid();
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
            cy.wait(1000);

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
            cy.assertPaid();
        });
    });

    it('Works with xendit', () => {
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
            cy.wait(1000);

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
            cy.assertPaid();
        });
    });

    it('Works with 2factor auth card', () => {
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
            cy.wait(1000);

            expect(theEvent).to.not.eq(null);
            cy.visit('/event/' + theEvent.id + '/' + theEvent.hashKey + '/overview');

            cy.get('[data-cy=event-dj]').should('exist');
            cy.get('[data-cy=progress-step-incomplete]')
                .contains('Confirm and pay')
                .should('exist');
            cy.get('[data-cy=offer-price]').should('contain', 'USD500.00');
            cy.get('[data-cy=book-dj-button]').click();
            cy.get('[data-cy="payment-amount"]').contains('USD500.00');

            cy.completePayment({ cardNumber: '4000000000003220', withTwoFactor: true });
            cy.assertPaid();
        });
    });

    it('Fails gracefully if card declined', () => {
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
            cy.wait(1000);

            expect(theEvent).to.not.eq(null);
            cy.visit('/event/' + theEvent.id + '/' + theEvent.hashKey + '/overview');

            cy.get('[data-cy=event-dj]').should('exist');
            cy.get('[data-cy=progress-step-incomplete]')
                .contains('Confirm and pay')
                .should('exist');
            cy.get('[data-cy=offer-price]').should('contain', 'USD500.00');
            cy.get('[data-cy=book-dj-button]').click();
            cy.get('[data-cy="payment-amount"]').contains('USD500.00');

            cy.completePayment({ cardNumber: '4000000000009995' });
            cy.get('.pay-form .errors').should('contain.text', 'Your card has insufficient funds.');

            cy.completePayment();
            cy.assertPaid();
        });
    });

    it('Can be paid from user profile', () => {
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
                    djFeeAmount: 15000,
                    offerAmount: 500000,
                    serviceFeeAmount: 100000,
                    currency: 'DKK',
                    enableBankPayout: true,
                },
                { djId: 6 },
            ],
        };

        cy.request('POST', '/test/seed/event', eventData).then((response) => {
            const theEvent = response.body.event;
            cy.wait(1000);

            expect(theEvent).to.not.eq(null);
            cy.visit('/event/' + theEvent.id + '/' + theEvent.hashKey + '/overview');

            cy.get('[data-cy=event-dj]').should('exist');
            cy.get('[data-cy=progress-step-incomplete]')
                .contains('Confirm and pay')
                .should('exist');
            cy.get('[data-cy=offer-price]').should('contain', 'DKK5,000.00');
            cy.get('[data-cy=dj-profile-button]').first().click();
            cy.get('.sidebar [data-cy=profile-cta]').should('contain', 'BOOK');
            cy.get('.sidebar [data-cy=profile-cta]').click();

            cy.completePayment();
            cy.get('h3').should(
                'contain',
                'The DJ has been booked, and you will receive a receipt on email.'
            );
            cy.get('.card.popup.active *[data-cy=close-popup-button]').click();

            cy.get('.sidebar [data-cy=profile-cta]').should('contain', 'MESSAGE');
        });
    });

    it('Direct booking using cash', () => {
        cy.request('POST', '/test/clearDB');
        cy.request('POST', '/test/seed/djs');

        const eventData = {
            customerUserId: 1,
            status: 'ACCEPTED',
            gigs: [
                {
                    djId: 5,
                    status: 'ACCEPTED',
                    djFeeAmount: 15000,
                    offerAmount: 500000,
                    serviceFeeAmount: 0,
                    currency: 'DKK',
                    enableDirectPayout: true,
                    referred: true,
                },
            ],
        };

        cy.request('POST', '/test/seed/event', eventData).then((response) => {
            const theEvent = response.body.event;
            cy.wait(1000);

            expect(theEvent).to.not.eq(null);
            cy.visit('/event/' + theEvent.id + '/' + theEvent.hashKey + '/overview');

            cy.get('[data-cy=event-dj]').should('exist');
            cy.get('[data-cy=progress-step-incomplete]')
                .contains('Confirm and pay')
                .should('exist');
            cy.get('[data-cy=offer-price]').should('contain', 'DKK5,000.00');
            cy.get('[data-cy=dj-profile-button]').first().click();
            cy.get('.sidebar [data-cy=profile-cta]').should('contain', 'BOOK');
            cy.get('.sidebar [data-cy=profile-cta]').click();

            cy.completePayment();
            cy.get('h3').should(
                'contain',
                'The DJ has been booked, and you will receive a receipt on email.'
            );
            cy.get('.card.popup.active *[data-cy=close-popup-button]').click();

            cy.get('.sidebar [data-cy=profile-cta]').should('contain', 'MESSAGE');
        });
    });
});
