import {signOut, getStarted} from "tb-sdk"
import {activitySetup} from "../../support/helpers"

describe("Create Activity Date", () => {
  beforeEach(() => {
    cy.execute(signOut())
    cy.execute(getStarted())
  })

  it("creating an activity date", () => {
    const {createActivityReq} = activitySetup()
    cy.visit(`/dashboard/event/${createActivityReq.body.wish.activity_id}/dates`)

    cy.getByTestId("create-first-activity-date-btn").click()
    cy.getByTestId("activity-date-card").contains('An activity date...')
    cy.getByTestId("create-activity-date-btn").click()
    cy.getByTestId("activity-date-card").should('have.length', 2)
    cy.reload()
    cy.getByTestId("activity-date-card").should('have.length', 2)
  })
})
