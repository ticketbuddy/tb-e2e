import {signOut, getStarted} from "tb-sdk"

describe("Promoter", () => {
  beforeEach(() => {
    cy.execute(signOut())
    cy.execute(getStarted())
    cy.visit("/dashboard")
  })

  it("creates the first promoter", () => {
    cy.getByTestId("create-first-promoter-btn").click()
    cy.getByTestId("promoter-card").contains("Untitled promoter")
    cy.getByTestId("create-promoter-btn").click()
    cy.getByTestId("promoter-card").should('have.length', 2)
    cy.reload()
    cy.getByTestId("promoter-card").should('have.length', 2)
  })
})
