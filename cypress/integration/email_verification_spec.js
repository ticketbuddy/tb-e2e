import {getStarted, signOut, requestEmailVerification, verifyEmail} from "tb-sdk"
import {makeId, getEmailIFrame} from "../support/helpers"

describe("Request email verification", () => {
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

    getEmailIFrame().contains("Please click here to verify your email address")
  })
})

describe("Verifies email", () => {
  beforeEach(() => {
    cy.execute(signOut())
    cy.execute(getStarted())
  })

  it("Accepts valid email signature", () => {
    const email = "tester@ticketbuddy.co.uk"

    cy.secureSign(email)
      .then(signature => {
        return cy.execute(verifyEmail(signature))
      })
      .then((req) => {
        expect(req.status).to.eq(200)
        expect(req.headers).to.include.key('set-cookie')
      })
  })

  it("Rejects invalid email signature", () => {
    cy.execute(verifyEmail("invalid-signature"))
      .then((req) => {
        expect(req.status).to.eq(403)
        expect(req.headers).to.not.include.key('set-cookie')
      })
  })
})
