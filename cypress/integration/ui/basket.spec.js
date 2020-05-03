import {signOut, getStarted, createPromoter} from "tb-sdk"
import {ticketSetup} from "../../support/helpers"

describe("Basket", () => {
  beforeEach(() => {
    cy.execute(signOut())
    cy.execute(getStarted())
  })

  describe("Checks user status", () => {
    it("prevents anonymous users reserving seats", () => {
      const {createActivityDateReq} = ticketSetup(5)

      cy.visit(`/date-tickets/${createActivityDateReq.body.wish.activity_date_id}`)
      cy.getByTestId("buy-ticket-card").contains("Early bird ticket")
      cy.getByTestId("buy-ticket-card").contains("400")
      cy.getByTestId("buy-ticket-card").should("not.contain", "+ 1")
    })

    it("prevents tracked-anonymous users reserving seats")

    it("allows verified users to reserve seats")
  })
})
