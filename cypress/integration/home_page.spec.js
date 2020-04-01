/// <reference types="Cypress" />

describe('The Home Page', () => {
    it('Scrolls when clicking CTA', () => {
        cy.visit('/');

        cy.get('[data-cy=cta]').click();

        cy.window().then((window) => expect(window.scrollY).to.be.gt(0));
    });
});
