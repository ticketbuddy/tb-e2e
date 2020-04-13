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
  // return cy.request(httpRequest.method, httpRequest.path, httpRequest.body || null)
  return cy.request({
    method: httpRequest.method,
    body: httpRequest.body,
    url: httpRequest.path,
    failOnStatusCode: false
  })
})

Cypress.Commands.add("signInAs", (personId) => {
  return cy.request("get", `/_private/sign-in/${personId}`)
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
