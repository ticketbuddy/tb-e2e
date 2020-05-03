import {signOut, getStarted, createPromoter} from "tb-sdk"

describe("Create Activity", () => {
  beforeEach(() => {
    cy.execute(signOut())
    cy.execute(getStarted())
  })

  it("creating an activity", () => {
    const createPromoterReq = createPromoter()
    cy.execute(createPromoterReq)
    cy.visit(`/dashboard/promoter/${createPromoterReq.body.wish.promoter_id}`)
    cy.getByTestId("create-first-activity-btn").click()
    cy.getByTestId("activity-card").contains('Untitled event')
    cy.getByTestId("create-activity-btn").click()
    cy.getByTestId("activity-card").should('have.length', 2)
    cy.reload()
    cy.getByTestId("activity-card").should('have.length', 2)
  })
})
