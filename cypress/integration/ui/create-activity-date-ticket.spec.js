import {signOut, getStarted} from "tb-sdk"
import {activityDateSetup} from "../../support/helpers"

describe("Create Activity Date Ticket", () => {
  beforeEach(() => {
    cy.execute(signOut())
    cy.execute(getStarted())
  })

  it("creating an activity date ticket", () => {
    const {createActivityDateReq} = activityDateSetup()
    cy.visit(`/dashboard/date/${createActivityDateReq.body.wish.activity_date_id}/tickets`)

    cy.getByTestId("create-first-ticket-btn").click()
    cy.getByTestId("ticket-card").contains('Untitled')
    cy.getByTestId("create-ticket-btn").click()
    cy.getByTestId("ticket-card").should('have.length', 2)
    cy.reload()
    cy.getByTestId("ticket-card").should('have.length', 2)
  })
})
