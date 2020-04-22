import {getStarted, signOut, requestEmailVerification} from "tb-sdk"
import {makeId} from "../support/helpers"

describe("Email verification", () => {
  beforeEach(() => {
    cy.execute(signOut())
  })

  describe("invalid user status", () => {
    it("when anonymous user", () => {
      cy.execute(requestEmailVerification())
        .then((req) => {
          expect(req.status).to.eq(403)
        })
    })

    it("when verified", () => {
      cy.execute(getStarted())
      cy.upgradeToVerified()

      cy.execute(requestEmailVerification())
        .then((req) => {
          expect(req.status).to.eq(403)
        })
    })
  })

  it("anonymous with session but no email set for the person", () => {
    cy.execute(getStarted())

    cy.execute(requestEmailVerification())
      .then((req) => {
        expect(req.status).to.eq(400)
        expect(req.body).to.deep.eq({
          status: "email_not_set"
        })
      })
  })

  it("anonymous with session & email is set!", () => {
    // unverified person with email
    cy.signInAs("7120a063cfb542a9b69010f9d284f066")

    cy.execute(requestEmailVerification())
      .then((req) => {
        expect(req.status).to.eq(200)
        expect(req.body).to.deep.eq({})
      })

    // TODO check _private/sent_emails to see the email that was sent
  })
})
