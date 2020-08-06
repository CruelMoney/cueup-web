/// <reference types="Cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
});

describe('The Home Page', () => {
    it('Scrolls when clicking CTA', () => {
        cy.visit('/');
    });
});
