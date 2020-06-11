import {signOut, getStarted, createPromoter} from "tb-sdk"
import {ticketSetup} from "../../support/helpers"

var ticketId;

describe("Ticket Collection", () => {
  beforeEach(() => {
    cy.execute(signOut())
    cy.execute(getStarted())
    const {createTicketReq, createActivityDateReq} = ticketSetup(5)
    ticketId = createTicketReq.body.wish.product_id

    cy.visit(`/date-tickets/${createActivityDateReq.body.wish.activity_date_id}`)
    cy.execute(signOut())
  })

  it("displays tickets", () => {
    cy.getByTestId("buy-ticket-card").contains("Early bird ticket")
  })

  it("Upon selection, redirected to /basket/", () => {
    cy.getByTestId(`ticket-qty-${ticketId}`).select("2")
    cy.getByTestId("submit-ticket-collection").click()

    cy.url().should('contain', '/basket/')
  })
})
