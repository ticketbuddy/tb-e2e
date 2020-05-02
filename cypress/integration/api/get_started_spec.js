import {getStarted, signOut} from "tb-sdk"
import {makeId} from "../../support/helpers"

describe("Get started", () => {
  beforeEach(() => {
    cy.execute(signOut())
  })

  it("when anonymous user", () => {
    cy.execute(getStarted())
      .then((req) => {
        expect(req.status).to.eq(302)
        expect(req.headers.location).to.eq("/dashboard")
        expect(req.headers).to.include.key("set-cookie")
      })
  })

  it("when anonymous with session", () => {
    cy.execute(getStarted())

    cy.execute(getStarted())
      .then((req) => {
        expect(req.status).to.eq(302)
        expect(req.headers.location).to.eq("/dashboard?status=already-signed-in")
        expect(req.headers).not.to.include.key("set-cookie")
      })
  })

  it("when verified", () => {
    cy.execute(getStarted())
    cy.upgradeToVerified()

    cy.execute(getStarted())
      .then((req) => {
        expect(req.status).to.eq(302)
        expect(req.headers.location).to.eq("/dashboard?status=already-signed-in")
        expect(req.headers).not.to.include.key("set-cookie")
      })
  })
})
