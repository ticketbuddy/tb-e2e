import {signOut, getStarted} from "tb-sdk"
import {activityDateSetup, activityDateTicketSetup} from "../../support/helpers"

describe("Activity Date Ticket", () => {
  beforeEach(() => {
    cy.execute(signOut())
    cy.execute(getStarted())
  })

  describe("Create", () => {
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

  describe("Update", () => {
    it("updates an activity date ticket", () => {
      const params = activityDateTicketSetup()
      console.log(params)
      cy.visit(`/dashboard/ticket/${params.createTicketReq.body.wish.product_id}/edit`)
      cy.getByTestId("title-input").type("Early bird")
      cy.getByTestId("amount-input").clear().type("1500")
      cy.getByTestId("quantity-input").clear().type("1000")
      cy.getByTestId("submit-ticket").click()
      cy.reload()
      cy.contains("Early bird")
      cy.getByTestId("quantity-input").should('have.value', '1000')
      cy.getByTestId("amount-input").should('have.value', '1500')
    })
  })
})
