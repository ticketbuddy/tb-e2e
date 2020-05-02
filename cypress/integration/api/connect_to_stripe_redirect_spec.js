import {connectToStripeRedirect, getStarted, signOut} from "tb-sdk"

describe("Connect to stripe account redirect", () => {
  beforeEach(() => {
    cy.execute(signOut())
    cy.execute(getStarted())
  })

  it("redirects verified user to stripe", () => {
    cy.upgradeToVerified()

    cy.execute(connectToStripeRedirect())
      .then((req) => {
        expect(req.status).to.eq(302)
        expect(req.headers.location).to.include("connect.stripe.com")
        expect(req.headers.location).to.include("creditor_")
      })
  })

  it("does not redirect unverified user to stripe", () => {
    cy.execute(connectToStripeRedirect())
      .then((req) => {
        expect(req.status).to.eq(403)
        expect(req.headers).to.not.include.key('location')
      })
  })

  it("does not redirect anonymous user to stripe", () => {
    cy.execute(signOut())

    cy.execute(connectToStripeRedirect())
      .then((req) => {
        expect(req.status).to.eq(403)
        expect(req.headers).to.not.include.key('location')
      })
  })

  it("does not redirect is already connected to a stripe account", () => {
    cy.upgradeToVerified()
    cy.linkCurrentCreditorToStripeAccount("a-stripe-ac")

    cy.execute(connectToStripeRedirect())
      .then((req) => {
        expect(req.status).to.eq(302)
        expect(req.headers.location).to.eq("/dashboard?status=creditor_already_linked_to_stripe")
      })
  })
})
