import Joi from "@hapi/joi"

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add("execute", (httpRequest) => {

  // slight pause for asynchronous actions on server.
  cy.wait(20)

  return cy.request({
    method: httpRequest.method,
    body: httpRequest.body,
    url: httpRequest.path,
    failOnStatusCode: false,
    followRedirect: false
  })
})

Cypress.Commands.add("signInAs", (personId) => {
  return cy.request({
    method: "get",
    url: `/_private/sign-in/${personId}`,
    failOnStatusCode: false
  })
})

Cypress.Commands.add("reversePayouts", (reversePayouts) => {
  return cy.request({
    method: "post",
    body: {reversals: reversePayouts},
    url: `/_private/reverse-payouts`,
    failOnStatusCode: false
  })
})

Cypress.Commands.add("secureSign", (thingToSign) => {
  return cy.request({
    method: "post",
    body: {sign: thingToSign},
    url: `/_private/data-sign`,
    failOnStatusCode: false
  }).then((req) => req.body.signature)
})

Cypress.Commands.add("completeCheckout", (checkoutId) => {
  return cy.request({
    method: "get",
    url: `/_private/complete-checkout/${checkoutId}`,
    failOnStatusCode: false
  })
})

Cypress.Commands.add("addPendingFunds", (amount) => {
  return cy.request({
    method: "post",
    url: `/_private/creditor-add-pending-funds`,
    body: {
      amount: amount
    },
    failOnStatusCode: false
  })
})

Cypress.Commands.add("linkCurrentCreditorToStripeAccount", (stripeAccountId) => {
  return cy.request({
    method: "get",
    url: `/_private/link-creditor-to-stripe/${stripeAccountId}`,
    failOnStatusCode: true
  })
})

Cypress.Commands.add("upgradeToVerified", () => {
  return cy.request("get", "/_private/upgrade-person-to-verified")
})

Cypress.Commands.add("assertValid", (joiSchema, body) => {
  const { error } = joiSchema.validate(body)
  console.log(error)
  expect(error).to.eq(undefined)
})

// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
