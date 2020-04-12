import {createPromoter, getStarted} from "tb-sdk"

describe("Promoter", () => {
  it("Creates a new promoter", () => {

    cy.execute(getStarted())

    cy.execute(createPromoter())
      .its('headers')
      .its('content-type')
      .should('include', 'application/json')
  })
})
