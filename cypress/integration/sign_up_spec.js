import {getStarted, createPromoter, getAccountPromoters, getCurrentPerson, signOut, signUp} from "tb-sdk"
import {makeId} from "../support/helpers"

describe("Sign up", () => {
  beforeEach(() => {
    cy.execute(signOut())
  })

  it("signs up anonymous user", () => {
    const email = makeId(30) + "@ticketbuddy.co.uk"

    cy.execute(signUp(email, "alongpassword"))
      .then((req) => {
        expect(req.status).to.eq(302)
        expect(req.headers.location).to.eq("/dashboard")
        expect(req.headers).to.include.key("set-cookie")
      })
  })

  it("password too short", () => {
    const email = makeId(30) + "@ticketbuddy.co.uk"

    cy.execute(signUp(email, "shrt"))
      .then((req) => {
        expect(req.status).to.eq(400)
        expect(req.body).to.deep.eq({
          password: ["should be at least 8 character(s)"]
        })
        expect(req.headers).not.to.include.key("set-cookie")
        expect(req.headers).not.to.include.key("location")
      })
  })

  it("email has invalid format", () => {
    let email = makeId(3)
    cy.execute(signUp(email, "alongpassword"))
      .then((req) => {
        expect(req.status).to.eq(400)
        expect(req.body).to.deep.eq({
          email: ["has invalid format"]
        })
        expect(req.headers).not.to.include.key("set-cookie")
        expect(req.headers).not.to.include.key("location")
      })
  })

  it("anonymous session users cannot sign up", () => {
    const email = makeId(30) + "@ticketbuddy.co.uk"
    cy.execute(getStarted())

    cy.execute(signUp(email, "alongpassword"))
      .then((req) => {
        expect(req.status).to.eq(302)
        expect(req.headers.location).to.eq("/dashboard?status=already-signed-in")
        expect(req.headers).to.not.include.key("set-cookie")
      })
  })

  it("verified user cannot sign up", () => {
    const email = makeId(30) + "@ticketbuddy.co.uk"
    cy.execute(getStarted())
    cy.upgradeToVerified()

    cy.execute(signUp(email, "alongpassword"))
      .then((req) => {
        expect(req.status).to.eq(302)
        expect(req.headers.location).to.eq("/dashboard?status=already-signed-in")
        expect(req.headers).to.not.include.key("set-cookie")
      })
  })
})
