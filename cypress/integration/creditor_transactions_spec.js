import {signOut, getStarted, getCurrentPerson, getCurrentCreditorTransactions} from "tb-sdk"
import {accountIdToCreditorId} from "../support/helpers"

describe("Creditor's transactions", () => {
  beforeEach(() => {
    cy.execute(signOut())
    cy.execute(getStarted())
    cy.upgradeToVerified()
  })

  it("fetches creditor's transactions", () => {

    cy.execute(getCurrentPerson())
      .then(({body}) => {
        const creditorId = accountIdToCreditorId(body.account_id)

        cy.addPendingFunds(500)
          .then(() => {
            cy.execute(getCurrentCreditorTransactions())
              .then((req) => {
                expect(req.status).to.eq(200)
                expect(req.body).to.deep.eq([
                  {
                    amount: 500,
                    creditor_id: creditorId,
                    fee: 63,
                    type: "funds_added"
                  }
                ])
              })
          })
      })
  })
})
