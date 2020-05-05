import {signOut, getStarted, createPromoter} from "tb-sdk"
import {ticketSetup} from "../../support/helpers"

function assertSharedNonVerifiedUserTicketCollection() {
  cy.getByTestId("buy-ticket-card").contains("Early bird ticket")
  cy.getByTestId("buy-ticket-card").contains("400")
  cy.getByTestId("buy-ticket-card").should("not.contain", "+ 1")
}

describe("Basket", () => {
  beforeEach(() => {
    cy.execute(signOut())
    cy.execute(getStarted())
    const {createActivityDateReq} = ticketSetup(5)

    cy.visit(`/date-tickets/${createActivityDateReq.body.wish.activity_date_id}`)
    cy.execute(signOut())
  })


    it("prevents anonymous users reserving seats", () => {
      cy.reload()
      assertSharedNonVerifiedUserTicketCollection()

      cy.getByTestId("ticket-collection-user-status-notice").contains("Sign in to reserve seats")
    })

    it("prevents anonymous-with-session users reserving seats", () => {
      cy.execute(getStarted())
      cy.reload()
      assertSharedNonVerifiedUserTicketCollection()

      cy.getByTestId("ticket-collection-user-status-notice").contains("Please set, or verify your email")
    })

    it("allows verified users to reserve seats", () => {
      cy.execute(getStarted())
      cy.upgradeToVerified()
      cy.reload()

      cy.getByTestId("buy-ticket-card").contains("Early bird ticket")
      cy.getByTestId("buy-ticket-card").contains("400")
      cy.getByTestId("buy-ticket-card").should("contain", "+ 1")
    })
  
})
