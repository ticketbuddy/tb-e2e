import {getStarted, signOut, reversePayouts, getCurrentPerson, getCurrentCreditor} from "tb-sdk"

describe("Stripe payout reversals", () => {
  beforeEach(() => {
    cy.execute(signOut())
    cy.execute(getStarted())
  })

  it("accepts a payout reversal", () => {
    cy.execute(getCurrentPerson())
      .then(({body}) => {
        const creditorId = "creditor_" + body.person_id;
        const reversals = [
          {
            creditor_id: creditorId,
            amount: 350,
            reversal_id: "reverse-payout-1-" + body.person_id
          }
        ]

        cy.reversePayouts(reversals)
          .then((req) => {
            expect(req.status).to.eq(200)
            expect(req.body).to.deep.eq({})
          })

        cy.execute(getCurrentCreditor())
          .then((req) => {
            expect(req.status).to.eq(200)
            expect(req.body).to.deep.eq({
              creditor_id: creditorId,
              stripe_account_id: null,
              pending_funds: 350
            })
          })
      })
  })

  it("checks idempotency of a payout reversal", () => {
    cy.execute(getCurrentPerson())
      .then(({body}) => {
        const creditorId = "creditor_" + body.person_id;
        const reversals = [
          {
            creditor_id: creditorId,
            amount: 500,
            reversal_id: "duplicated-payout-1-" + body.person_id
          },
          {
            creditor_id: creditorId,
            amount: 500,
            reversal_id: "duplicated-payout-1-" + body.person_id
          },
          {
            creditor_id: creditorId,
            amount: 200,
            reversal_id: "reverse-payout-2-" + body.person_id
          }
        ]

        cy.reversePayouts(reversals)
          .then((req) => {
            expect(req.status).to.eq(200)
            expect(req.body).to.deep.eq({})
          })

        cy.execute(getCurrentCreditor())
          .then((req) => {
            expect(req.status).to.eq(200)
            expect(req.body).to.deep.eq({
              creditor_id: creditorId,
              stripe_account_id: null,
              pending_funds: 700
            })
          })
      })
  })

  it("returns an error status if one of the payouts fail", () => {
    cy.execute(getCurrentPerson())
      .then(({body}) => {
        const creditorId = "creditor_" + body.person_id;
        const reversals = [
          {
            creditor_id: "creditor_invalid",
            amount: 350,
            reversal_id: "reverse-payout-1-" + body.person_id
          }
        ]

        cy.reversePayouts(reversals)
          .then((req) => {
            expect(req.status).to.eq(400)
            expect(req.body).to.deep.eq({})
          })

        cy.execute(getCurrentCreditor())
          .then((req) => {
            expect(req.status).to.eq(200)
            expect(req.body).to.deep.eq({
              creditor_id: creditorId,
              stripe_account_id: null,
              pending_funds: 0
            })
          })
      })
  })
})
