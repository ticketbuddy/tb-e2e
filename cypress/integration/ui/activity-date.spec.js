import {signOut, getStarted} from "tb-sdk"
import {activitySetup, activityDateSetup} from "../../support/helpers"

describe("Create Activity Date", () => {
  beforeEach(() => {
    cy.execute(signOut())
    cy.execute(getStarted())
  })

  describe("Create", () => {
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

  describe("update an activity date", () => {
    it("sets activity date location values", () => {
      const goesLive = new Date().toISOString()
      const starts = new Date().toISOString()
      const ends = new Date().toISOString()

      const {createActivityDateReq} = activityDateSetup()
      cy.visit(`/dashboard/date/${createActivityDateReq.body.wish.activity_date_id}/edit`)
      cy.getByTestId("addr_line_1-input").type('Addr line 1')
      cy.getByTestId("addr_line_2-input").type('Addr line 2')
      cy.getByTestId("postcode-input").type('P05TC0D3')
      cy.getByTestId("county-input").type('County')
      cy.getByTestId("country-input").type('Country')
      cy.getByTestId("submit-activity-date").click()
      cy.reload()

      cy.getByTestId("addr_line_1-input").should('have.value', 'Addr line 1')
      cy.getByTestId("addr_line_2-input").should('have.value', 'Addr line 2')
      cy.getByTestId("postcode-input").should('have.value', 'P05TC0D3')
      cy.getByTestId("county-input").should('have.value', 'County')
      cy.getByTestId("country-input").should('have.value', 'Country')
    })

    it("sets activity date time values")
  })
})
