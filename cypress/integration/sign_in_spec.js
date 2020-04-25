import {getStarted, signIn, magicLinkSignIn, signOut} from "tb-sdk"
import {makeId} from "../support/helpers"

describe("Sign in", () => {
  beforeEach(() => {
    cy.execute(signOut())
  })

  it("accepts email & password", () => {
    const email = "tester@example.com"
    const password = "alongpass"

    cy.execute(signIn(email, password))
      .then((req) => {
        expect(req.status).to.eq(200)
        expect(req.body).to.deep.eq({
          person: {
            email: "tester@example.com",
            "email_verified?": true,
            id: "6b54b841c15f4b93add07b0c3f0ce59d",
            "is_anonymous?": false,
            name: null,
            terms_and_conditions_agreement_version: 0
          }
        })

        expect(req.headers).to.include.key("set-cookie")
      })
  })

  it("accepts magic link", () => {
    const email = "tester@example.com"
    cy.secureSign(email)
      .then((signedEmail) => {
        cy.execute(magicLinkSignIn(signedEmail))
        .then((req) => {
          expect(req.status).to.eq(200)
          expect(req.body).to.deep.eq({
            person: {
              email: "tester@example.com",
              "email_verified?": true,
              id: "6b54b841c15f4b93add07b0c3f0ce59d",
              "is_anonymous?": false,
              name: null,
              terms_and_conditions_agreement_version: 0
            }
          })

          expect(req.headers).to.include.key("set-cookie")
        })
      })
  })

  it("rejects invalid magic link", () => {
    const email = "tester@example.com"
    const signedEmail = "this-in-not-valid"

    cy.execute(magicLinkSignIn(signedEmail))
    .then((req) => {
      expect(req.status).to.eq(403)
      expect(req.body).to.deep.eq({})

      expect(req.headers).to.not.include.key("set-cookie")
    })
  })

  it("rejects when email is not associated to a person", () => {
    const email = "nothing@example.com"
    const password = "alongpass"

    cy.execute(signIn(email, password))
      .then((req) => {
        expect(req.status).to.eq(403)
        expect(req.body).to.deep.eq({})
        expect(req.headers).to.not.include.key("set-cookie")
      })
  })

  it("rejects wrong email & password", () => {
    const email = "tester@example.com"
    const password = "wrongpass"

    cy.execute(signIn(email, password))
      .then((req) => {
        expect(req.status).to.eq(403)
        expect(req.body).to.deep.eq({})
        expect(req.headers).to.not.include.key("set-cookie")
      })
  })
})
