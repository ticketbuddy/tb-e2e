import {signOut, getStarted, createPromoter} from "tb-sdk"
import {activitySetup} from "../../support/helpers"

describe("Activity", () => {
  beforeEach(() => {
    cy.execute(signOut())
    cy.execute(getStarted())
  })

  describe("Create", () => {
    it("creates first and second activity", () => {
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

  describe("Update", () => {
    it("Updates an activity", () => {
      const {createActivityReq} = activitySetup()

      cy.visit(`/dashboard/event/${createActivityReq.body.wish.activity_id}/edit`)

      cy.getByTestId("title-input").type("This is a really cool event title")
      cy.getByTestId("description-input").type("This is a really cool event description")

      cy.getByTestId("submit-activity-description").click()
      cy.reload()
      cy.contains("This is a really cool event title")
      cy.contains("This is a really cool event description")
    })
  })
})
