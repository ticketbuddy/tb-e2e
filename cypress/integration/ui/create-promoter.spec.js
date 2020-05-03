import {signOut, getStarted} from "tb-sdk"

describe("Create Promoter", () => {
  beforeEach(() => {
    cy.execute(signOut())
    cy.execute(getStarted())
    cy.visit("/dashboard")
  })

  it("creating promoters", () => {
    cy.getByTestId("create-first-promoter-btn").click()
    cy.getByTestId("promoter-card").contains("Untitled promoter")
    cy.getByTestId("create-promoter-btn").click()
    cy.getByTestId("promoter-card").should('have.length', 2)
    cy.reload()
    cy.getByTestId("promoter-card").should('have.length', 2)
  })
})
