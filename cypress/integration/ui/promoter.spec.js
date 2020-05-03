import {signOut, getStarted, createPromoter} from "tb-sdk"

describe("Promoter", () => {
  beforeEach(() => {
    cy.execute(signOut())
    cy.execute(getStarted())
    cy.visit("/dashboard")
  })

  describe("Create", () => {
    it("first and second promoter", () => {
      cy.getByTestId("create-first-promoter-btn").click()
      cy.getByTestId("promoter-card").contains("Untitled promoter")
      cy.getByTestId("create-promoter-btn").click()
      cy.getByTestId("promoter-card").should('have.length', 2)
      cy.reload()
      cy.getByTestId("promoter-card").should('have.length', 2)
    })
  })

  describe("Update", () => {
    it("updates a promoter", () => {
      const createPromoterReq = createPromoter()
      cy.execute(createPromoterReq)
      cy.visit(`/dashboard/promoter/${createPromoterReq.body.wish.promoter_id}/edit`)
      cy.getByTestId("title-input").type("This is a really cool promoter title")
      cy.getByTestId("description-input").type("This is a really cool promoter description")
      cy.getByTestId("submit-promoter-description").click()
      cy.reload()
      cy.contains("Edit This is a really cool promoter title")
      cy.contains("This is a really cool promoter description")
    })
  })
})
